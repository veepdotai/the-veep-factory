import { useEffect, useState } from 'react'
import { Logger } from 'react-logger-lib'
import { t } from 'i18next'
import PubSub from 'pubsub-js'

import { useCookies } from 'react-cookie'

import { Constants } from 'src/constants/Constants'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { UtilsFormCommon as UFC } from '../../lib/utils-form-common'
import { Utils } from '../../lib/utils'

import formDefinition from "./editorial-form-definition.json"

import { useToast } from "src/components/ui/shadcn/hooks/use-toast"
import { Button } from "src/components/ui/shadcn/button"
import { Form, } from "src/components/ui/shadcn/form"
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "src/components/ui/shadcn/tabs"
import { UtilsGraphQLObject } from '../../../api/utils-graphql-object'
import Loading from 'src/components/common/Loading'
import { fieldNameFromStoreName } from '@apollo/client/cache'
import { normalizeReadFieldOptions } from '@apollo/client/cache/inmemory/policies'

export default function DynamicForm({ type }) {
  const log = Logger.of(DynamicForm.name);

  const graphqlURI = Constants.WORDPRESS_GRAPHQL_ENDPOINT;
  const [cookies] = useCookies(['JWT']);

  const { toast } = useToast()

  const name = "form-" + Utils.camelize(type)
  const topic = Utils.camelize(type) + "_DATA_FETCHED"

  function getConstraints(minChars = 1) {
    return z.string().min(minChars, { message: t("AtLeast", { length: minChars }), }).optional().or(z.literal(''))
  }

  const minChars = 2
  const FormSchema = z.object(getFormSchema(formDefinition))

  let cn = "text-sm font-bold"
  let sectionCn = "pt-5 flex items-center text-md font-bold text-black after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-white dark:after:border-neutral-600"

  let defaultTabsContentLayout = "pl-5"
//  let defaultCBB = { displayFormLabel: true, cnFormLabel: "w-[200px] text-right" }
  let defaultCBB = { displayFormLabel: true, cnFormLabel: "w-[200px] text-left" }

  let form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {}
  })

  function getFormSchema(formDefinition) {
    let formDefinitionObject = {}
    formDefinition.map((field) => {
      formDefinitionObject[field.name] = getConstraints(field.constraints || minChars)
      return null
    })
    console.log(formDefinitionObject)
    return formDefinitionObject
  }

  function updateForm(topic, message) {
    log.trace("updateForm: ", "topic: ", topic, "message: ", message)
    return UFC.updateStringForm(form, topic, message)
  }

  //function onSubmit(data: z.infer<typeof FormSchema>) {
  function onSubmit(data) {
    return UFC.onSubmit(graphqlURI, cookies, name, topic, data, toast)
  }

  useEffect(() => {
    PubSub.subscribe(topic, updateForm)
    UtilsGraphQLObject.listOne(graphqlURI, cookies, name, topic)
  }, [])

  log.trace("updateForm: formDefinition: ", formDefinition)

  let normalizedFormDefinition = formDefinition.filter(({ name }) => name ? true : false)
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
  /**
   * 
   * @param group 
   * @param fdbg form definition by group
   * @returns 
   */
  function getTabsContentForGroup(group, fdbg) {
    let fields = fdbg[group]
    let fieldsBySubgroup = Object.groupBy(fields, ({ subgroup }) => subgroup || "empty")

    let res
    if (!fieldsBySubgroup) {
      res = fields.map((field) => {
        return UFC.getFormField(form, field.name, field.type, field.options, defaultCBB)
      })
    } else {
      res = Object.keys(fieldsBySubgroup).map((subgroup, i) => {
        if (subgroup == "empty") {
          return fieldsBySubgroup[subgroup].map((field) => UFC.getFormField(form, field.name, field.type, field.options, defaultCBB))
        } else {
          return (
            <div>
              <div class={sectionCn}>
                {t(Utils.camelize(subgroup))}
              </div>
              <div class=''>{/*{{ paddingLeft: "3rem"}}*/}
                {fieldsBySubgroup[subgroup].map((field) => UFC.getFormField(form, field.name, field.type, field.options, defaultCBB))}
              </div>
            </div>
          )
        }
      })
    }

    return (
      <TabsContent value={t(Utils.camelize(group))} className={defaultTabsContentLayout}>
        {res}
      </TabsContent>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        <Tabs defaultValue="pitch">

          <TabsList className="grid grid-cols-5">
            {tabsTrigger}
          </TabsList>

          {Object.keys(fieldsByGroup).map((group) => getTabsContentForGroup(group, fieldsByGroup))}
        </Tabs>

        <Button type="submit">{t("Submit")}</Button>
      </form>
    </Form>
  )
}

