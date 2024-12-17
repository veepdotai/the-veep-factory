import { useEffect } from 'react'
import { Logger } from 'react-logger-lib'
import { t } from 'i18next';
import { cn } from "@/lib/utils"

import { useMediaQuery } from 'usehooks-ts'
import { useOSDetection } from 'src/hooks/useOSDetection'

import { Button } from 'src/components/ui/shadcn/button';
import {
  NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink,
  NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger, MenubarShortcut} from "src/components/ui/shadcn/menubar"
import { Popover, PopoverContent, PopoverTrigger } from "src/components/ui/shadcn/popover"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "src/components/ui/shadcn/tooltip"

import { Icons } from '@/src/constants/Icons'
import { Separator } from 'src/components/ui/shadcn/separator';

export default function ContentActions( {actions = null, title = null, icon = null, viewType = "menu"} ) {
  const log = Logger.of(ContentActions.name);

  log.trace("actions: " + JSON.stringify(actions))
  log.trace("title: " + JSON.stringify(title))
  log.trace("icon: " + JSON.stringify(icon))

  const isDesktop = useMediaQuery("(min-width: 768px)")

  function getActionMenuItem(title, icon, action, shortcut) {
    let shortcutChar = ("Mac" == useOSDetection() && '⌘') || "CTRL"
    return (
      <MenubarItem>
        {Icons[icon]}{' '} {title} <MenubarShortcut>{shortcutChar} {shortcut}</MenubarShortcut>
      </MenubarItem>
    )
  }

  function getActionsMenu(actions, title, icon = null, shortcut = null) {
    return (
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>{icon && Icons[icon]}{' '}{title ?? ""}</MenubarTrigger>
          <MenubarContent>
            {actions?.map((action) => getActionMenuItem(action.title, action.icon, action.action, action.shortcut))}
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    )
  }

  function getActionNavigationMenuItem(title, icon, action, shortcut) {
    let shortcutChar = ("Mac" == useOSDetection() && '⌘') || "CTRL"
    return (
      <NavigationMenuLink asChild>
        <a className="text-sm flex h-full w-full select-none justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
          href="/"
        >
          {Icons[icon]}{title} <div className="text-xs">{shortcutChar} <strong>{shortcut}</strong></div>
        </a>
      </NavigationMenuLink>
    )
  }

  function getActionsNavigationMenu(actions, title, icon = null, shortcut = null) {
    return (
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>{icon && Icons[icon]}{' '}{title ?? ""}</NavigationMenuTrigger>
            <NavigationMenuContent>
              {actions?.map((action) => getActionNavigationMenuItem(action.title, action.icon, action.action, action.shortcut))}
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    )
  }

  function getActionsToolbar(actions) {
    return (
      <>
        <TooltipProvider delayDuration={0}>
        <div className="flex h-full flex-col ms-auto">
          <div className="flex items-center p-2">
            <div className="flex items-center gap-2">
              {actions.map((action) => {
                if ("separator" == action.type) {
                  return <Separator orientation="vertical" className="mx-1 h-6" />
                }

                if (action.action) {
                  return CAU.getTTWithButton({title: action.title, action: action.action, icon: action.icon, displayTitle: false, displayIcon: true})
                }

                if (action.content) {
                  /*
                  return CAU.getPopoverWithTT({
                    title: action.title, icon: action.icon, content: action.content(), displayTitle: false, displayIcon: true
                  })
                    */
                  return (action.content())
                }

                return null

              })}
            </div>
          </div>
        </div>
        </TooltipProvider>
      </>
    )

  }

  useEffect(() => {
  }, [])

  return (
    <>
      {"toolbar" == viewType && getActionsToolbar(actions)}
      {"menu" == viewType && getActionsMenu(actions, title, icon)}
      {"navigation" == viewType && getActionsNavigationMenu(actions, title, icon)}
    </>
  )
}

interface ContentActionsUtilsProps {
  title: string,
  action?: Function,
  icon?: string,
  content?: Element,
  displayIcon?: boolean,
  displayTitle?: boolean,
  disabled?: boolean,
  className?: any
}
const ContentActionsUtils = {
  getButton: function({title, action, icon, displayTitle = true, displayIcon = true, disabled = false, className}: ContentActionsUtilsProps) {
    if (action) {
      return (
        <Button className={cn("p-1 hover:bg-accent justify-start font-normal text-sm", className)} variant="ghost" disabled={disabled} onClick={action}>
          <div className="flex flex-row gap-2 items-center">
            {displayIcon && icon && Icons[icon]}
            {displayTitle && title ? <span className="mx text-muted-foreground text-xs">{title}</span> : <></>}
          </div>
          <span className="sr-only">{title}</span>
        </Button>
      )
    } else {
      return(
        <Button className={cn("p-1", className)} variant="ghost" disabled={disabled}>
          {displayIcon && icon && Icons[icon]}{displayTitle && title ? <div className="ps-2">{title}</div>: <></>}
          <span className="sr-only">{title}</span>
        </Button>                
      )
    }
  },

  getPopoverWithTT: function({title, icon, content, displayIcon = true, displayTitle = false, className}: ContentActionsUtilsProps) {
    return (
      <Tooltip>
        <Popover>
          <PopoverTrigger asChild>
            <TooltipTrigger asChild>
              {CAU.getButton({title: title, icon: icon, displayIcon: true, displayTitle: false,})}
            </TooltipTrigger>
          </PopoverTrigger>
          <PopoverContent className={cn("flex p-0", className)}>
            {"function" == typeof(content) ? content() : content}
          </PopoverContent>
        </Popover>
        <TooltipContent>{title}</TooltipContent>
      </Tooltip>
    )
  },

  getTTWithButton: function({title, action = undefined, icon, displayIcon = true, displayTitle = false, disabled = false}: ContentActionsUtilsProps) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {CAU.getButton({title: title, action: action, icon: icon, displayIcon: displayIcon, displayTitle: displayTitle, disabled: disabled})}
        </TooltipTrigger>
        <TooltipContent>{title}</TooltipContent>
      </Tooltip>
    )
  },

  getContent: function(title, part1, part2 = null, button = null) {
    return (
        <div className='w-full flex flex-col items-start'>
          <div className="border border-b-1 w-full text-sm font-bold text-start p-3">{t(title)}</div>
          <div className="flex flex-row gap-4">
            <div className="w-1/2 px-2 py-4">
              {part1}
            </div>
            <div className="w-1/2 px-2 basis-1/2 py-4">
              {part2}
            </div>
          </div>
          <div className="w-full p-2 text-right">{button}</div>
        </div>
    )
  },

}

const CAU = ContentActionsUtils

export { ContentActionsUtils }
