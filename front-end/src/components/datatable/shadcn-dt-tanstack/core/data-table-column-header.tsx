import { ArrowDownIcon, ArrowUpIcon, CaretSortIcon, EyeNoneIcon, } from "@radix-ui/react-icons"
import { Column } from "@tanstack/react-table"

import { t } from "i18next"

import { cn } from "@/lib/utils"
import { Button } from "src/components/ui/shadcn/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "src/components/ui/shadcn/dropdown-menu"

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            <span>{title}</span>
            {column.getIsSorted() === "desc" ?
              (<ArrowDownIcon className="ml-2 h-4 w-4 inline" />)
              :
              column.getIsSorted() === "asc" ?
                (<ArrowUpIcon className="ml-2 h-4 w-4 inline" />)
                : (<CaretSortIcon className="ml-2 h-4 w-4 inline" />)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[150px] bg-white">
          <DropdownMenuItem className="hover:bg-slate-200" onClick={() => column.toggleSorting(false)}>
            <ArrowUpIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70 inline" />
            {t("Asc")}
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-slate-200" onClick={() => column.toggleSorting(true)}>
            <ArrowDownIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70 inline" />
            {t("Desc")}
          </DropdownMenuItem>
          <DropdownMenuSeparator className="border-t"/>
          <DropdownMenuItem className="hover:bg-slate-200" onClick={() => column.toggleVisibility(false)}>
            <EyeNoneIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70 inline" />
            {t("Hide")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
