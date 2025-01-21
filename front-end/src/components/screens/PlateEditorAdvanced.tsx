"use client";

import { useEffect, useState } from 'react';
import { Logger } from 'react-logger-lib';
import { t } from 'i18next'

import { withProps } from '@udecode/cn';
import { createPlateEditor, Plate, ParagraphPlugin, PlateElement, PlateLeaf } from '@udecode/plate/react';
import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import { CodeBlockPlugin, CodeLinePlugin, CodeSyntaxPlugin } from '@udecode/plate-code-block/react';

import { HeadingPlugin } from '@udecode/plate-heading/react';
import { HorizontalRulePlugin } from '@udecode/plate-horizontal-rule/react';
import { LinkPlugin } from '@udecode/plate-link/react';
import { ImagePlugin, MediaEmbedPlugin } from '@udecode/plate-media/react';
import { CaptionPlugin } from '@udecode/plate-caption/react';
import { TodoListPlugin, ListPlugin, BulletedListPlugin, NumberedListPlugin, ListItemPlugin } from '@udecode/plate-list/react';
import { ExcalidrawPlugin } from '@udecode/plate-excalidraw/react';
import { TogglePlugin } from '@udecode/plate-toggle/react';
import { ColumnPlugin, ColumnItemPlugin } from '@udecode/plate-layout/react';
import { MentionPlugin, MentionInputPlugin } from '@udecode/plate-mention/react';
import { TablePlugin, TableRowPlugin, TableCellPlugin, TableCellHeaderPlugin } from '@udecode/plate-table/react';
import { DatePlugin } from '@udecode/plate-date/react';
import { BoldPlugin, ItalicPlugin, UnderlinePlugin, StrikethroughPlugin, CodePlugin, SubscriptPlugin, SuperscriptPlugin } from '@udecode/plate-basic-marks/react';
import { BaseFontColorPlugin, BaseFontBackgroundColorPlugin, BaseFontSizePlugin } from '@udecode/plate-font';
import { HighlightPlugin } from '@udecode/plate-highlight/react';
import { KbdPlugin } from '@udecode/plate-kbd/react';
import { BaseAlignPlugin } from '@udecode/plate-alignment';
import { IndentPlugin } from '@udecode/plate-indent/react';
import { IndentListPlugin } from '@udecode/plate-indent-list/react';
import { BaseLineHeightPlugin } from '@udecode/plate-line-height';
import { AutoformatPlugin } from '@udecode/plate-autoformat/react';
import { BlockSelectionPlugin } from '@udecode/plate-selection/react';
import { DndPlugin } from '@udecode/plate-dnd';
import { EmojiPlugin } from '@udecode/plate-emoji/react';
import { ExitBreakPlugin, SoftBreakPlugin } from '@udecode/plate-break/react';
import { NodeIdPlugin } from '@udecode/plate-node-id';
import { ResetNodePlugin } from '@udecode/plate-reset-node/react';
import { DeletePlugin } from '@udecode/plate-select';
import { TabbablePlugin } from '@udecode/plate-tabbable/react';
import { TrailingBlockPlugin } from '@udecode/plate-trailing-block';
import { CommentsPlugin } from '@udecode/plate-comments/react';
import { DocxPlugin } from '@udecode/plate-docx';
import { CsvPlugin } from '@udecode/plate-csv';
import { MarkdownPlugin } from '@udecode/plate-markdown';
import { JuicePlugin } from '@udecode/plate-juice';
import { HEADING_KEYS } from '@udecode/plate-heading';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Prism from 'prismjs';

import { BlockquoteElement } from '@/components/plate-ui/blockquote-element';
import { CodeBlockElement } from '@/components/plate-ui/code-block-element';
import { CodeLineElement } from '@/components/plate-ui/code-line-element';
import { CodeSyntaxLeaf } from '@/components/plate-ui/code-syntax-leaf';
import { ExcalidrawElement } from '@/components/plate-ui/excalidraw-element';
import { HrElement } from '@/components/plate-ui/hr-element';
import { ImageElement } from '@/components/plate-ui/image-element';
import { LinkElement } from '@/components/plate-ui/link-element';
import { LinkFloatingToolbar } from '@/components/plate-ui/link-floating-toolbar';
import { ToggleElement } from '@/components/plate-ui/toggle-element';
import { ColumnGroupElement } from '@/components/plate-ui/column-group-element';
import { ColumnElement } from '@/components/plate-ui/column-element';
import { HeadingElement } from '@/components/plate-ui/heading-element';
import { ListElement } from '@/components/plate-ui/list-element';
import { MediaEmbedElement } from '@/components/plate-ui/media-embed-element';
import { MentionElement } from '@/components/plate-ui/mention-element';
import { MentionInputElement } from '@/components/plate-ui/mention-input-element';
import { ParagraphElement } from '@/components/plate-ui/paragraph-element';
import { TableElement } from '@/components/plate-ui/table-element';
import { TableRowElement } from '@/components/plate-ui/table-row-element';
import { TableCellElement, TableCellHeaderElement } from '@/components/plate-ui/table-cell-element';
import { TodoListElement } from '@/components/plate-ui/todo-list-element';
import { DateElement } from '@/components/plate-ui/date-element';
import { CodeLeaf } from '@/components/plate-ui/code-leaf';
import { CommentLeaf } from '@/components/plate-ui/comment-leaf';
import { CommentsPopover } from '@/components/plate-ui/comments-popover';
import { HighlightLeaf } from '@/components/plate-ui/highlight-leaf';
import { KbdLeaf } from '@/components/plate-ui/kbd-leaf';
import { Editor } from '@/components/plate-ui/editor';

