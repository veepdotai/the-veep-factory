import React from 'react';

import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';

import {
//  focusEditor,
  useEditorReadOnly,
  useEditorRef,
  usePlateStore,
} from '@udecode/plate/react';

import { Icons } from '@/components/icons';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  useOpenState,
} from '@/components/ui/plate-ui/dropdown-menu';
import { ToolbarButton } from '@/components/ui/plate-ui/toolbar';

export function ModeDropdownMenu(props: DropdownMenuProps) {
  const editor = useEditorRef();
  const setReadOnly = usePlateStore().set.readOnly();
  const readOnly = useEditorReadOnly();
  const openState = useOpenState();

  let value = 'editing';

  if (readOnly) value = 'viewing';

  const item: any = {
    editing: (
      <>
        <Icons.editing className="mr-2 size-5" />
        {/*<span className="hidden lg:inline">Editing</span>*/}
      </>
    ),
    editingMenu: (
      <>
        <Icons.editing className="mr-2 size-5" />
        <span className="hidden lg:inline">Editing</span>
      </>
    ),
    viewing: (
      <>
        <Icons.viewing className="mr-2 size-5" />
        {/*<span className="hidden lg:inline">Viewing</span>*/}
      </>
    ),
    viewingMenu: (
      <>
        <Icons.viewing className="mr-2 size-5" />
        <span className="hidden lg:inline">Viewing</span>
      </>
    ),
  };

  return (
    <DropdownMenu modal={false} {...openState} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton
          className="min-w-[auto] lg:min-w-[50px]"
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
              //focusEditor(editor);
              editor.tf.focus()

              return;
            }
          }}
        >
          <DropdownMenuRadioItem value="editing">
            {item.editingMenu}
          </DropdownMenuRadioItem>

          <DropdownMenuRadioItem value="viewing">
            {item.viewingMenu}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
