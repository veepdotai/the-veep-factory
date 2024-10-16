import React from 'react';

import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';

import {
  focusEditor,
  useEditorReadOnly,
  useEditorRef,
  usePlateStore,
} from '@udecode/plate-common/react';

import { Icons } from '@/components/icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  useOpenState,
} from '@/registry/default/plate-ui/dropdown-menu';
import { ToolbarButton } from '@/registry/default/plate-ui/toolbar';

export function PlaygroundModeDropdownMenu(props: DropdownMenuProps) {
  const editor = useEditorRef();
  const setReadOnly = usePlateStore().set.readOnly();
  const readOnly = useEditorReadOnly();
  const openState = useOpenState();

  const item = {
    editing: (
      <>
        <Icons.editing className="mr-2 size-5" />
        <span className="hidden lg:inline">Editing</span>
      </>
    ),
    suggesting: (
      <>
        <Icons.suggesting className="mr-2 size-5" />
        <span className="hidden lg:inline">Suggesting</span>
      </>
    ),
    viewing: (
      <>
        <Icons.viewing className="mr-2 size-5" />
        <span className="hidden lg:inline">Viewing</span>
      </>
    ),
  };

  let value: keyof typeof item = 'editing';

  if (readOnly) value = 'viewing';

  return (
    <DropdownMenu modal={false} {...openState} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton
          className="min-w-[auto] lg:min-w-[130px]"
          pressed={openState.open}
          tooltip="Editing mode"
          isDropdown
        >
          {item[value]}
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="min-w-[180px]" align="start">
        <DropdownMenuRadioGroup
          className="flex flex-col gap-0.5"
          value={value}
          onValueChange={(newValue) => {
            if (newValue !== 'viewing') {
              setReadOnly(false);
            }
            if (newValue === 'viewing') {
              setReadOnly(true);

              return;
            }
            if (newValue === 'editing') {
              focusEditor(editor);

              return;
            }
          }}
        >
          <DropdownMenuRadioItem value="editing">
            {item.editing}
          </DropdownMenuRadioItem>

          <DropdownMenuRadioItem disabled value="suggesting">
            {item.suggesting}
            <span className="ml-2 rounded-md bg-muted px-1.5 py-0.5 text-xs leading-none text-muted-foreground no-underline group-hover:no-underline">
              Soon
            </span>
          </DropdownMenuRadioItem>

          <DropdownMenuRadioItem value="viewing">
            {item.viewing}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
