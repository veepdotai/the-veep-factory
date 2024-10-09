//import Image from 'next/image'
import dynamic from 'next/dynamic'
import { Suspense, useRef } from 'react'
import EditorComp from './EditorComponent'

//const EditorComp = dynamic(() => import('./EditorComponent'), { ssr: false })

export default function EditorHome({cid, attrName, markdown, contentEditableClassName}) {
  let ref = useRef();
  return (
      <Suspense fallback={null}>
        <EditorComp cid={cid} editorRef={ref} attrName={attrName} markdown={markdown} contentEditableClassName="text-green" />
      </Suspense>
  )
}