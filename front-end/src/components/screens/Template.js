/**
 * This is a template. Just copy and rename it. 
 */
import { useEffect, useState } from 'react'

import { Logger } from 'react-logger-lib'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { t } from 'src/components/lib/utils'
import { Container } from 'react-bootstrap'
import { useCookies } from 'react-cookie'

import { Constants } from '@/constants/Constants'
import { UtilsGraphQL } from "src/api/utils-graphql"

export default function Dashboard() {
    const log = Logger.of(Dashboard.name);

    const graphqlURI = Constants.WORDPRESS_GRAPHQL_ENDPOINT;
    const [cookies] = useCookies(['JWT']);
  
    useEffect(() => {
    }, [])

    return (
        <Container>
        </Container>
    )
}

