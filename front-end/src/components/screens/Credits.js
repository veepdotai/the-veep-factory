import { useEffect, useState } from 'react'

import { Logger } from 'react-logger-lib'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { t } from 'i18next'
import { Container } from 'react-bootstrap'
import { useCookies } from 'react-cookie'

import { Constants } from '@/constants/Constants'

//import { UtilsGraphQLMonitoring } from "src/api/utils-graphql-monitoring"
import { UtilsGraphQL } from "src/api/utils-graphql"
import { UsageChartLib } from './widgets/UsageChartLib'

import { usePapaParse } from 'react-papaparse';

export default function Credits() {
    const log = Logger.of(Credits.name);

    const graphqlURI = Constants.WORDPRESS_GRAPHQL_ENDPOINT;
    const [cookies] = useCookies(['JWT']);
  
    const [data, setData] = useState(null)
    
    /**
     * Gets data from influx server and aggregates them to render a stacked area graph
     * [
     *  {"_time":"2024-01-11T23:53:13Z","completion_tokens":"583","model":"gpt-4-1106-preview","user_email":"a@b.c"}
     *  {"_time":"2024-01-11T23:53:13Z","prompt_tokens":"6548","model":"gpt-4-1106-preview","user_email":"a@b.c"}
     *  ...
     * ]
     * 
     * becomes
     * 
     * [
     *  {
     *      "_time":"2024-01-11T23:53:13Z",
     *      "model":"gpt-4-1106-preview",
     *      "user_email":"a@b.c",
     *      "completion_tokens":"583",
     *      "prompt_tokens":"6548"
     *  }
     *  ...
     * ]
     *
     * @param {*} data
     * @returns aggregated data
     */
    function transform(_data) {

        function mergeObject(src, target) {
            Object.keys(target).forEach(element => {
                src[element] = target[element];
            });
            return src;
        }

        log.trace(`transform: raw data: ${JSON.stringify(_data)}`)

        /**
         * [
         *  {field: "myFieldName", value : "myValue" },
         *  ...
         * ]
         *  => [
         *  { "myFieldName": "myValue" },
         *  ...
         * ]
         */
        let data = _data.map((row) => {
            let r = { "_time": row._time }
            r[row._field] = row._value
            return r
        })

        log.trace(`transform: field/value => {field: value}: ${JSON.stringify(data)}`)

        /**
         * Data are aggregated (grouped by) on the same date.
         */
        let aggregatedView = {}
        data.forEach(item => {
            if (aggregatedView[item._time]) {
                aggregatedView[item._time] = mergeObject(aggregatedView[item._time], item)
                //r[item._time][item._field] = [item._value]
            } else {
                aggregatedView[item._time] = item
            }
        })

        /**
         * Date keys are removed on aggregatedView
         */
        let mergedData = [];
        Object.keys(aggregatedView).forEach(element => {
            mergedData.push(aggregatedView[element])
        })
        log.trace(`transform: data after transformation: mergedData: ${JSON.stringify(mergedData)}`)

        /**
         * Last step: date strings are transformed in Date objects
         */
        let finalData = mergedData.map((row) => {
            return {
                "x": new Date(row._time),
                ...row
            }
        })
        log.trace("buildGraph: _time date converted: " + JSON.stringify(finalData))

        /*
        let data = results.data.map((item) => {
            let r = { "_time": item._time.replace(/Z/, ".000Z") }
            r[item._field] = item._value
            return r
        })
        */

        return finalData
    }

    /**
     * For a same date (and normally the same generation process), computes nb
     * of tokens according total, prompt and/or completion values availability
     * by merging their properties in the same object.
     * 
     * @param {*} data 
     * @returns 
     */
    function nbOfTokens(data) {
        let nb = 0
        data.forEach(item => {
            log.info(`nbOfTokens: ${item.total_tokens}/${item.prompt_tokens}/${item.completion_tokens}`)
            if (item.total_tokens) {
                nb += parseInt(item.total_tokens)
            } else if (item.prompt_tokens && item.completion_tokens) {
                nb += parseInt(item.prompt_tokens) + parseInt(item.completion_tokens)  
            } else if (item.prompt_tokens) {
                nb += parseInt(item.prompt_tokens)  
            } else if (item.completion_tokens) { // Normally, no other solution
                nb += parseInt(item.completion_tokens)
            }
        })
        return nb
    }

    function buildGraph(topic, data) {
        const { readString } = usePapaParse();
        
        log.trace("buildGraph: " + data.usage_data)

        readString(data.usage_data, {
            header: true,
            worker: true,
            complete: (results) => {
                /** {"data":[{
                *      "result":"last","table":"0","_start":"2024-01-01T00:00:00Z","_stop":"2024-01-31T00:00:00Z",
                *      "_time":"2024-01-11T23:53:13Z",
                *      "_value":"583",
                *      "_field":"completion_tokens",
                *      "_measurement":"usage",
                *      "model":"gpt-4-1106-preview",
                *      "user_email":"a@b.c"
                * }]},
                */
                log.trace("buildGraph: readString result: " + JSON.stringify(results))

                let newData = transform(results.data);
                
                setData(newData);
            },
        });
    }

    function getUsageData(graphqlURI, cookies) {
        log.info("getUsageData: Getting usage data")
        // publishes a USAGE_DATA_UPDATED event with the corresponding data
        UtilsGraphQL.getUsageData( graphqlURI, cookies);
    }

    useEffect(() => {
        PubSub.subscribe("USAGE_DATA_UPDATED", buildGraph);

        getUsageData(graphqlURI, cookies);

    }, [])

    return (
        <Container>
            {/*<Markdown remarkPlugins={[remarkGfm]}>{t("CreditsContent")}</Markdown>*/}
            { data ?
                    <>
                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                            {UsageChartLib.widget(t("NumberOfGenerations"), "", data.length, t("NumberOfGenerationsDesc"), "p-1" )}
                            {UsageChartLib.widget(t("NumberOfTokens"), "", nbOfTokens(data), t("NumberOfTokensDesc"), "p-1" )}
                        </div>
                        <div className="ml-0 mt-2 w-50">
                            {UsageChartLib.chart(data)}
                        </div>
                    </>
                :
                    <>
                        No data available
                    </>
            }
            {/*<Checkout />*/}
        </Container>
    )
}

