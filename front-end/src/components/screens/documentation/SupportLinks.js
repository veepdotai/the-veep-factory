import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Container } from 'react-bootstrap';

import { t } from 'src/components/lib/utils'

export default function SupportLinks() {

    
    const markdown = `
* [Forums (fr)](https://support.veep.ai/forums/forum/support-francais/)
* Documentation
`
    return (
        <Container>
            <Container className="ps-0" as="h2">{t("Support")}</Container>
            <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
        </Container>
    )
}