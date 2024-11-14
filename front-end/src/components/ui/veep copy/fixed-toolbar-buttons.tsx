import React from 'react';

import {
  BoldPlugin,
  CodePlugin,
  ItalicPlugin,
  StrikethroughPlugin,
  UnderlinePlugin,
} from '@udecode/plate-basic-marks/react';
import { useEditorReadOnly } from '@udecode/plate-common/react';

import { Icons } from '@/components/icons';
import { Icons as MyIcons } from '@/src/constants/Icons';
import { InsertMenu } from './insert-dropdown-menu';
import { MarkToolbarButton } from '@/components/plate-ui/mark-toolbar-button';
import { ModeDropdownMenu } from '@/components/plate-ui/mode-dropdown-menu';
import { ToolbarGroup } from '@/components/plate-ui/toolbar';
import { TurnIntoDropdownMenu } from '@/components/plate-ui/turn-into-dropdown-menu';

import { Logger } from 'react-logger-lib';
import { Button } from '../shadcn/button';

export function FixedToolbarButtons( {view = "Advanced", operations} ) {
  const log = Logger.of(FixedToolbarButtons.name)
  const readOnly = useEditorReadOnly();

  return (
    <div className="w-full overflow-hidden">
      <div
        className="flex flex-wrap"
        style={{
          transform: 'translateX(calc(-1px))',
        }}
      >
        {!readOnly && (
          <>
            <ToolbarGroup>
              <Button onClick={operations.handleSave}>
                {MyIcons.save}
              </Button>
            </ToolbarGroup>

            <ToolbarGroup noSeparator>
            {/*
              <InsertMenu view={view} />
              <TurnIntoDropdownMenu />
            */}
            </ToolbarGroup>

            {/*
            <ToolbarGroup>
              <MarkToolbarButton nodeType={BoldPlugin.key} tooltip="Bold (⌘+B)">
                <Icons.bold />
              </MarkToolbarButton>
              <MarkToolbarButton
                nodeType={ItalicPlugin.key}
                tooltip="Italic (⌘+I)"
              >
                <Icons.italic />
              </MarkToolbarButton>
              <MarkToolbarButton
                nodeType={UnderlinePlugin.key}
                tooltip="Underline (⌘+U)"
              >
                <Icons.underline />
              </MarkToolbarButton>

              <MarkToolbarButton
                nodeType={StrikethroughPlugin.key}
                tooltip="Strikethrough (⌘+⇧+M)"
              >
                <Icons.strikethrough />
              </MarkToolbarButton>
              <MarkToolbarButton nodeType={CodePlugin.key} tooltip="Code (⌘+E)">
                <Icons.code />
              </MarkToolbarButton>
            </ToolbarGroup>
              */}
          </>
        )}

        <div className="grow" />
        {/*
        <ToolbarGroup noSeparator>
          <ModeDropdownMenu />
        </ToolbarGroup>
        */}
      </div>
    </div>
  );
}
