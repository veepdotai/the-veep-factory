import { useEffect, useState } from 'react';
import { Logger } from 'react-logger-lib';
import { t } from 'i18next';
import { Container } from 'react-bootstrap';

export default function About() {
  const log = Logger.of(About.name);

  const [version, setVersion] = useState();

  function updateVersion(topic, message) {
    setVersion(message);
  }

  useEffect(() => {
    PubSub.subscribe("VERSION", updateVersion);
  }, []);

  return (
    <Container>
        <Container id="about">
          <ul>
            <li>{t("Version")} : {version}</li>
            <li>{t("AppPublisher")} : Kerma Projects</li>
            <li>{t("Manager")} : <a href="https://www.linkedin.com/in/jean-christophe-kermagoret/" target="_blank">Jean-Christophe Kermagoret</a></li>
            <li>{t("Mail")} : <a href="mailto:contact@veep.ai">contact@veep.ai</a></li>
            <li>Linkedin : <a href="https://www.linkedin.com/comm/mynetwork/discovery-see-all?usecase=PEOPLE_FOLLOWS&followMember=jean-christophe-kermagoret" target="_blank">suivez-moi sur LinkedIn</a></li>
          </ul>
          <ul>
            <li><a href="https://www.veep.ai/legal/politique-de-confidentialite/" target="_blank">Politique de confidentialité</a></li>
            <li><a href="https://www.veep.ai/legal/mentions-legales/" target="_blank">Mentions légales</a></li>
            <li><a href="https://www.veep.ai/legal/conditions-generales-utilisation/" target="_blank">Conditions générales d'utilisation</a></li>
          </ul>
        </Container>
    </Container>
  )
}