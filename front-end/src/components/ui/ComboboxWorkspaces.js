"use client"

import { useState } from "react"

import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "src/components/ui/shadcn/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "src/components/ui/shadcn/command"
import { Popover, PopoverContent, PopoverTrigger } from "src/components/ui/shadcn/popover"

export default function ComboboxWorkspaces() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("personal")

  const items = [
    {
      value: "personal",
      label: "Personal",
    },
    {
      value: "general",
      label: "General",
    },
  ]
  
  const itemSingular = "workspace"
    
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? items.find((item) => item.value === value)?.label
            : `Select ${itemSingular}...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Search ${itemSingular}...`} />
          <CommandList>
            <CommandEmpty>No {itemSingular} found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
