"use client"

import { t } from "src/components/lib/utils"
 
import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "src/components/ui/shadcn/button"
import { Input } from "src/components/ui/shadcn/input"

import { DataTableViewOptions } from "./data-table-view-options"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"

interface DataTableToolbarProps<TData> {
  table: Table<TData>,
  metadata: {}[],
  viewMode: string,
  cns: any
}

export function DataTableToolbar<TData>({
  table,
  metadata,
  viewMode = "compact1",
  cns
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters?.length > 0
  
  function getColumns() {
    let result = metadata.map((meta) => table.getColumn(meta.name) && (
                                <DataTableFacetedFilter
                                  column={table.getColumn(meta.name)}
                                  title={meta.title}
                                  options={meta.data}
                                  viewMode={viewMode}
                                />
                              ))

    return result

  }

  return (
    <>
    <div className={`flex items-center justify-between ${cns.cnForTableToolbar}`}>
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={t("FilterContents")}
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className={`h-8 ${ viewMode == "compact2" ? "w-[150px]" : "w-[200px]"}`}
        />
        { viewMode != "compact2" && getColumns()}
        {isFiltered && (
          viewMode == "compact1" || viewMode == "compact2" ?
              <Cross2Icon style={{cursor: "pointer"}} onClick={() => table.resetColumnFilters()}
              color="red" className="ml-2 h-4 w-4 inline" />
            :
              <Button
                variant="ghost"
                onClick={() => table.resetColumnFilters()}
                className="h-8 px-2 lg:px-3"
              >
                <>Reset</>
                <Cross2Icon color="red" className="ml-2 h-4 w-4 inline" />
              </Button>
          )}
      </div>
      <DataTableViewOptions table={table} viewMode={viewMode} />
    </div>
    { viewMode == "compact2" && (
        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center space-x-2">
            {getColumns()}
          </div>
        </div>
    )}
    </>
  )
}
