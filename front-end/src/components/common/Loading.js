import { t } from 'src/components/lib/utils'
import { Spinner } from 'react-bootstrap';

import { Logger } from 'react-logger-lib';

export default function Loading() {
    const log = Logger.of(Loading.name);

    return (
        <div className="d-flex align-items-center justify-content-center h-lvh" id="loader">
            <Spinner animation="border" variant="primary" role="status">
                <span className="visually-hidden">{t("General.Loading")}</span>
            </Spinner>
        </div>
    )
}
