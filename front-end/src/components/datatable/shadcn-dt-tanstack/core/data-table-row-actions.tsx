"use client"

import { t } from "i18next"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"

import { Button } from "src/components/ui/shadcn/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "src/components/ui/shadcn/dropdown-menu"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>,
  labels: Any,
  schema: Any,
  onShow: Any,
  onEdit: Any,
  onDuplicate: Any,
  onFavorite: Any,
  onDelete: Any,
}

export function DataTableRowActions<TData>({
  row,
  labels,
  schema,
  onShow,
  onEdit,
  onDuplicate,
  onFavorite,
  onDelete,
}: DataTableRowActionsProps<TData>) {
  //const data = schema.parse(row.original)
  let className = "hover:bg-slate-200"

  function notImpl() {
    alert("This function has not been implemented.")
  }

  function show() {
    onShow(row.original)
  }

  function edit() {
    onEdit(row.original)
  }

  function duplicate() {
    onDuplicate(row.original)
  }

  function remove() {
    onDelete(row.original)
  }

  function favorite() {
    onFavorite(row.original)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px] bg-white">
        {onShow && (<DropdownMenuItem className={className} onClick={show}>{t("Show")}</DropdownMenuItem>)}
        {onEdit && (<DropdownMenuItem className={className} onClick={edit}>{t("Rename")}</DropdownMenuItem>)}
        {onDuplicate && (<DropdownMenuItem className={className} onClick={duplicate}>{t("Duplicate")}</DropdownMenuItem>)}
        {onFavorite && (<DropdownMenuItem className={className} onClick={favorite}>{t("Favorite")}</DropdownMenuItem>)}
        <DropdownMenuSeparator className="border-t"/>
        { Array.isArray(labels) && labels.length > 0 &&
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={row.label || ""}>
                {labels.map((label) => (
                  <DropdownMenuRadioItem key={label.value} value={label.value}>
                    {label.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        }
        {onDelete && (<>
            <DropdownMenuSeparator />
            <DropdownMenuItem className={className} onClick={remove}>
              {t("Delete")}
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
