import React from 'react';

import {
  BoldPlugin,
  CodePlugin,
  ItalicPlugin,
  StrikethroughPlugin,
  UnderlinePlugin,
} from '@udecode/plate-basic-marks/react';
import { useEditorReadOnly } from '@udecode/plate/react';

import { Icons } from '@/components/icons';
import { MarkToolbarButton } from '@/components/plate-ui/mark-toolbar-button';
import { TurnIntoDropdownMenu } from '@/components/plate-ui/turn-into-dropdown-menu';

import { FloatingToolbarAIDropdownMenu } from './floating-toolbar-ai-dropdown-menu';
import { FloatingToolbarMoreDropdownMenu } from './floating-toolbar-more-dropdown-menu';

export function FloatingToolbarButtons() {
  const readOnly = useEditorReadOnly();

  return (
    <>
      {!readOnly && (
        <>
          <TurnIntoDropdownMenu />

          <MarkToolbarButton nodeType={BoldPlugin.key} tooltip="Bold (⌘+B)">
            <Icons.bold />
          </MarkToolbarButton>
          <MarkToolbarButton nodeType={ItalicPlugin.key} tooltip="Italic (⌘+I)">
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

          <FloatingToolbarAIDropdownMenu />
          <FloatingToolbarMoreDropdownMenu />

        </>
      )}
    </>
  );
}
