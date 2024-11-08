
import { Logger } from 'react-logger-lib'
import { t } from 'i18next'
import { Container, Row, Col, Tab } from 'react-bootstrap';
import { ScreenHeading } from "src/components/common/Heading";
import MyContent from "src/components/screens/mycontent/MyContent";

export const UtilsMenu = {
  log: Logger.of("Menu"),

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
      function rest(name) {
        return  {
          label: t(name),
          query: { view: t(name), status: "DRAFT", meta: {value: name, compare: "LIKE", key: "veepdotaiCategory"}}
        }
      }

      let menuDefinition = [
        {
            id: "function-sales",
            title: t("SalesFunction"),
            items: [
              {id: 'dpt-communication', ...rest("Communication")},
              {id: 'dpt-marketing', ...rest("Marketing")},
              {id: 'dpt-sales', ...rest("Sales")},
            ]
        },
        {
            id: "function-production",
            title: t("ProductionConsultingServicesFunction"),
            items: [
                {id: 'dpt-management', ...rest("Management")},
                {id: 'dpt-production', ...rest("Production")},
                {id: 'dpt-consulting', ...rest("Consulting")},
                {id: 'dpt-service', ...rest("Service")},
                {id: 'dpt-quality', ...rest("Quality")},
                {id: 'dpt-randd', ...rest("RandD")},
            ]
        },
        {
            id: "function-support",
            title: t("SupportFunction"),
            items: [
                {id: 'dpt-finance', ...rest("Finance")},
                {id: 'dpt-hr', ...rest("HR")},
                {id: 'dpt-it', ...rest("IT")},
                {id: 'dpt-logistics', ...rest("Logistics")},
                {id: 'dpt-procurement', ...rest("Procurement")},
            ]
        },
    ]

    return menuDefinition
  },

  createPaneFromMenuItem: function(menuDefinition) {
    let tab = menuDefinition.map((menu) => {
        let panes = menu.items.map((row) => {
          if (! row?.dontcreate) { 
            return (
              <Tab.Pane eventKey={row.id}>
                <ScreenHeading name={row.id} title={t(row?.query?.view) || t(row.label)} subtitle={t(`${row.label}Subtitle`)} />
                <Container className='p-0'>
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


