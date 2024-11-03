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

import { useToast } from "src/components/ui/shadcn/hooks/use-toast"
import { Button } from "src/components/ui/shadcn/button"
import { Form, } from "src/components/ui/shadcn/form"
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "src/components/ui/shadcn/tabs"
import { UtilsGraphQLObject } from '../../../api/utils-graphql-object'

import Loading from 'src/components/common/Loading'

export default function PDFExportForm() {
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
      logo: getConstraints(minChars),
      backgroundImage: getConstraints(minChars),
      title: getConstraints(minChars),
      subtitle: getConstraints(minChars),
      css: getConstraints(minChars),
      organizationName: getConstraints(minChars),
      author: getConstraints(minChars),
    })

    let cn = "text-sm font-bold"
    let defaultTabsContentLayout = "pl-5"
    let defaultCBB = {displayFormLabel: true, cnFormLabel: "w-[200px] text-right"}

    let form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {}
    })

    function updateForm(topic, message) {
      return UFC.updateForm(form, topic, message)
    }

    //function onSubmit(data: z.infer<typeof FormSchema>) {
    function onSubmit(data) {
        return UFC.onSubmit(graphqlURI, cookies, name, topic, data, toast)
    }

    useEffect(() => {
      PubSub.subscribe(topic, updateForm)
      UtilsGraphQLObject.listOne(graphqlURI, cookies, name, topic)
    }, [])

    return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            <Tabs defaultValue="presentation">

              <TabsList className="grid grid-cols-5">
                <TabsTrigger className={cn} value="presentation">{t("Presentation")}</TabsTrigger>
                <TabsTrigger className={cn} value="display">{t("Display")}</TabsTrigger>
                <TabsTrigger className={cn} value="css">{t("CSS")}</TabsTrigger>
              </TabsList>

              <TabsContent value="presentation" className={defaultTabsContentLayout}>
                {UFC.getFormField(form, "logo", "input")}
              </TabsContent>

              <TabsContent value="display" className={defaultTabsContentLayout}>
                {UFC.getFormField(form, "logo", "input")}
                {UFC.getFormField(form, "backgroundImage", "input")}
                {UFC.getFormField(form, "title", "input")}
                {UFC.getFormField(form, "subtitle", "input")}
                {UFC.getFormField(form, "organizationName", "input")}
                {UFC.getFormField(form, "author", "input")}
              </TabsContent>

              <TabsContent value="css" className={defaultTabsContentLayout}>
                {UFC.getFormField(form, "css", "textarea")}
              </TabsContent>

            </Tabs>

            <Button type="submit">{t("Submit")}</Button>
          </form>
        </Form>
    )
}

