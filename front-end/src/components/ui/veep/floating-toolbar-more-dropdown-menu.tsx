/**
 * Actions:
 * Improve
 * Fix spelling and grammar
 * Translate
 * Make shorter
 * Make longer
 * Simplify
 * Be more specific
 */
import React from 'react';

import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';

import {
  SubscriptPlugin,
  SuperscriptPlugin,
} from '@udecode/plate-basic-marks/react';
import { collapseSelection } from '@udecode/plate-common';
import { focusEditor, useEditorRef } from '@udecode/plate-common/react';
import { HighlightPlugin } from '@udecode/plate-highlight/react';
import { KbdPlugin } from '@udecode/plate-kbd/react';

import { Icons } from '@/components/icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  useOpenState,
} from '@/registry/default/plate-ui/dropdown-menu';
import { ToolbarButton } from '@/registry/default/plate-ui/toolbar';

export function FloatingMoreDropdownMenu(props: DropdownMenuProps) {
  const editor = useEditorRef();
  const openState = useOpenState();

  const actions = [
    "Improve",
    "Fix spelling and grammar",
    "Translate",
    "Make shorter",
    "Make longer",
    "Simplify",
    "Be more specific",
  ]
  
  return (
    <DropdownMenu modal={false} {...openState} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton pressed={openState.open} tooltip="Insert">
          <Icons.more />
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="ignore-click-outside/toolbar flex max-h-[500px] min-w-[180px] flex-col gap-0.5 overflow-y-auto"
        align="start"
      >
        <DropdownMenuItem
          onSelect={() => {
            editor.tf.toggle.mark({ key: HighlightPlugin.key });
            collapseSelection(editor, { edge: 'end' });
            focusEditor(editor);
          }}
        >
          <Icons.bg className="mr-2 size-5" />
          Make shorter
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={() => {
            //editor.tf.toggle.mark({ key: KbdPlugin.key });
            //collapseSelection(editor, { edge: 'end' });
            //focusEditor(editor);
            let o = localStorage.getItem('editor')
            console.log(o)
            console.log(JSON.parse(o))
          }}
        >
          <Icons.kbd className="mr-2 size-5" />
          Save
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={() => {

            editor.tf.toggle.mark({
              key: SuperscriptPlugin.key,
              clear: [SubscriptPlugin.key, SuperscriptPlugin.key],
            });
            focusEditor(editor);
          }}
        >
          <Icons.superscript className="mr-2 size-5" />
          Superscript
          {/* (⌘+,) */}
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            editor.tf.toggle.mark({
              key: SubscriptPlugin.key,
              clear: [SuperscriptPlugin.key, SubscriptPlugin.key],
            });
            focusEditor(editor);
          }}
        >
          <Icons.subscript className="mr-2 size-5" />
          Subscript
          {/* (⌘+.) */}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
