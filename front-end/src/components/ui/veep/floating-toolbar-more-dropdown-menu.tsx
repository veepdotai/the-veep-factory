import React from 'react';
import {
  SubscriptPlugin,
  SuperscriptPlugin,
} from '@udecode/plate-basic-marks/react';
import {
//  focusEditor,
  useEditorRef
} from '@udecode/plate/react';

import { Icons } from '@/components/icons';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  useOpenState,
} from '@/registry/default/plate-ui/dropdown-menu';
import { ToolbarButton } from '@/registry/default/plate-ui/toolbar';

import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';

export function FloatingToolbarMoreDropdownMenu(props: DropdownMenuProps) {
  const editor = useEditorRef();
  const openState = useOpenState();

  return (
    <DropdownMenu modal={false} {...openState} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton pressed={openState.open} tooltip="Insert">
          <Icons.more />
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="flex max-h-[500px] min-w-[180px] flex-col gap-0.5 overflow-y-auto"
      >
        <DropdownMenuItem
          onSelect={() => {
            editor.tf.toggle.mark({
              clear: [SubscriptPlugin.key, SuperscriptPlugin.key],
              key: SuperscriptPlugin.key,
            });
            //focusEditor(editor);
            editor.tf.focus()
          }}
        >
          <Icons.superscript className="mr-2 size-5" />
          Superscript
          {/* (⌘+,) */}
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            editor.tf.toggle.mark({
              clear: [SuperscriptPlugin.key, SubscriptPlugin.key],
              key: SubscriptPlugin.key,
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
