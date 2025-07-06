import { useEffect, useState } from 'react'
import { Logger } from 'react-logger-lib'
import { t, Utils } from 'src/components/lib/utils'
import PubSub from 'pubsub-js'

import { cn } from "@/lib/utils"

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { Button } from "src/components/ui/shadcn/button"
import { Checkbox } from "src/components/ui/shadcn/checkbox"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "src/components/ui/shadcn/form"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue,} from "src/components/ui/shadcn/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, } from "src/components/ui/shadcn/command"
import { Popover, PopoverContent, PopoverTrigger, } from "src/components/ui/shadcn/popover"
import { Calendar as CalendarIcon } from "lucide-react" 
import { Calendar } from "src/components/ui/shadcn/calendar"
import { Input } from "src/components/ui/shadcn/input"
import { Textarea } from "src/components/ui/shadcn/textarea"

import { getIcon } from '@/constants/Icons'
import { UtilsGraphQLObject } from '@/api/utils-graphql-object'
import Upload from '../upload-widget/page'
import MediaLibrary from '../MediaLibrary'
import JSCodeEditor from '../editor/JSCodeEditor'


export const UtilsFormCommon = {
    log: (...args) => Logger.of("UtilsFormCommon").trace(args),

    onSubmitMetadata: function(graphqlURI, cookies, cid, data, topic, toast, name = null, value = null) {
        let log = (...args) => UtilsFormCommon.log("onSubmitMetadata: ", args)

        let lcn = "mt-2 w-[500px] rounded-md"
        let o = data ? JSON.stringify(data, null, 2) : null
        log("Submitting data: ", o)

        let params = {
            graphqlURI: graphqlURI,
            cookies: cookies,
            contentId: cid,
            title: data?.title,
            metadata: data,
            topics: topic,
            name: name,
            value: value
        }
        log("GraphQL params:", params)
        let q = UtilsGraphQLObject.saveMetadata(params)  
        log("GraphQL response: ", q)

        toast && toast({
          title: t("Status"),
          description: (
            <div className={lcn}>{t("DataUpdated")}</div>
          ),
        })
    },

    onSubmit: function(graphqlURI, cookies, name, topics, data) {
        let log = (...args) => UtilsFormCommon.log("onSubmit: ", args)
        
        let o = JSON.stringify(data, null, 2)
        log("o (after JSON stringifying): " + o)

        let odata = Utils.denormalize(o)
        log("odata (after replacing chars): " + odata)
 
        let q = UtilsGraphQLObject.create(
            {
                "graphqlURI": graphqlURI,
                "cookies": cookies,
                "name": name,
                "value": odata,
                "topics": topics,
                "objectId": data?.objectId || null
            }
        )
  
        log("GraphQL request: ", q)
        log("Submitting data: ", data)

        PubSub.publish('TOAST', {
          title: t("Status"),
          description: (
            <div className="mt-2 w-[300px] rounded-md flex">
                {getIcon("loading")}
                {t("SavingData")}
            </div>
          ),
        })
    },
  
    // It is form display, not an update in the database
    refreshForm: function(form, topic, message) {
        let log = (...args) => UtilsFormCommon.log("refreshForm: ", args)

        log("message: ", message)
        form.reset(message)
    },

    // It is form display, not an update in the database
    // So user must click on Save to persist data
    refreshFormFromStringForm: function(form, formMetadata, metadata, mergingStrategy = null) {
        let log = (...args) => UtilsFormCommon.log("updateFormFromStringForm: ", args)

        let newMetadata = null
        if (typeof metadata == "string" && metadata) {
            metadata = JSON.parse(metadata)
            log("metadata (object): ", metadata)
            if (typeof metadata.result == "string") {
                metadata = Utils.normalize(metadata?.result)
                if (metadata) {
                    metadata = JSON.parse(metadata)
                }
            } else {
                // metadata.result may be a boolean
                // what do we do in that case?
            }
            log("metadata: ", metadata)
        }
        
        if (metadata) {
            if (! ('result' in metadata)) {
                // Data can be updated
                let prevMetadata = {...formMetadata.defaultValues, ...form.getValues()}
                log("before resetting form: ", "prevMetadata: ", prevMetadata)
                log("before resetting form: ", "newMetadata: ", metadata)

                let mergedMetadata = {}
                if (null === mergingStrategy) {
                    mergedMetadata = {...metadata}
                } else {
                    // the new content comes before the old one
                    mergedMetadata = {...prevMetadata}
                    let keys = Object.keys(prevMetadata)
                    for(let i = 0; i < keys.length; i++) {
                        let key = keys[i]
                        if (metadata[key]) {
                            let mergedValue = mergedMetadata[key]
                            if ('replace' === mergingStrategy
                                    || "listofvalues" === formMetadata.formDefinitionByFieldsName[key].type) {
                                mergedMetadata[key] = metadata[key]
                            } else if ('merge-newdata-before' === mergingStrategy) {
                                mergedMetadata[key] = metadata[key] + (mergedValue && ("\n" + mergedValue))
                            } else if ('merge-newdata-after' === mergingStrategy) {
                                mergedMetadata[key] = (mergedValue && mergedValue + "\n") + metadata[key]
                            } else {
                                // We are initializing the form so we take the new value we get from the database
                                mergedMetadata[key] = metadata[key]
                            }
                        } else {
                            // We just let the existing data
                        }
                    }
                }

                log("once merged: ", "mergedMetadata: ", mergedMetadata)
                form.reset(mergedMetadata)
            } else if (metadata.result === true) {
                // Data are updated
                log("Data have been updated.")
            } else if (metadata.result === false) {
                // Data aren't updated
                //alert("Error while updating data.")
                log("Data have NOT been updated.")
            }
        } else {
            // metadata == null or undefined
            // We should raise an error?
            log("metadata is null. What's happening? Houston, we have a problem.")
        }
    },

    refreshStringForm: function(form, formMetadata, topic, message) {
        let log = (...args) => UtilsFormCommon.log("refreshStringForm: ", args)
        log("topic: ", topic)

        let metadata = null
        if ("200" == message?.status || message?.result) {
            metadata = message.result
            log("message.result: ", message?.result)
        } else {
            metadata = message
            log("message.result: ", message?.result)
        }
        log("metadata: ", metadata)

        return UtilsFormCommon.refreshFormFromStringForm(form, formMetadata, metadata)
    },
    
    updateFormOld: function(form, topic, message) {
        let log = (...args) => UtilsFormCommon.log("updateForm: ", args)

        log("message: " + JSON.stringify(message))
        let result = ""
        try {
            result = JSON.parse(message?.result).result
        } catch (e) {
            log("e: " + e)
        }
        log("result: " + result)
        let currentValues = {}
        
        if (result && typeof result === "string" && result != "") {
            let o_string = ""
            try {
                o_string = Utils.normalize(result)
            } catch(e) {
                alert("e: " + e)

                o_string = ""
            }

            log("o: " + o_string)
            let o = JSON.parse(o_string)
            log("o: " + JSON.stringify(o))
            form.reset(o)
            log("resetted form.")
        }
    },

    /**
     * 
     * @param form 
     * @param field 
     * @param fieldName 
     * @param fieldType "input", "upload", "medialibrary", "textarea", "select", "checkbox", "listofvalues", "combobox", "date", "codeeditor", "jscodeeditor"
     * @param fieldValues 
     * @param fieldOptions 
     * @returns 
     */
    getFieldType: function(form, field, fieldName, fieldType = "input", fieldValues = "", fieldOptions) {
        let log = (...args) => UtilsFormCommon.log("getFieldType: ", args);

        log("field: " + fieldName, field, "fieldValues:", fieldValues, "fieldOptions:", fieldOptions)
        let lcn = fieldOptions?.cn || "" 

        if (fieldType === "input") {
            //let fieldValue = fieldValues ?? undefined
            let fieldValue = fieldValues
            return <Input className={cn} placeholder={t(fieldName + "PlaceHolder")} {...field} />
            //return <Input className={cn} placeholder={t(fieldName + "PlaceHolder")} {...field} value={fieldValue} />
        } else if (fieldType === "upload") {
            let fieldValue = fieldValues ?? undefined
            return (
                <>
                    {/*<Input className={cn} placeholder={t(fieldName + "PlaceHolder")} {...field} />*/}
                    <Upload form={form} className={lcn} fieldName={fieldName} {...field} />
                </>
            )
        } else if (fieldType === "medialibrary") {
            function openMediaLibrary(e) {
                e.preventDefault()
                PubSub.publish("PROMPT_DIALOG", {
                    title: t('Media Library'),
                    description: t('Select or upload media items'),
                    content: <MediaLibrary fieldName={fieldName} embeddingType='nomodal' />,
                    actions: [
                        {
                            label: t('Close'),
                        }
                    ],
                    outerCN: "flex flex-col items-start w-full h-full max-w-8xl"
                })
                
            }

            function onSelect(topic, mediaItem) {
                let log = (...args) => UtilsFormCommon.log("onSelect: ", args)
                log("content: ", mediaItem)

                if (mediaItem && mediaItem.thumbnailUrl) {
                    log("mediaItemUrl: ", mediaItem.thumbnailUrl)
                    form.setValue(fieldName, mediaItem.thumbnailUrl)
                }
            }

            let lcn = "w-[200px]"
            let topic = "MEDIA_ITEM_SELECTED"
            PubSub.subscribe(topic + "_" + fieldName, onSelect)

            return (
                <div className="flex gap-2">
                    <Input id={"input-" + fieldName} className={lcn} {...field} />
                    <Button onClick={openMediaLibrary}>
                        {t("OpenMediaLibrary")}
                    </Button>
                </div>
            )
        } else if (fieldType === "textarea") {
            return (
                <Textarea className={lcn || "min-h-[200px]"} placeholder={t(fieldName + "PlaceHolder")} {...field} />
            )
        } else if (fieldType === "select") {
            lcn = lcn || "w-[300px]"
            let values = fieldValues?.split('|') || [];
            log("select: values: ", values);
            return (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger className={lcn}>
                            <SelectValue placeholder={t(fieldName + "PlaceHolder")} />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>{t(fieldName + "Label")}</SelectLabel>
                            {values.map((value) => value ? 
                                value.match(/:/) ?
                                    <SelectItem value={value.replace(/(.*):.*/,"$1")}>{t(value.replace(/.*:(.*)/,"$1"))}</SelectItem>
                                    :
                                    <SelectItem value={value.toLowerCase()}>{t(value)}</SelectItem>
                                :
                                <></>
                            )}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            )
        } else if (["checkbox"].includes(fieldType)) {
            log("checkbox: ");

            let formFieldName = "displayOptions"
            let formLabel = t("displayOptionsLabel")
            let formDescription = t("displayOptionsDesc")
            let items = [
                {id: "displayHeader", label: t("displayHeaderLabel")},
                {id: "displayFooter", label: t("displayFooterLabel")},
                {id: "displayTOC", label: t("displayTOCLabel")},
                {id: "displayBreakOnPage", label: t("displayBreakOnPageLabel")},
            ]

            let f = <FormField
                control={form.control}
                name="items"
                render={() => (
                    <FormItem>
                        <div className="mb-4">
                            <FormLabel className="text-base">{formLabel}</FormLabel>
                            <FormDescription>{formDescription}</FormDescription>
                        </div>
                        {items.map((item) => (
                            <FormField
                                key={item.id}
                                control={form.control}
                                name={formFieldName}
                                render={({field}) => {
                                    log(`fields: ${JSON.stringify(field)}`)
                                    return (
                                        <FormItem
                                            key={item.id}
                                            className="flex flex-row items-start space-x-3 space-y-0"
                                        >
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value?.includes(item.id)}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            if (field.value) {
                                                                field.onChange([...field.value, item.id])  
                                                            } else {
                                                                field.onChange([item.id])
                                                            }
                                                        } else {
                                                            field.onChange(
                                                                field.value?.filter((value) => value !== item.id)
                                                            )
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                {item.label}
                                            </FormLabel>
                                        </FormItem>
                                    )
                                }}
                            />
                        ))}
                        <FormMessage />
                    </FormItem>
                )}
            />

            return f
        } else if (["listofvalues", "combobox"].includes(fieldType)) {
            log(fieldType + ": ", fieldValues)

            lcn = lcn || "w-[400px]"
            let values = fieldValues?.split('|') || [];
            values = values.map((item) => {
                return item.match(/:/) ?
                    { label: t(item.replace(/.*:(.*)/, "$1")), value: item.replace(/(.*):.*/, "$1") }
                    :
                    { label: t(item), value: item }
            })
            return (
                <Popover style={{ pointerEvents: "auto" }} >
                    <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                                variant="outline"
                                role="combobox"
                                className={lcn + " " + cn(
                                    "justify-between",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value
                                    ? values.find(
                                        (item) => item.value === field.value
                                    )?.label
                                    : t(fieldName + "PlaceHolder")}
                                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className={cn(lcn, "p-0")}>
                        <Command>
                            <CommandInput placeholder={t(fieldName + "Search")} className="h-9" />
                            <CommandList>
                                <CommandEmpty>{t("NoItemFound")}</CommandEmpty>
                                <CommandGroup>
                                    {values.map((item) => (
                                    <CommandItem
                                        className="data-[disabled]:pointer-events-auto data-[disabled]:opacity-75"
                                        value={item.label}
                                        key={item.value}
                                        onSelect={() => form.setValue(fieldName, item.value)}
                                    >
                                        <CheckIcon
                                            className={cn(
                                                "disabled-ml-auto disabled-h-4 disabled-w-4 h-4 w-5 m-1",
                                                item.value === field.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                        />
                                        {item.label}
                                    </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            )
        } else if (fieldType === "date") {
            const [date, setDate] = useState<Date>()
 
            return (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )
        } else if (fieldType === "codeeditor") {
            let source = field.value || ""
            return (
                <div className="">
                    <JSCodeEditor source={source} />
                </div>
            )
        }
    },

    getFormField: function(form, fieldName, fieldType = "input", fieldValues = null, fieldOptions = {}) {
        let _fieldName = fieldName.replace(/([^\.]*)$/, "$1")
        let fo = fieldOptions
        let lcnFormField = "w-100"
        let lcnFieldLabel = `${fo?.cnFormLabel} font-bold text-sm mt-4 pe-2 pb-2`
        let lcnFieldDesc = `${lcnFormField} m-3 mb-4 text-xs`
        if (["listofvalues", "combobox", "checkbox"].includes(fieldType)) {
            fo.displayFormLabel = fo.displayFormLabel || false
        } else {
            fo.displayFormLabel = fo.displayFormLabel || true
        }

        function toggleHelp(e, fieldName, helpMode = "modal") {
            const capitalize = <T extends string>(s: T) => (s[0].toUpperCase() + s.slice(1)) as Capitalize<typeof s>;
            e.preventDefault()
            switch(helpMode) {
                case 'modal':
                    PubSub.publish("PROMPT_DIALOG", {
                        title: t(capitalize(fieldName)),
                        description: "Quelques mots pour vous aider...",
                        content: t(fieldName + "Desc"),
                        //let help = document.getElementById(fieldName + "Desc")
                        actions: [{
                            label: t("Close")
                        }]
                    })
                    break;
                default:
                    let help = document.getElementById(fieldName + "Help")
                    if (help.classList?.contains("d-none")) {
                        help.classList.remove("d-none")
                    } else {
                        help.classList?.add("d-none")
                    }
            }
        }

        let helpMode = "modal"

        return (
            <FormField key={fieldName} control={form.control} name={fieldName}
                render={({ field }) => (
                    <FormItem>
                        {fo?.displayFormLabel && <>
                                <FormLabel className={lcnFieldLabel}>
                                    {t(_fieldName + "Label")}<a className="mx-2 hover:cursor-pointer" onClick={(e) => toggleHelp(e, fieldName, helpMode)}>{getIcon("help")}</a>
                                </FormLabel>
                                {
                                    helpMode != 'modal' ?
                                        <div id={fieldName + "Help"}>
                                            <FormDescription className={lcnFieldDesc}>{t(fieldName + "Desc")}</FormDescription>
                                        </div>
                                        :
                                        <></>
                                }
                            </>
                        }
                        <div className="flex">
                            <div className={lcnFormField}>
                                {UtilsFormCommon.getFieldType(form, field, fieldName, fieldType, fieldValues, fo)}
                            </div>
                        </div>
                        <FormMessage className="mx-3 mt-3 mb-2 text-xs"/>
                    </FormItem>
                )}
            />
        )
    }
}

