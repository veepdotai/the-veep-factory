import { Logger } from 'react-logger-lib';
import PubSub from 'pubsub-js';
import { t } from 'i18next';

import { Constants } from "src/constants/Constants";
import { UtilsGraphQL } from 'src/api/utils-graphql.js';

const MyContentActions = {
    log: Logger.of("MyConfigurationActions"),

    showDetails: function(row) {
        return {
            show: true,
            url: Constants.WORDPRESS_URL + row.uri,
            title: row.title,
            id: row.id
        };
    },

    renameContentTitleDialog: function(graphqlURI, cookies, row) {
        PubSub.publish("PROMPT_DIALOG", {
            title: t("RenameTitleDialog"),
            description: t("RenameTitleDialogDesc"),
            content: <input className="m-2 p-2 border-slate-200" id="input_title" name="title" />,
            actions: [{
                label: t("Cancel")
            }, {
                label: t("OK"),
                click: () => MyConfigurationActions.renameContentTitle(graphqlURI, cookies, row, document.getElementById("input_title").value)
            }]
        })
    },

    renameContentTitle: function(graphqlURI, cookies, row, title) {
        MyConfigurationActions.log.trace(`renameContentTitle: row: ${row.id} / title: ${title}`)
        UtilsGraphQL.rename(graphqlURI, cookies, row, title)
    },

    moveToTrashConfirmationDialog: function(graphqlURI, cookies, row) {
        MyContentActions.log.trace(`moveToTrashConfirmationDialog: ${JSON.stringify(row)}`)
        PubSub.publish("PROMPT_DIALOG", {
            title: t("MoveToTrashConfirmationDialog"),
            description: t("MoveToTrashConfirmationDialogDesc"),
            //content: <input className="m-2 p-2 border-slate-200" id="input_title" name="title" />,
            actions: [{
                label: t("Cancel")
            }, {
                label: t("OK"),
                click: () => UtilsGraphQL.moveToTrash(graphqlURI, cookies, row)
            }]
        })
    },

    moveToTrash: function(graphqlURI, cookies, row) {
        UtilsGraphQL.moveToTrash(graphqlURI, cookies, row)
    }
}

export default MyContentActions;