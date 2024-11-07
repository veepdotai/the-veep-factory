import { Logger } from 'react-logger-lib';
import { Container, Row, Col, Tab } from 'react-bootstrap';
import { t } from 'i18next';

import CardSelector from "src/components/catalog/CardSelector";
import Home from "src/components/Home";
import Logs from "src/components/Logs";
//import Test from "src/components/Test";

import MyContent from "src/components/screens/mycontent/MyContent";
import BrandVoiceForm from "src/components/screens/forms/BrandVoiceForm";
import PDFExportForm from "src/components/screens/forms/PDFExportForm";
import PubTarget from "src/components/screens/PubTarget";
import EditorialLine from "src/components/screens/EditorialLine";
import EditorialCalendar from "src/components/screens/EditorialCalendar";
import PromptsStore from "src/components/screens/PromptsStore";
import Chat from "src/components/screens/Chat";
import Support from "src/components/screens/Support";
import About from "src/components/screens/About";
import UserParameters from "src/components/screens/UserParameters";
import AppParameters from "src/components/screens/AppParameters";
import Credits from "src/components/screens/Credits";
import Dashboard from "src/components/screens/Dashboard";
//import CodeEditor from "src/components/editor/CodeEditor";
import IDE from "src/components/editor/IDE";
import PDFDisplay from "src/components/screens/PDFDisplay";
import AddContentWizard from "src/components/screens/wizards/AddContentWizard";
import Profile from "src/components/screens/Profile";

import { ScreenHeading } from "src/components/common/Heading";

import Schema from "src/components/schemas/Schema";
import Playground from "src/components/ffmpeg/Playground";
import { UtilsMenu } from 'src/components/lib/utils-menu';
import { interval } from 'date-fns';

//export default function App() {
export default function Main({credits, current}) {
  const log = Logger.of(Main.name);

  return (
      <Tab.Content className="p-0">
        <Tab.Pane eventKey="home">
          <ScreenHeading name="home" title={t("DashboardTitle")} subtitle={t("DashboardSubtitle")} />
          <Dashboard />
        </Tab.Pane>
        <Tab.Pane eventKey="add-content-wizard">
          <ScreenHeading name="add-content" title={t("AddContentWizardTitle")} subtitle={t("AddContentWizardSubtitle")} />
          <Container className='p-2'>
            <AddContentWizard />
          </Container>
        </Tab.Pane>
        {/*
        <Tab.Pane eventKey="contents">
          <ScreenHeading name="contents" title={t("MyContentsTitle")} subtitle={t("MyContentsSubtitle")} />
          <Container className='p-0'>
            <MyContent view={t("RecentActivity")} status="DRAFT" afterDate="2024-06-01" beforeDate="2024-12-31" />
          </Container>
        </Tab.Pane>
        */}
        {UtilsMenu.convertMainContentMenu2Sections()}
        <Tab.Pane eventKey="config-pdf">
          <ScreenHeading name="config-pdf" title={t("ConfigPDF")} subtitle={t("ConfigPDFSubtitle")} />
          <Container className='p-0'>
            {<PDFDisplay/>}
          </Container>
        </Tab.Pane>
        <Tab.Pane eventKey="infos">
          <ScreenHeading name="infos" title={t("Infos")} subtitle={t("Infos")} />
          <Container className='p-2'>
            <Logs />
            <Playground />
            {/*<Schema />*/}
          </Container>
        </Tab.Pane>
        <Tab.Pane eventKey="add-content">
          <ScreenHeading name="add-content" title={t("AddContentTitle")} subtitle={t("AddContentSubtitle")} />
          <Container className='p-2'>
            <CardSelector />
            <Home credits={credits} current={current} />
          </Container>
        </Tab.Pane>
        <Tab.Pane eventKey="brand-voice">
          <ScreenHeading name="brand-voice" title={t("BrandVoiceTitle")} subtitle={t("BrandVoiceSubtitle")} />
          <Container className='p-2'>
            <BrandVoiceForm />
          </Container>
        </Tab.Pane>
        <Tab.Pane eventKey="editorial-line">
          <ScreenHeading name="editorial-line" title={t("EditorialLineTitle")} subtitle={t("EditorialLineSubtitle")} />
          <Container className='p-2'>
            <EditorialLine />
          </Container>
        </Tab.Pane>
        <Tab.Pane eventKey="pdf-export">
          <ScreenHeading name="pdf-export" title={t("EditorialLineTitle")} subtitle={t("PDFExportSubtitle")} />
          <Container className='p-2'>
            <PDFExportForm />
          </Container>
        </Tab.Pane>
        <Tab.Pane eventKey="pub-target">
          <ScreenHeading name="pub-target" title={t("PubTargetTitle")} subtitle={t("PubTargetSubtitle")} />
          <Container className='p-2'>
            <PubTarget />
          </Container>
        </Tab.Pane>

        <Tab.Pane eventKey="editorial-calendar">
          <ScreenHeading name="editorial-calendar" title={t("EditorialCalendarTitle")} subtitle={t("EditorialCalendarSubtitle")} />
          <Container className='p-2'>
            <EditorialCalendar />
          </Container>
        </Tab.Pane>
        <Tab.Pane eventKey="chat" className='h-100'>
            {/*<ScreenHeading name="chat" title={t("Chat")} subtitle={t("ChatSubtitle")} />*/}
            {/*<Container className='p-2'>*/}
              <Chat />
            {/*</Container>*/}
        </Tab.Pane>
        <Tab.Pane eventKey="support">
          <ScreenHeading name="support" title={t("SupportTitle")} subtitle={t("SupportSubtitle")} />
          <Container className='p-2'>
            <Support />
          </Container>
        </Tab.Pane>
        <Tab.Pane eventKey="credits">
          <ScreenHeading name="credits" title={t("CreditsTitle")} subtitle={t("CreditsSubtitle")} />
          <Container className='p-2'>
            <Credits />
          </Container>
        </Tab.Pane>
        <Tab.Pane eventKey="editor">
          <ScreenHeading title={t("EditorTitle")} subtitle={t("EditorSubtitle")} />
          <Container className='p-2'>
            <IDE />
          </Container>
        </Tab.Pane>
        <Tab.Pane eventKey="userPreferences">
          <ScreenHeading name="userPreferences" title={t("UserPreferencesTitle")} subtitle={t("UserPreferencesSubtitle")} />
          <Container className='p-2'>
            <UserParameters />
          </Container>
        </Tab.Pane>
        <Tab.Pane eventKey="appPreferences">
          <ScreenHeading name="appPReferences" title={t("AppPreferencesTitle")} subtitle={t("AppPreferencesSubtitle")} />
          <Container className='p-2'>
            <AppParameters />
          </Container>
        </Tab.Pane>
        <Tab.Pane eventKey="about">
          <ScreenHeading name="about" title={t("AboutTitle")} subtitle={t("AboutSubtitle")} />
          <Container className='p-2'>
            <About />
          </Container>
        </Tab.Pane>
        <Tab.Pane eventKey="profile">
          <ScreenHeading name="profile" title={t("ProfileTitle")} subtitle={t("ProfileSubtitle")} />
          <Container className='p-2'>
            <Profile />
          </Container>
        </Tab.Pane>
      </Tab.Content>
  );
}
