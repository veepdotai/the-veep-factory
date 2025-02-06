import { useEffect, useState } from 'react'
import { Logger } from 'react-logger-lib'
import { t } from 'i18next'
import PubSub from 'pubsub-js'

//import { Container } from 'react-bootstrap'
import { useCookies } from 'react-cookie'
import { useToast } from "src/components/ui/shadcn/hooks/use-toast"

import { UtilsFormCommon as UFC } from '../../lib/utils-form-common'
import { UtilsGraphQLObject } from '../../../api/utils-graphql-object'

import { Constants } from 'src/constants/Constants'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "src/components/ui/shadcn/button"
import { Form } from "src/components/ui/shadcn/form"

export default function BrandVoiceForm() {
    const log = Logger.of(BrandVoiceForm.name);

    const graphqlURI = Constants.WORDPRESS_GRAPHQL_ENDPOINT;
    const [cookies] = useCookies(['JWT']);
  
    const { toast } = useToast()
    const name = "brandVoice"
    const topic = "BRAND_VOICE_DATA_FETCHED"

    function getConstraints(minChars = 1) {
      return z.string().min(minChars, {message: t("AtLeast", {length: minChars}),}).optional().or(z.literal(''))
    }

    let minChars = 25
    const FormSchema = z.object({
      values: getConstraints(minChars),
      history: getConstraints(minChars),
      anecdotes: getConstraints(minChars),
    })
    
    function updateForm(topic, message) {
      log.trace("updateForm: ", "topic: ", topic, "message: ", message)
      return UFC.updateStringForm(form, topic, message)
    }

    //function onSubmit(data: z.infer<typeof FormSchema>) {
    function onSubmit(data) {
        return UFC.onSubmit(graphqlURI, cookies, name, topic, data, toast)
    }

    const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
      },
    })

    useEffect(() => {
      PubSub.subscribe( topic, updateForm)
      UtilsGraphQLObject.listOne(graphqlURI, cookies, name, topic)
    }, [])


    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">

          {UFC.getFormField(form, "values", "textarea")}
          {UFC.getFormField(form, "history", "textarea")}
          {UFC.getFormField(form, "anecdotes", "textarea")}

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    )
}

