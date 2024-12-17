import { useEffect } from 'react';
import { Logger } from 'react-logger-lib';
import format from "date-fns/format"
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { useCookies } from 'react-cookie';
import toast from 'react-hot-toast'
import { t } from 'i18next';

import { fr } from 'date-fns/locale'
import { setDefaultOptions } from 'date-fns';
setDefaultOptions({ locale: fr })

import { ScrollArea, ScrollBar } from "src/components/ui/shadcn/scroll-area"
import { Separator } from "src/components/ui/shadcn/separator"

import ContentCardActions from "./ContentCardActions"

import { getService } from 'src/api/service-fetch';
import { UtilsDom } from '../../lib/utils-dom';

import addDays from "date-fns/addDays"
import addHours from "date-fns/addHours"
import nextMonday from "date-fns/nextMonday"
import { Calendar } from "src/components/ui/shadcn/calendar"

import MyContentDetailsActions from './MyContentDetailsActions';

import {ContentActionsUtils as CAU } from './ContentActions';
import ContentActions from './ContentActions';

export default function Content( {contentId, title, attrName = null, content = "", raw = "", contentStyle = {}, contentClassName = "", ...props} ) {
  const log = Logger.of(Content.name);

  let looknfeel = {
    variant: 'outline-info',
    className: 'ms-2 p-2 btn btn-sm fs-6 float-end'
  }
  
  const [cookies] = useCookies('JWT');

  let actions = [
    {
      title: t("Up"),
      icon: "up",
      action: (params) => up(params),
      shortcut: "U",
      visibility: "toolbar",
      cn: ""
    },
    {
      title: t("Down"),
      icon: "down",
      action: (params) => down(params),
      shortcut: "D",
      visibility: "toolbar",
      cn: ""
    },
    { type: "separator", cn: "" },
    {
      title: t("Schedule"),
      icon: "schedule",
      shortcut: "S",
      visibility: "toolbar:lg:hidden,menu:max-lg:hidden",
      content: (params) => getSchedulePanel(params),
      cn: ""
    },
    {
      title: t("Copy"),
      icon: "copy",
      action: (params) => copy(params),
      shortcut: "C",
      visibility: "toolbar:lg:hidden,menu:max-lg:hidden",
      cn: ""
    },
    {
      title: t("Share"),
      icon: "share",
      content: (params) => getSharePanel(params),
      shortcut: "D",
      visibility: "toolbar:lg:hidden,menu:max-lg:hidden",
      cn: ""
    },
    {
      title: t("Publish"),
      icon: "publish",
      content: (params) => getPublishPanel(params),
      shortcut: "P",
      visibility: "toolbar:lg:hidden,menu:max-lg:hidden",
      cn: ""
    },
    {
      title: t("Generate"),
      icon: "generate",
      content: (params) => getGeneratePanel(params),
      shortcut: "G",
      visibility: "toolbar:lg:hidden,menu:max-lg:hidden",
      cn: ""
    },
  ]

  actions = actions.map((action) => {
    log.trace("action: " + JSON.stringify(action))
    let result = {...action}
    if (action.action) {
      result.action = () => action.action(action)
      log.trace("result.action: " + JSON.stringify(result.action + ""))
    }
    if (action.content) {
      result.content = () => action.content(action)
      log.trace("result.content: " + JSON.stringify(result.content + ""))
    }

    return result
  })
  log.trace("actions (after recomputation): " + JSON.stringify(actions))

  function getSchedulePanel(params) {
    log.trace("getSchedulePanel: params: " + JSON.stringify(params))
    function action() { alert('schedule: NYI') }

    const today = new Date()

    let part1 = <div className="flex flex-col">
      {CAU.getButton({title: t("LaterToday") + " ", action: () => format(addHours(today, 4), "E H:mm")})}
      {CAU.getButton({title: t("Tomorrow") + " ", action: () => format(addDays(today, 1), "E H:mm")})}
      {CAU.getButton({title: t("NextMonday") + " ", action: () => format(nextMonday(today), "E H:mm")})}
      {CAU.getButton({title: t("NextWeek") + " ", action: () => format(addDays(today, 7), "E H:mm")})}
    </div>

    let part2 = <Calendar className="text-sm"/>
    let button = CAU.getButton({title: params.title, action: action, icon: params.icon, className: "border"})
    let content = CAU.getContent(params.title, part1, part2, button)

    return (
      <>{CAU.getPopoverWithTT({title: params.title, icon: params.icon, content: content, className: "w-[580px]"})}</>
    )
  }

  function getSharePanel(params) {
    function action() { alert('share: NYI') }

    let part1 = <>This is part one</>
    let part2 = <>This is part two</>
    let button = CAU.getButton({title: params.title, action: action, icon: params.icon, className: "border"})
    let content = CAU.getContent(params.title, part1, part2, button)

    return (
      <>{CAU.getPopoverWithTT({title: params.title, icon: params.icon, content: content})}</>
    )
  }

  function getPublishPanel(params) {
    function action() { alert('publish: NYI') }

    let part1 = <>This is part one</>
    let part2 = <>This is part two</>
    let button = CAU.getButton({title: params.title, action: action, icon: params.icon, className: "border"})
    let content = CAU.getContent(params.title, part1, part2, button)

    return (
      <>{CAU.getPopoverWithTT({title: params.title, icon: params.icon, content: content})}</>
    )
  }

  function getGeneratePanel(params) {
    function action() { alert('generate: NYI') }

    let part1 = <>This is part one</>
    let part2 = <>This is part two</>
    let button = CAU.getButton({title: params.title, action: action, icon: params.icon, className: "border"})
    let content = CAU.getContent(params.title, part1, part2, button)

    return (
      <>{CAU.getPopoverWithTT({title: params.title, icon: params.icon, content: content})}</>
    )
  }

  function handleClick(className) {
    UtilsDom.selectElementContents(document.getElementsByClassName(className)[0]);
    toast.success(t("Copy+C"));
  }

  function up(params) { alert(`${params.title}: NYI`) }
  function down(params) { alert(`${params.title}: NYI`) }
  function copy(params) { alert(`${params.title}: NYI`) }

  function remove() { ContentCardActions.remove() }

  function handleSave(topic, params) {
    log.trace(`handleSave: topic: ${topic} / params: ${JSON.stringify(params)}`);
    ContentCardActions.handleSave({
      content: params.content,
      contentId: params.cid,
      attrName: params.attrName || "post_content",
      custom: params.custom,
      conf: getService(cookies, "contents", params.cid, "PATCH"),
    })

  }

  function getContentActionsMenu(actions, viewType = "menu") {
    return (
      <ContentActions actions={actions} title={t("Actions")} icon="menu" shortcut="M" viewType={viewType} />
    )
  }
  
  function getContentActions(actions) {
    let mail = true

    return (
      <>
        <ContentActions actions={actions} viewType="toolbar" />
        {/*getContentActionsMenu(actions)}
        {getContentActionsMenu(actions, "navigation")*/}
        </>
    ) 
  }

  function getContentBanner(actions, title, author, date, email) {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4 text-sm">
          <div className="grid gap-1">
            {title &&   <div className="font-semibold ps-2">{title}</div>}
            {author &&  <div className="line-clamp-1 text-xs">{author}</div>}
            {email &&   <div className="line-clamp-1 text-xs">
                          <span className="font-medium">Reply-To:</span> {email}
                        </div>}
          </div>
        </div>
        {date && (
          <div className="ml-auto text-xs text-muted-foreground">
            {format(date, "PPpp")}
          </div>
        )}
        
        <div className="">
          {getContentActions(actions)}
        </div>
      </div>
    )
  }

  useEffect(() => {
    log.trace(`useEffect: Unsubscribing MARKDOWN_CONTENT_${attrName}`)
    PubSub.unsubscribe(`MARKDOWN_CONTENT_${attrName}`);

    log.trace(`useEffect: Subscribing MARKDOWN_CONTENT_${attrName}`)
    PubSub.subscribe(`MARKDOWN_CONTENT_${attrName}`, handleSave);
  }, [])

  let author = ""
  let date = ""
  let email = ""

  return (
      <>
        {contentId ?
          <div className="flex flex-1 flex-col h-full">
              {/*getContentMenu()*/}
              {getContentBanner(actions, title, author, date, email)}
              <Separator />

              { true ?
                <ScrollArea className="w-100 whitespace-nowrap">
                  <ScrollBar orientation="vertical" />
                  <div className="whitespace-pre-wrap text-sm h-full">
                      {content ? content : props.children}
                  </div>
                </ScrollArea>
                :
                <div className="whitespace-pre-wrap text-sm h-full">
                      {content ? content : props.children}
                  </div>
              }

          </div>
        :
          <div className="p-8 text-center text-muted-foreground">
            {t("No element selected")}
          </div>
        }
      </>
  )

}