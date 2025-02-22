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
import MyContentPanelWithSheet2panels from './MyContentPanelWithSheet2panels'

import { t } from "i18next";
import LogoWithUrl from "@/components/LogoWithLink";
import { Icons } from "@/constants/Icons";

export default function MyContentPanelWithSheet( {side, id = null, info = null, content = null}) {

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (info && info.id) {
      setOpen(true);
    }
  }, [info])

  return (
    <>
        { /* Datatable */
          side()
        }
        {info ? 
            <>
              {/*className="w-full" style={{width: "1024px"}}*/}
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent className="sm:max-w-8xl w-full">
                  <SheetHeader>
                    <SheetTitle className="flex items-center">
                      <LogoWithUrl height="3em"/>
                      <div style={{color: "grey"}} className="flex items-center text-sm px-3">
                        <a onClick={(e) => setOpen(false)} href="#">{Icons.home}</a>
                      </div>
                      {t("ContentDetails")}
                    </SheetTitle>
                    <SheetDescription>
                    </SheetDescription>
                  </SheetHeader>
                    <MyContentPanelWithSheet2panels id={id} info={info} content={content}/>
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
