import { useEffect, useState } from 'react'
import { Logger } from 'react-logger-lib'
import { t } from 'src/components/lib/utils'

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

export default function PubTargetForm() {
    const log = Logger.of(PubTargetForm.name);

    const graphqlURI = Constants.WORDPRESS_GRAPHQL_ENDPOINT;
    const [cookies] = useCookies(['JWT']);
  
    const FormSchema = z.object({
        linkedInHost: z.string().min(2, {
            message: t("AtLeast", {length: 2}),
        }),
        linkedInUser: z.string().min(2, {
          message: t("AtLeast", {length: 2}),
        }),
    })
    
    const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        "benefits": ""
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

          {UFC.getFormField(form, "linkedInHost")}
          {UFC.getFormField(form, "linkedInUser")}

          <Button type="submit">{t("Submit")}</Button>
        </form>
      </Form>
    )
}

