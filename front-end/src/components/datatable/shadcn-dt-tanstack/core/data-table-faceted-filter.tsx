import * as React from "react"
import { CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons"
import { Column } from "@tanstack/react-table"

import { CommonFacetedFilter } from "./common-faceted-filter"

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
  options: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }[],
  viewMode: string
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
  viewMode = "compact1"
}: DataTableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues()
  const selectedValues = new Set(column?.getFilterValue() as string[])

  return (
    <CommonFacetedFilter
      column={column}
      title={title}
      options={options}
      viewMode={viewMode}
      _facets={facets}
      _selectedValues={selectedValues}
    />
  )
}
