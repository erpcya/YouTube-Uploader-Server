#!/bin/sh
echo Runing Server
#Run Server
WEBDAV_USER='medios' \
WEBDAV_PSK='medios' \
WEBDAV_URL='http://elcamino/remote.php/webdav' \
WEBDAV_BASE_FOLDER='/' \
LOCAL_TMP_DIRECTORY='/tmp' \
PYTHON_PATH='/usr/bin/python' \
SCRIPT_PATH='/tmp/Youtube-ERP' \
SCRIPT_NAME='upload_video.py' \
SERVER_HOST='0.0.0.0:50051' \
node youtube-uploader.js
