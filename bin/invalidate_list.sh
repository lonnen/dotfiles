#!/usr/bin/env bash

#############################
## PROGRAM: invalidate_list.sh
## PURPOSE: Given a url and domain to limit searches to
##          this will give you a list of all paths you should invalidate
## USAGE: invalidate_list.sh url domain_to_limit_search_to
## EXAMPLE:  ./invalidate_list.sh https://webmaker.org webmaker.org
#############################

#############################
## VARIABLES
REQUIREDARGS=1
ACTUALARGS=$#

#############################
## FUNCTIONS
error_check() {
    if [ ${RETURN_CODE} -ne 0 ]
        then
        echo "`date` -- Non-zero return code encountered"
        exit 1
        fi
  }


show_usage() {
    echo "Usage:"
    echo "   ./invalidate-list.sh url domain_limiter"
    echo " "
    echo " "
    echo "For example, if I wanted to spider webmaker.org"
    echo "  ./invalidate-list.sh https://webmaker.org webmaker.org"
    exit 0
  }


export URL_TO_SPIDER=$1
export DOMAIN_LIMITER=$2

if echo $DOMAIN_LIMITER > /dev/null
	then
        wget --spider --recursive -l 20 -D ${DOMAIN_LIMITER}  ${URL_TO_SPIDER} 2>&1 | grep http|awk '{print $3}'|sort -rn| uniq| sed 's/"$1"//g'
	RETURN_CODE=$?;error_check
	else
        wget --spider --recursive -l 20 ${URL_TO_SPIDER} 2>&1 | grep http|awk '{print $3}'|sort -rn| uniq
        RETURN_CODE=$?;error_check
	fi
