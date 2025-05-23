#!/bin/bash

#
# Final app build and deploy script. Look at the main function below
# to see what's going on
#
# jck@veep.ai
#
# This script updates the next.config.js and .env.production files to get the
# expected build and deploy it on a remote server through sftp:
# * First, it prepares the build, operates the builds then stores the result in
# the expected dir.
# * Then, it prepares the deployment, deploys the build and restitutes the
# original env
#
# Deployment preparation consists in moving the vendor part outside the plugin
# dir so the sftp operates quickly. It is especially useful for the main
# veepdotai plugin where the vendor dir is big enough. After deployment, you
# have to put the vendor dir to its right location
#
# Of course, if you add a new lib, you MUST sync the vendor dir beetween your
# local and remote installation.
#

#set -e

# hash code to use
ALL_ARGS=$@

# Go and look at the build/env.tpl file to have an idea of the expected informations

# env vars must have been loaded before running this script
#. ../../.env

parse_options() {
    echo "Parsing options"

    COMMAND_LINE_OPTIONS_HELP='
Command line options:
    -b          Builds the client app
    -d          Deploys the client app on the remote target 
    -D  DIR     Deploys the provided client app on the remote target 
    -s          Deploys the client app on the remote target

Examples:
    Builds and deploys client app:
        '`basename $0`' -b -d

    Deploys specific client app:
        '`basename $0`' -b -D 241124-1151-af1914b9

    Deploys server modules:
        '`basename $0`' -s

'
    OPTIONS=":hbdD:s"

    BUILDS_CLIENT_APP="n"
    DEPLOYS_CLIENT_APP="n"
    DEPLOYS_SERVER_MODULES="n"

    echo "OPTIONS: $OPTIONS"
    while getopts $OPTIONS option
    do
        echo "$option option found."
        case $option in
            h)
                echo "$COMMAND_LINE_OPTIONS_HELP"
                exit $E_OPTERROR
                ;;
            b)
                echo "Builds the client app"
                BUILDS_CLIENT_APP="y"
                ;;
            d)
                echo "Deploys the client app on the remote target"
                DEPLOYS_CLIENT_APP="y"
                ;;
            D)
                echo "Deploys the server modules on the remote target"
                BUILDS_CLIENT_APP="n"
                DEPLOYS_CLIENT_APP="y"
                TAG=$OPTARG
                ;;
            s)
                echo "Deploys the server modules on the remote target"
                DEPLOYS_SERVER_MODULES="y"
                ;;
            :)
                echo "$OPTARG option required an argument"
                exit 1
                ;;
            \?)
                echo "$OPTARG : option invalide"
                exit 1
                ;;
        esac
    done

    echo BUILDS_CLIENT_APP=$BUILDS_CLIENT_APP
    echo DEPLOYS_CLIENT_APP=$DEPLOYS_CLIENT_APP
    echo DEPLOYS_SERVER_MODULES=$DEPLOYS_SERVER_MODULES

    echo "Analyse des options terminées"

}

main() {
    init
    parse_options $ALL_ARGS

    test_sshpass

    echo "Executing Main"

    # build = prepare + build + store
    if [ "y$BUILDS_CLIENT_APP" = "yy" ]; then        
        build
    fi

    # deploys only the js app
    if [ "y$DEPLOYS_CLIENT_APP" = "yy" ]; then        
        deploy_build
    fi

    # deploys the wp plugins
    if [ "y$DEPLOYS_SERVER_MODULES" = "yy" ]; then        
        deploy_server
    fi

    echo "The server has been pusblished: $APP_HOST/v/$TAG"
}

test_sshpass() {
    TEST=$(command sshpass -v > test-command.txt | grep Usage test-command.txt)
    if [ -z "$TEST" ]; then
        sudo apt-get install sshpass
    else
        echo "sshpass is already installed"
    fi
}

init() {
    APP_HOST="https://app.veep.ai"
    APP_DIR=$(echo "$APP_HOST" | sed "s,https\?://,,g")

    ROOT_DIR="/workspaces/the-veep-factory"
    FRONT_DIR="$ROOT_DIR/front-end"
    BACK_DIR="$ROOT_DIR/back-end"

    SERVER_ROOT_DIR="$BACK_DIR/wordpress/htdocs"
    SERVER_LOCAL_DIR="$SERVER_ROOT_DIR"
    mkdir -p "$SERVER_LOCAL_DIR"

    SERVER_DIST_DIR="/vhosts/app.veep.ai/htdocs"

    DIST_DIR="$FRONT_DIR/dist"
    APP_DEST_DIR="$FRONT_DIR/versions/$APP_DIR"

    NEW_APP_HOST=$(echo "$APP_HOST" | sed "s,/,\\\/,g")
    echo $NEW_APP_HOST

    NEXT_CONFIG_JS_PATH="$FRONT_DIR/next.config.js"
    NEXT_CONFIG_JS_TPL_PATH="$FRONT_DIR/next.config.js.tpl"

    ENV_PRODUCTION_PATH="$FRONT_DIR/.env.production"
    ENV_PRODUCTION_TPL_PATH="$FRONT_DIR/.env.production.tpl"

    DATE=$(date "+%Y%m%d-%H%M" | cut -b 3-13)
    HASH=$(git rev-parse HEAD | cut -b 1-8)

    TAG=${ARGS:-$DATE-$HASH}
    echo $TAG

}

