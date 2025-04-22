import { useEffect, useState } from 'react'
import { Logger } from 'react-logger-lib'
import { t } from 'src/components/lib/utils'

//import { Container } from 'react-bootstrap'
import { useCookies } from 'react-cookie'

import { Constants } from 'src/constants/Constants'
import { UtilsGraphQL } from "src/api/utils-graphql"
import PubTargetForm from "./forms/PubTargetForm"

export default function PubTarget() {
    const log = Logger.of(PubTarget.name);

    const graphqlURI = Constants.WORDPRESS_GRAPHQL_ENDPOINT;
    const [cookies] = useCookies(['JWT']);
  
    return (
      <PubTargetForm />
    )
}

