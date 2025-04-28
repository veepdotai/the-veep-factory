import React, { useCallback, useMemo, useState } from 'react'
import { Logger } from 'react-logger-lib'
import { t } from "src/components/lib/utils"
import PubSub from "pubsub-js"

import { Calendar, Navigate, Views, dayjsLocalizer } from 'react-big-calendar'
import dayjs from 'dayjs'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
//import events from  './EditorialCalendar/events'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'

import { UtilsContent } from '../lib/util-content'

import './EditorialCalendar/styles.css'
import Loading from '../common/Loading'
import { CommonFacetedFilter } from '../datatable/shadcn-dt-tanstack/core/common-faceted-filter'
import SocialNetworkPreview from './SocialNetworkPreview'
import { UtilsGraphQL } from '@/api/utils-graphql'
import { useCookies } from 'react-cookie'
import { Constants } from '@/constants/Constants'
import { UtilsGraphQLObject } from '@/api/utils-graphql-object'

export interface CalendarProps {
    id: string,
    title: string,
    start: Date,
    end?: Date,
    isDraggable: boolean,
    type?: string,
    resource?: number,
    allDay?: boolean,
    content: string,
    avatarUrl?: string,
    author?: string,
    baseline?: string,
    desc?: string,
    mediaUrl?: string,

}

export default function EditorialCalendar({events}) {
    const log = Logger.of(EditorialCalendar.name)
    const DnDCalendar = withDragAndDrop(Calendar)

    const [cookies] = useCookies(['JWT']);
    const graphqlURI = Constants.WORDPRESS_GRAPHQL_ENDPOINT
    const localizer = dayjsLocalizer(dayjs)
    const defaultDate = new Date()
    const defaultConf = {
        defaultClassName: "text-sm",
        defaultCulture: "fr",
        defaultView: Views.MONTH,
        defaultDate: new Date(),
        defaultStyle: { height: 600 }
    }
    const defaultView = Views.MONTH
    const data = []

    function getContentPreview(content) {
        let _content = {
            //avatarUrl: "https://media.licdn.com/dms/image/v2/C5603AQH1QwJjj0fKQQ/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1519680310523?e=1742428800&v=beta&t=KbF4DkT-0Pxaw5S19Sf3P65UwtucEmfAKicMJ2nY_DQ",
            //author: "Jean-Christophe Kermagoret",
            //mediaUrl: "https://media.licdn.com/dms/image/v2/D4E22AQF0-kDhW1maNg/feedshare-shrink_800/B4EZRfcRyfGgAo-/0/1736768036733?e=1739404800&v=beta&t=gV4PSUoHaLpNG6_zr8Txat2zKXjqmfkAkRUKDZNKi_4",
            //mediaUrl: "https://researchtorevenue.wordpress.com/wp-content/uploads/2015/04/1r41ai10801601_fong.pdf",
            ...content,
        }
        return (
            <SocialNetworkPreview content={_content} />
        )
    }

    const [myEvents, setMyEvents] = useState(events)
    const [conf, setConf] = useState(defaultConf)

    const selectEvent = useCallback((event) => {
        log.trace("title", event)

        PubSub.publish("PROMPT_DIALOG", {
            title: t("SocialNetworkPreviewDialog", {socialNetworkName: "LinkedIn"}),
            description: t("SocialNetworkPreviewDesc", {socialNetworkName: "LinkedIn"}),
            content: getContentPreview(event),
            actions: [{
                label: t("Close"),
            }]
        })
    
    }, [])
    
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
  
        log.trace("EditorialCalendar: moveEvent: event.id: ", event.id, "start: ", start, "ISOString: ", start.toISOString(), "end: ", end)
        //UtilsGraphQL.update(graphqlURI, cookies, {id: event.id}, "tvfPubDate", start.toISOString())
        UtilsGraphQLObject
            .saveMetadata(graphqlURI, cookies, event.id, null, null, null, "tvfPubDate", start.toISOString())
/*
            .then((result) => {
                setMyEvents((prev) => {
                    const existing = prev.find((ev) => ev.id === event.id) ?? {}
                    const filtered = prev.filter((ev) => ev.id !== event.id)
                    return [...filtered, { ...existing, start, end, allDay: event.allDay }]
                })
        
                return result}
            )
            .catch((e) => alert('coucou'))
*/
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
        let title = (e.type ? e.type + " - " : "") + e.title
        let max = 100
        if (Views.AGENDA == conf.defaultView) {
            return e.desc?.substring(0,100) ?? title
        } else {
            return title
        }
    }

    return (
        <>
            {/*className="h-screen"*/}
            {/*resources={[{id: 1, title: "Room A"}, {id: 2, title: "Room B"}, {id: 4095, title: "Room C"}]*/}
            {/*getSearchBar()*/}
            { myEvents ?
                <DnDCalendar
                    className={conf.defaultClassName}
                    culture={conf.defaultCulture}
                    defaultDate={conf.defaultDate}
                    defaultView={conf.defaultView}
                    style={conf.defaultStyle}
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
                    onView={(newView) => setConf({...conf, defaultView: newView})}
                    onNavigate={(newDate) => setConf({...conf, defaultDate: newDate})}
                    resizable
                    step={30}
                    timeslots={4}
                    selectable
                    showMultiDayTimes
                    popup
                    navigate={[Navigate.PREVIOUS, Navigate.NEXT, Navigate.TODAY, Navigate.DATE]}
                    views={[Views.MONTH, Views.WEEK, Views.WORK_WEEK, Views.DAY, Views.AGENDA]}
                    components={components}
                    eventPropGetter={eventPropGetter}
                    tooltipAccessor={(e) => e.desc}
                    titleAccessor={(e) => getTitle(e)}
                    drilldownView="day"
                    />
                :
                    <Loading />
            }
        </>
    )
}
