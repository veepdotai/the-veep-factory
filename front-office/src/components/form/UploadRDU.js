
import { useContext, useRef, useState, useEffect } from 'react';
import { Button, Col, Container, Modal, Row, Form } from 'react-bootstrap';
import { Logger } from 'react-logger-lib';
import toast from 'react-hot-toast';
import { t } from 'i18next';
import 'react-dropzone-uploader/dist/styles.css'
import Dropzone, { formatBytes } from 'react-dropzone-uploader'

import { UploadLib } from '../lib/util-upload-form.js';
import { VeepletContext } from 'src/context/VeepletProvider.js';
import { ContentIdContext } from 'src/context/ContentIdProvider';

export default function UploadRDU( {...props} ) {
    const log = Logger.of(UploadRDU.name);

    let conf = props.conf;

    const REQUIRED_CREDITS_MIN = 1;
    const MIN_LENGTH = 0;
  
    const { veeplet, setVeeplet } = useContext(VeepletContext);
    const { contentId, setContentId } = useContext(ContentIdContext);

    // receives array of files that are done uploading when submit button is clicked
    const handleSubmit = (files, allFiles) => {
        let fd = new FormData();

        fd.append(
            "veepdotai-ai-input-file",
            files[0].file,
            files[0].meta.name
        );
        log.trace("onFileUpload: selectedFile: " + files[0].meta.name);
    
        UploadLib.sendRecording(conf, fd, veeplet, setContentId);
        allFiles.forEach(f => f.remove())
    }

    function handleChangeStatus({meta, status}, files) {
        /*
        if (status == "done") {
            setSelectedFile(files[0].file);
        }
        */
        log.trace("handleChangeStatus: " + JSON.stringify(meta))
        log.trace(`handleChangeStatus: status: ${meta.status}`)
    }

    function checkFile(file) {
        log.trace("checkFile: " + JSON.stringify(file));

        let MB = 1024 * 1024;
        let constraints = [
            {type: "video", size: 100},
            {type: "audio", size: 25},
            {type: "application", size: 5},
            {type: "text", size: 0.3}
        ];
        let applicationFormats = [
            "pdf", "doc", "docx", "xlsx", "pptx",
            "odt", "ods", "odp"
        ];

        log.trace(`checkFile: ${file.meta.name} / ${file.meta.type} / ${file.meta.size}.`);
        let constraint = constraints.filter((item) => {
            let re = new RegExp(item.type);
            return re.test(file.meta.type)
        })[0];

        log.trace(`checkFile: constraint: ${constraint.type} / ${constraint.size}`);

        // Check file suffix
        let suffix = file.meta.name.replace(/.*\.([^\.]*)$/, "$1");
        log.trace(`checkFile: suffix: ${suffix}`);

        if (! ["video", "audio", "text"].includes(constraint.type)
            && ! applicationFormats.includes(suffix)) {
                let message = t("ErrorMimeTypeNotSupported", { 
                    docType: suffix
                });
                toast.error(message, { position: 'bottom-center'});
                file.remove();
                return message;
        }

        // Check file size
        let maxSize = constraint.size * MB;
        let constraintType = constraint.type.replace(/\.*/, "");
        if (constraintType == "application") {
            constraintType = "document";
        }
        if (file.meta.size > maxSize) {
            let message = t("ErrorContentTooBig", { 
                contentSize: Math.round(file.meta.size/MB),
                maxContentSize: Math.round(maxSize/MB),
                mimeType: constraintType
            });
            toast.error(message, { position: 'bottom-center'});
            file.remove();
            return message;
        } else {
            return false;
        }
    }

    return (
        <>
            {
                veeplet ?
                    <>
                        <Container className='w-100 text-center'>
                            <Dropzone
                                //getUploadParams={getUploadParams}
                                onChangeStatus={handleChangeStatus}
                                onSubmit={handleSubmit}
                                //accept="video/*,image/*,.doc,.docx,.xlsx,.pptx,.odt,.ods,.odp,.txt,.pdf"
                                inputContent={t("InputContent")}
                                inputWithFilesContent={t("InputWithFilesContent")}
                                maxFiles={1}
                                multiple={false}
                                canCancel={false}
                                styles={{
                                    dropzoneActive: { borderColor: 'green' },
                                    //dropzoneReject: { borderColor: 'red' },
                                }}
                                validate={checkFile}
                            />
                        </Container>
                        <Container style={{fontSize: "0.75rem"}} className='w-100 mt-3'>
                            <ul>
                                <li>{t("VideoFileConstraint")}</li>
                                <li>{t("AudioFileConstraint")}</li>
                                <li>{t("DocumentFileConstraint")}</li>
                                <li>{t("AllFileConstraints")}</li>
                            </ul>
                        </Container>
                    </>
                :
                    <></>
            }
        </>
    );
};
