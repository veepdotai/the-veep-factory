import { useEffect } from 'react';
import { Logger } from 'react-logger-lib';
import { Button, Container, Stack } from 'react-bootstrap';
//import { Button, Card, Container, Stack } from 'react-bootstrap';
import format from "date-fns/format"
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { useCookies } from 'react-cookie';
import md5 from 'js-md5';
import toast from 'react-hot-toast'
import { t } from 'i18next';
import axios from 'axios';

//import { ScrollArea } from '@radix-ui/react-scroll-area';
import addDays from "date-fns/addDays"
import addHours from "date-fns/addHours"
import nextMonday from "date-fns/nextMonday"
import { fr } from 'date-fns/locale'
import { setDefaultOptions } from 'date-fns';
setDefaultOptions({ locale: fr })

import { ScrollArea, ScrollBar } from "src/components/ui/shadcn/scroll-area"
import { Separator } from "src/components/ui/shadcn/separator"
import { Popover, PopoverContent, PopoverTrigger } from "src/components/ui/shadcn/popover"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "src/components/ui/shadcn/tooltip"
import { Switch } from "src/components/ui/shadcn/switch"
import { Calendar } from "src/components/ui/shadcn/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/shadcn/card"

import { getService } from 'src/api/service-fetch';
import { UtilsDom } from '../../lib/utils-dom';
import MyContentDetailsActions from './MyContentDetailsActions';
import { Icons } from "src/constants/Icons";

