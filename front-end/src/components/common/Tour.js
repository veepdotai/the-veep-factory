import { Container } from 'react-bootstrap';
import { Logger } from 'react-logger-lib';
import { t } from 'src/components/lib/utils'

// App tour
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

import { getIcon } from "src/constants/Icons";
import { Utils } from '../lib/utils';


export default function Tour( props ) {
    const log = Logger.of(Tour.name);

    const tour = {
        "home": [ 'home', 'add-content', 'contents'],
        "add-content": [ 'add-content', 'catalog-shared', 'catalog-personal'],
        "contents": [ 'contents/AddContent', 'add-content/MyContents'],
        "dpt-marketing": [ 'add-content', 'dpt-marketing-catalog-shared', 'dpt-marketing-catalog-personal'],
    }

    function getTour(name) {
        log.trace(`getTour: name: ${name}`);
        /*
        let steps = tour[name]?.map((bigStep) => getStep(bigStep.split('/')[0], bigStep.split('/')[1]));
        if (! steps) {
            steps = [getStep("none", "TBD")];
        }

        return steps;
        */
       return tour[name].map((stepName) => getStep(stepName, Utils.camelize(stepName)))
    }

    function getStep(id, name) {
        log.trace(`getStep: id: ${id}, name: ${name}`);
        return {
            element: `#${id}`,
            popover: {
              title: t(`${name}TitleTour`),
              description: t(`${name}DescTour`)
            }
        }
    }

    function handleClick() {
        let tourDriver = driver({
            showProgress: true,  // Because everyone loves progress bars!
            steps: getTour(props.name),
            stageRadius: 20,
            progressText: `{{current}} ${t("Of")} {{total}}`,
            nextBtnText: t("NextBtnText"),
            prevBtnText: t("PrevBtnText"),
            doneBtnText: t("DoneBtnText"),
            popoverClass: "popoverTourClass"
        });

        tourDriver.drive();
    }

    return (
        <div className='cursor-pointer' onClick={handleClick}>{getIcon("tour")}</div>
    )
}
