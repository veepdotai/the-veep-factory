import { Logger } from 'react-logger-lib';
import { Container } from 'react-bootstrap';
import { useTranslation } from 'src/components/lib/utils'

export default function Header() {
    const log = Logger.of(Header.name);

    return (
        <header id="header" className="ml-0 mb-3">
            <div style={{height: "5em", borderBottom: "1px solid silver"}} className="bb-1 p-2">
                Exemple
            </div>
        </header>
    )
}
