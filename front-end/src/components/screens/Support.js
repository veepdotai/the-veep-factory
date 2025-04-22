import { Logger } from 'react-logger-lib';
import { Container, Col, Row } from 'react-bootstrap';

import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { t } from 'src/components/lib/utils'

export default function Support() {
  const log = Logger.of(Support.name);

  const markdown = `
Les ressources suivantes sont disponibles :

* [Documentation](https://app.veep.ai/support/)
* [Blog](https://www.veep.ai/blog/)
* [Forums(FR)](https://support.veep.ai/forums/forum/support-francais/)
* [Forums(EN)](https://support.veep.ai/forums/forum/support-english/)

  `
  return (
    <>
      <Container>
        <Row>
          <Col md={12} lg={6}>
            <Container>
                <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
            </Container>
          </Col>
        </Row>
      </Container>
    </>
  )
}