import { useState, useEffect } from 'react';
import { Logger } from 'react-logger-lib';
import { useCookies } from 'react-cookie';
import useSWR from 'swr';
import PubSub from 'pubsub-js';

import { Constants } from "src/constants/Constants";

export default function Logs() {
    const log = Logger.of(Logs.name);

    const [cookies] = useCookies(['JWT']);
    const [config, setConfig] = useState({});

    function reset(topic, msg) {
        setConfig({});
        done = [];
    }

    function initDataSource(topic, data) {
        log.trace("initDataSource.");

        const prefix = Constants.WORDPRESS_REST_URL + "/?rest_route=/veepdotai_rest/v1";
        const token = "&JWT=" + cookies.JWT;

        log.info("Processing pid: " + data);

        let param = "&audio_pid=" + data;
        let service = prefix + "/logs/get-logs" + param + token;

        log.info("initDataSource: service: " + service);

        setConfig({
            service: service,
        });
    }

    useEffect(() => {
        PubSub.subscribe("PROCESSING_PID", initDataSource);
        PubSub.subscribe('RESET', reset);
    }, [])

    return (
        <div>
        {config && config.service ?
            <DisplayLogs conf={config} />
        :
            <p>Initializing....</p>
        }
        </div>
    )
}

var done = [];

function DisplayLogs({conf}) {
    const log = Logger.of(DisplayLogs.name);
    log.trace("conf: " + JSON.stringify(conf));

    var [processing, setProcessing] = useState(true);

    const fetcher = (...args) => fetch(...args).then(res => res.json())

    // This may seem useless but we are polling the server
    // and so we don't want caching
    const disableCache = (useSWRNext) => {
        return (key, fetcher, config) => {
          const swr = useSWRNext(key, fetcher, config);
          const { data, isValidating } = swr;
          return Object.assign({}, swr, {
            data: isValidating ? undefined : data,
          });
        };
    };

    const { data, error, isLoading } = useSWR(processing ? conf.service : null, fetcher, {
        refreshInterval: 3000,
        focusThrottleInterval: 0,
        use: [disableCache],  
    });

    function init() {
        if (error) return <div>Échec du chargement</div>
        if (isLoading) return <div>Chargement en cours...</div>
        if (processing) {
            if (data) {
                log.info("init: processing = true; data: " + JSON.stringify(data));
                filterAndPublishData(data);
            }
        }
    }

    function reset(topic, msg) {
        setProcessing(true);
        done = [];
    }

    function filterAndPublishData(data) {
        data.map((row) => {
            if (row !== "" && row.match(/_(STARTED|FINISHED|PAUSED|ERROR)_/)) {
                log.trace("processData: " + JSON.stringify(row));

                let result = row.replace(/.*\s(_[^\s]*_(STARTED|FINISHED|PAUSED|ERROR)_).*/, "$1");
                let alreadyDone = done.includes(result);
                log.trace("processData: alreadyDone? " + JSON.stringify(done) + " includes " + result + " : " + alreadyDone);

                if (result && ! alreadyDone) {
                    // We publish row to have all the available information
                    log.info(`processData: publishing on ${result}: ${JSON.stringify(row)}.`);
                    PubSub.publish(result, row);

                    log.info(`processData: publishing on CURRENT_STEP: ${JSON.stringify(result)}.`);
                    PubSub.publish('CURRENT_STEP', row);

                    // But we store result to be more concise
                    done.push(result);
                }
            }
        })
    }
    
    function setProcessingTrue(topic, message) {
        log.info("setProcessingTrue.");
        setProcessing(true);
    }

    function setProcessingFalse(topic, message) {
        log.info("setProcessingFalse.");
        setProcessing(false);
    }

    useEffect(() => {

        PubSub.subscribe('_CONTENT_GENERATION_STARTED_', setProcessingTrue);
        PubSub.subscribe('_CONTENT_GENERATION_RESUMED_', () => {
            setProcessingTrue();
            done = [];
        });
        if (processing) {
            PubSub.subscribe('_CONTENT_GENERATION_FINISHED_', setProcessingFalse);
            PubSub.subscribe('_CONTENT_GENERATION_PAUSED_', setProcessingFalse);
    
            PubSub.subscribe('RESET', reset);
            PubSub.subscribe('_ERROR_', reset);
            //PubSub.subscribe('CURRENT_STEP', checkProcessing);
        }
    }, [processing]);

    init();

    return (
        <div>
            {processing && data && data.map((row) => {
                if (row !== "") {
                    let [all, date, time, log ] = row.match(/^(.{10})T(.{15})\s(.*)/);
                    let rowData = {
                        all: all,
                        date: date,
                        time: time,
                        log: log
                    }

                    if (row.match(/http/)) {
                        var href = row.replace(/.*(http[^\s]*).*/, "$1");
                        rowData.log = rowData.log.replace(/http[^\s]*/, "");
                    }

                    return (
                        <>
                            {/*<li>{rowData.date} / {rowData.time} / {rowData.log} /</li>*/}
                            <p key={row}>
                                {rowData.time} / {
                                    row.match(/http/) ? 
                                            <><a href={href}>{rowData.log}</a></>
                                        :
                                            <>{rowData.log}</>
                                }
                            </p>
                        </>
                    )
                }
            })}

        </div>
    )

}