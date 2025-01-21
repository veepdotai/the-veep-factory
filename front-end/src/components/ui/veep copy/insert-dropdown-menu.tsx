import React from 'react';

import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';

import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import { insertEmptyElement } from '@udecode/plate';
import {
  ParagraphPlugin,
  focusEditor,
  useEditorRef,
} from '@udecode/plate/react';
import { HEADING_KEYS } from '@udecode/plate-heading';
import { HorizontalRulePlugin } from '@udecode/plate-horizontal-rule/react';
import { LinkPlugin, triggerFloatingLink } from '@udecode/plate-link/react';
import { CodeBlockPlugin, CodeLinePlugin, CodeSyntaxPlugin } from '@udecode/plate-code-block/react';
import { insertEmptyCodeBlock } from '@udecode/plate-code-block';
import { ExcalidrawPlugin } from '@udecode/plate-excalidraw/react';
import { TablePlugin, insertTable } from '@udecode/plate-table/react';
import { ImagePlugin, MediaEmbedPlugin } from '@udecode/plate-media/react';
import { insertMedia } from '@udecode/plate-media';
import { toggleIndentList } from '@udecode/plate-indent-list';
import { toggleList } from '@udecode/plate-list';
import { settingsStore } from '@/components/context/settings-store';

import { IndentPlugin } from '@udecode/plate-indent/react';
import { IndentListPlugin } from '@udecode/plate-indent-list/react';

import { Icons } from '@/components/icons';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  useOpenState,
} from '@/components/plate-ui/dropdown-menu';

import { MarkToolbarButton } from '@/components/plate-ui/mark-toolbar-button';
import { ToolbarButton } from '@/components/plate-ui/toolbar';

const items = [
  {
    label: 'Basic blocks',
    items: [
      {
        description: 'Paragraph',
        icon: Icons.paragraph,
        label: 'Paragraph',
        value: ParagraphPlugin.key,
      },
      {
        description: 'Heading 1',
        icon: Icons.h1,
        label: 'Heading 1',
        value: HEADING_KEYS.h1,
      },
      {
        description: 'Heading 2',
        icon: Icons.h2,
        label: 'Heading 2',
        value: HEADING_KEYS.h2,
      },
      {
        description: 'Heading 3',
        icon: Icons.h3,
        label: 'Heading 3',
        value: HEADING_KEYS.h3,
      },
      {
        description: 'Quote (⌘+⇧+.)',
        icon: Icons.blockquote,
        label: 'Quote',
        value: BlockquotePlugin.key,
      },
      {
        description: 'Table',
        icon: Icons.table,
        label: 'Table',
        value: TablePlugin.key,
      },
      {
        description: 'Bulleted list',
        icon: Icons.ul,
        label: 'Bulleted list',
        value: 'ul',
      },
      {
        description: 'Numbered list',
        icon: Icons.ol,
        label: 'Numbered list',
        value: 'ol',
      },
      {
        description: 'Divider (---)',
        icon: Icons.minus,
        label: 'Divider',
        value: HorizontalRulePlugin.key,
      },
    ],
  },
  /*
  {
    label: 'Media',
    items: [
      {
        value: CodeBlockPlugin.key,
        label: 'Code',
        description: 'Code (```)',
        icon: Icons.codeblock,
      },
      {
        value: ImagePlugin.key,
        label: 'Image',
        description: 'Image',
        icon: Icons.image,
      },
      {
        value: MediaEmbedPlugin.key,
        label: 'Embed',
        description: 'Embed',
//        icon: Icons.embed,
        icon: Icons.settings,
      },
      {
        value: ExcalidrawPlugin.key,
        label: 'Excalidraw',
        description: 'Excalidraw',
        icon: Icons.image,
        //icon: Icons.excalidraw,
      },
    ],
  },
  */
  {
    label: 'Inline',
    items: [
      {
        description: 'Link',
        icon: Icons.link,
        label: 'Link',
        value: LinkPlugin.key,
      },
    ],
  },
];

export function InsertMenu({ view = "Normal"}) {
  if ("Dropdown" == view) {
    return InsertMenuAsDropdown()
  } else {
    return InsertMenuAsNormal()
  }
}

export function InsertMenuAsNormal() {
  const editor = useEditorRef();
  const openState = useOpenState();

  let r = items.map(({ items: nestedItems, label }, index) => (
      <React.Fragment key={label}>
          {nestedItems.map(
          ({ icon: Icon, label: itemLabel, value: type }) => (
            <ToolbarButton key={type} pressed={openState.open} tooltip={itemLabel}
                onSelect={() => {
                  editor.tf.toggle.block({ type });
                  focusEditor(editor)
                }}>
                  <Icon className="mr-2 size-5" />
                  {`${itemLabel}/${type}`}
              </ToolbarButton>
            ))
          }
      </React.Fragment>
  ))

  return r

}

export function InsertMenuAsDropdown() {
  const editor = useEditorRef();
  const openState = useOpenState();

  return (
    <DropdownMenu modal={false} {...openState}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton pressed={openState.open} tooltip="Insert" isDropdown>
          <Icons.add />
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="flex max-h-[500px] min-w-0 flex-col gap-0.5 overflow-y-auto"
        align="start"
      >
        {items.map(({ items: nestedItems, label }, index) => (
          <React.Fragment key={label}>
            {index !== 0 && <DropdownMenuSeparator />}

            <DropdownMenuLabel>{label}</DropdownMenuLabel>
            {nestedItems.map(
              ({ icon: Icon, label: itemLabel, value: type }) => (
                <DropdownMenuItem
                  key={type}
                  className="min-w-[180px]"
                  onSelect={() => {
                    switch (type) {
                      /*
                      case CodeBlockPlugin.key: {
                        insertEmptyCodeBlock(editor);
                        break;
                      }
                      case ImagePlugin.key: {
                        await insertMedia(editor, { type: ImagePlugin.key });                      
                        break;
                      }
                      case MediaEmbedPlugin.key: {
                        await insertMedia(editor, {
                           type: MediaEmbedPlugin.key,
                        });
                        break;
                      }
                      case 'ul':
                      case 'ol': {
                        insertEmptyElement(editor, ParagraphPlugin.key, {
                          select: true,
                          nextBlock: true,
                        });
                      
                        if (settingsStore.get.checkedId(IndentListPlugin.key)) {
                          toggleIndentList(editor, {
                            listStyleType: type === 'ul' ? 'disc' : 'decimal',
                          });
                        } else if (settingsStore.get.checkedId('list')) {
                          toggleList(editor, { type });
                        }                      
                        break;
                      }
                      case TablePlugin.key: {
                        insertTable(editor);
                        break;
                      }
                      case LinkPlugin.key: {
                        triggerFloatingLink(editor, { focused: true });
                        break;
                      }
                      */
                      
                      default: {
                        insertEmptyElement(editor, type, {
                          nextBlock: true,
                          select: true,
                        });
                      }
                    }

                    focusEditor(editor);
                  }}
                >
                  <Icon className="mr-2 size-5" />
                  {itemLabel}
                </DropdownMenuItem>
              )
            )}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
