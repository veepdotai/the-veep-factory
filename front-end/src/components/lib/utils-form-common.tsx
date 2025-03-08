import { useEffect, useState } from 'react'
import { Logger } from 'react-logger-lib'
import { t } from 'i18next'

import { cn } from "@/lib/utils"

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { Button } from "src/components/ui/shadcn/button"
import { Checkbox } from "src/components/ui/shadcn/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "src/components/ui/shadcn/form"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue,} from "src/components/ui/shadcn/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, } from "src/components/ui/shadcn/command"
import { Popover, PopoverContent, PopoverTrigger, } from "src/components/ui/shadcn/popover"
import { Calendar as CalendarIcon } from "lucide-react" 
import { Calendar } from "src/components/ui/shadcn/calendar"
import { Input } from "src/components/ui/shadcn/input"
import { Textarea } from "src/components/ui/shadcn/textarea"
import { UtilsGraphQLObject } from '@/api/utils-graphql-object'

export const UtilsFormCommon = {
    log: Logger.of("UtilsFormCommon"),

    onSubmitMetadata: function(graphqlURI, cookies, cid, data, topic, toast, name = null, value = null) {
        let log = (msg) => UtilsFormCommon.log.trace("onSubmitMetadata: " + msg)

        let o = data ? JSON.stringify(data, null, 2) : null
        log("Submitting data: " + o)

        let q = UtilsGraphQLObject.saveMetadata(graphqlURI, cookies,
          cid,
          data?.title,
          data,
          topic,
          name,
          value
        )
  
        log("GraphQL response: " + q)

        toast && toast({
          title: t("Status"),
          description: (
            <div className="mt-2 w-[500px] rounded-md">{t("DataUpdated")}</div>
          ),
        })
    },

    onSubmit: function(graphqlURI, cookies, name, topic, data, toast) {
        let log = (msg) => UtilsFormCommon.log.trace("onSubmit: " + msg)
        let o = JSON.stringify(data, null, 2)
        let q = UtilsGraphQLObject.create(graphqlURI, cookies,
          name,
          o.replace(/"/g, "_G_").replace(/\n/g, "_EOL_"),
          topic,
        )
  
        log("GraphQL request: " + q)
        log("Submitting data: " + JSON.stringify(data, null, 2))

        toast({
          title: t("Status"),
          description: (
            <div className="mt-2 w-[500px] rounded-md">{t("DataUpdated")}</div>
          ),
        })
    },
  
    // It is form display, not an update in the database
    updateForm: function(form, topic, message) {
        //let log = (msg) => UtilsFormCommon.log.trace("updateForm: " + msg)
        let log = UtilsFormCommon.log

        log.trace("message: ", message)
        form.reset(message)
    },

    // It is form display, not an update in the database
    updateStringForm: function(form, topic, message) {
        //let log = (msg) => UtilsFormCommon.log.trace("updateForm: " + msg)
        let log = UtilsFormCommon.log
        log.trace("updateStringForm: topic: ", topic)

        let metadata = null
        if ("200" == message?.status || message?.result) {
            metadata = message.result
            log.trace("updateStringForm: message.result: ", message?.result)
        } else {
            metadata = message
            log.trace("updateStringForm: message.result: ", message?.result)
        }
        log.trace("updateStringForm: metadata: ", metadata)

        if (typeof metadata == "string" && metadata) {
            metadata = JSON.parse(metadata)
            log.trace("updateStringForm: metadata (object): ", metadata)
            if (typeof metadata.result == "string") {
                metadata = metadata?.result?.replace(/_EOL_/g, "\n").replace(/_G_/g, '"')
                if (metadata) {
                    metadata = JSON.parse(metadata)
                }
            } else {
                // metadata.result may be a boolean
                // what do we do in that case?
            }
            log.trace("updateStringForm: ", "metadata: ", metadata)
        }
        
        if (metadata) {
            if (! ('result' in metadata)) {
                log.trace("updateStringForm: before resetting form: ", "metadata: ", metadata)
                form.reset(metadata)
            } else if (metadata.result === true) {
                // Data are updated
                log.trace("updateStringForm: Data have been updated.")
            } else if (metadata.result === false) {
                // Data aren't updated
                //alert("Error while updating data.")
                log.trace("updateStringForm: Data have NOT been updated.")
            }
        } else {
            // metadata == null or undefined
            // We should raise an error?
            log.trace("updateStringForm: metadata is null. What's happening? Houston, we have a problem.")
        }
    },
    
    updateFormOld: function(form, topic, message) {
        let log = (msg) => UtilsFormCommon.log.trace("updateForm: " + msg)

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
                o_string = result.replace(/_G_/g, '"').replace(/_EOL_/g, "\n")
            } catch(e) {
                alert("e: " + e)

                o_string = ""
            }

            //let o_string = result.replace(/_G_/g, '"').replace(/_EOL_/g, "\n")
            log("o: " + o_string)
            let o = JSON.parse(o_string)
            log("o: " + JSON.stringify(o))
            form.reset(o)
            log("resetted form.")
        }
    },

    getFieldType: function(form, field, fieldName, fieldType = "input", fieldValues = "", fieldOptions) {
        let log = (msg) => UtilsFormCommon.log.trace(`getFieldType: ${msg}`);
        log(JSON.stringify(field))
        let lcn = fieldOptions?.cn || "" 
        if (fieldType === "input") {
            let fieldValue = fieldValues ?? undefined
            return <Input className={cn} placeholder={t(fieldName + "PlaceHolder")} {...field} />
            //return <Input className={cn} placeholder={t(fieldName + "PlaceHolder")} {...field} value={fieldValue} />
        } else if (fieldType === "textarea") {
            return (
                <Textarea className={lcn || "min-h-[200px]"} placeholder={t(fieldName + "PlaceHolder")} {...field} />
            )
        } else if (fieldType === "select") {
            lcn = lcn || "w-[300px]"
            let values = fieldValues?.split('|') || [];
            UtilsFormCommon.log.trace("Values: " + JSON.stringify(values));
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
                            <FormLabel className="text-base">{t("displayOptionsLabel")}</FormLabel>
                            <FormDescription>{t("displayOptionsDesc")}</FormDescription>
                        </div>
                        {items.map((item) => (
                            <FormField
                                key={item.id}
                                control={form.control}
                                name="displayOptions"
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
            lcn = lcn || "w-[300px]"
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
                    <PopoverContent className="w-[300px] p-0">
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
        }
    },

    getFormField: function(form, fieldName, fieldType = "input", fieldValues = null, fieldOptions = {}) {
        let _fieldName = fieldName.replace(/([^\.]*)$/, "$1")
        let fo = fieldOptions
        if (["listofvalues", "combobox", "checkbox"].includes(fieldType)) {
            fo.displayFormLabel = fo.displayFormLabel || false
        } else {
            fo.displayFormLabel = fo.displayFormLabel || true
        }
        return (
            <FormField control={form.control} name={fieldName}
                render={({ field }) => (
                    <FormItem>
                        {fo?.displayFormLabel &&
                            <FormLabel className={`${fo?.cnFormLabel} font-bold text-sm mt-4 pe-2 pb-2`}>{t(_fieldName + "Label")}</FormLabel>
                        }
                        <div class="flex">
                            <div class="w-75">
                                {UtilsFormCommon.getFieldType(form, field, fieldName, fieldType, fieldValues, fo)}
                            </div>
                            <FormDescription className="m-3 mb-4 text-xs">{t(fieldName + "Desc")}</FormDescription>
                        </div>
                        <FormMessage className="mx-3 mt-3 mb-2 text-xs"/>
                    </FormItem>
                )}
            />
        )
    }
}

