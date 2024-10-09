import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Button, Card, Container, Stack } from 'react-bootstrap';
import { Logger } from 'react-logger-lib';
import md5 from 'js-md5';
import toast from 'react-hot-toast'
import { t } from 'i18next';
import axios from 'axios';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ScrollArea } from '@radix-ui/react-scroll-area';

import { getService } from 'src/api/service-fetch';
import { Icons } from "src/constants/Icons";
import { UtilsDom } from '../../lib/utils-dom';
import MyContentDetailsActions from './MyContentDetailsActions';

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

    log.trace(`contentId: ${contentId}`);
    log.trace(`attrName: ${attrName}`);
    log.trace(`content: ${content}`);

    let conf = getService(cookies, "contents", contentId, "PATCH");
    log.trace( "conf: " + JSON.stringify(conf));

    //let content = document.getElementsByClassName(className)[0];

    let fd = new FormData();
    fd.append("contentId", contentId);
    fd.append("attrName", attrName);
    fd.append("content", content);

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

  useEffect(() => {
    PubSub.unsubscribe(`MARKDOWN_CONTENT_${attrName}`);
    PubSub.subscribe(`MARKDOWN_CONTENT_${attrName}`, handleSave);
  }, [])

  // {...bodyAttrs && ''} 
  return (
    <>
    
    {/*<Card className={styles.card}>*/}
    <Card className="">
      <Card.Header className="m-0 p-0">
          <Card.Title className="fs-6 m-0">
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
          </Card.Title>
      </Card.Header>
      <Card.Body
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
            {content ?
                content
                :
                props.children
              }
          </Container>
          </ScrollArea>
      </Card.Body>
    </Card>

    </>

  )
}