import { useState } from 'react';
import { Logger } from 'react-logger-lib';
import { t } from 'src/components/lib/utils'

import AllCards from './AllCards';

export default function CardSelector() {
  const log = Logger.of(CardSelector.name);

  /**
   * beginner, normal, advanced
   */
  const [skillsLevel, setSkillsLevel] = useState();
  return (
    <>
      <AllCards view={skillsLevel} id={"catalog-shared"} type="shared" title={t("VeepVeeplets")}/>
      <AllCards view={skillsLevel} id={"catalog-personal"} type="personal" title={t("MyVeeplets")}/>
    </>
  )

}
