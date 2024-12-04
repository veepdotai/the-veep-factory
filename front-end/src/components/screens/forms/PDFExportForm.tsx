import { useEffect, useState } from 'react'
import { Logger } from 'react-logger-lib'
import PubSub from 'pubsub-js'
import { t } from 'i18next'

import { useCookies } from 'react-cookie'

import { Constants } from 'src/constants/Constants'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { UtilsFormCommon as UFC } from '../../lib/utils-form-common'

import { useToast } from "src/components/ui/shadcn/hooks/use-toast"
import { Button } from "src/components/ui/shadcn/button"
import { Form, } from "src/components/ui/shadcn/form"
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "src/components/ui/shadcn/tabs"
import { UtilsGraphQL } from '../../../api/utils-graphql'

import Loading from 'src/components/common/Loading'

export default function PDFExportForm( {cid, params} ) {
    const log = Logger.of(PDFExportForm.name);

    const graphqlURI = Constants.WORDPRESS_GRAPHQL_ENDPOINT;
    const [cookies] = useCookies(['JWT']);
  
    const { toast } = useToast()

    const name = "pdfExport"
    const topic = "PDF_EXPORT_DATA_FETCHED"

    function getConstraints(minChars = 1) {
      return z.string().min(minChars, {message: t("AtLeast", {length: minChars}),}).optional().or(z.literal(''))
    }

    const minChars = 2
    const FormSchema = z.object({
      title: getConstraints(minChars),
      subtitle: getConstraints(minChars),
      organizationName: getConstraints(minChars),
      author: getConstraints(minChars),
      version: getConstraints(minChars),

      displayOptions: z.array(z.string()).optional(),
//      displayOptions: z.array(z.string()).refine((value) => value?.some((item) => item), {
//        message: t("SelectOnItem"),
//      }),

      logo: getConstraints(minChars),
      backgroundImage: getConstraints(minChars),
      css: getConstraints(minChars),
    })

    let cn = "text-sm font-bold"
    let defaultTabsContentLayout = "pl-5"
    let defaultCBB = {displayFormLabel: true, cnFormLabel: "w-[200px] text-right"}

    let form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        title: params?.title,
        subtitle: params?.subtitle,
        organizationName: params?.organizationName,
        author: params?.author,
        version: params?.version,
  
//        displays: z.array(z.string()).refine((value) => value.some((item) => item), {
//          message: t("SelectOneItem"),
//        }),
        displayOptions: [],

        logo: params?.logo,
        backgroundImage: params?.backgroundImage,
        css: params?.css  
      }
    })

    function updateFormDisplay(topic, message) {
      log.trace('updateFormDisplay: message: ' + JSON.stringify(message))

      let metadata = null
      if ("200" == message?.status) {
        metadata = message.original
      } else {
        metadata = message
      }

      log.trace('updateFormDisplay: metadata: ' + JSON.stringify(metadata))

      let newParams = {cid: cid, ...metadata, ...params}
      log.trace(`onSubmit: newParams: ${JSON.stringify(newParams)}`)
      PubSub.publish("INFOS_PANEL_UPDATED", newParams)

      return UFC.updateForm(form, topic, metadata)  
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

    useEffect(() => {
      PubSub.subscribe(topic, updateFormDisplay)
      if (cid) {
        UtilsGraphQL
        .listOne(graphqlURI, cookies, cid)
        .then(
          (data) => {
            log.trace("useEffect: data: " + JSON.stringify(data));
            let metadataString = data?.nodes[0].veepdotaiMetadata
            log.trace(`useEffect: metadataString: ${metadataString}`);

            metadataString = metadataString.replace(/_G_/g, '"').replace(/_EOL_/g, "\n")
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

