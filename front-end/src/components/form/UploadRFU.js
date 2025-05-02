
import { useContext, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { Logger } from 'react-logger-lib';
import toast from 'react-hot-toast';
import { t } from 'src/components/lib/utils'

import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

import { UploadLib } from '../lib/util-upload-form.js';
import { VeepletContext } from 'src/context/VeepletProvider.js';
import { ContentIdContext } from 'src/context/ContentIdProvider';

export default function UploadRFU( {...props} ) {
    const log = Logger.of(UploadRFU.name);

    let conf = props.conf;

    const REQUIRED_CREDITS_MIN = 1;
    const MIN_LENGTH = 0;
  
    const { veeplet, setVeeplet } = useContext(VeepletContext);
    const { contentId, setContentId } = useContext(ContentIdContext);

    const [submitButtonIsEnabled, setSubmitButtonIsEnabled] = useState(true);
    const [submitButtonIsHidden, setSubmitButtonIsHidden] = useState(false);
    
    registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)

    const [files, setFiles] = useState([])

    // receives array of files that are done uploading when submit button is clicked
    const handleSubmit = () => {
        log.trace(`handleSubmit`, files)

        if (files) {
            let file = files[0].file
            let name = file.name

            let fd = new FormData();
            fd.append(
                "veepdotai-ai-input-file",
                file,
                name
            );
            log.trace("onFileUpload: selectedFile: " + name);
    
            PubSub.publish("FILE_ADDED", { "veepdot-ai-input-file": file })
            UploadLib.sendRecording(conf, fd, veeplet, setContentId);
            //allFiles.forEach(f => f.remove())
            setFiles([])
        }
    }

    function handleUpdateFiles(files) {
        log.trace(`handleUpdateFiles`, files)
        setFiles(files)
        return true
    }

    function handleChangeStatus({meta, status}, files) {
        /*
        if (status == "done") {
            setSelectedFile(files[0].file);
        }
        */
        log.trace("handleChangeStatus: ", meta)
        log.trace(`handleChangeStatus: status: ${meta.status}`)
    }

    function checkFile(file) {
        log.trace("checkFile: ", file);

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
                            <FilePond
                                files={files}
                                onupdatefiles={handleUpdateFiles}
                                allowMultiple={false}
                                //server="/api"
                                instantUpload={false}
                                labelIdle={t("InputWithFilesContent")}
                            />

                            <Button className={'w-100 ' + (submitButtonIsHidden ? 'd-none' : '')}
                                    disabled={! submitButtonIsEnabled || props.credits < REQUIRED_CREDITS_MIN}
                                    variant="primary"
                                    onClick={handleSubmit}>
                                {t("EditorialCalendar.useThisRecord")}
                            </Button>
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

