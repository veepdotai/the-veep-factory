import { useEffect, useState } from 'react'
import { Logger } from 'react-logger-lib'
import { t } from 'i18next'

//import { Container } from 'react-bootstrap'
import { useCookies } from 'react-cookie'

import { Constants } from 'src/constants/Constants'
import { UtilsGraphQL } from "src/api/utils-graphql"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { UtilsFormCommon as UFC } from '../../lib/utils-form-common'
import { Button } from "src/components/ui/shadcn/button"
import { Form } from "src/components/ui/shadcn/form"

export default function BrandVoiceForm() {
    const log = Logger.of(BrandVoiceForm.name);

    const graphqlURI = Constants.WORDPRESS_GRAPHQL_ENDPOINT;
    const [cookies] = useCookies(['JWT']);
  
    let minChars = 25
    const FormSchema = z.object({
      values: z.string().min(minChars, {
        message: t("AtLeast", {length: minChars}),
      }).optional().or(z.literal('')),
      history: z.string().min(minChars, {
        message: t("AtLeast", {length: minChars}),
      }).optional().or(z.literal('')),
      anecdotes: z.string().min(minChars, {
        message: t("AtLeast", {length: minChars}),
      }).optional().or(z.literal('')),
    })
    
    const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
      },
    })

    useEffect(() => {
    }, [])

    function onSubmit(data: z.infer<typeof FormSchema>) {
      /*
      toast({
        title: "You submitted the following values:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      })
      */
    }

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