prepare_build() {
    echo "# next.config.js configuration"
    echo

    cp -f $NEXT_CONFIG_JS_TPL_PATH $NEXT_CONFIG_JS_PATH

    sed -i "s/.*basePath: '.*/    basePath: '\/v\/$TAG',/" $NEXT_CONFIG_JS_PATH
    sed -i "s/.*assetPrefix: '.*/    assetPrefix: '\/v\/$TAG',/" $NEXT_CONFIG_JS_PATH

    head -n 5 $NEXT_CONFIG_JS_PATH

    echo
    echo "# .env.production configuration"
    echo

    cp -f $ENV_PRODUCTION_TPL_PATH $ENV_PRODUCTION_PATH

    sed -i "s/NEXT_PUBLIC_APP_URL =.*/NEXT_PUBLIC_APP_URL = \'$NEW_APP_HOST\/v\/$TAG\'/" $ENV_PRODUCTION_PATH
    sed -i "s/NEXT_PUBLIC_ROOT =.*/NEXT_PUBLIC_ROOT = '\/v\/$TAG'/" $ENV_PRODUCTION_PATH

    head -n 5 $ENV_PRODUCTION_PATH
}

build_app() {
    echo "Really builds the app"
    npm run build
    cp -f $NEXT_CONFIG_JS_TPL_PATH $NEXT_CONFIG_JS_PATH
}

store_build() {
    mkdir -p $APP_DEST_DIR
    mv $DIST_DIR "$APP_DEST_DIR/$TAG"
}

deploy_build() {
    echo "Deploy build at... $(date '+%Y%m%d-%H%M')"
    echo "=> $USER@$HOST"

    sshpass -f $TOK_FILE sftp -oStrictHostKeyChecking=no -oBatchMode=no -b - "$USER@$HOST" << !
cd /vhosts/app.veep.ai/htdocs/v
mput -r "$APP_DEST_DIR/$TAG"
bye
!

}

# Usually, vendor doesn't need to be exported during deployemnt.
# As there is no exclude flags in sftp, we move it to its parent
# and rename it $parent-vendor
deploy_server_pre() {
    local PLUGINS_DIR="$SERVER_LOCAL_DIR/wp-content/plugins"
    cd $PLUGINS_DIR
    for dir in $(ls -d veepdotai*); do
        echo Currently processing $dir plugin
        [ -d $dir/vendor ] && mv $dir/vendor $dir-vendor
        echo Processed
    done
}

# After deployment, we move and rename vendor dir back
deploy_server_post() {
    local PLUGINS_DIR="$SERVER_LOCAL_DIR/wp-content/plugins"
    cd $PLUGINS_DIR
    for dir in $(ls -d veepdotai*); do
        echo Currently re-processing $dir plugin
        [ -d $dir-vendor ] && mv $dir-vendor $dir/vendor
        echo Processed
    done
}

# We export all the veepdotai* plugin to the server
# In a future version, we may use git-ftp
deploy_server_veepdotai_plugins() {

    echo "Deploy build $TAG at... $(date '+%Y%m%d-%H%M')"
    echo "=> $USER@$HOST"

    #mput -r "$SERVER_LOCAL_DIR/wp-content/plugins/veepdotai_front_js"

    sshpass -f $TOK_FILE sftp -oStrictHostKeyChecking=no -oBatchMode=no -b - "$USER@$HOST" << !
cd $SERVER_DIST_DIR/wp-content/plugins
mput -r "$SERVER_LOCAL_DIR/wp-content/plugins/veepdotai"
mput -r "$SERVER_LOCAL_DIR/wp-content/plugins/veepdotai_billing"
mput -r "$SERVER_LOCAL_DIR/wp-content/plugins/veepdotai_dsl"
mput -r "$SERVER_LOCAL_DIR/wp-content/plugins/veepdotai_extractors"
mput -r "$SERVER_LOCAL_DIR/wp-content/plugins/veepdotai_graphql"
mput -r "$SERVER_LOCAL_DIR/wp-content/plugins/veepdotai_login_to_headless_wp"
mput -r "$SERVER_LOCAL_DIR/wp-content/plugins/veepdotai_misc"
mput -r "$SERVER_LOCAL_DIR/wp-content/plugins/veepdotai_rest"
mput -r "$SERVER_LOCAL_DIR/wp-content/plugins/veepdotai_setup"
mput -r "$SERVER_LOCAL_DIR/wp-content/plugins/veepdotai_usage"
bye
!

}

deploy_server() {
    echo "un"
    deploy_server_pre
    echo "deux"
    deploy_server_veepdotai_plugins
    deploy_server_post
}

build() {
    echo "Build started at... $(date '+%Y%m%d-%H%M')"

    prepare_build
    build_app
    store_build
    echo "Build finished at... $(date '+%Y%m%d-%H%M')"
}

main
