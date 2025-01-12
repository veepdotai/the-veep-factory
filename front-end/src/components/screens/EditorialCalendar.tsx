import React, { useCallback, useMemo, useState } from 'react'
import { t } from "i18next"
import { Calendar, Navigate, Views, dayjsLocalizer } from 'react-big-calendar'
import dayjs from 'dayjs'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
//import events from  './EditorialCalendar/events'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'

import './EditorialCalendar/styles.css'
import Loading from '../common/Loading'

import { CommonFacetedFilter } from './mycontent/datatable/shadcn-dt-tanstack/core/common-faceted-filter'

export interface CalendarProps {
    id: string,
    title: string,
    start: Date,
    end?: Date,
    isDraggable: boolean,
    type?: string,
    resource?: number,
    allDay?: boolean,
    desc?: string
}

export default function EditorialCalendar({events}) {
    
    const DnDCalendar = withDragAndDrop(Calendar)

    const localizer = dayjsLocalizer(dayjs)
    const defaultDate = new Date()
    const data = []

    const [myEvents, setMyEvents] = useState(events)

    const selectEvent = useCallback(
        (event) => window.alert(event.title),
        []
    )
    
    const selectSlot = useCallback(
        ({ start, end }) => {
          const title = window.prompt('New Event Name')
          if (title) {
            setMyEvents((prev) => [...prev, { start, end, title }])
          }
        },
        [setMyEvents]
    )

    const newEvent = useCallback(
        (event) => {
          setMyEvents((prev) => {
            const idList = prev.map((item) => item.id)
            const newId = Math.max(...idList) + 1
            return [...prev, { ...event, id: newId }]
          })
        },
        [setMyEvents]
    )

    const moveEvent = useCallback(
      ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }) => {
        const { allDay } = event
        if (!allDay && droppedOnAllDaySlot) {
          event.allDay = true
        }
        if (allDay && !droppedOnAllDaySlot) {
            event.allDay = false;
        }
  
        setMyEvents((prev) => {
            const existing = prev.find((ev) => ev.id === event.id) ?? {}
            const filtered = prev.filter((ev) => ev.id !== event.id)
            return [...filtered, { ...existing, start, end, allDay: event.allDay }]
        })
      },
      [setMyEvents]
    )
  
    const resizeEvent = useCallback(
      ({ event, start, end }) => {
        setMyEvents((prev) => {
          const existing = prev.find((ev) => ev.id === event.id) ?? {}
          const filtered = prev.filter((ev) => ev.id !== event.id)
          return [...filtered, { ...existing, start, end }]
        })
      },
      [setMyEvents]
    )

    const ColoredDateCellWrapper = ({ children }) =>
        React.cloneElement(React.Children.only(children), {
          style: {
            backgroundColor: 'light',
          },
    })

    const eventPropGetter = ((event, start, end, isSelected) => {
        if (event.type) {
            return {"className" : event.type}
        } else {
            return {}
        }
    })

    const { components, max, views } = useMemo(
        () => ({
          components: {
            timeSlotWrapper: ColoredDateCellWrapper,
          },
          defaultDate: new Date(2015, 3, 1),
          max: dayjs().endOf('day').subtract(4, 'hours').toDate(),
          views: Object.keys(Views).map((k) => Views[k]),
        }),
        []
    )

    function filter(eventType) {
        let filteredEvents = events.filter((e) => {
            return e.type && e.type === eventType;
        })

        setMyEvents(filteredEvents);
    }

    function getSearchBar() {
        return (
            <>
                <div className="">
                    {getTOFUCriteria()}
                    {getStatusCriteria()}
                </div>
            </>
        )
    }

    function getStatusCriteria() {
        return (
            <CommonFacetedFilter
                title="Status"
                options={[
                    {label: "Done", value: "Done"},
                    {label: "Todo", value: "Todo"},
                    {label: "InProgress", value: "InProgress"}
                ]}
                viewMode="compact2"
                _facets={new Map([["Done", 3],["Todo", 2], ["InProgress", 4]])}
                _selectedValues={new Set([])}
            />
        )
    }

    function getTOFUCriteria() {
        return (
            <CommonFacetedFilter
                title="*OFU"
                options={[
                    {label: t("TOFU"), value: "TOFU"},
                    {label: t("MOFU"), value: "MOFU"},
                    {label: t("BOFU"), value: "BOFU"}
                ]}
                viewMode="compact2"
                _facets={new Map([["TOFU", 4],["MOFU", 2], ["BOFU", 5]])}
                _selectedValues={new Set([])}
            />
        )
    }

    function getTitle(e) {
        alert("e: " + JSON.stringify(e))
        let title = (e.type ? e.type + " - " : "") + e.title
        return title
    }

    return (
        <>
            {/*className="h-screen"*/}
            {/*resources={[{id: 1, title: "Room A"}, {id: 2, title: "Room B"}, {id: 4095, title: "Room C"}]*/}
            {getSearchBar()}
            { myEvents ?
                <DnDCalendar
                    className="text-sm"
                    culture="fr"
                    messages={{
                        today: t("Today"),
                        previous: '<',
                        next: '>',
                        day: t('Day'),
                        week: t('Week'),
                        work_week: t('WorkWeek'),
                        month: t('Month'),
                        agenda: t('Agenda'), // Ordre du jour
                        showMore: (total) => t("ShowMore", {showMore: total}),
                    }}
                    defaultDate={defaultDate}
                    defaultView={Views.WEEK}
                    localizer={localizer}
                    events={myEvents}
                    draggableAccessor={(e) => true}
                    resizableAccessor={(e) => true}
                    startAccessor="start"
                    endAccessor="end"
                    onSelectEvent={selectEvent}
                    onSelectSlot={selectSlot}
                    onEventDrop={moveEvent}
                    onEventResize={resizeEvent}
                    resizable
                    step={30}
                    timeslots={4}
                    selectable
                    showMultiDayTimes
                    popup
                    style={{ height: 600 }}
                    navigate={[Navigate.PREVIOUS, Navigate.NEXT, Navigate.TODAY, Navigate.DATE]}
                    views={[Views.MONTH, Views.WEEK, Views.WORK_WEEK, Views.DAY, Views.AGENDA]}
                    components={components}
                    eventPropGetter={eventPropGetter}
                    tooltipAccessor={(e) => e.title}
                    titleAccessor={(e) => getTitle(e)}
                    drilldownView="day"
                    />
                :
                    <Loading />
            }
        </>
    )
}

