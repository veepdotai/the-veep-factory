#!/bin/bash

# hash code to use
ALL_ARGS=$@

# Go and look at the build/env.tpl file to have an idea of the expected informations

# env vars must have been loaded before running this script
#. ../../.env

init() {
	USER=$MYSQL_USER
	if [ "x$USER" = "x" ]; then
		echo "USER var is empty => No CONTAINER_USER env var has been found."
        exit 1;
    fi

	PASSWORD=$MYSQL_PASSWORD
	if [ "x$PASSWORD" = "x" ]; then
		echo "PASSWORD var is empty => No CONTAINER_PASSWORD env var has been found."
        exit 1;
    fi

	DATABASE=$MYSQL_DATABASE
	if [ "x$DATABASE" = "x" ]; then
		echo "DATABASE var is empty => No CONTAINER_DATABASE env var has been found."
        exit 1;
    fi

	BACKUP_PATH=$MYSQL_BACKUP_PATH/
	if [ "x$BACKUP_PATH" = "x" ]; then
		echo "BACKUP_PATH var is empty => No CONTAINER_BACKUP_PATH env var has been found."
        exit 1;
    fi

}

parse_options() {
    echo "Parsing options"

    COMMAND_LINE_OPTIONS_HELP='
Command line options:
    -t  test
    -i -r  import db data
    -b  backup db data

Examples:
    Test:
        '`basename $0`' -t

    Import/Restore db data
        '`basename $0`' -i 20250905102100-wordpress.tgz

    Backup data with default filename:
        '`basename $0`' -b
'
    OPTIONS=":htbi:r:"
	
	# Possible to execute various commands with the same execution
	BACKUP="n"
	IMPORT_RESTORE="n"

    #echo "OPTIONS: $OPTIONS"
    while getopts $OPTIONS option
    do
        #echo "The $option option has been found."
        case $option in
            h)
                echo "$COMMAND_LINE_OPTIONS_HELP"
                exit $E_OPTERROR
                ;;
            b)
                echo "Backup db data with default name"
                BACKUP="y"
                ;;
            i)
                echo "Import/Restore option found"
                IMPORT_RESTORE="y"
				BACKUP_PATH=$OPTARG
                ;;
            r)
                echo "Import/Restore option found"
                IMPORT_RESTORE="y"
                ;;
            :)
                echo "$OPTARG option requires an argument"
                exit 1
                ;;
            \?)
                echo "$OPTARG option is invalid"
                exit 1
                ;;
        esac
    done

    #echo "Analyse des options terminées"
}

main() {
    parse_options $ALL_ARGS

	if [ "y$TEST" = "yy" ]; then        
        test
    fi

	if [ "y$IMPORT_RESTORE" = "yy" ]; then        
        import_restore
    fi

	if [ "y$BACKUP" = "yy" ]; then        
        backup
    fi

}

test() {
	echo "--- Test db connection"
}

import_restore() {
	echo "--- Restore data"
	#gunzip < "$BACKUP_PATH/$BACKUP_FILE" | docker exec -i wordpress-db /usr/bin/mariadb -u $USER $ -p$PASSWORD $DATABASE
}

backup() {
	echo "--- Backup data"
	#docker exec mariadb /usr/bin/mariadb-dump -u $USER $ -p$PASSWORD $DATABASE | gzip > "$BACKUP_PATH/database_backup_$(date +\%F).sql.gz"
}

main
