import { t } from 'src/components/lib/utils'
import { Container, Spinner } from 'react-bootstrap';
import { Constants } from "src/constants/Constants";

import { Logger } from 'react-logger-lib';
import { useMediaQuery } from 'usehooks-ts';

export default function FirstLoading() {
    const log = Logger.of(FirstLoading.name);

    const isDesktop = useMediaQuery("(min-width: 768px)")

    return (
        <div className="d-flex align-items-center justify-content-center flex-column h-lvh" id="loader">
            <div className={isDesktop ? "w-25 p-5" : "px-4 pb-5"}>{t("BePatient")}</div>
            <img src={Constants.ROOT + '/mr-bean.gif' } width="150px" className='rounded-circle'/>
        </div>
    )
}
