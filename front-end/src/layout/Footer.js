import { Logger } from 'react-logger-lib';
import { t } from 'src/components/lib/utils'

import { Constants } from "src/constants/Constants"

export default function Footer() {
    const log = Logger.of(Footer.name);

    return (
        <footer id="footer" className="mt-3">
            <a
                href="https://veep.ai?utm_source=veepdotai-app&utm_medium=default-template&utm_campaign=launching"
                target="_blank"
                rel="noopener noreferrer"
                >
                    {t("General.PoweredBy") + ' '}
                <img style={{height: "1em"}} src={Constants.ROOT + '/assets/images/veep.ai-wnb.png'} alt="Veep.AI" />
            </a>
        </footer>
    )
}
