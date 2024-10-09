import { Logger } from 'react-logger-lib';
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { t } from 'i18next';
import { Container } from 'react-bootstrap';

export default function PromptsStore() {
  const log = Logger.of(PromptsStore.name);

  const markdown = (t("PromptStoreText", { joinArrays: '\n\n'}));

  return (
    <>
      <Container>
        <h2>Test - {t('Menu.PromptsStore')}</h2>
        <Container>
          <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
        </Container>
      </Container>
    </>
  )
}
