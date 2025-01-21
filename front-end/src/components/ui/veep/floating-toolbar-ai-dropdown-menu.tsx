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
import PubSub from 'pubsub-js'

import { collapseSelection } from '@udecode/plate';
import { focusEditor, useEditorRef } from '@udecode/plate/react';

import { Icons } from '@/components/icons';
import { Icons as MyIcons } from '@/constants/Icons';

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

  function showAlert(msg) {
    PubSub.publish("PROMPT_DIALOG", {
      title: t("AITitleDialog"),
      description: t("AITitleDialogDesc"),
      content: <div>
        <p>{t("AIDialogLongDesc")}</p>
        <p>{t("GoToDiscussion")} <a style={{color: "blue", textDecoration: "underline"}} target="_blank" href='https://github.com/veepdotai/the-veep-factory/discussions/24'>discussion</a></p>
      </div>,
      actions: [{
          label: t("OK"),
      }]
    })
  }

  const actions = [
    { title: t("Improve"), icon: "save", action: () => showAlert("Improve")},
    { title: t("FixSpellingGrammar"), icon: "save", action: () => showAlert()},
    { title: t("Translate"), icon: "save", action: () => showAlert()},
    { title: t("MakeShorter"), icon: "save", action: () => showAlert()},
    { title: t("MakeLonger"), icon: "save", action: () => showAlert()},
    { title: t("Simplify"), icon: "save", action: () => showAlert()},
    { title: t("BeMoreSpecific"), icon: "save", action: () => showAlert()},
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
