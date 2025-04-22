import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { Container } from 'react-bootstrap';

import { t } from 'src/components/lib/utils'

export default function Welcome() {

    
    const markdown = `
Grâce à la voix, alimentez facilement votre communication et vos applications métiers.
`
    return (
        <Container>
            <Container className="ps-0" as="h2">{t("Welcome")}</Container>
            <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
        </Container>
    )
}