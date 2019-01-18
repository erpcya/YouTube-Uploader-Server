#!/bin/sh
echo Runing Server
#Run Server
WEBDAV_USER='nextcloud' \
WEBDAV_PSK='nextcloud' \
WEBDAV_URL='http://server/remote.php/webdav' \
WEBDAV_BASE_FOLDER='/media' \
LOCAL_TMP_DIRECTORY='/tmp' \
PYTHON_PATH='/usr/bin/python' \
SCRIPT_PATH='/opt/Apps/Youtube-ERP' \
SCRIPT_NAME='upload_video.py' \
SERVER_HOST='0.0.0.0:50051' \
node youtube-uploader.js
