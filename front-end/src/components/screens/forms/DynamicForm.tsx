import { useEffect, useState } from 'react'
import { Logger } from 'react-logger-lib'
import { t } from 'src/components/lib/utils'
import PubSub from 'pubsub-js'

import { useCookies } from 'react-cookie'

import { Constants } from 'src/constants/Constants'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { UtilsFormCommon as UFC } from '../../lib/utils-form-common'
import { Utils } from '../../lib/utils'

import editorialFormDefinition from "./editorial-form-definition.json"
import formFormDefinition from "./form-form-definition.json"
import brandVoiceFormDefinition from "./brand-form-definition.json"
import templateFormDefinition from "./template-form-definition.json"
import pdfExportFormDefinition from "./pdf-export-form-definition.json"

import { Button } from "src/components/ui/shadcn/button"
import { Form, } from "src/components/ui/shadcn/form"
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "src/components/ui/shadcn/tabs"
import { UtilsGraphQLObject } from '../../../api/utils-graphql-object'
import Loading from 'src/components/common/Loading'
import JSON2Form from '@/components/import-to-form/JSON2Form'

export default function DynamicForm({ type, params = null, importButton = true, onImportCallback = null, onSubmitCallback = null, onUpdateCallback = null, syncWithDatabase = true }) {
  const log = (...args) => Logger.of(DynamicForm.name).trace(args);

  const graphqlURI = Constants.WORDPRESS_GRAPHQL_ENDPOINT;
  const [cookies] = useCookies(['JWT']);

  const name = "form-" + Utils.camelize(type)
  const topic = Utils.camelize(type) + "_DATA_FETCHED"

  function getFormDefinitionFromType(type) {
    switch (type) {
      case 'editorial-line':
        return editorialFormDefinition
      case 'form':
        return formFormDefinition
      case 'brand-voice':
        return brandVoiceFormDefinition
      case 'template':
        return templateFormDefinition
      case 'pdf-export':
        return pdfExportFormDefinition
      default:
        return formFormDefinition
    }
  }

  function getConstraints(minChars = 1) {
    return z.string().min(minChars, { message: t("AtLeast", { length: minChars }), }).optional().or(z.literal(''))
  }

  function getFormSchema(formDefinition) {
    let formDefinitionObject = {}
    formDefinition.map((field) => {
      formDefinitionObject[field.name] = getConstraints(field.constraints || minChars)
      return null
    })
    log("getFormSchema: formDefinitionObject: ", formDefinitionObject)
    return formDefinitionObject
  }

  function getFormDefinitionByFieldsName(formDefinition) {
    let formDefinitionObject = {}
    formDefinition.map((field) => {
      formDefinitionObject[field.name] = field
      return null
    })
    log("getFormDefinitionByFieldsName: formDefinitionObject: ", formDefinitionObject)
    return formDefinitionObject
  }

  function getDefaultValuesFromFormDefinition(formDefinition) {
    let defaultValues = {}
    formDefinition.map((field) => {
      defaultValues[field.name] = field.values || ""
      return null
    })
    log("getDefaultValuesFromFormDefinition: defaultValues: ", defaultValues)
    return defaultValues  
  }

  function importForm() {
    log("importForm")
    const getValueById = (fieldName) => document.getElementById(fieldName).value 

    //alert(`json: ${getValueById("importFormJson")} / ${getValueById("importFormFieldsList")} / ${getValueById("importFormStrategy") || 'merge-after'}`)
    //let metadata = {benefits: getValueById("importFormJson")}
    try {
      let metadata = JSON.parse(getValueById("importFormJson"))
      let mergingStrategy = getValueById("importFormStrategy")
      return UFC.updateFormFromStringForm(form, formMetadata, metadata, mergingStrategy)
    } catch(e) {
      log("importForm: pb while updating: e: ", e)
      alert("importForm: pb while updating: e: " + e)
    }
  }

  /**
   * Called when the data is loaded from the server
   * 
   * @param topic the topic for the specific content type  
   * @param message the fetched data
   * @returns 
   */
  function updateForm(topic, message) {
    log("updateForm: ", "topic: ", topic, "message: ", message)
    return UFC.updateStringForm(form, formMetadata, topic, message)
  }

  //function onSubmit(data: z.infer<typeof FormSchema>) {
  function onSubmit(data) {
    return UFC.onSubmit(graphqlURI, cookies, name, topic, data)
  }

  //function renameContentTitleDialog(graphqlURI, cookies, row) {
  function displayImportDialog(e) {
      e.preventDefault()
      PubSub.publish("PROMPT_DIALOG", {
          title: t("FormImportDialog"),
          description: t("FormImportDialogDesc"),
          content: JSON2Form(),
          actions: [{
              label: t("Cancel")
          }, {
              label: t("OK"),
              click: () => importForm()
          }]
      })
  }

  /**
   * 
   * @param group 
   * @param fdbg form definition by group
   * @returns 
   */
  function getTabsContentForGroup(group, fdbg) {
    let fields = fdbg[group]
    let fieldsBySubgroup = Object.groupBy(fields, ({ subgroup }) => subgroup || "empty")

    function getCN(cn, defaultOptions) {
      if (cn) {
        return {"cn": cn, ...defaultOptions}
      } else {
        return defaultOptions
      }
    }

    let res
    if (!fieldsBySubgroup) {
      res = fields.map((field) => {
        return UFC.getFormField(form, field.name, field.type, field.options, getCN(field.className, defaultCBB))
      })
    } else {
      res = Object.keys(fieldsBySubgroup)
            .map((subgroup, i) => {
              if (subgroup == "empty") {
                return fieldsBySubgroup[subgroup].map((field) => UFC.getFormField(form, field.name, field.type, field.options, getCN(field.className, defaultCBB)))
              } else {
                let subGroup = t(Utils.camelize(subgroup))
                return (
                  <div className="w-full m-5">
                    <div key={`${subGroup}-section`} className={sectionCn}>
                      {subGroup}
                    </div>
                    <div key={`${subGroup}-items`} className=''>{/*{{ paddingLeft: "3rem"}}*/}
                      {fieldsBySubgroup[subgroup].map((field) => UFC.getFormField(form, field.name, field.type, field.options, getCN(field.className, defaultCBB)))}
                    </div>
                  </div>
                )
              }
            })
    }

    return (
      <TabsContent value={t(Utils.camelize(group))} className={defaultTabsContentLayout}>
        <div className="float-right">
            { importButton && <Button className="mx-1" onClick={(e) => displayImportDialog(e)}>{t("Import")}</Button> }
            <Button className="mx-1" type="submit">{t("Submit")}</Button>
            {/*<Button type="reset">{t("Reset")}</Button>*/}
        </div>

        {res}
      </TabsContent>
    )
  }

  useEffect(() => {
    if (onUpdateCallback) {
      PubSub.subscribe(topic, onUpdateCallback)
    } else {
      PubSub.subscribe(topic, updateForm)
    }

    if (syncWithDatabase) {
      UtilsGraphQLObject.listOne(graphqlURI, cookies, name, topic)
    }

    if (params && onUpdateCallback) {
      log("useEffect: params: ", params)
      form.reset(params)
      //onUpdateCallback(null, params)
    }
  }, [])

  const minChars = 2

  /**
   * Should be refactored in a class
   */
  let formMetadata = {}
  formMetadata.type = type
  formMetadata.formDefinition = getFormDefinitionFromType(type)
  formMetadata.formDefinitionByFieldsName = getFormDefinitionByFieldsName(formMetadata.formDefinition)
  formMetadata.defaultValues = getDefaultValuesFromFormDefinition(formMetadata.formDefinition)
  formMetadata.formSchema = getFormSchema(formMetadata.formDefinition)
  log("formMetadata: ", formMetadata)

  const FormSchema = z.object(formMetadata.formSchema)
  let form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: formMetadata.defaultValues
  })

  let cn = "text-sm font-bold"
  let sectionCn = "pt-5 flex items-center text-md font-bold text-black after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-white dark:after:border-neutral-600"

  let defaultTabsContentLayout = "pl-5 pb-5"
