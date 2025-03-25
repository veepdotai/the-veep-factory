"use client"

import { Logger } from 'react-logger-lib'
import { t } from "i18next"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "src/components/ui/shadcn/badge"
import { Checkbox } from "src/components/ui/shadcn/checkbox"
import { DataTableColumnHeader } from "@/components/datatable/shadcn-dt-tanstack/core/data-table-column-header"
import { DataTableRowActions } from "@/components/datatable/shadcn-dt-tanstack/core/data-table-row-actions"

import { labels, priorities, statuses } from "./enums"
import { schema, Data } from "./schema"

export default function getColumns(operations): ColumnDef<Data>[] {
  const log = Logger.of("getColumns")

  function getSelect() {
    return {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
            className="align-top translate-y-[2px]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="align-top translate-y-[2px]"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      }
  }
  
  function getActions(operations) {
  
    return {
      id: "actions",
      cell: ({ row }) => <DataTableRowActions
        row={row}
        labels={labels}
        schema={schema}
        onShow={operations.onShow}
        onEdit={operations.onEdit}
        onDuplicate={operations.onDuplicate}
        onFavorite={operations.onFavorite}
        onDelete={operations.onDelete}
      />,
    }
  }
  
  function getId() {
    return {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Id" />
      ),
      cell: ({ row }) => <div className="w-[50px]">{row.getValue("id")}</div>,
      enableSorting: true,
      enableHiding: true,
      //initialState: { columnVisibility: { customer: false } },
    }
  }

  /**
   * 
   * @param meta
   *              meta.name: the name of the metadata
   *              meta.title: the title (label) of the metadata. name if not provided.
   *              meta.accessorKey: the accessorKey of the metadata, name if not provided
   * @returns 
   */
  function getColumnMetadata(meta) {
    if (! meta.name) {
      throw new Error("'name' metadata MUST be provided.");
    }
    
    const name = meta.name
    const accessorKey = meta.accessorKey || name
    const title = t(meta.title || name.replace(/(^|\s)\S/g, l => l.toUpperCase()))
  
    const width = meta.width ? meta.width : "150px"
    const fontSize = meta.fontSize ? meta.fontSize : "text-sm leading-3"
    const className = meta.className ? meta.className : `w-[${width}] truncate ${fontSize}`
  
    //const onClickAAV =  meta.onClick && ({onClick: meta.onClick(row)}) || ""
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
            <span style={meta.onClick && {"cursor": "pointer"}} className={className} {...meta.onClick && ({onClick: () => meta.onClick(row.original)})}>
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
    } else if (Array.isArray(meta?.data) && meta?.data.length == 0) {
      return null
    }
  
    const name = meta.name
    const data = meta.data
    const accessorKey = meta.accessorKey || name
    const title = meta.title || name.replace(/(^|\s)\S/g, l => l.toUpperCase())
  
    const width = meta.width ? meta.width : "100px"
    const fontSize = meta.fontSize ? meta.fontSize : "font-small"
    const className = meta.className ? meta.className : `flex w-[${width}] ${fontSize} items-center`
  
    let result =   {
      ...meta,
      fieldType: "enum",
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

  return [
      getSelect(),
      //getEnumColumnMetadata({name: "title", title: t("MenuType"), data: [{"label":"home", "value": "Home"},{"label":"data", "value": "Data"},{"label":"config", "value": "Configuration"}]}),
      getColumnMetadata({name: "title", title: t("Title")}),
      getColumnMetadata({name: "menuType", title: t("MenuType")}),
      getActions(operations),
      getColumnMetadata({name: "name", title: t("Name"), width: "150px", onClick: operations.onShow}),
      //getColumnMetadata({name: "givenName", title: t("Author"), width: "150px", onClick: operations.onShow}),
      getId(),
  ].filter((item) => item != null)
}
