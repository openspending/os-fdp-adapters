/**
 * Created by wk on 5/30/16.
 */
var http = require("http");
var url = require("url");

function start(route, handle) {
    function onRequest(request, response) {
        var pathname = url.parse(request.url).pathname;

        var temp  = pathname.substring(0,pathname.length-1).substring(2);
        var postData = temp;

        var path = "/"
        if(pathname!='/favicon.ico'){
            var date = new Date();
            console.log(date.toISOString()+": Request for " + pathname + " received.");
        }
        //console.log("Request for " + pathname + " received.");
        route(handle, path, response, request, postData);
    }

    http.createServer(onRequest).listen(8888);
    var date = new Date();
    console.log(date.toISOString()+": Server has started.");
}

exports.start = start;