import { Logger } from 'react-logger-lib';
import axios from 'axios';
import PubSub from 'pubsub-js';

import { Constants } from "src/constants/Constants";
import { pushState } from '../lib/utils-analytics.js';

export const UploadLib = {

    log: Logger.of("UploadLib"),

    getTs: function() {
        let now = Date.now();
        this.log.info('getFormData: get logs from the WP server with ts (kind of pid): ' + now);

        return now;
    },

    addCommonFormData: function (formData, veeplet, now) {
        // Boilerplate data is added dynamically
        formData.append('audio', 'veep_id_vocal');

        formData.append('veepdotai-ai-idea', 'Test (cat: marketing');
        formData.append('veepdotai-ai-pid', now);
        formData.append('veepdotai-content-id', '');

        formData.append('veepdotai-ai-chain-id', veeplet);
    
        return formData;
    },
  
    postVocal: async function(formData, conf, setContentId = null) {
        const config = {
            headers: {'content-type': 'multipart/form-data'}
        }
        const params = { params: { 'JWT': conf.token } };

        this.log.trace("postVocal: params: " + JSON.stringify(params));

        await axios.post(conf.service, formData,
            params,
            config
        ).then((res) => {
            UploadLib.log.trace("postVocal: result: " + JSON.stringify(res));
            return res.data;
        }).then(function (data) {
            let contentId = data.data;
            UploadLib.log.trace("postVocal: contentId: " + JSON.stringify(contentId));

            //PubSub.publish("CONTENT_ID", contentId);
            if (setContentId) {
                setContentId(contentId);
            }
            //      setContent(res.data);
        }).catch((err) => {
            this.log.info(err);
        });
    },

    resumeSendRecording: function(conf, contentId, setContentId = null) {
        let fd = new FormData();
        pushState("resumeSendRecording");

        let now = this.getTs();

        fd.append('veepdotai-ai-pid', now);
        fd.append('veepdotai-ai-content-id', contentId);

        PubSub.publish("PROCESSING_PID", now);
        PubSub.publish("_CONTENT_GENERATION_RESUMED_", true);
        PubSub.publish("PROCESS_STARTED", true)
        this.postVocal(fd, conf, setContentId);
    },

    sendRecording: function(conf, fd, veeplet, setContentId) {
        pushState("sendRecording");
        this.log.info("sendRecording: veeplet: " + veeplet);

        let now = this.getTs();
        this.addCommonFormData(fd, veeplet, now);

        PubSub.publish("PROCESSING_PID", now);
        PubSub.publish("PROCESS_STARTED", null)
        this.postVocal(fd, conf, setContentId);
    }

}
