var http = require("http");
var express = require('express');
var router = express.Router();

port = 8081;

console.log("Starting up server...");

startServer();



function startServer() {
  http.createServer((req, res) => {
    //set up authorization level
    res.setHeader('Access-Control-Allow-Origin', '*');

    //handle POST & GET requests
    if (req.method == "POST") {
      handlePost(req, res);
    } else if (req.method == "GET") {
      handleGet(req, res);
    } else if (req.method == "PUT") {
      handlePut(req, res);
    } else if (req.method == "HEAD") {
      handleHead(req, res);
    } else if (req.method == "DELETE") {
      handleDelete(req, res);
    } else if (req.method == "PATCH") {
      handlePatch(req, res);
    } else if (req.method == "OPTIONS") {
      handleOptions(req, res);
    } else {
      handleOther();
    };
  }).listen(port); //the server object listens on port 8081
  //http://localhost:8081
  console.log("Server listening on port " + port)
};



function handlePost(req, res) {
  console.log("post");
};



function handleGet(req, res) {
  console.log("get");
  res.writeHead(200, {outcome: "success"});
  res.write("Connected successfully to Server");
  res.render('<html><body><h1>Hello World</h1></body></html>');
  res.end();
};



function handlePut(req, res) {
  console.log("put");
};



function handleHead(req, res) {
  console.log("head");
};



function handleDelete(req, res) {
  console.log("delete");
};



function handlePatch(req, res) {
  console.log("patch");
};



function handleOptions(req, res) {
  console.log("options");
};



function handleOther(req, res) {
  console.log("other");

  res.writeHead(404, {outcome: 'Failure: Resource not found'});
  return res.end();
};
