import { useEffect, useState } from 'react'
import { Logger } from 'react-logger-lib'
import { t } from 'i18next'

//import { Container } from 'react-bootstrap'
import { useCookies } from 'react-cookie'

import { Constants } from 'src/constants/Constants'
import { UtilsGraphQL } from "src/api/utils-graphql"
import EditorialLineForm from './forms/EditorialLineForm'

export default function EditorialLine() {
    const log = Logger.of(EditorialLine.name);

    const graphqlURI = Constants.WORDPRESS_GRAPHQL_ENDPOINT;
    const [cookies] = useCookies(['JWT']);

    return (
      <EditorialLineForm />
    )
}

