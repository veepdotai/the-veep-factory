'use client'

import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Logger } from 'react-logger-lib';
import PubSub from "pubsub-js";
import { getIcon } from "src/constants/Icons";

import {FC, useEffect} from 'react'
import {
    MDXEditor,
    MDXEditorMethods,
    headingsPlugin,
    linkDialogPlugin,
    listsPlugin,
    quotePlugin,
    thematicBreakPlugin,
    markdownShortcutPlugin,
    tablePlugin,
    diffSourcePlugin,
    toolbarPlugin,
    BlockTypeSelect,
    UndoRedo, BoldItalicUnderlineToggles,
    CreateLink, InsertTable,
    DiffSourceToggleWrapper,
    imagePlugin,
    InsertImage,

} from "@mdxeditor/editor"
import '@mdxeditor/editor/style.css'

interface EditorProps {
  attrName: string
  markdown: string
  editorRef?: React.MutableRefObject<MDXEditorMethods | null>
  contentEditableClassName: string
}

/**
 * Extend this Component further with the necessary plugins or props you need.
 * proxying the ref is necessary. Next.js dynamically imported components don't support refs. 
*/
const Editor: FC<EditorProps> = ({ cid, attrName, markdown, editorRef, contentEditableClassName }) => {
  const log = Logger.of(Editor.name);

  let looknfeel = {
    variant: 'outline-info',
    className: 'ms-2 p-2 btn btn-sm fs-6 float-end'
  }

  // () => console.log(editorRef?.current?.getMarkdown())
  function handleSave(markdown) {
    //alert('Markdown: ' + markdown);
    log.trace("markdown: " + markdown);
    let params = {
      cid: cid,
      content: markdown
    }
    PubSub.publish(`MARKDOWN_CONTENT_${attrName}`, params)
      
  }

  return (
    <>
      { true ?
        <>
          <Button {...looknfeel} onClick={() => handleSave(editorRef.current.getMarkdown())}>
            {getIcon("save")}
          </Button>
          <MDXEditor ref={editorRef} markdown={markdown} contentEditableClassName={contentEditableClassName} plugins={[
                headingsPlugin(),
                listsPlugin(),
                linkDialogPlugin(),
                quotePlugin(),
                imagePlugin({
                  imageUploadHandler: () => {
                    return Promise.resolve('https://picsum.photos/200/300')
                  },
                  imageAutocompleteSuggestions: ['https://picsum.photos/200/300', 'https://picsum.photos/200']
                }),
                thematicBreakPlugin(),
                markdownShortcutPlugin(),
                tablePlugin(),
                diffSourcePlugin({ diffMarkdown: 'An older version', viewMode: 'rich-text' }),
                toolbarPlugin({
                    toolbarContents: () => (
                      <>
                        <BlockTypeSelect />
                        {' '}
                        <UndoRedo />
                        <BoldItalicUnderlineToggles />
                        <CreateLink />
                        <InsertImage />
                        <InsertTable />
                        <DiffSourceToggleWrapper>
                          <UndoRedo />
                        </DiffSourceToggleWrapper>
                      </>
                    )
                  })
            ]}
          />
        </>
        :
        <></>
      }
    </>
  )
}

export default Editor