
import { Logger } from 'react-logger-lib'
import { t } from 'i18next'
import { Container, Row, Col, Tab } from 'react-bootstrap';
import { ScreenHeading } from "src/components/common/Heading";
import MyContent from "src/components/screens/mycontent/MyContent";
import AllCards from '../catalog/AllCards';
import Home from "src/components/Home";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

export const UtilsMenu = {
  log: Logger.of("Menu"),

  getSheetForm: function(home, open, setOpen) {
  //<Sheet open={open} onOpenChange={setOpen}>
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        {/*
        <SheetTrigger asChild>
          <Button variant="outline">Open</Button>
        </SheetTrigger>
        */}
        <SheetContent className="sm:max-w-8xl w-75">
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>
              Make changes to your profile here. Click save when you're done.
            </SheetDescription>
          </SheetHeader>
          <>
            {home}
          </>
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit">Save changes</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )
  },

  getGenericMenu: function() {
    let menuDefinition = [{
        id: "common",
        title: "",
        items: [
            {
              id: 'digitalTwin', label: t("MyDigitalTwin"),
              query: {
                view: t("RecentActivities"), status: "DRAFT", interval: {after: "2024-11-01", before: "2024-11-30"}
              }
            },
            //{id: 'assistant', label: t("CreateAssistant")},
            {id: 'add-content', dontcreate: true, label: t("CreateContent")},
            {
              id: 'contents', label: t("MyContents"),
              query: {
                view: t("AllContents"), status: "DRAFT"
              }
            },
            {id: 'separator', label: ""},        
        ]
    }]

    return menuDefinition
  },

  getMainContentMenu: function() {
      function details(name, displayAgents = true) {
        return  {
          id: `dpt-${name?.toLowerCase()}`,
          name: name,
          label: t(name),
          query: { view: t(name), status: "DRAFT", meta: {value: name, compare: "LIKE", key: "veepdotaiCategory"}},
          displayAgents: displayAgents
        }
      }

      let menuDefinition = [
        {
            id: "function-sales",
            title: t("SalesFunction"),
            items: [
              details("Communication"),
              details("Marketing"),
              details("Sales"),
            ]
        },
        {
            id: "function-production",
            title: t("ProductionConsultingServicesFunction"),
            items: [
                details("Management"),
                details("Production"),
                details("Consulting"),
                details("Service"),
                details("Quality"),
                details("RandD"),
            ]
        },
        {
            id: "function-support",
            title: t("SupportFunction"),
            items: [
                details("Finance"),
                details("HR"),
                details("IT"),
                details("Logistics"),
                details("Procurement"),
            ]
        },
    ]

    return menuDefinition
  },

  createPaneFromMenuItem: function(menuDefinition, home = null) {
    let tab = menuDefinition.map((menu) => {
        let panes = menu.items.map((row) => {
          if (! row?.dontcreate) { 
            return (
              <Tab.Pane eventKey={row.id}>
                <ScreenHeading name={row.id} title={t(row?.query?.view) || t(row.label)} subtitle={t(`${row.label}Subtitle`)} />
                <Container className='p-0'>
                  {row.displayAgents ?
                      <>
                        <AllCards id="catalog-shared" type="personal" title={t("VeepVeeplets")} cat={row.name} form={home} />
                        {/* <Home credits={credits} current={current} /> */}
                      </>
                    :
                      <></>

                  }
                  <MyContent 
                    view={row?.query?.view}
                    status={row?.query?.status}
                    meta={row?.query?.meta}
                    date={row?.query?.date}
                    interval={row?.query?.interval}
                    category={row?.query?.category}
                  />
                </Container>
              </Tab.Pane>
            )
          } else {
            return (<></>)
          }
        })
        return panes

    })

    return tab
  }
}


