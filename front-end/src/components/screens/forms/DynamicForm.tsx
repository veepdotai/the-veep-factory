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

import defaultEditorialLineFormDefinition from "src/config/form-definitions/editorial-line-form-definition.json"
import defaultFormFormDefinition from "src/config/form-definitions/form-form-definition.json"
import defaultBrandVoiceFormDefinition from "src/config/form-definitions/brand-form-definition.json"
import defaultTemplateFormDefinition from "src/config/form-definitions/template-form-definition.json"
import defaultUploadFormDefinition from "src/config/form-definitions/upload-form-definition.json"
import defaultPdfExportFormDefinition from "src/config/form-definitions/pdf-export-form-definition.json"

import { Button } from "src/components/ui/shadcn/button"
import { Form, } from "src/components/ui/shadcn/form"
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "src/components/ui/shadcn/tabs"
import { UtilsGraphQLObject } from '../../../api/utils-graphql-object'
import Loading from 'src/components/common/Loading'
import JSON2Form from '@/components/import-to-form/JSON2Form'
import { UtilsGraphQLConfiguration } from '@/api/utils-graphql-configuration'

const defaultDefinitions = [
    { name: "editorial-line", definition: defaultEditorialLineFormDefinition },
    { name: "form", definition: defaultFormFormDefinition },
    { name: "brand-voice", definition: defaultBrandVoiceFormDefinition },
    { name: "template", definition: defaultTemplateFormDefinition },
    { name: "upload", definition: defaultUploadFormDefinition },
    { name: "pdf-export", definition: defaultPdfExportFormDefinition },
]

export default function DynamicForm({type, ...props}) {
  const log = (...args) => Logger.of(DynamicForm.name).trace(args)
  //const log = (...args) => console.log("DynamicForm", args)

  log("type:", type, "props: ", props)

  const graphqlURI = Constants.WORDPRESS_GRAPHQL_ENDPOINT;
  const [cookies] = useCookies(['JWT']);

  const [definition, setDefinition] = useState(null)

  function getDefinitionFromType(type, definitions) {
    log("getDefinitionFromType:", type)
    let definition = definitions?.find((def) => {
        log("type:", type, "definition:", def)
        return type === def.name
    })?.definition

    return definition
  }

  function initDefinition(type, cType, defaultDefinitions) {
    let def = null
    UtilsGraphQLConfiguration.
      listConfiguration(graphqlURI, cookies, "Form", cType)
      .then((data) => {
        log("useEffect: type:", type, "data from db: data:", data)
        let ldefinition = data?.length > 0 && data[0]?.definition 
        if (ldefinition) {

          let defString = Utils.normalize(ldefinition)
          log("useEffect: type:", type, "normalized data.definition: def: ", defString)

          def = JSON.parse(defString)
          log("useEffect: type:", type, "json data.definition: def: ", def)

          if (!def) {
            def = getDefinitionFromType(type, defaultDefinitions)
            log("useEffect: type:", type, "default definition because can't convert data.definition from db: def: ", def)
          }
        } else {
          def = getDefinitionFromType(type, defaultDefinitions)
          log("useEffect: type:", type, "default definition: def: ", def)
        }

        /**
         * Type is inknown. Provide a default basic definition.
         */
        if (!def) {
          def = getDefinitionFromType("form", defaultDefinitions)
          log("useEffect: type:", type, "default definition because nothing has been provided: def: ", def)
        }

        setDefinition(def)

      })
      .catch((e) => {
        log("ERROR: useEffect: type:", type, "while getting definition: e: ", e)

        def = getDefinitionFromType("form", defaultDefinitions)
        log("useEffect: type:", type, "default definition because an exception has been raised: def: ", def)

        setDefinition(def)
      })
  }

  useEffect(() => {
    let cType = Utils.camelize(type)
    log("useEffect: cType:", cType)
    log("useEffect: Form type:", type, "cType: ", cType, "Type complet: Form-" + cType)

    if (! definition) {
      let def = null
      if (!cType) {
          def = getDefinitionFromType("Form", defaultDefinitions)
          log("useEffect: data from defaultDefinitions: ", def)
          setDefinition(def)
      } else {
        initDefinition(type, cType, defaultDefinitions)
      }
    }

  }, [definition])
  
  return (
    <>
      {
        definition ?
            <>
              <Button size="icon" onClick={() => setDefinition(null)}>Reload</Button>
              {<DisplayForm type={type} formDefinition={definition} {...props} />}
            </>
          :
            <Loading />
      }
    </>
  )

}

