import { Logger } from 'react-logger-lib';
import toast from 'react-hot-toast'
import { t } from 'i18next';
import axios from 'axios';

const ContentCardActions = {
  log: Logger.of("ContentCardActions"),

  remove: function() {
    alert('NYI');
  },

  copy: function() {
    alert('NYI');
  },

  publish: function() {
    alert('NYI');
  },

  handleSave: function(params) {
    let log = ContentCardActions.log

    log.trace(`contentId: ${params.contentId}`);
    log.trace(`attrName: ${params.attrName}`);
    log.trace(`content: ${params.content}`);

    let conf = params.conf
    log.trace( "conf: " + JSON.stringify(conf));

    let fd = new FormData();
    fd.append("contentId", params.contentId);
    fd.append("attrName", params.attrName);
    fd.append("content", params.content);

    axios.post(
      conf.service,
      fd,
      {},
      conf.options)
    .then((res) => res.data)
    .then((data) => {
      if (data) {
        toast.success(t("Saved") + `: ${params.contentId}`);
        return true;
      } else {
        toast.error(t("NotSaved") + ` ${params.contentId}`);
        return false;
      }
    })
  }

}

export default ContentCardActions