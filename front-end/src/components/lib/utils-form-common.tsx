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
import { Input } from "src/components/ui/shadcn/input"
import { Textarea } from "src/components/ui/shadcn/textarea"
import { UtilsGraphQLObject } from '@/src/api/utils-graphql-object'

export const UtilsFormCommon = {
    log: Logger.of("UtilsFormCommon"),

    onSubmitMetadata: function(graphqlURI, cookies, cid, data, topic, toast) {
        let log = (msg) => UtilsFormCommon.log.trace("onSubmitMetadata: " + msg)

        let o = JSON.stringify(data, null, 2)
        log("Submitting data: " + o)

        let q = UtilsGraphQLObject.saveMetadata(graphqlURI, cookies,
          cid,
          data.title,
          data,
          topic,
        )
  
        log("GraphQL response: " + q)

        toast({
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
        let log = (msg) => UtilsFormCommon.log.trace("updateForm: " + msg)

        log("message: " + JSON.stringify(message))
        form.reset(message)
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
            return <Input className={cn} placeholder={t(fieldName + "PlaceHolder")} {...field} />
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
        } else if (fieldType === "checkbox") {
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
        } else if (fieldType === "combobox") {
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
        }
    },

    getFormField: function(form, fieldName, fieldType = "input", fieldValues = null, fieldOptions = {}) {
        let fo = fieldOptions
        if (fieldType === "combobox" || fieldType === "checkbox") {
            fo.displayFormLabel = fo.displayFormLabel || false
        } else {
            fo.displayFormLabel = fo.displayFormLabel || true
        }
        return (
            <FormField control={form.control} name={fieldName}
                render={({ field }) => (
                    <FormItem>
                        {fo?.displayFormLabel &&
                            <FormLabel className={`${fo?.cnFormLabel} font-bold text-sm mt-4 pe-2 pb-2`}>{t(fieldName + "Label")}</FormLabel>
                        }
                        {UtilsFormCommon.getFieldType(form, field, fieldName, fieldType, fieldValues, fo)}
                        <FormMessage className="mx-3 mt-3 mb-2 text-xs"/>
                        <FormDescription className="m-3 mb-4 text-xs">{t(fieldName + "Desc")}</FormDescription>
                    </FormItem>
                )}
            />
        )
    }
}

