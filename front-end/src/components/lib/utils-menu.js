
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
import configurationMenuDefinition from './utils-menu-configuration-definition.json'

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

  getGenericMenu: function() {
    let menuDefinition = [{
        id: "home",
        title: "home2",
        items: [
            { id: 'home', dontcreate: true, label: t("Dashboard")},
            /*
            {
              id: 'digitalTwin', label: t("MyDigitalTwin"),
              query: {
                view: t("RecentActivities"), status: "DRAFT", interval: {after: "2024-11-01", before: "2024-11-30"}
              }
            },
            */
            //{id: 'assistant', label: t("CreateAssistant")},
            { id: 'add-content', dontcreate: true, label: t("CreateContent")},
            { id: 'contents', dontcreate: false, label: t("MyContents")},
//            {id: 'separator', label: ""},        
        ]
    }]

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
      function details(name, displayAgents = true) {
        return  {
          id: `dpt-${name?.toLowerCase()}`,
          name: name,
          label: t(name),
          query: { view: t(name), status: "DRAFT", meta: { key: "veepdotaiCategory", compare: "LIKE", value: name}},
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

  getConfigurationMenu: function() {
    let menuDefinition = configurationMenuDefinition 
    /*[
        { 
          id: 'context',
          title: t("Context"),
          label: t("ContextLabel"),
          itemType: "screen",
          items: [
            { id: 'brand-voice', itemType: "form", label: t("BrandVoiceLabel")},
            { id: 'editorial-line', itemType: "form", label: t("EdiorialLineLabel")},
            { id: 'pdf-export', itemType: "form", label: t("PdfExportLabel")},
          ]
        },
        { 
          id: "my-expertise",
          title: t("MyExpertise"),
          label: t('MyExpertiseLabel'),
          itemType: "menu",
          items: [
            { id: 'my-experiences', itemType: "form", label: t('MyExperiences') },
          ]
        },
        { 
          id: 'knowledge-bases',
          label: t('KnowledgeBaseLabel'),
          title: t('KnowledgeBaseTitle'),
          itemType: "menu",
          items: [
            { id: "websites", itemType: "form", label: t("WebsiteLabel")},
            { id: "documents", itemType: "form", label: t("DocumentsLabel")},
            { id: "news", itemType: "form", label: t("NewsLabel")},
            { id: "misc", itemType: "form", label: t("MiscLabel")},
          ]
        },
        { 
          id: 'automations',
          title: t('AutomationsTitle'),
          itemType: "",
          items: [
            
          ]
        },
        { 
          id: 'enumerations',
          title: t('EnumerationsTitle'),
          itemType: "menu",
          items: [
            { id: 'configuration', itemType: "form", label: t("ConfigurationLabel")},
            { id: 'classification', itemType: "form", label: t("ClassificationLabel")},
            { id: 'prompt', itemType: "form", label: t("PromptLabel")},
          ]
        },
        { 
          id: 'menus',
          title: t('MenusTitle'),
          itemType: "menu",
          items: [
            { id: 'welcome', itemType: "form", label: t("WelcomeLabel")},
            { id: 'data', itemType: "form", label: t("DataLabel")},
            { id: 'configuration', itemType: "form", label: t("ConfigurationLabel")},
          ]
        },
        { 
          id: 'forms',
          title: t('FormsTitle'),
          itemType: "menu",
          items: [
            { id: 'data', itemType: "form", label: t("WelcomeLabel")},
          ]
        },
        { 
          id: 'templates',
          title: t('TemplatesTitle'),
          itemType: "menu",
          items: [
            { id: 'Documents', itemType: "form", label: t("WelcomeLabel")},
            { id: 'Caroussel', itemType: "form", label: t("DataLabel")},
          ]
        },
        { 
          id: 'data-analysis',
          title: t('AnalysisTitle')},
    ]
*/
    return menuDefinition
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
              title: t(row?.query?.view) || t(Utils.camelize(row?.label)),
              subtitle: t(Utils.camelize(row?.label) + 'Subtitle')
            }

            switch(itemType) {
              case "menu": break
              case "form":
                return (
                  <Tab.Pane key={row.id} eventKey={row.id}>
                    <ScreenHeading {...props} />
                    <Container className='p-0'>
                      Content
                    </Container>
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


