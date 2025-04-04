/* eslint-disable prettier/prettier */
import React from 'react';

import { cn } from '@udecode/cn';
import { BasicElementsPlugin } from "@udecode/plate-basic-elements/react";
import { BasicMarksPlugin } from "@udecode/plate-basic-marks/react";
import {
  type Decorate,
  type TText, createSlatePlugin, isText
} from "@udecode/plate";
import { type TRenderLeafProps, Plate , usePlateEditor } from "@udecode/plate/react";
import Prism from 'prismjs';

import { editableProps } from '@/plate/demo/editableProps';
import { PlateUI } from '@/plate/demo/plate-ui';
import { previewMdValue } from '@/plate/demo/values/previewMdValue';
import { Editor } from '@/registry/default/plate-ui/editor';

import 'prismjs/components/prism-markdown.js';

/**
 * Decorate texts with markdown preview.
 */
const decoratePreview: Decorate =
  ({entry: [node, path]}) => {
    const ranges: any[] = [];

    if (!isText(node)) {
      return ranges;
    }

    const getLength = (token: any) => {
      if (typeof token === 'string') {
        return token.length;
      }
      if (typeof token.content === 'string') {
        return token.content.length;
      }

      return token.content.reduce((l: any, t: any) => l + getLength(t), 0);
    };

    const tokens = Prism.tokenize(node.text, Prism.languages.markdown);
    let start = 0;

    for (const token of tokens) {
      const length = getLength(token);
      const end = start + length;

      if (typeof token !== 'string') {
        ranges.push({
          anchor: { offset: start, path },
          focus: { offset: end, path },
          [token.type]: true,
        });
      }

      start = end;
    }

    return ranges;
  };

function PreviewLeaf({
  attributes,
  children,
  leaf,
}: TRenderLeafProps<
  {
    blockquote?: boolean;
    bold?: boolean;
    code?: boolean;
    hr?: boolean;
    italic?: boolean;
    list?: boolean;
    title?: boolean;
  } & TText
>) {
  const { blockquote, bold, code, hr, italic, list, title } = leaf;

  return (
    <span
      {...attributes}
      className={cn(
        bold && 'font-bold',
        italic && 'italic',
        title && 'mx-0 mb-2.5 mt-5 inline-block text-[20px] font-bold',
        list && 'pl-2.5 text-[20px] leading-[10px]',
        hr && 'block border-b-2 border-[#ddd] text-center',
        blockquote &&
          'inline-block border-l-2 border-[#ddd] pl-2.5 italic text-[#aaa]',
        code && 'bg-[#eee] p-[3px] font-mono'
      )}
    >
      {children}
    </span>
  );
}

const _editableProps = {
  ...editableProps,
  renderLeaf: PreviewLeaf,
};

export default function PreviewMdDemo() {
  const editor = usePlateEditor({
    override: { components: PlateUI },
    plugins: [BasicElementsPlugin, BasicMarksPlugin, createSlatePlugin({
      key: 'preview-md',
      decorate: decoratePreview,
    })],
    value: previewMdValue,
  })
  
  return (
    <div className="p-10">
      <Plate editor={editor}>
        <Editor {..._editableProps} />
      </Plate>
    </div>
  );
}
