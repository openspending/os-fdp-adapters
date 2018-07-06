#!/bin/sh
set -e

ls $WORKDIR/.git > /dev/null && cd $WORKDIR || cd /app
echo working from `pwd`

echo 'Starting gunicorn'
gunicorn -w 4 os_fdp_adapters:wsgi -b 0.0.0.0:8000 "$@"
