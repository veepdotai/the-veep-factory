
import { Logger } from 'react-logger-lib'
import { t } from 'i18next'
import { Container, Tab } from 'react-bootstrap';
import { ScreenHeading } from "src/components/common/Heading";
import MyContent from "src/components/screens/mycontent/MyContent";
import AllCards from '../catalog/AllCards';

import { Button } from "@/components/ui/button"
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
import { Utils } from './utils';

import startMenuDefinition from './utils-menu-start-definition.json'
import dataMenuDefinition from './utils-menu-data-definition.json'
import configurationMenuDefinition from './utils-menu-configuration-definition.json'
import configurationMenuDefinitionForUser from './utils-menu-configuration-definition-user.json'
import configurationMenuDefinitionForAdmin from './utils-menu-configuration-definition-admin.json'
import Spreadsheet from '../spreadsheet/Spreadsheet';
import DynamicForm from '../screens/forms/DynamicForm';

import MyConfiguration from 'src/components/screens/myconfiguration/MyConfiguration'

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
            <SheetTitle>{t("EditProfile")}</SheetTitle>
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

  process: function(menu) {
    return UtilsMenu.processMenu(menu)
  },

  processMenu: function(o) {
    function details(name, displayAgents = true) {
      return  {
        id: `dpt-${name?.toLowerCase()}`,
        name: name,
        label: t(name),
        itemType: "query",
        dontcreate: false,
        query: { view: t(name), status: "DRAFT", meta: { key: "veepdotaiCategory", compare: "LIKE", value: name}},
        displayAgents: displayAgents
      }
    }

      if (Array.isArray(o)) {
          return o.map((item) => UtilsMenu.processMenu(item))
      } else if("object" == typeof(o)) {
          if (o.f) {
              let f = o.f[0]      // function name
              let params = o.f[1] // params
              switch(f) {
                  case 'details': return details(params)
                  case 't': return t(params)
                  default: return `unknown method ${f}`
              }
          } else {
              let res = {}
              let keys = Object.keys(o)
              for (let i = 0; i < keys.length; i++) {
                  let key = keys[i]
                  if (Array.isArray(o[key])) {
                      res[key] = UtilsMenu.processMenu(o[key])
                  } else if ("object" == typeof(o[key])) {
                      res[key] = UtilsMenu.processMenu(o[key], key)
                  } else {
                      res[key] = o[key]
                  }
              }
              return res
          }
      } else {
          // This is a primitive
          return o
      }
  },

  getGenericMenu: function() {
    let menuDefinition = UtilsMenu.process(startMenuDefinition)

    return menuDefinition
  },

  /**
   * This menu is used to build:
   * - the left navigational menu
   * - the main pane that will display corresponding content
   * 
   * returns a json definition 
   */
  getMainContentMenu: function() {
    let menuDefinition = UtilsMenu.process(dataMenuDefinition)
    menuDefinition = []
    return menuDefinition
  },

  getConfigurationMenu: function() {
    const role = "user"
    
    let menuDefinition = []
    if ("user" === role) {
      menuDefinition = configurationMenuDefinitionForUser 
    } else if ("admin" === role) {
      menuDefinition = configurationMenuDefinitionForAdmin
    } else {
      menuDefinition = configurationMenuDefinition 
    }
    return UtilsMenu.process(menuDefinition)
  },

  createPaneFromMenuItem: function(menuDefinition, home = null) {
    let tab = menuDefinition.map((menu) => {
        let panes = menu?.items?.map((row) => {
          if (row?.dontcreate) {
            // The pane has been created in another way. It already exists.
            return (<></>)
          } else {            
            // The pane is going to be created according the provided itemType and information
            let itemType = row?.itemType || "menu"
            let props = {
              name: row.id,
              title: t(row?.query?.view) || t(Utils.camelize(row?.title)) || t(Utils.camelize(row?.label)),
              subtitle: t(Utils.camelize(row?.subtitle)) || t(Utils.camelize(row?.label) + 'Subtitle')
            }

            console.log("createPaneFromMenuItem: itemType: ", itemType)
            console.log("createPaneFromMenuItem: row: ", row)
            switch(itemType) {
              case "menu": break
              case "form":
                return (
                  <Tab.Pane key={row.id} eventKey={row.id}>
                    <ScreenHeading {...props} />
                    <MyConfiguration type={row.id} />
                  </Tab.Pane>
                )
                break
              case "spreadsheet":
                return (
                  <Tab.Pane key={row.id} eventKey={row.id}>
                    <ScreenHeading {...props} />
                    <MyConfiguration type={row.id} />
                    <Spreadsheet />
                  </Tab.Pane>
                )
                break
              case "query":
                return (
                  <Tab.Pane eventKey={row.id}>
                    <ScreenHeading {...props} />
                    <Container className='p-0'>
                      {row?.displayAgents ?
                          <>
                            <AllCards id={row?.id + "-catalog-shared"} type="personal" title={t("VeepVeeplets")} cat={row.name} form={home} />
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
                break

              default:
            }
          }
        })
        return panes
    })

    return tab
  }
}


