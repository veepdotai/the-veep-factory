import { useEffect, useState } from 'react'
import { Logger } from 'react-logger-lib'
import PubSub from 'pubsub-js'
import { t } from 'src/components/lib/utils'

import { useCookies } from 'react-cookie'

import { Constants } from 'src/constants/Constants'

import { UtilsFormCommon as UFC } from '../../lib/utils-form-common'
import { Utils } from '../../lib/utils'

import { useToast } from "src/components/ui/shadcn/hooks/use-toast"
import { Button } from "src/components/ui/shadcn/button"
import { Form, } from "src/components/ui/shadcn/form"
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "src/components/ui/shadcn/tabs"
import { UtilsGraphQL } from '../../../api/utils-graphql'

import { VContentModel } from './DataModel'

import Loading from 'src/components/common/Loading'

export default function VContentForm( {cid, params} ) {
    const log = Logger.of(VContentForm.name);

    const graphqlURI = Constants.WORDPRESS_GRAPHQL_ENDPOINT;
    const [cookies] = useCookies(['JWT']);
  
    const { toast } = useToast()

    const topic = "VCONTENT_FETCHED"

    let model= VContentModel(params)
    let form = model.form

    let cn = "text-sm font-bold"
    let defaultTabsContentLayout = "pl-5"
    let defaultCBB = {displayFormLabel: true, cnFormLabel: "w-[200px] text-right"}

    function updateFormDisplay(topic, message) {
      log.trace('updateFormDisplay: message: ', message)

      let metadata = null
      if ("200" == message?.status) {
        metadata = message.original
      } else {
        metadata = message
      }

      log.trace('updateFormDisplay: metadata: ', metadata)

      let newParams = {cid: cid, ...metadata, ...params}
      log.trace(`onSubmit: newParams: ${JSON.stringify(newParams)}`)
      PubSub.publish("INFOS_PANEL_UPDATED", newParams)

      return UFC.refreshForm(form, topic, metadata)  
    }

    //function onSubmit(data: z.infer<typeof FormSchema>) {
    function onSubmit(data) {
        // Merge export form data and params
        log.trace(`onSubmit.`)
        log.trace(`onSubmit: data: ${JSON.stringify(data)}`)

        let newParams = {cid: cid, ...data, ...params}
        log.trace(`onSubmit: newParams: ${JSON.stringify(newParams)}`)
        PubSub.publish("INFOS_PANEL_UPDATED", newParams)
        return UFC.onSubmitMetadata(graphqlURI, cookies, cid, data, topic, toast)
    }


    function getDomainValues() {
      return "draft|waiting|validated|published"
    }

    function getSubDomainValues() {
      return "draft|waiting|validated|published"
    }

    function getCategoryValues() {
      return "pole-dir-generale|pole-admin-finance|pole-marketing-communication|"
    }

    function getSubCategoryValues() {
      return "dir-generale|dir-operations|dir-service-client|dir-rh|dir-commerciale|dir-admin-financier|dir-marketing|dir-maintenance|dir-technique|dir-innovation"
    }

    function getArtefactTypeValues() {
      return "case-study|feedback|white-paper|blog-article|blog-post|linkedin-article|linkedin-post"
    }

    function getStatusValues() {
      return "draft|waiting|validated|published"
    }

    useEffect(() => {
      PubSub.subscribe(topic, updateFormDisplay)
      if (cid) {
        UtilsGraphQL
        .listOne(graphqlURI, cookies, cid)
        .then(
          (data) => {
            log.trace("useEffect: data: ", data);
            let metadataString = data?.nodes[0].tvfMetadata
            log.trace(`useEffect: metadataString: ${metadataString}`);

            metadataString = Utils.normalize(metadataString)
            let metadata = null
            try {
              metadata = JSON.parse(metadataString)
            } catch (e) {
              log.trace(`${e}: Can't parse metadataString to json: ${metadataString}`)
            }
  
            PubSub.publish(topic, metadata) // String
        })
      }

      //UtilsGraphQLObject.listOne(graphqlURI, cookies, cid, "metadata", topic)
    }, [])

    return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mx-3">

            <Tabs defaultValue="metadata">

              <TabsList className="grid grid-cols-5">
                <TabsTrigger className={cn} value="metadata">{t("Metadata")}</TabsTrigger>
                <TabsTrigger className={cn} value="display">{t("Layout")}</TabsTrigger>
                <TabsTrigger className={cn} value="css">{t("CSS")}</TabsTrigger>
              </TabsList>

              <TabsContent value="metadata" className={defaultTabsContentLayout}>
                {UFC.getFormField(form, "title", "input")}
                {UFC.getFormField(form, "subtitle", "input")}
                {UFC.getFormField(form, "version", "input")}
                {UFC.getFormField(form, "organizationName", "input")}
                {UFC.getFormField(form, "author", "input")}

                {UFC.getFormField(form, "domain", "combobox", getDomainValues(), defaultCBB)}
                {UFC.getFormField(form, "subDomain", "combobox", getSubDomainValues(), defaultCBB)}
                {UFC.getFormField(form, "category", "combobox", getCategoryValues(), defaultCBB)}
                {UFC.getFormField(form, "subCategory", "combobox", getSubCategoryValues(), defaultCBB)}
                {UFC.getFormField(form, "artefactType", "combobox", getArtefactTypeValues(), defaultCBB)}
                
                {UFC.getFormField(form, "status", "combobox", getStatusValues(), defaultCBB)}
                {UFC.getFormField(form, "pubDate", "input")}
                {UFC.getFormField(form, "target", "input")}
                {UFC.getFormField(form, "up", "input")}
                {UFC.getFormField(form, "down", "input")}
              </TabsContent>

              <TabsContent value="display" className={defaultTabsContentLayout}>
                {UFC.getFormField(form, "displayOptions", "checkbox")}

                {UFC.getFormField(form, "logo", "input")}
                {UFC.getFormField(form, "backgroundImage", "input")}
              </TabsContent>

              <TabsContent value="css" className={defaultTabsContentLayout}>
                {UFC.getFormField(form, "css", "textarea")}
              </TabsContent>

            </Tabs>

            <Button className="float-right" type="submit">{t("Submit")}</Button>
          </form>
        </Form>
    )
}

