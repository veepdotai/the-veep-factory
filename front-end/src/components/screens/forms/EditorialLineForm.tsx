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

export default function EditorialLineForm() {
    const log = Logger.of(EditorialLineForm.name);

    const graphqlURI = Constants.WORDPRESS_GRAPHQL_ENDPOINT;
    const [cookies] = useCookies(['JWT']);
  
    const { toast } = useToast()

    const name = "editorialLine"
    const topic = "EDITORIAL_LINE_DATA_FETCHED"

    function getConstraints(minChars = 1) {
      return z.string().min(minChars, {message: t("AtLeast", {length: minChars}),}).optional().or(z.literal(''))
    }

    const minChars = 2
    const FormSchema = z.object({
        benefits: getConstraints(minChars),
        pains: getConstraints(minChars),
        solutions: getConstraints(minChars),
        offers: getConstraints(minChars),
        uniqueFeatures: getConstraints(minChars),

        icp: getConstraints(minChars),
        buyerPersona: getConstraints(minChars),

        themes: getConstraints(minChars),
        roles: getConstraints(minChars),

        vocabulary: getConstraints(minChars),
        syntax: getConstraints(minChars),
        pointOfView: getConstraints(minChars),
        tone: getConstraints(minChars),
        structure: getConstraints(minChars),

        gender: getConstraints(minChars),
        language: getConstraints(minChars),
        emojis: getConstraints(1),
        emojisGranularity: getConstraints(minChars),
        frequency: getConstraints(1),
        frequencyGranularity: getConstraints(1),
        framework: getConstraints(minChars),
        signature: getConstraints(minChars),
    })

    let cn = "text-sm font-bold"
    let defaultTabsContentLayout = "pl-5"
    let defaultCBB = {displayFormLabel: true, cnFormLabel: "w-[200px] text-right"}

    let form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {}
    })

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

    return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            <Tabs defaultValue="pitch">

              <TabsList className="grid grid-cols-5">
                <TabsTrigger className={cn} value="pitch">{t("Pitch")}</TabsTrigger>
                <TabsTrigger className={cn} value="target">{t("Target")}</TabsTrigger>
                <TabsTrigger className={cn} value="content">{t("Content")}</TabsTrigger>
                <TabsTrigger className={cn} value="style">{t("Style")}</TabsTrigger>
                <TabsTrigger className={cn} value="scheduling">{t("Scheduling")}</TabsTrigger>
              </TabsList>

              <TabsContent value="pitch" className={defaultTabsContentLayout}>
                {UFC.getFormField(form, "benefits", "textarea")}
                {UFC.getFormField(form, "pains", "textarea")}
                {UFC.getFormField(form, "solutions", "textarea")}
                {UFC.getFormField(form, "offers", "textarea")}
                {UFC.getFormField(form, "uniqueFeatures", "textarea")}
              </TabsContent>

              <TabsContent value="target" className={defaultTabsContentLayout}>
                {UFC.getFormField(form, "icp", "textarea")}
                {UFC.getFormField(form, "buyerPersona", "textarea")}
              </TabsContent>

              <TabsContent value="content" className={defaultTabsContentLayout}>
                {UFC.getFormField(form, "themes", "textarea")}
                {UFC.getFormField(form, "roles", "textarea")}

                <div class="flex items-center text-md font-bold text-black after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-white dark:after:border-neutral-600">
                    {t("Misc")}
                </div>
                <div style={{ paddingLeft: "3rem"}}>
                  {UFC.getFormField(form, "gender", "combobox", "Male|Female|Neutral|NoMatter", defaultCBB)}
                  {UFC.getFormField(form, "language", "combobox", "fr-FR:fr(FR)|fr-CA:fr(CA)|en-UK:en(UK)|en-US:en(US)|sp|de", defaultCBB)}
                  {UFC.getFormField(form, "signature", "textarea")}
                  </div>
              </TabsContent>

              <TabsContent value="style" className={defaultTabsContentLayout}>
                <div class="flex items-center text-md font-bold text-black after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-white dark:after:border-neutral-600">
                    {t("Style")}
                </div>
                <div style={{ paddingLeft: "3rem"}}>
                  {/*UFC.getFormField(form, "style", "select", "Friendly|Neutral|Professional|Solemn")*/}

                  {UFC.getFormField(form, "vocabulary", "combobox", "Extended|Limited|Slang|Evolved|Common|Technical", defaultCBB)}
                  {UFC.getFormField(form, "syntax", "combobox", "Complex|Simple|LongAndFlowing|ShortAndSimple", defaultCBB)}
                  {UFC.getFormField(form, "pointOfView", "combobox", "Je|Tu|Il|Elle|Iel|Nous|Vous|Ils|Elles|Iels", defaultCBB)}
                  {UFC.getFormField(form, "tone", "combobox", "Cold|Formal|Unformal|Humorous|Serious|Solemn|Sarcastic|Warm", defaultCBB)}
                  {UFC.getFormField(form, "structure", "combobox", "para-expositif:Paragraph-Expositif", defaultCBB)}
                </div>

                <div class="pt-5 flex items-center text-md font-bold text-black after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-white dark:after:border-neutral-600">
                    {t("Emojis")}
                </div>
                <div style={{ paddingLeft: "3rem"}}>
                  {UFC.getFormField(form, "emojis", "combobox", "1|2|3|4", defaultCBB)}
                  {UFC.getFormField(form, "emojisGranularity", "combobox", "para:Paragraph|sentence:Sentence", defaultCBB)}
                </div>
              </TabsContent>

              <TabsContent value="scheduling" className={defaultTabsContentLayout}>
                {UFC.getFormField(form, "frequency", "combobox", "1:1T|2:2T|3:3T|4:4T|5:5T|6:6T|7:7T|8:8T|9:9T|10:10T", defaultCBB)}
                {UFC.getFormField(form, "frequencyGranularity", "combobox", "Day|Week|Fortnight|Month|Quarter|Half-Yeer|Year", defaultCBB)}
                {UFC.getFormField(form, "framework", "combobox", "xofu:TOFU/MOFU/BOFU|AARRR", defaultCBB)}
              </TabsContent>
                  
            </Tabs>

            <Button type="submit">{t("Submit")}</Button>
          </form>
        </Form>
    )
}

