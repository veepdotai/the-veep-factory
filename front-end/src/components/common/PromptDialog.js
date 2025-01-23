import { useEffect, useState } from 'react';
import { Logger } from 'react-logger-lib'

import { Button } from 'src/components/ui/shadcn/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "src/components/ui/shadcn/dialog"

export default function PromptDialog() {
  const log = Logger.of(PromptDialog.name)
  
  const [open, setOpen] = useState(false);
  const [infos, setInfos] = useState();

  function process(action) {
    if (action) {
      action()
    }
    closeDialog()
  }

  function closeDialog(topic, infos) {
    setInfos({});
    setOpen(false);
  }

  function openDialog(topic, infos) {
    log.trace(`openDialog: infos:`);
    log.trace(`openDialog: infos: ${JSON.stringify(infos)}`);
    setInfos(infos);
    setOpen(true);
  }

  useEffect(() => {
    log.trace("Subscribing to PROMPT_DIALOG");
    PubSub.subscribe("PROMPT_DIALOG", openDialog);

//    log.trace("Subscribing to CLOSE_PROMPT_DIALOG");
//    PubSub.subscribe("CLOSE_PROMPT_DIALOG", closeDialog);
  }, [])

  return (
    <>
      { infos ?
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{infos?.title}</DialogTitle>
              <DialogDescription>{infos?.description}</DialogDescription>
            </DialogHeader>
            {infos?.content}
            <div className='flex justify-end'>
              {infos?.actions?.map((action, i) => {
                return (
                  <Button key={action.label} className="me-2 w-[100px]" onClick={() => process(action?.click)}>
                    {action.label}
                  </Button>
                )
              })}
            </div>
          </DialogContent>
        </Dialog>
        :
        <></>
      }
    </>
  )

}