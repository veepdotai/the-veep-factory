import{ useCallback, useEffect, useMemo, useState } from 'react'

import { Logger } from 'react-logger-lib'
import { t } from 'i18next'
import PubSub from "pubsub-js"
import { Button } from '../ui/shadcn/button'

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Loading from '../common/Loading'
import EditorialCalendar from './EditorialCalendar'

export default function CalendarView({viewType, content}) {
    const log = Logger.of(CalendarView.name)

    const [event, setEvents] = useState(content)
    const [open, setOpen] = useState(false)

    return (
        <>
            <CalendarSheet />
        </>
    )
}

function CalendarSheet() {
    const log = Logger.of(CalendarSheet.name)
    const [open, setOpen] = useState(true)
    const [content, setContent] = useState("Initialization")

    function onCalendarView(topic, message) {
        log.trace("onCalendarView: " + open)
        setOpen(true)
    }

    useEffect(() => {
        PubSub.subscribe("CALENDAR_VIEW", onCalendarView)
        log.trace("useEffect: CalendarSheet")
    }, [])

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent className="sm:max-w-8xl w-75">
                <SheetHeader>
                    <SheetTitle>CalendarView</SheetTitle>
                    <SheetDescription>
                    View Calendar
                    </SheetDescription>
                </SheetHeader>
                <>
                    {/*content*/}
                    <EditorialCalendar />
                </>
                <>
                {
                    <SheetFooter>
                        <SheetClose asChild>
                            <Button type="submit">Save changes</Button>
                        </SheetClose>
                    </SheetFooter>
                }
                </>
                </SheetContent>
        </Sheet>
    )
}