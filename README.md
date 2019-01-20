# YouTube Uploader Server
YouTube server for upload or publish video

## Build Setup

bash
# install dependencies
```
npm install
```

## Requirements
- [Docker Compose](https://docs.docker.com/compose/)
- [Docker](https://docs.docker.com/)
- [Node](https://nodejs.org/)

### Running Envoy proxy for it:
Go to YouTube-Uploader-Server and run follow command (This command bluid a dockerfile from envoy.yml):

```
docker build -t youtube-uploader-server/envoy -f ./envoy.Dockerfile .
```

Run Docker for envoy proxy with follow command

```
docker run -d -p 8080:8080 --network=host youtube-uploader-server/envoy
```

### Running Server from SH
Just go to YouTube-Uploader-Server and run follow command:

```
sh StartServer.sh
```