import { FixedToolbar } from '@/components/ui/veep/fixed-toolbar';
import { FixedToolbarButtons } from '@/components/ui/veep/fixed-toolbar-buttons';
import { FloatingToolbar } from '@/components/ui/veep/floating-toolbar';
import { FloatingToolbarButtons } from '@/components/ui/veep/floating-toolbar-buttons';

//import { PlaygroundFixedToolbarButtons } from '@/components/plate-ui/playground-fixed-toolbar-buttons';
//import { PlaygroundFloatingToolbarButtons } from '@/components/plate-ui/playground-floating-toolbar-buttons';

import { withPlaceholders } from '@/components/plate-ui/placeholder';
import { withDraggables } from '@/components/plate-ui/with-draggables';
import { EmojiInputElement } from '@/components/plate-ui/emoji-input-element';
import { TooltipProvider } from '@/components/plate-ui/tooltip';

import MergedContent from './mycontent/parts/MergedContent';

/**
 * 
 * @param (String | String[]) input provided as markdown or CRT. If markdown then converted in CRT 
 * @returns Plate editor with provided plugins
 */
export function PlateEditorAdvanced( {input, contentId = null, attrName = null, cn = "w-full"} ) {
  const log = Logger.of("PlaceEditor")

  const [content, setContent] = useState([])
  
  function getEditor(_content = []) {

    editor = createPlateEditor({
        plugins: [
          BlockquotePlugin,
          CodeBlockPlugin.configure({
            options: {
              prism: Prism,
            },
          }),
          ParagraphPlugin,
          HeadingPlugin,
          HorizontalRulePlugin,
          LinkPlugin.configure({
            render: { afterEditable: () => <LinkFloatingToolbar /> },
          }),
          ImagePlugin,
          CaptionPlugin.configure({
            options: { plugins: [ImagePlugin, MediaEmbedPlugin] },
          }),
          TodoListPlugin,
          ExcalidrawPlugin,
          TogglePlugin,
          ColumnPlugin,
          ListPlugin,
          MediaEmbedPlugin,
          MentionPlugin,
          TablePlugin,
          DatePlugin,
          BoldPlugin,
          ItalicPlugin,
          UnderlinePlugin,
          StrikethroughPlugin,
          CodePlugin,
          SubscriptPlugin,
          SuperscriptPlugin,
          BaseFontColorPlugin,
          BaseFontBackgroundColorPlugin,
          BaseFontSizePlugin,
          HighlightPlugin,
          KbdPlugin,
          BaseAlignPlugin.configure({
            inject: { targetPlugins: ['p', 'h1', 'h2', 'h3'] },
          }),
          IndentPlugin.configure({
            inject: { targetPlugins: ['p', 'h1', 'h2', 'h3'] },
          }),
          IndentListPlugin.configure({
            inject: { targetPlugins: ['p', 'h1', 'h2', 'h3'] },
          }),
          BaseLineHeightPlugin.configure({
            inject: {
              nodeProps: {
                defaultNodeValue: 1.5,
                validNodeValues: [1, 1.2, 1.5, 2, 3],
              },
              targetPlugins: ['p', 'h1', 'h2', 'h3'],
            },
          }),
          AutoformatPlugin.configure({
            options: {
              enableUndoOnDelete: true,
              rules: [
                // Usage: https://platejs.org/docs/autoformat
              ],
            },
          }),
          BlockSelectionPlugin,
          DndPlugin.configure({
              options: { enableScroller: true },
          }),
          EmojiPlugin,
          ExitBreakPlugin.configure({
            options: {
              rules: [
                {
                  hotkey: 'mod+enter',
                },
                {
                  before: true,
                  hotkey: 'mod+shift+enter',
                },
                {
                  hotkey: 'enter',
                  level: 1,
                  query: {
                    allow: ['h1', 'h2', 'h3'],
                    end: true,
                    start: true,
                  },
                  relative: true,
                },
              ],
            },
          }),
          NodeIdPlugin,
          ResetNodePlugin.configure({
            options: {
              rules: [
                // Usage: https://platejs.org/docs/reset-node
              ],
            },
          }),
          DeletePlugin,
          SoftBreakPlugin.configure({
            options: {
              rules: [
                { hotkey: 'shift+enter' },
                {
                  hotkey: 'enter',
                  query: {
                    allow: ['code_block', 'blockquote', 'td', 'th'],
                  },
                },
              ],
            },
          }),
          TabbablePlugin,
          TrailingBlockPlugin.configure({
            options: { type: 'p' },
          }),
          CommentsPlugin,
          DocxPlugin,
          CsvPlugin,
          MarkdownPlugin,
          JuicePlugin,
        ],
        override: {
          components: withDraggables(withPlaceholders(({
            [BlockquotePlugin.key]: BlockquoteElement,
            [CodeBlockPlugin.key]: CodeBlockElement,
            [CodeLinePlugin.key]: CodeLineElement,
            [CodeSyntaxPlugin.key]: CodeSyntaxLeaf,
            [ExcalidrawPlugin.key]: ExcalidrawElement,
            [HorizontalRulePlugin.key]: HrElement,
            [ImagePlugin.key]: ImageElement,
            [LinkPlugin.key]: LinkElement,
            [TogglePlugin.key]: ToggleElement,
            [ColumnPlugin.key]: ColumnGroupElement,
            [ColumnItemPlugin.key]: ColumnElement,
            [HEADING_KEYS.h1]: withProps(HeadingElement, { variant: 'h1' }),
            [HEADING_KEYS.h2]: withProps(HeadingElement, { variant: 'h2' }),
            [HEADING_KEYS.h3]: withProps(HeadingElement, { variant: 'h3' }),
            [HEADING_KEYS.h4]: withProps(HeadingElement, { variant: 'h4' }),
            [HEADING_KEYS.h5]: withProps(HeadingElement, { variant: 'h5' }),
            [HEADING_KEYS.h6]: withProps(HeadingElement, { variant: 'h6' }),
            [BulletedListPlugin.key]: withProps(ListElement, { variant: 'ul' }),
            [NumberedListPlugin.key]: withProps(ListElement, { variant: 'ol' }),
            [ListItemPlugin.key]: withProps(PlateElement, { as: 'li' }),
            [MediaEmbedPlugin.key]: MediaEmbedElement,
            [MentionPlugin.key]: MentionElement,
            [MentionInputPlugin.key]: MentionInputElement,
            [ParagraphPlugin.key]: ParagraphElement,
            [TablePlugin.key]: TableElement,
            [TableRowPlugin.key]: TableRowElement,
            [TableCellPlugin.key]: TableCellElement,
            [TableCellHeaderPlugin.key]: TableCellHeaderElement,
            [TodoListPlugin.key]: TodoListElement,
            [DatePlugin.key]: DateElement,
            [CodePlugin.key]: CodeLeaf,
            [CommentsPlugin.key]: CommentLeaf,
            [HighlightPlugin.key]: HighlightLeaf,
            [BoldPlugin.key]: withProps(PlateLeaf, { as: 'b' }),
            [ItalicPlugin.key]: withProps(PlateLeaf, { as: 'em' }),
            [KbdPlugin.key]: KbdLeaf,
            [StrikethroughPlugin.key]: withProps(PlateLeaf, { as: 's' }),
            [SubscriptPlugin.key]: withProps(PlateLeaf, { as: 'sub' }),
            [SuperscriptPlugin.key]: withProps(PlateLeaf, { as: 'sup' }),
            [UnderlinePlugin.key]: withProps(PlateLeaf, { as: 'u' }),
          }))),
        },
        value: _content,
      })

      return editor
  };

  function updateContent(input) {
    try {
      setContent(JSON.parse(input))
    } catch (e) {
      log.trace(e)
      log.trace("Exception while parsing Plate/JSON content.")
      setContent([])
    }
  }

  log.trace("input: " + input)

  let editor
  useEffect(() => {
    editor = getEditor()
    if (input) {
      if (typeof input === "string" && input.startsWith("[{")) {
        log.trace("input is not a string: " + input)
        updateContent(input)
      } else {
        log.trace("input is a string: " + input)
        const value = editor.api.markdown.deserialize(input);
        log.trace("Editor: " + JSON.stringify(value))
        setContent(value)
      }
    }
  }, [])
  
  let operations = {
    handleSave: () =>{
      updateContent(localStorage.getItem('editor'))
      MergedContent.saveItPlease(contentId, attrName)
    }
  }
  
  let editorWindowSpacing = {
    padding: "2rem"
  }

  return (
    <>
        { content ?
            <DndProvider backend={HTML5Backend}>
              <Plate
                editor={getEditor(content)} 
                onChange={ value => {
                  const content = JSON.stringify(value.value);
                  localStorage.setItem("editor", content)
                }}
                className='dis_focus:ring-0 dis_focus:ring-offset-0'
              >
                <FixedToolbar>
                  <FixedToolbarButtons operations={operations} />
                </FixedToolbar>
                <Editor
                  style={editorWindowSpacing}
                  className=" {cn} mx-auto mt-2 rounded-none focus-visible:ring-none focus-visible:ring-1 focus-visible:ring-offset-0"
                />
                
              <FloatingToolbar>
                <FloatingToolbarButtons />
              </FloatingToolbar>
              <CommentsPopover />
            </Plate>
          </DndProvider>
        :
          <>{t("Loading...")}</>
      }
    </>
  )
}