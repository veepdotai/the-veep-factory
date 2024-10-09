import { Logger } from 'react-logger-lib';
import { t } from 'i18next';
import { Container } from 'react-bootstrap';
import PDFConfigDisplay from 'src/components/veepdotai-pdf-config/page'

export default function PDFDisplay() {
    const log = Logger.of(PDFDisplay.name);

    return (
        <Container>
            <PDFConfigDisplay displayConfigPanel={true} />
        </Container>
    )
}