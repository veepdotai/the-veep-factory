import { useEffect, useState } from "react"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "src/components/ui/shadcn/sheet"

import { t } from "i18next";

export default function MyContentPanelWithSheet( {side, id = null, info = null, content = null}) {

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (info && info.id) {
      setOpen(true);
    }
  }, [info])

  return (
    <>
        {side()}
        {info ? 
            <>
              <Sheet style={{width: "750px"}} open={open} onOpenChange={setOpen}>
                <SheetContent className="sm:max-w-8xl">
                  <SheetHeader>
                    <SheetTitle>{t("ContentDetails")}</SheetTitle>
                    <SheetDescription>
                    </SheetDescription>
                  </SheetHeader>
                  {content(info.id)}
                  <SheetFooter>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </>
          :
            <></>
        }

    </>
  )
}
