'use client'

import { useState } from "react"
import { Logger } from "react-logger-lib"

import PDF from "@/components/veepdotai-pdf-config/components/PDF"

import testdata from "../../data.json"

let initText = `
# La paperasse joyeuse

## Rendre l’administratif plus humain.

L’objectif n’est pas seulement d’aider… mais de le faire avec légèreté:

L’objectif n’est pas seulement d’aider… mais de le faire avec légèreté:

Happy Papers, c’est :
😅 Moins de stress
😅 Plus d’efficacité
😅 Un accompagnement personnalisé
😅 Une approche simple, joyeuse et rassurante

# Lokavivo : le réseau des pros

## Tous secteurs, toutes filières

La plate-forme pour faire du business qui connecte tous les pros

La plate-forme pour faire du business qui connecte tous les pros

😅 Des news
😅 Des problèmes
😅 Des solutions
😅 Du business

`

initText = testdata.textSlides

export default function MyPDFDocument() {
  const log = Logger.of(MyPDFDocument.name)

  const [text, setText] = useState(initText)
  const [params, setParams] = useState(true)
  const [flag, setFlag] = useState(true)

  return (
    <>
      <h1>{new Date().toString()}</h1>
      <PDF initContent={text} initParams={testdata.attachmentGenerationOptions} viewType="custom" viewOptions={testdata.attachmentViewOptions}/>
    </>
  )
}