function DisplayForm({
  type,
  formDefinition,
  cardinality = "single",
  params = null,
  importButton = true,
  onImportCallback = null,
  onSubmitCallback = null,
  onUpdateCallback = null,
  syncWithDatabase = true
}) {
  const log = (...args) => Logger.of("DynamicForm.DisplayForm").trace(args)

  const [id, setId] = useState(null)

  const graphqlURI = Constants.WORDPRESS_GRAPHQL_ENDPOINT;
  const [cookies] = useCookies(['JWT']);

  const cType = Utils.camelize(type)
  const name = "form-" + Utils.camelize(type)
  const topics = [
    Utils.camelize(type) + "_DATA_FETCHED",
    "SHOW_" + Utils.camelize(type),
  ]

  const topicsOnSubmit = [
    "REFRESH_CONTENT_" + Utils.camelize(type),
  ]

  function getDefinitionFromType(type, definitions) {
    log("getDefinitionFromType:", type)
    let definition = definitions?.find((def) => {
        log("type:", type, "definition:", def)
        return type === def.name
    })?.definition

    return definition
  }

  function getConstraints(minChars = 1) {
    return z.string().min(minChars, { message: t("AtLeast", { length: minChars }), }).optional().or(z.literal(''))
  }

  function getFormSchema(formDefinition) {
    let formDefinitionObject = {}
    formDefinition?.map((field) => {
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
      return UFC.refreshFormFromStringForm(form, formMetadata, metadata, mergingStrategy)
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
  function refreshForm(topic, message) {
    log("refreshForm: ", "topic: ", topic, "message: ", message)
    setId(message?.objectId || null)
    return UFC.refreshStringForm(form, formMetadata, topic, message)
  }

  //function onSubmit(data: z.infer<typeof FormSchema>) {
  function onSubmit(data) {
    return UFC.onSubmit(graphqlURI, cookies, name, topicsOnSubmit, data)
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

  /**
   * Should be refactored in a specific component
   */
  function getFormMetadata(type, cardinality, formDefinition) {
    let formMetadata = {}
    formMetadata.type = type
    formMetadata.cardinality = cardinality
    formMetadata.formDefinition = formDefinition
    formMetadata.formDefinitionByFieldsName = getFormDefinitionByFieldsName(formMetadata.formDefinition)
    formMetadata.defaultValues = getDefaultValuesFromFormDefinition(formMetadata.formDefinition)
    formMetadata.formSchema = getFormSchema(formMetadata.formDefinition)
    log("formMetadata: ", formMetadata)

    return formMetadata
  }

  function getForm(formMetadata) {
    const FormSchema = z.object(formMetadata.formSchema)
    let form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: formMetadata.defaultValues
    })
    return form
  }

  function getNormalizedFormDefinition(formMetadata) {
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

    return normalizedFormDefinition
  }

  useEffect(() => {
    if (onUpdateCallback) {
      topics.map((topic) => PubSub.subscribe(topic, onUpdateCallback))
    } else {
      topics.map((topic) => PubSub.subscribe(topic, refreshForm))
    }

    if (syncWithDatabase) {
      UtilsGraphQLObject.listOne(graphqlURI, cookies, name, topics)
    }

    if (params && onUpdateCallback) {
      log("useEffect: params: ", params)
      form.reset(params)
      //onUpdateCallback(null, params)
    } else {
      log("useEffect: no params, form.reset()")
      //form.reset(formMetadata.defaultValues)
      form.reset(params)
    }
  }, [])

  const minChars = 2

  let formMetadata = getFormMetadata(type, cardinality, formDefinition)
  let form = getForm(formMetadata)

  let cn = "text-sm font-bold"
  let sectionCn = "pt-5 flex items-center text-md font-bold text-black after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-white dark:after:border-neutral-600"

  let defaultTabsContentLayout = "pl-5 pb-5"
//  let defaultCBB = { displayFormLabel: true, cnFormLabel: "w-[200px] text-right" }
  let defaultCBB = { displayFormLabel: true, cnFormLabel: "w-[400px] text-left" }

  let nfd = getNormalizedFormDefinition(formMetadata)
  let fieldsByGroup = Object.groupBy(nfd, ({ group }) => group || "main")
  let tabsTrigger = Object.keys(fieldsByGroup).map(
    (group) => <TabsTrigger key={`group-${group}]`} className={cn} value={t(Utils.camelize(group))}>{t(Utils.camelize(group))}</TabsTrigger>
  )

  return (
      <Form key={"form-" + id} {...form}>
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



