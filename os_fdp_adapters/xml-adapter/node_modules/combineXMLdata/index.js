/**
 * Created by wk on 5/30/16.
 */
var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
//handle["/"] = requestHandlers.start;
//handle["/favicon.ico"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
handle["/show"] = requestHandlers.show;
handle["/xmlload"] = requestHandlers.xmlload;
//handle["/showxml2json"] = requestHandlers.showxml2json;
handle["/showtraverse"] = requestHandlers.showtraverse;
handle["/addNewPage"] = requestHandlers.addNewPage;
handle["/"] = requestHandlers.realfunction;

server.start(router.route, handle);

function addPage(pageName){
    handle["/"+pageName] = requestHandlers.addNewPage;
}