export default function Content( {contentId, title, attrName = null, content = "", raw = "", contentStyle = {}, contentClassName = "", ...props} ) {
  const log = Logger.of(Content.name);

  let looknfeel = {
    variant: 'outline-info',
    className: 'ms-2 p-2 btn btn-sm fs-6 float-end'
  }
  
  const [cookies] = useCookies('JWT');

  function handleClick(className) {
    UtilsDom.selectElementContents(document.getElementsByClassName(className)[0]);
    toast.success(t("Copy+C"));
  }

  function remove() {
    alert('NYI');
  }

  function copy() {
    alert('NYI');
  }

  function publish() {
    alert('NYI');
  }

//function handleSave(contentId, attrName, className) {
  function handleSave(topic, params) {

//    let contentId = params.contentId;
//    let attrName = params.attrName;
    let content = params.content;
    let cid = params.cid;
    log.trace(`cid: ${cid}`);

    log.trace(`attrName: ${attrName}`);
    log.trace(`content: ${content}`);

    let conf = getService(cookies, "contents", contentId, "PATCH");
    log.trace( "conf: " + JSON.stringify(conf));

    //let content = document.getElementsByClassName(className)[0];

    let fd = new FormData();
    fd.append("contentId", contentId);
    fd.append("attrName", attrName);
    fd.append("content", content);
    // Required ?
    fd.append("veepdotaiContent", content);

    //alert(`1: ${contentId} / ${attrName} : ${markdown}`);
    axios.post(
      conf.service,
      fd,
      {},
      conf.options)
    .then((res) => res.data)
    .then((data) => {
      if (data) {
        toast.success(t("Saved") + `: ${contentId}`);
        return true;
      } else {
        toast.error(t("NotSaved") + ` ${contentId}`);
        return false;
      }
    })
  }

  // {...bodyAttrs && ''} 
  function contentCard() {
    return (
      <>
      {/*<Card className={styles.card}>*/}
      <Card className="border-0 shadow-none">
        <CardHeader className="m-0 p-0">
            <CardTitle className="fs-6 m-0 w-100">
              <Stack direction="horizontal">
                  <Container>ZZ : {title}</Container>
                  <MyContentDetailsActions
                      showPromptEditor={() => null}
                      showInfo={() => null}
                      copy={copy}
                      remove={remove}
                      publish={publish}
                      />
                </Stack>
            </CardTitle>
        </CardHeader>
        <CardContent
          style={{...contentStyle, /*height: 350 + 'px',*/ "fontSize": "0.875rem" }}
          className={'mb-2 overflow-scroll text-overflow-ellipsis ' + contentClassName}>
            <CopyToClipboard
                text={props.contentAsText2CRLF != "" ? props.contentAsText2CRLF : ""}
                onCopy={() => {
                    log.trace("CopyToClipBoard: Clicked.");
                    content != "" ? toast.success(t("CopiedToClipboard"))
                                  : handleClick("details-" + md5(title));
  
                    //PubSub.publish("CURRENT_ACTION", { headerTitle: null, body: t("ContentCopied")});
                }}
                options={{asHtml: true}}
                >
                <Button {...looknfeel}>
                    {Icons.clipboard} {/* size="12" */}
                </Button>
            </CopyToClipboard>
            {/*}
            <Button onClick={(e) => handleSave( contentId, attrName, "details-" + md5(title))} variant='outline-info' className='p-2 btn btn-sm fs-6 float-end'>
                  {Icons.save}
            </Button>
            <ScrollArea className="h-50 h-72 w-48 rounded-md border">
            */}
  
            <ScrollArea className="vh-100">
            <Container id={"details-" + md5(title)} style={{...props?.innerContentStyle}}>
              {content ? content : props.children}
            </Container>
            </ScrollArea>
        </CardContent>
      </Card>
  
      </>
  
    )
  }

  function getContentActionsMenu() {

    let mail = true
    const today = new Date()

    function getTTWithButton(actionName, onAction, title, disabled = false) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button className="p-1" variant="ghost" size="icon" disabled={disabled} onClick={onAction}>
              {/*<Archive className="h-4 w-4" />*/}
              {Icons[actionName]}
              <span className="sr-only">{title}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{title}</TooltipContent>
        </Tooltip>
      )
    }

    function getPopoverWithTT(title, icon, part1, part2) {
      return (
        <Tooltip>
          <Popover>
            <PopoverTrigger asChild>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" disabled={false}>
                  {Icons[icon]}
                  <span className="sr-only">{title}</span>
                </Button>
              </TooltipTrigger>
            </PopoverTrigger>
            <PopoverContent className="flex w-[585px] p-0">
              <div className="flex flex-col gap-2 border-r px-2 py-4">
                <div className="text-sm font-medium">{t(title)}</div>
                {/*<div className="grid min-w-[225px] gap-1">*/}
                <div className="min-w-[250px]">
                  {part1}
                </div>
              </div>
              <div className="p-2">
                {part2}
              </div>
            </PopoverContent>
          </Popover>
          <TooltipContent>{title}</TooltipContent>
        </Tooltip>
      )
    }

    function getScheduleButton() {
      let part1 = <>
        {getShortCut(t("LaterToday") + " ", () => format(addHours(today, 4), "E H:mm"))}
        {getShortCut(t("Tomorrow") + " ", () => format(addDays(today, 1), "E H:mm"))}
        {getShortCut(t("NextMonday") + " ", () => format(nextMonday(today), "E H:mm"))}
        {getShortCut(t("NextWeek") + " ", () => format(addDays(today, 7), "E H:mm"))}
      </>

      let part2 = <Calendar className="text-sm"/>

      return (
        <>{getPopoverWithTT("Schedule", "schedule", part1, part2)}</>
      )
    }

    function getShareButton() {
      let part1 = <>This is Share part one</>
      let part2 = <>This is Share part two</>

      return (
        <>{getPopoverWithTT("Share", "share", part1, part2)}</>
      )
    }

    function getGenerateButton() {
      let part1 = <>This is Generate part one</>
      let part2 = <>This is Generate part two</>

      return (
        <>{getPopoverWithTT("Generate", "generate", part1, part2)}</>
      )
    }

    function getShortCut(title, onAction) {
      return (
        <Button variant="ghost" className="hover:bg-accent justify-start font-normal text-sm">
          {title}
          <span className="mx text-muted-foreground text-xs">
            {onAction()}
          </span>
        </Button>
      )
    }

    /*
    return (
      <>
        <TooltipProvider delayDuration={0}>
        <div className="flex h-full flex-col ms-auto">
          <div className="flex items-center p-2">
            <div className="flex items-center gap-2">
              {getScheduleButton()}
              <Separator orientation="vertical" className="mx-1 h-6" />
              {getTTWithButton("up", () => alert("NYI"), t("Up"))}
              {getTTWithButton("down", () => alert("NYI"), t("Down"))}
              <Separator orientation="vertical" className="mx-1 h-6" />
              {getShareButton("share", () => alert("NYI"), t("Publish"))}
              {getGenerateButton("generate", () => alert("NYI"), t("Generate"))}
            </div>
          </div>
        </div>
        </TooltipProvider>
      </>
    )
    */
    return (
      <>
      </>
    )

  }

  function getContentActionsMenu2() {
    return (
      <Stack direction="horizontal" className="w-100">
        <MyContentDetailsActions
            showPromptEditor={() => null}
            showInfo={() => null}
            copy={copy}
            remove={remove}
            publish={publish}
            />
      </Stack>
    )
  }
  
  function getContentBanner(author, date, email) {
    return (
      <div className="flex items-start p-4">
        <div className="flex items-start gap-4 text-sm">
          <div className="grid gap-1">
            {title &&   <div className="font-semibold">{title}</div>}
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
          {getContentActionsMenu()}
        </div>
      </div>
    )
  }

  useEffect(() => {
    PubSub.unsubscribe(`MARKDOWN_CONTENT_${attrName}`);
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
              {getContentBanner(author, date, email)}
              <Separator />

              { true ?
                <ScrollArea className="w-100 whitespace-nowrap">
                  <ScrollBar orientation="vertical" />
                  <div className="whitespace-pre-wrap p-4 text-sm h-full">
                      {content ? content : props.children}
                  </div>
                </ScrollArea>
                :
                <div className="whitespace-pre-wrap p-4 text-sm h-full">
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