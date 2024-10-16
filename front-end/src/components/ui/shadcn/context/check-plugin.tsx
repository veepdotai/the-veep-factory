// render children only if editor.plugins[id] exists

import type { WithRequiredKey } from '@udecode/plate-core';

import { useEditorRef } from '@udecode/plate-common/react';

import { useDemoId } from '@/registry/default/example/playground-demo';

import { settingsStore } from './settings-store';

export const CheckPlugin = ({
  // id,
  children,
  componentId,
  plugin,
}: {
  children: React.ReactNode;
  id?: string[] | string;
  componentId?: string;
  plugin?: WithRequiredKey;
}) => {
  const editor = useEditorRef();
  const demoId = useDemoId();
  const enabledComponent = settingsStore.use.checkedComponentId(componentId);

  let isEnabled = true;

  // enable if component is enabled
  if (!demoId && componentId && !enabledComponent) {
    isEnabled = false;
  }
  // enable if id is in demoId
  // if (demoId && id && !castArray(id).includes(demoId)) {
  //   isEnabled = false;
  // }
  // enable if plugin is enabled
  if (plugin && !editor?.plugins[plugin.key]) {
    isEnabled = false;
  }
  if (!isEnabled) {
    return null;
  }

  return children;
};
