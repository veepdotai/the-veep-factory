import { Container } from 'react-bootstrap';
import { Logger } from 'react-logger-lib';
import { t } from 'i18next';

// App tour
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

import { Icons } from "src/constants/Icons";

const tour = {
    "home": [ 'home/Dashboard', 'contents/AddContent', 'add-content/MyContents']
}

export default function Tour( props ) {
    const log = Logger.of(Tour.name);

    function getTour(name) {
        log.trace(`getTour: name: ${name}`);
        let steps = tour[name]?.map((bigStep) => getStep(bigStep.split('/')[0], bigStep.split('/')[1]));
        if (! steps) {
            steps = [getStep("none", "TBD")];
        }

        return steps;
    }

    function getStep(id, name) {
        log.trace(`getStep: id: ${id}, name: ${name}`);
        return {
            element: `#${id}`,
            popover: {
              title: t(`${name}Menu`),
              description: t(`${name}Menu`)
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
        <div className='text-right' onClick={handleClick}>{Icons.tour}</div>
    )
}
