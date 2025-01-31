import { Logger } from 'react-logger-lib';
import { Container, Row, Col, Tab } from 'react-bootstrap';
import { t } from 'i18next';
import dynamic from 'next/dynamic'

import CardSelector from "src/components/catalog/CardSelector";
import Home from "src/components/Home";
import Logs from "src/components/Logs";
///import Test from "src/components/Test";

//import MyContent from "src/components/screens/mycontent/MyContent";
import Dashboard from "src/components/screens/Dashboard";
//import BrandVoiceForm from "src/components/screens/forms/BrandVoiceForm";
import EditorialLine from "src/components/screens/EditorialLine";
import VContentForm from "src/components/screens/forms/VContentForm";
import PDFExportForm from "src/components/screens/forms/PDFExportForm";
import PubTarget from "src/components/screens/PubTarget";
import EditorialCalendar from "src/components/screens/EditorialCalendar";
import About from "src/components/screens/About";
import UserParameters from "src/components/screens/UserParameters";
import AppParameters from "src/components/screens/AppParameters";
import Credits from "src/components/screens/Credits";
//import CodeEditor from "src/components/editor/CodeEditor";
//import IDE from "src/components/editor/IDE";
import PDFDisplay from "src/components/screens/PDFDisplay";
import AddContentWizard from "src/components/screens/wizards/AddContentWizard";
import Profile from "src/components/screens/Profile";

/*
import PromptsStore from "src/components/screens/PromptsStore";
import Chat from "src/components/screens/Chat";
import Support from "src/components/screens/Support";
*/
import Playground from "src/components/ffmpeg/Playground";
import { ScreenHeading } from "src/components/common/Heading";

//import Schema from "src/components/schemas/Schema";
import { UtilsMenu } from 'src/components/lib/utils-menu';
//import { interval } from 'date-fns';
import { useMediaQuery } from 'usehooks-ts';

const BrandVoiceForm = dynamic(() => import("../components/screens/forms/BrandVoiceForm", { ssr: false }))

let home = null

/**
 * Create a screen for each main part
 * @param {*} credits Credits the user has
 * @param {*} current The current screen 
 * @returns 
 */
export default function Main({credits, current}) {
  const log = Logger.of(Main.name);

  const isDesktop = useMediaQuery("(min-width: 768px)")

  let home = <Home credits={credits} current={current} />

  let panes = [
    {id: "home", title: t("DashboardTitle"), subtitle: t("DashboardSubtitle"), content: <Dashboard />},
    {id: "add-content-wizard", title: t("AddContentWizardTitle"), subtitle: t("AddContentWizardSubtitle"), content: <AddContentWizard />},
    {id: "add-content", title: t("AddContentTitle"), subtitle: t("AddContentSubtitle"), content:
      <>
        <CardSelector />
        {home}
      </>
    },
    {id: "pdf-config", title: t("PdfConfigTitle"), subtitle: t("PdfConfigSubtitle"), content: <PDFDisplay />},
    {id: "brand-voice", title: t("BrandVoiceTitle"), subtitle: t("BrandVoiceSubtitle"), content: <BrandVoiceForm />},
    {id: "config-post", title: t("ConfigPostTitle"), subtitle: t("ConfigPostSubtitle"), content: <VContentForm />},
    {id: "editorial-line", title: t("EditorialLineTitle"), subtitle: t("EditorialLineSubtitle"), content: <EditorialLine />},
    {id: "pdf-export", title: t("PdfExportTitle"), subtitle: t("PdfExportSubtitle"), content: <PDFExportForm />},

    {id: "credits", title: t("CreditsTitle"), subtitle: t("CreditsSubtitle"), content: <Credits />},
    {id: "user-preferences", title: t("UserPreferencesTitle"), subtitle: t("UserPreferencesSubtitle"), content: <UserParameters />},
    {id: "app-preferences", title: t("AppPreferencesTitle"), subtitle: t("AppPreferencesSubtitle"), content: <AppParameters />},
    {id: "about", title: t("AboutTitle"), subtitle: t("AboutSubtitle"), content: <About />},
    {id: "profile", title: t("ProfileTitle"), subtitle: t("ProfileSubtitle"), content: <Profile />},
    {id: "pub-target", title: t("PubTargetTitle"), subtitle: t("PubTargetSubtitle"), content: <PubTarget />},
    {id: "editorial-calendar", title: t("EditorialCalendarTitle"), subtitle: t("EditorialCalendarSubtitle"), content: <EditorialCalendar />},
    {id: "infos", title: t("infosTitle"), subtitle: t("InfosSubtitle"), content: 
      <>
        <Logs />
        { isDesktop ? <Playground /> : <></>}
      </>
    },
/*
    {id: "editor", title: t("EditorTitle"), subtitle: t("EditorSubtitle"), content: <IDE />},
    {id: "support", title: t("SupportTitle"), subtitle: t("SupportSubtitle"), content: <Support />},
    {id: "chat", title: t("ChatTitle"), subtitle: t("ChatSubtitle"), content: <Chat />},
*/
]
  return (
    <>
      {/* Create and initialize main parts */}
      <Tab.Content className="p-0">
        {UtilsMenu.createPaneFromMenuItem(UtilsMenu.getGenericMenu(), home)}
        {UtilsMenu.createPaneFromMenuItem(UtilsMenu.getMainContentMenu(), home)}
        {panes.map((pane, i) =>
            <Tab.Pane key={pane.id} eventKey={pane.id}>
              <ScreenHeading name={pane.id} key={pane.id} title={pane.title} subtitle={pane.subtitle} />
              {typeof pane.content == "function" ? pane.content() : pane.content}
            </Tab.Pane>
        )}

      </Tab.Content>
    </>
  );
}
