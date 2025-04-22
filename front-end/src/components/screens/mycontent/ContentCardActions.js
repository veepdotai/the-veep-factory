import { Logger } from 'react-logger-lib';
import toast from 'react-hot-toast'
import { t } from 'src/components/lib/utils'
import axios from 'axios';

const ContentCardActions = {
  log: Logger.of("ContentCardActions"),

  remove: function() {
    alert('NYI');
  },

  /*
  copy: function() {
    alert('NYI');
  },

  publish: function() {
    alert('NYI3');
  },
  */
  handleSave: function(params) {
    let log = ContentCardActions.log

    log.trace("contentId: ", params.contentId);
    log.trace("attrName: ", params.attrName);
    log.trace("content: ", params.content);
    log.trace("custom: ", params.custom);

    let conf = params.conf
    log.trace( "conf: ", conf);

    let fd = new FormData();
    fd.append("contentId", params.contentId);
    fd.append("attrName", params.attrName);
    fd.append("content", params.content);
    fd.append("custom", params.custom);

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