import { Logger } from 'react-logger-lib'
import { t } from 'i18next'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

function VContentModel(params) {
    const log = Logger.of(VContentModel.name);

    function getConstraints(minChars = 1) {
      return z.string().min(minChars, {message: t("AtLeast", {length: minChars}),}).optional().or(z.literal(''))
    }

    const minChars = 2

    const Schema = {
      title: getConstraints(minChars),
    }

    const FormSchema = z.object(Schema)

    let defaultValues = {
      title: params?.title,
    }
    

    let form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: defaultValues
    })

    return {
      type: "VContentModel",
      form: form,
      defaultValues: defaultValues,
      schema: Schema,
    }
  
}

function PDFExportModel(params) {
  const log = Logger.of(PDFExportModel.name);

  function getConstraints(minChars = 1) {
    return z.string().min(minChars, {message: t("AtLeast", {length: minChars}),}).optional().or(z.literal(''))
  }

  const minChars = 2

  const Schema = {
    title: getConstraints(minChars),
    subtitle: getConstraints(minChars),
    organizationName: getConstraints(minChars),
    author: getConstraints(minChars),
    version: getConstraints(minChars),
    displayOptions: z.array(z.string()).optional(),
    logo: getConstraints(minChars),
    backgroundImage: getConstraints(minChars),
    css: getConstraints(minChars),
  }

  const FormSchema = z.object(Schema)

  let defaultValues = {
    title: params?.title,
    subtitle: params?.subtitle,
    organizationName: params?.organizationName,
    author: params?.author,
    version: params?.version,
    displayOptions: [],
    logo: params?.logo,
    backgroundImage: params?.backgroundImage,
    css: params?.css  
  }

  let form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: defaultValues
  })

  return {
    type: "PDFExportModel",
    form: form,
    defaultValues: defaultValues,
    schema: Schema,
  }

}

function VeepletModel(params) {
  const log = Logger.of(VeepletModel.name);

  log.trace("params: " + JSON.stringify(params))

  function getConstraints(minChars = 1) {
    return z.string().min(minChars, {message: t("AtLeast", {length: minChars}),}).optional().or(z.literal(''))
  }

  const minChars = 2

  const Schema = {
    "metadata.publication.status": getConstraints(minChars),
    "metadata.publication.scope": getConstraints(minChars),
    "owner.authorId": getConstraints(minChars),
    "owner.orgId": getConstraints(minChars),
    "owner.creationDate": getConstraints(minChars),
    "metadata.classification.group": getConstraints(minChars),
    "metadata.classification.category": getConstraints(minChars),
    "metadata.classification.subCategory": getConstraints(minChars),
    "metadata.name": getConstraints(minChars),
    "details.presentation.heading": getConstraints(minChars),
    "metadata.reviews": getConstraints(minChars),
    "metadata.version": getConstraints(minChars),
    "details.ui.headerIconName": getConstraints(minChars),
    "details.ui.headerColor": getConstraints(minChars),
    "details.ui.headerBgColorFrom": getConstraints(minChars),
    "details.ui.headerBgColorTo": getConstraints(minChars),
    "details.ui.headerBgColorAngle": getConstraints(minChars),
    "details.ui.bodyIconName": getConstraints(minChars),
    "details.ui.bodyColor": getConstraints(minChars),
    "details.ui.bodyBgColorFrom": getConstraints(minChars),
    "details.ui.bodyBgColorTo": getConstraints(minChars),
    "details.ui.bodyBgColorAngle": getConstraints(minChars),
    "details.presentation.icon": getConstraints(minChars),
    "details.presentation.image": getConstraints(minChars),
    "details.presentation.description": getConstraints(minChars),
    "metadata.summary": getConstraints(minChars),
    "details.presentation.tips1": getConstraints(minChars),
    "details.presentation.tips2": getConstraints(minChars),
  }

  const FormSchema = z.object(Schema)

  function getParamValue(data, varName) {    
    let attrs = varName.match(/[a-zA-Z_0-9]+/g)
    log.trace("attrs: " + JSON.stringify(attrs));

    for(let i = 0; i < attrs.length; i++) {
      log.trace("attr: " + attrs[i]);
      try {
        data = data[attrs[i]];
      } catch(e) {
        data = "";
      }
    }
    log.trace("varName / data: " + varName + "/" + JSON.stringify(data));

    return data
  }

  let defaultValues = {
    "metadata.publication.status": getParamValue(params, "metadata.publication.status"),
    "metadata.publication.scope": getParamValue(params, "metadata.publication.scope"),
    "owner.authorId": getParamValue(params, "owner.authorId"),
    "owner.orgId": getParamValue(params, "owner.orgId"),
    "owner.creationDate": getParamValue(params, "owner.creationDate"),
    "metadata.classification.group": getParamValue(params, "metadata.classification.group"),
    "metadata.classification.category": getParamValue(params, "metadata.classification.category"),
    "metadata.classification.subCategory": getParamValue(params, "metadata.classification.subCategory"),
    "metadata.name": getParamValue(params, "metadata.name"),
    "details.presentation.heading": getParamValue(params, "details.presentation.heading"),
    "metadata.reviews": getParamValue(params, "metadata.reviews"),
    "metadata.version": getParamValue(params, "metadata.version"),
    "details.ui.headerIconName": getParamValue(params, "details.ui.headerIconName"),
    "details.ui.headerColor": getParamValue(params, "details.ui.headerColor"),
    "details.ui.headerBgColorFrom": getParamValue(params, "details.ui.headerBgColorFrom"),
    "details.ui.headerBgColorTo": getParamValue(params, "details.ui.headerBgColorTo"),
    "details.ui.headerBgColorAngle": getParamValue(params, "details.ui.headerBgColorAngle"),
    "details.ui.bodyIconName": getParamValue(params, "details.ui.bodyIconName"),
    "details.ui.bodyColor": getParamValue(params, "details.ui.bodyColor"),
    "details.ui.bodyBgColorFrom": getParamValue(params, "details.ui.bodyBgColorFrom"),
    "details.ui.bodyBgColorTo": getParamValue(params, "details.ui.bodyBgColorTo"),
    "details.ui.bodyBgColorAngle": getParamValue(params, "details.ui.bodyBgColorAngle"),
    "details.presentation.icon": getParamValue(params, "details.presentation.icon"),
    "details.presentation.image": getParamValue(params, "details.presentation.image"),
    "details.presentation.description": getParamValue(params, "details.presentation.description"),
    "metadata.summary": getParamValue(params, "metadata.summary"),
    "details.presentation.tips1": getParamValue(params, "details.presentation.tips1"),
    "details.presentation.tips2": getParamValue(params, "details.presentation.tips2"),
  }

  let form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: defaultValues
  })

  return {
    type: "VeepletModel",
    form: form,
    defaultValues: defaultValues,
    schema: Schema,
  }

}

export {VContentModel, PDFExportModel, VeepletModel}
