"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "src/components/ui/shadcn/badge"
import { Checkbox } from "src/components/ui/shadcn/checkbox"

import { labels, priorities, statuses } from "../data/enums"
import { schema, Data } from "../data/schema"
import { DataTableColumnHeader } from "../core/data-table-column-header"
import { DataTableRowActions } from "../core/data-table-row-actions"

function getColumnMetadata(meta) {
  if (! meta.name) {
    throw new Error("'name' metadata MUST be provided.");
  }

  const name = meta.name
  const accessorKey = meta.accessorKey || name
  const title = meta.title || name.replace(/(^|\s)\S/g, l => l.toUpperCase())

  const width = meta.width ? meta.width : "150px"
  const fontSize = meta.fontSize ? meta.fontSize : "font-small"
  const className = meta.className ? meta.className : `w-[${width}] truncate ${fontSize}`

  let result = {
    accessorKey: accessorKey,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={title} />
    ),
    cell: ({ row }) => {
      const label = labels.find((label) => label.value === row.original.label)
      return (
        <div className="flex space-x-2">
          {label && <Badge variant="outline" className="px-1 rounded">{label.label}</Badge>}
          <span className={className}>
            {row.getValue(name)}
          </span>
        </div>
      )
    },
  }

  return result
}

function getEnumColumnMetadata(meta) {
  if (! meta.name || ! meta.data) {
    throw new Error("'name' and 'data' metadata MUST be provided => 'name', 'data' or both are not currently provided.");
  }

  const name = meta.name
  const data = meta.data
  const accessorKey = meta.accessorKey || name
  const title = meta.title || name.replace(/(^|\s)\S/g, l => l.toUpperCase())

  const width = meta.width ? meta.width : "100px"
  const fontSize = meta.fontSize ? meta.fontSize : "font-small"
  const className = meta.className ? meta.className : `flex w-[${width}] ${fontSize} items-center`

  let result =   {
    accessorKey: accessorKey,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={title} />
    ),
    cell: ({ row }) => {
      const prop = data.find(
        (item) => item.value === row.getValue(meta.name)
      )

      if (!prop) {
        return null
      }

      return (
        <div className={className}>
          {prop.icon && (
            <prop.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{prop.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  }

  return result

}

export const columns: ColumnDef<Data>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
    cell: ({ row }) => <div className="w-[100px]">{row.getValue("id")}</div>,
    enableSorting: true,
    enableHiding: true,
    //initialState: { columnVisibility: { customer: false } },
  },
  getColumnMetadata({name: "title", width: "200px", fontSize: "font-medium"}),
  getColumnMetadata({name: "date", width: "200px", fontSize: "font-medium"}),
  getEnumColumnMetadata({name: "status", data: statuses}),
  getEnumColumnMetadata({name: "priority", data: priorities}),
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} labels={labels} schema={schema} />,
  },
]
