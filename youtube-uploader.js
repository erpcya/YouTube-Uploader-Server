var PROTO_PATH = __dirname + '/protos/youtube-uploader.proto';
var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var protoLoader = grpc.loadPackageDefinition(packageDefinition).uploader;
const { createClient } = require("webdav");
const fileSystem = require('fs');

const client = createClient(
    process.env.WEBDAV_URL,
    {
        username: process.env.WEBDAV_USER,
        password: process.env.WEBDAV_PSK
    }
);
//  Local Database for match uploaded fileData
var databse = require('node-localdb');
var media = databse('/tmp/media.json');

//  Default list
var fileList = [{
  filename: '',
  basename: '',
  lastmod: '',
  size: '',
  type: '',
  mime: '',
  title: '',
  description: '',
  keywords: ''
}];

/**
 * Implements the SayHello RPC method.
 */
function requestUpload(call, callback) {
  const {PythonShell} = require('python-shell');
  console.log(call.request.clientname + ": Upload Requested");
  if(call.request.filename) {
    client
       .getFileContents(call.request.filename)
       .then(contents => {
        fileSystem.writeFile(process.env.LOCAL_TMP_DIRECTORY + "/" + call.request.basename, contents, (err) => {
           if (err) {
              console.log(call.request.clientname + ": Error: " + err);
              callback(null, {message: "Error Upload: " + err});
           } else {
             console.log(call.request.clientname + ": The file has been saved!");
             let options = {
               mode: 'text',
               pythonPath: process.env.PYTHON_PATH,
               pythonOptions: ['-u'], // get print results in real-time
               scriptPath: process.env.SCRIPT_PATH,
               args: ['--file=' + process.env.LOCAL_TMP_DIRECTORY + '/' + call.request.basename,
                '--title="' + call.request.title + '"',
                '--description="' + call.request.description + '"',
                '--keywords="' + call.request.keywords + '"', '--category="22"', '--privacyStatus=private']
             };
             //  Run it
             PythonShell.run(process.env.SCRIPT_NAME, options, function (err, results) {
               if (err) {
                 console.log(call.request.clientname + ": Error: " + err);
                 callback(null, {message: "Error Upload: " + err});
               } else {
                 fileSystem.unlink(process.env.LOCAL_TMP_DIRECTORY + "/" + call.request.basename, contents, (err) => {
                   if (err) {
                     console.log(call.request.clientname + ": Error: " + err);
                     callback(null, {message: "Error Deleting Tmp file: " + err});
                   } else {
                     callback(null, {message: "Uploaded"});
                   }
                 });
               }
             });
           }
         });
       })
       .catch(err => callback(null, {message: err}));
  } else {
    console.log(call.request.clientname + ": Mandatory File Name");
  }
}

/**
* request file from server
*/
function requestFileList(call, callback) {
  var fileName = process.env.WEBDAV_BASE_FOLDER;
  if(call.request.filename) {
    fileName = call.request.filename;
  }
  client
      .getDirectoryContents(fileName)
      .then(contents => {
            verifycontents(contents);
            fileList = contents;
            console.log(call.request.clientname + ": List Downloaded");
            callback(null, {fileList});
      });
}

/**
* Make a match with DB
*/
function verifycontents(contents) {
  for(var i = 0; i < contents.length; i++) {
    media.findOne({filename: contents[i].filename}).then(function(u){
      console.log("Encontrado: " + u);
    });
    console.log("Epa: " + contents[i].filename);
  }
}

/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
function main() {
  var server = new grpc.Server();
  server.addService(protoLoader.YouTubeFileUploader.service,
    {
      requestUpload: requestUpload, requestFileList: requestFileList
    }
  );
  server.bind(process.env.SERVER_HOST, grpc.ServerCredentials.createInsecure());
  server.start();
}

main();
