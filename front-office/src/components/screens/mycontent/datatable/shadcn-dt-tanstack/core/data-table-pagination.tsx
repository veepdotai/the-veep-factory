import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "src/components/ui/shadcn/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/shadcn/select"

interface DataTablePaginationProps<TData> {
  table: Table<TData>,
  viewMode: string
}

export function DataTablePagination<TData>({
  table,
  viewMode = "compact1"
}: DataTablePaginationProps<TData>) {

  function getSelectedItems() {
    return (
      <>
      { viewMode == "compact2" ?
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length}/{table.getFilteredRowModel().rows.length}
        </div>
      :
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
      }
      </>
    )
  }

  function getRowsPerPage() {
    const buttonClassName = viewMode != "compact2" ? "h-8 w-[70px]" : "p-1 h-6 w-[50px]"
    return (
      <div className="flex items-center space-x-2">
        { viewMode != "compact1" && viewMode != "compact2" &&
          (<p className="text-sm font-medium">Rows per page</p>)
        }
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value))
          }}
        >
          <SelectTrigger className={buttonClassName}>
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent className="bg-white w-[100px]" side="top">
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem className="hover:bg-slate-200" key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  function getPageXOfY() {

    const iconClassName = viewMode != "compact2" ? "h-4 w-4" : "h-3 w-3"
    const buttonClassName = viewMode != "compact2" ? "h-8 w-8 p-0" : "h-6 w-6 p-0"

    return (
      <>
        {viewMode != "compact2" && (
          <div className="flex w-[100px] items-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
        )}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className={`hidden ${buttonClassName} lg:flex`}
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className={iconClassName} />
          </Button>
          <Button
            variant="outline"
            className={`${buttonClassName}`}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className={iconClassName} />
          </Button>
          {viewMode == "compact2" && (
            <div className="text-sm font-medium">
              {table.getState().pagination.pageIndex + 1}/{table.getPageCount()}
            </div>
          )}
          <Button
            variant="outline"
            className={`${buttonClassName}`}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className={iconClassName} />
          </Button>
          <Button
            variant="outline"
            className={`hidden ${buttonClassName} lg:flex`}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className={iconClassName} />
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
    {
      viewMode == "compact1" ?
        <>
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center space-x-6 lg:space-x-8">
            {getSelectedItems()}
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            {getRowsPerPage()}
          </div>
        </div>
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center space-x-6 lg:space-x-8">
            {getPageXOfY()}
          </div>
        </div>
        </>
      :
        <>
          {
            viewMode == "compact2" ?
            <div className="flex items-center justify-between px-2">
              {getSelectedItems()}
              <div className="flex items-center space-x-2">
                {getRowsPerPage()}
                {getPageXOfY()}
              </div>
            </div>
          : 
            <div className="flex items-center justify-between px-2">
              {getSelectedItems()}
              <div className="flex items-center space-x-6 lg:space-x-8">
                {getRowsPerPage()}
                {getPageXOfY()}
              </div>
            </div>
          }
        </>
    }
  </>
  )
}
