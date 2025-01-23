import { Logger } from 'react-logger-lib';
import { Container } from 'react-bootstrap';
import PDFPanel from 'src/components/veepdotai-pdf-config/PDFPanel'

export default function PDFDisplay() {
    const log = Logger.of(PDFDisplay.name);

    return (
        <Container>
            <PDFPanel displayInfosPanel={true} />
        </Container>
    )
}