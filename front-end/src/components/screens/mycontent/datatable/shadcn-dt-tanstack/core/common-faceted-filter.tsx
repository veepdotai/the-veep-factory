import * as React from "react"
import { CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Badge } from "src/components/ui/shadcn/badge"
import { Button } from "src/components/ui/shadcn/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "src/components/ui/shadcn/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "src/components/ui/shadcn/popover"
import { Separator } from "src/components/ui/shadcn/separator"

interface CommonFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
  options: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }[],
  viewMode: string,
  _facets: any,
  _selectedValues: any
}

export function CommonFacetedFilter<TData, TValue>({
  column,
  title,
  options,
  viewMode = "compact1",
  _facets,
  _selectedValues
}: CommonFacetedFilterProps<TData, TValue>) {
  //const facets = column?.getFacetedUniqueValues()
  //const selectedValues = new Set(column?.getFilterValue() as string[])
  const facets = _facets
  const selectedValues = _selectedValues

  function onAddOrDelete(isSelected, option) {
    if (isSelected) {
      selectedValues.delete(option.value)
    } else {
      selectedValues.add(option.value)
    }
    const filterValues = Array.from(selectedValues)
    column?.setFilterValue(
      filterValues?.length ? filterValues : undefined
    )
  }

  function onClear() {
    return column?.setFilterValue(undefined)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed inline-flex">
          {
              ! selectedValues || selectedValues?.size < 1 ?
                <>
                    <PlusCircledIcon className="mr-2 h-4 w-4 inline" />
                    {title}
                </>
              :
                <>
                  { viewMode == "compact2" ?
                    <></>
                  :
                    viewMode == "compact1" ?
                      <PlusCircledIcon className="mr-2 h-4 w-4 inline" />
                    :
                    <>
                        <PlusCircledIcon className="mr-2 h-4 w-4 inline" />
                        {title}
                    </>
                  }
                </>
          }
          {selectedValues?.size > 0 && (
            <>
              { viewMode == "compact2" ?
                <></>
              :
                <Separator orientation="vertical" className="mx-2 h-4 border-l" />
              }
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 bg-white" align="start">
        <Command>
          <CommandInput className="py-1 focus:outline-none" placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    className="data-[disabled]:pointer-events-auto data-[disabled]:opacity-100 hover:bg-slate-200"
                    onSelect={() => onAddOrDelete(isSelected, option)}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <CheckIcon className={cn("h-4 w-4")} />
                    </div>
                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                    {facets?.get(option.value) && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator className="border-t"/>
                <CommandGroup>
                  <CommandItem
                    onSelect={onClear}
                    className="justify-center text-center hover:bg-slate-200"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
