import { t } from 'i18next';
import { Container, Spinner } from 'react-bootstrap';
import { Constants } from "src/constants/Constants";

import { Logger } from 'react-logger-lib';

export default function FirstLoading() {
    const log = Logger.of(FirstLoading.name);

    //<Container className="position-absolute top-25 start-25" id="loader">
    //<div style={{"display": "flex", "alignItems" :"center", "justifyContent": "center", "height": "100vh", "flexDirection": "column"}} id="loader">
    return (
        <div className="d-flex align-items-center justify-content-center flex-column h-lvh" id="loader">
            <div className="w-25 p-5">{t("BePatient")}</div>
            <img src={Constants.ROOT + '/mr-bean.gif' } width="150px" className='rounded-circle'/>
        </div>
    )
}
