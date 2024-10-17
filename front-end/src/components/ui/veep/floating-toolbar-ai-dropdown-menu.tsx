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
import { t } from 'i18next';

import { collapseSelection } from '@udecode/plate-common';
import { focusEditor, useEditorRef } from '@udecode/plate-common/react';

import { Icons } from '@/components/icons';
import { Icons as MyIcons } from '@/src/constants/Icons';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  useOpenState,
} from '@/registry/default/plate-ui/dropdown-menu';
import { ToolbarButton } from '@/registry/default/plate-ui/toolbar';
import MyContentDetailsActions from '../../screens/mycontent/MyContentDetailsActions';
import MyContentActions from '../../screens/mycontent/MyContentActions';

export function FloatingToolbarAIDropdownMenu(props: DropdownMenuProps) {
  const editor = useEditorRef();
  const openState = useOpenState();

  const actions = [
    { title: t("Improve"), icon: "save", action: () => alert('coucou')},
    { title: t("Fix spelling and grammar"), icon: "save", action: () => alert('coucou')},
    { title: t("Translate"), icon: "save", action: () => alert('coucou')},
    { title: t("Make shorter"), icon: "save", action: () => alert('coucou')},
    { title: t("Make longer"), icon: "save", action: () => alert('coucou')},
    { title: t("Simplify"), icon: "save", action: () => alert('coucou')},
    { title: t("Be more specific"), icon: "save", action: () => alert('coucou')},
  ]
  
  return (
    <DropdownMenu modal={false} {...openState} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton pressed={openState.open} tooltip="Insert">
          {MyIcons.chat}
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="ignore-click-outside/toolbar flex max-h-[500px] min-w-[180px] flex-col gap-0.5 overflow-y-auto"
        align="start"
      >
        { actions.map((row) => 
            <DropdownMenuItem onSelect={row.action}>
              {/*<Icons.bg className="mr-2 size-5" />*/}
              {Icons[row.icon]}
              {row.title}
            </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