//  let defaultCBB = { displayFormLabel: true, cnFormLabel: "w-[200px] text-right" }
  let defaultCBB = { displayFormLabel: true, cnFormLabel: "w-[400px] text-left" }

  log("updateForm: formMetadata.formDefinition: ", formMetadata.formDefinition)

  let normalizedFormDefinition = formMetadata.formDefinition.filter(({ name }) => name ? true : false)
  normalizedFormDefinition = normalizedFormDefinition.map((field) => {
    let group = field.group
    if (group.indexOf("/")) {
      return {
        ...field,
        group: group.replace(/([^\/]*)\/.*/, "$1"),
        subgroup: group.replace(/[^\/]*\/(.*)/, "$1")
      }
    } else {
      return field
    }
  })
  let fieldsByGroup = Object.groupBy(normalizedFormDefinition, ({ group }) => group || "main")
  let tabsTrigger = Object.keys(fieldsByGroup).map(
    (group) => <TabsTrigger key={`group-${group}]`} className={cn} value={t(Utils.camelize(group))}>{t(Utils.camelize(group))}</TabsTrigger>
  )

  //alert('DefaultValue: ' + t(Utils.camelize(Object.keys(fieldsByGroup[0])[0])))
  //alert('DefaultValue: ' + JSON.stringify(Object.keys(fieldsByGroup)[0]))
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitCallback ? onSubmitCallback : onSubmit)} className="space-y-6">

        <Tabs defaultValue={t(Utils.camelize(Object.keys(fieldsByGroup)[0]))}>

          <TabsList className="grid grid-cols-5">
            {tabsTrigger}
          </TabsList>

          {Object.keys(fieldsByGroup).map((group) => getTabsContentForGroup(group, fieldsByGroup))}
        </Tabs>
      </form>
    </Form>
  )
}

