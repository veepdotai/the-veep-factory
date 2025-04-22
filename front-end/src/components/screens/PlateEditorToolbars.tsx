"use client";

import { useEffect, useState } from 'react';
import { Logger } from 'react-logger-lib';
import { t } from 'src/components/lib/utils'


import { FixedToolbar } from '@/components/ui/veep/fixed-toolbar';
import { FixedToolbarButtons } from '@/components/ui/veep/fixed-toolbar-buttons';

import { FloatingToolbar } from '@/components/ui/veep/floating-toolbar';
import { FloatingToolbarButtons } from '@/components/ui/veep/floating-toolbar-buttons';

export function MyFixedToolbar( {view, operations} ) {
  return (
    <FixedToolbar>
      <FixedToolbarButtons view={view} operations={operations} />
    </FixedToolbar>
  )
}

export function MyFloatingToolbar( {view} ) {
  return (
    <FloatingToolbar>
      <FloatingToolbarButtons view={view} />
    </FloatingToolbar>
  )
}