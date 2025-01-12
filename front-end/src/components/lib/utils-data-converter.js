import { Logger } from 'react-logger-lib';
import TOML from '@iarna/toml';

export const UtilsDataConverter = {
    log: Logger.of("UtilsDataConverter"),

    /**
     * Converts raw GQL to VContent Value Object
     * @param {*} data 
     * @returns vvo a VContent Value Object 
     */
    convertGqlToVVO: function(data) {
        let gqlVContents = UtilsDataConverter.convertGqlToGqlVContents(data)
        let vvo = UtilsDataConverter.convertGqlVContentsToVO(gqlVContents)

        return vvo
    },

    /**
     * 
     * @param {*} data Gql raw data 
     * @returns [] array of Gql VContent data
     */
    convertGqlToGqlVContents: function(data) {
        UtilsDataConverter.log.trace("convertGqlToGqlVContents: data: " + JSON.stringify(data))

        let contents = data?.data?.posts ? data?.data?.posts : data?.data?.vcontents
        UtilsDataConverter.log.trace("convertGqlToGqlVContents: contents: " + JSON.stringify(contents))

        let nodes = contents?.nodes
        UtilsDataConverter.log.trace("convertGqlToGqlVContents: nodes: " + JSON.stringify(nodes))

        return nodes
    },

    /**
     * @param data GqlVContents data array
     * @returns array an array of VContent objects
     */
    convertGqlVContentsToVO: function(data) {
        let log = (msg) => UtilsDataConverter.log.trace("convertGqlVContentsToVO: " + msg)
        log("data: " + JSON.stringify(data))

        let vo = data?.map((o) => {
            log(`o: ${JSON.stringify(o)}`)

            let ps = TOML.parse(o.veepdotaiPrompt?.replace(/#EOL#/g, "\n"));

            let r = {}

            //r = o
            r.id = o.postId || o.databaseId
            //r.date = o.date?.replace(/T/, " ").replace(/\.*$/, "") ?? ""
            r.date = o.date ? o.date.replace(/T/, " ").replace(/\.*$/, "") : ""
            r.givenName = o.author ? o.author?.node?.firstName + " " + o.author?.node?.lastName : ""
            r.title = o.title

            // Think about next metadata
            // r.subtitle = o.subtitle
            // r.pubDate = o.pubDate
            // ///

            r.uri = o.uri

            //r.status = o.categories.edges[0].node.name
            //r.status = o.categories?.edges[0].node.name
            r.type = ps?.metadata?.name + ' v' + ps?.metadata?.version
            
            r.domain = (o.veepdotaiDomain || o.tvfDomain || ps?.metadata?.classification?.group)?.trim()
            r.subDomain = (o.veepdotaiSubDomain || o.tvfSubDomain || ps?.metadata?.classification?.subDomain)?.trim()
            r.category = (o.veepdotaiCategory || o.tvfCategory || ps?.metadata?.classification?.category)?.trim()
            r.subCategory = (o.veepdotaiSubCategory || o.tvfSubCategory || ps?.metadata?.classification?.subCategory)?.trim()
            r.artefactType = (o.veepdotaiArtefactType || o.tvfArtefactType || ps?.metadata?.classification?.artefactType)?.trim()

            log(`r: ${JSON.stringify(r)}`)
            return r
        })

        log("vo: " + JSON.stringify(vo))

        return vo
    }
}