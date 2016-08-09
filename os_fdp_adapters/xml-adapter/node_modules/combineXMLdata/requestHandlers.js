/**
 * Created by wk on 5/30/16.
 */
var fs = require("fs");
var traverse = require('traverse');
var parser = require('xml2json');
var formidable = require("formidable");
var sync = require('synchronize');
function start(response) {
    console.log("Request handler 'start' was called.");
    var body = '<html>'+
        '<head>'+
        '<meta http-equiv="Content-Type" content="text/html; '+
        'charset=UTF-8" />'+
        '</head>'+
        '<body>'+
        '<label>This is the first page</label><br/>'+
        '<label>For upload xml</label><br/>'+
        '<label>After upload , click upload</label><br/>'+
        '<form action="/upload" enctype="multipart/form-data" '+
        'method="post">'+
        '<input type="file" name="upload" multiple="multiple">'+
        '<input type="submit" value="for test xml input" />'+
        '</form>'+
        '<br/>'+
        '<hr>'+
        '<script type="text/javascript">'+
        'if (window.File && window.FileReader && window.FileList && window.Blob) {'+
        '/*alert(\'support\')*/'+
        '} else {'+
        'alert(\'The File APIs are not fully supported in this browser.\');'+
        '}</script>'+
        '<form action="/xmlload" enctype="multipart/form-data" '+
        'method="post">'+
        '<input type="file" id="files" name="files[]" multiple="multiple" hidden>'+
        '<output id="list"></output>'+
        '<script>'+
        'function handleFileSelect(evt) {'+
        '       var files = evt.target.files; '+
        '       console.log(files);'+
        '       var output = [];'+
        '       for (var i = 0, f; f = files[i]; i++) {'+
        '           output.push(\'<li><strong>\', escape(f.name), \'</strong> (\', f.type || \'n/a\', \') - \','+
        '               f.size, \' bytes, last modified: \','+
        '               f.lastModifiedDate.toLocaleDateString(), \'</li>\');'+
        '       }'+
        '       console.log(output);'+
        '       document.getElementById(\'list\').innerHTML = \'<ul>\' + output.join(\'\') + \'</ul>\';'+
        '   }'+
        ''+
        '   document.getElementById(\'files\').addEventListener(\'change\', handleFileSelect, false);'+
        '</script>'+
        '<input type="submit" value="for test link jump" />'+
        '</form>'+
        '</body>'+
        '</html>';
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}

function upload(response, request) {
    console.log("Request handler 'upload' was called.");
    var form = new formidable.IncomingForm();
    console.log("about to parse");
    form.parse(request, function(error, fields, files) {
        console.log("parsing done");
        fs.renameSync(files.upload.path, "/tmp/test.xml");
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write("received data:<br/>");
        response.write("<a href='/showxml2json'>show xml2json</a>");
        response.write("<br/>");
        response.end();
    });
}
function xmlload(response, request) {
    var xml = "<foo>bar</foo>";
//console.log(xml);
    var json = parser.toJson(xml); //returns a string containing the JSON structure by default
//console.log(json);
    var form = new formidable.IncomingForm();
    console.log("about to parse");
    form.parse(request, function(error, fields, files) {
         console.log("parsing done");
//console.log(files);
//console.log(files.upload);
//console.log(files.upload.path);
         fs.renameSync(files.upload.path, "/tmp/test.xml");
         response.writeHead(200, {"Content-Type": "text/html"});
         response.write("received data:<br/>");
         response.write(json);
         //response.write("<img src='/show' />");
         //response.write("<lable>test</lable>")
         response.end();
    });
}
function readFiles(dirname, onFileContent, onError){
    fs.readdir(dirname,function(err,filenames) {
        if(err){
            onError(err);
            return;
        }
        filenames.forEach(function(filename) {
            fs.readFile(dirname+filename,'utf-8', function(err, content){
                if(err){
                    onError(err);
                    return;
                }
                onFileContent(filename,content);
            });
        });
    });
}

function show(response) {
    console.log("Request handler 'show' was called.");
    fs.readFile("/tmp/test.xml", "binary", function(error, file) {
        if(error) {
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write(error + "\n");
            response.end();
        } else {
            response.writeHead(200, {"Content-Type": "text/html"});
            var json = parser.toJson(file); //returns a string containing the JSON structure by default
            var leaves = traverse(json).reduce(function (acc, x) {
                if (this.isLeaf) acc.push(x);
                return acc;
            }, []);
//console.dir(leaves);
            response.write(json);
            response.end();
        }
    });
}

function showxml2json(response,request,postData) {
    console.log("Request handler 'show' was called.");
    fs.readFile("/tmp/test.xml", "binary", function(error, file) {
        if(error) {
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write(error + "\n");
            response.end();
        } else {
            response.writeHead(200, {"Content-Type": "text/html"});
            console.log("trasform from xml to JSON: start");
            var json = parser.toJson(file); //returns a string containing the JSON structure by default
            console.log("trasform from xml to JSON: end");
            //console.log(json);
            var leaves = traverse(json).reduce(function (acc, x) {
                if (this.isLeaf) acc.push(x);
                return acc;
            }, []);
            var treatJS = treatJson(json);

            var splithtml = json.split(/{/);
            var replace1 = json.replace(/{/g,"<td>");
            var replace2 = replace1.replace(/}/g,"</td>");
            //var replace2 = replace1.replace(/,/g,",<br/>");
            //var splithtml = json.split(/\".*\"{1}/g);
            var res = '';
            for (var i = 0; i < splithtml.length ; i ++){
                if(splithtml[i].indexOf("}")>0){
                    var temp ="<br/>node:{"+splithtml[i].replace("}","");
                    var temp2 = temp.substring(5);
                    var temp3 = temp2.split(",");
                    res+=(temp+"<br/>");
                    for (var j = 0; j < temp3.length ; j ++){
                        //res+=("<br/>    preoperties:"+temp3[j]);
                    }
                }
            }
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write("received data:<br/>");
            var func =
                '<script type="text/javascript">'+
                'function showButton(id){' +
                '   if(document.getElementById(id).style.display=="block"){' +
                '       document.getElementById(id).style.display="none"' +
                '   } else {' +
                '       document.getElementById(id).style.display="block";' +
                '   }'+
                '}'+
                '</script>';

            response.write(func);
            for (var i = 0 ; i<treatJS.length; i ++){
                response.write("<input type = 'button' onclick='showButton(\"toc"+i+"\")' value = data"+i+">");
                response.write("<div id=\"toc"+i+"\" hidden>");
                response.write("<table style=\"width:100%\">");
                for (var j = 0; j < treatJS[i].length; j++){
                    //response.write(treatJS[i][j].datablock+"<br/>");
                    //console.log("treatJS["+i+"]["+j+"]"+treatJS[i][j].datablock);
                    //var htmlLine = JSONtoCSV(treatJS[i][j]);
                    var htmlLine = JSONtoHTML(treatJS[i][j]);
                    response.write(htmlLine);
                }
                response.write("</table>");
                response.write("</div>");
                response.write("<br/>");
            }
            //response.write("<img src='/show' />");
            //response.write("<lable>test</lable>")
            response.end();
        }
    });

}

function showtraverse(response) {
    console.log("Request handler 'show' was called.");
    fs.readFile("/tmp/test.xml", "binary", function(error, file) {
        if(error) {
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write(error + "\n");
            response.end();
        } else {
            response.writeHead(200, {"Content-Type": "text/html"});
            var json = parser.toJson(file); //returns a string containing the JSON structure by default
            //console.log(json);
            var leaves = traverse(json).reduce(function (acc, x) {
                if (this.isLeaf) acc.push(x);
                return acc;
            }, []);
            //console.dir(leaves);
//console.log(typeof (leaves));
            var res = JSON.stringify(leaves);
            response.write(json);
            response.end();
        }
    });
}
function buildHtmlTable(selector) {
    var columns = addAllColumnHeaders(myList, selector);
    for (var i = 0 ; i < myList.length ; i++) {
        var row$ = $('<tr/>');
        for (var colIndex = 0 ; colIndex < columns.length ; colIndex++) {
            var cellValue = myList[i][columns[colIndex]];
            if (cellValue == null) { cellValue = ""; }
            row$.append($('<td/>').html(cellValue));
        }
        $(selector).append(row$);
    }
}
function addAllColumnHeaders(myList, selector){
    var columnSet = [];
    var headerTr$ = $('<tr/>');
    for (var i = 0 ; i < myList.length ; i++) {
        var rowHash = myList[i];
        for (var key in rowHash) {
            if ($.inArray(key, columnSet) == -1){
                columnSet.push(key);
                headerTr$.append($('<th/>').html(key));
            }
        }
    }
    $(selector).append(headerTr$);
    return columnSet;
}
function treatJson( json ){
    //console.log("transform from JOSN to HTML:start");
    //var temp = json.indexOf("{");

    var patten = "$t";
    var str = json.replace("$t","description")
    //var str = json;
    var indices = [];
    for(var i=0; i<str.length;i++) {
        if (str[i] === "{") indices.push([i,"{"]);
        if (str[i] === "}") indices.push([i,"}"]);
        if (str[i] === "[") indices.push([i,"["]);
        if (str[i] === "]") indices.push([i,"]"]);
    }

    //},"
    //:{    -> : {<br/>
    var temp1 = json.replace(/:{/g,": {<br/>");
    //","    -> ",<br/>"
    var temp2 = temp1.replace(/\",\"/g,"\",<br/>\"");
    //},"  -> "<br/>},<br/>"
    var temp3 = temp2.replace(/},\"/g,"},<br/>\"");
    //"}    -> "<br/>}
    var temp4 = temp3.replace(/\"}/g,"\"<br/>}");
    //":[{" -> ":[<br/>{<br/>"
    var temp5 = temp4.replace(/\:\[{/g,":[<br/>{<br/>");
    //]     -> "]<br/>
    var temp6 = temp5.replace(/]/g,"]<br/>");
    //}}     -> "}<br/>}
    var temp7 = temp6.replace(/}\}/g,"}<br/>}");
    //},{    -> },<br/>{<br/>
    var temp8 = temp7.replace(/},{/g,"},<br/>{<br/>");
    //}]     -> }<br/>]
    var temp9 = temp8.replace(/}]/g,"}<br/>]");
    //}}     -> "}<br/>}
    var temp10 = temp9.replace(/}\}/g,"}<br/>}");
    var temp11 = temp10.split("<br/>");
    var temp12;
    var temp13=[];
    var indentation = 0;

    var prefix=[];
    var data=[];
    var line=[];
    for(var i=0; i<temp11.length;i++) {
        if(temp11[i].indexOf("{")>-1){
            temp12+=buildIndentation(indentation)+indentation+temp11[i]+"<br/>";
            ele={};
            ele["indentation"] = buildIndentation(indentation)+indentation;
            ele["line"] = temp11[i];
            temp13.push(ele);
            //temp13[i]=buildIndentation(indentation)+indentation+temp11[i]+"<br/>";
            indentation++;
        }else if(temp11[i].indexOf("}")>-1){
            temp12+=buildIndentation(indentation)+indentation+temp11[i]+"<br/>";
            ele={};
            ele["indentation"] = buildIndentation(indentation)+indentation;
            ele["line"] = temp11[i];
            temp13.push(ele);
            //temp13[i]=buildIndentation(indentation)+indentation+temp11[i]+"<br/>";
            indentation--;
        }else if(temp11[i].indexOf("[")>-1){
            temp12+=buildIndentation(indentation)+indentation+temp11[i]+"<br/>";
            ele={};
            ele["indentation"] = buildIndentation(indentation)+indentation;
            ele["line"] = temp11[i];
            temp13.push(ele);
            //temp13[i]=buildIndentation(indentation)+indentation+temp11[i]+"<br/>";
            indentation++;
        }else if(temp11[i].indexOf("]")>-1){
            temp12+=buildIndentation(indentation)+indentation+temp11[i]+"<br/>";
            ele={};
            ele["indentation"] = buildIndentation(indentation)+indentation;
            ele["line"] = temp11[i];
            temp13.push(ele);
            //temp13[i]=buildIndentation(indentation)+indentation+temp11[i]+"<br/>";
            indentation--;
        }else{
            temp12+=buildIndentation(indentation)+indentation+temp11[i]+"<br/>";
            ele={};
            ele["indentation"] = buildIndentation(indentation)+indentation;
            ele["line"] = temp11[i];
            temp13.push(ele);
            //temp13[i]=buildIndentation(indentation)+indentation+temp11[i]+"<br/>";
        }
    }
//console.log("transform log");
//console.log(temp13);
//console.log("transform log");
    var datas = [];
    var dataflag = false;
    for(var i=0; i<temp13.length;i++) {
        if(temp13[i].line.indexOf("[")>-1){
            if(dataflag == false){
                data.push(temp13[i]);
//console.log("################################a new block#################################################################");
//console.log("first line#########"+ temp13[i].line + " at line " + i);
            } else{
//console.log("################################delete a block#################################################################");
//console.log("because of" + temp13[i].line + " at line " + i);
                for (var idx in data){
                    prefix.push(data[idx]);
                    //console.log("data to prefix#########");
                }
                data.length = 0;
                data.push(temp13[i]);
//console.log("first line after delete#########"+ temp13[i].line + " at line " + i);
            }
            dataflag = true;
        } else if ((temp13[i].line.indexOf("]")>-1) && (dataflag == true)){
            data.push(temp13[i]);
            dataflag = false;
//console.log("################################end of a block#################################################################");
//console.log("because of" + temp13[i].line + " at line " + i);
            //remove duplicate
            var cleanedPrefix = cleanPrefix(prefix);
//console.log("-------------cleanedPrefix start-----------");
//console.log(cleanedPrefix);
//console.log("-------------cleanedPrefix end-------------");
            //if this prefix is already exist ,return index
            //var index = checkPrefix(datas, cleanedPrefix);

            var index = -1;
            var simpledataFlag = false;
            if(checkSimpleData(data)){
                simpledataFlag=true;
//console.log("this is a simple data");
            }
            index = findSameTitle(datas, cleanedPrefix, data, simpledataFlag);
            //console.log("datas "+datas.length);
            //console.log("same title at "+index);
//console.log("-------------index is "+index+"-------------");
            //prefix is same ,
            if(index>=0){
                //check data title , return data title length
                //var dataLength = checkData(datas[index],cleanedPrefix, data);
                //prefix exist, and data title is same , add to exist
                //console.log("add data to index "+index)
                var dataBlock = addDataToExist(cleanedPrefix, datas[index], data, simpledataFlag);
                var ele = {};
                ele["prefix"] =dataBlock[0];
                ele["datablock"]=dataBlock;
                if(simpledataFlag==true){
                    ele["simple"]=true;
                }
//console.log("update data " + index);
                datas[index] = ele;
                /*
                //data title is same
                if (dataLength>0) {
                    //prefix exist, and data title is same , add to exist
                    var dataBlock = addDataToExist(cleanedPrefix, datas[index], data);
                    var ele = {};
                    ele["prefix"] =dataBlock[0];
                    ele["datablock"]=dataBlock;
                    console.log("update data " + index);
                    datas[index] = ele;
                }else{
                    //prefix exist, but data title is different, make new block
                    var dataBlock = treatData(cleanedPrefix, data);
                    var ele = {};
                    ele["prefix"] =dataBlock[0];
                    ele["datablock"]=dataBlock;
                    console.log("add a new data to datas with number"+ datas.length);
                    datas.push(ele);
                }
                */
            }
            //prefix is different
            else {
                //prefix is not exist, make new block
                var dataBlock = treatData(cleanedPrefix, data, simpledataFlag);
                var ele = {};
                ele["prefix"] =dataBlock[0];
                ele["datablock"]=dataBlock;
                if(simpledataFlag==true){
                    ele["simple"]=true;
                }else{
                    ele["simple"]=false;
                }

//console.log("-------------dataBlock start-----------");
//console.log(dataBlock);
//console.log("-------------dataBlock end-------------");

//console.log("add a new data to datas with number"+ datas.length);
                datas.push(ele);
            }
            data.length = 0;
        } else if ( dataflag == true ){
//console.log("line " + i +"add to data");
            data.push(temp13[i]);
        } else if (dataflag == false){
//console.log("line " + i +"add to prefix");
            prefix.push(temp13[i]);
        }
    }
    var res = [];
    for(var i = 0; i< datas.length ; i++){
        res.push(datas[i].datablock);

    }

    var result = cleanResult(res);
    var mergedResult = mergeFinal(result);
    return mergedResult;
}

function reduceColumn(column, outputColumnNumber){
    var res = [];
    for (var i = 0; i < outputColumnNumber.length; i++){
        res.push(column[outputColumnNumber[i]]);
    }

    return res;
}


function checkTitle(title1, title2){

    var mark = false;

    if(title1.length==title2.length){

        for(index in title1){
            if( title1[index].att==title2[index].att){
                mark=true;
                continue;

            }else{
                mark=false;
                break;
            }
        }
    }
    return mark;
}

function mergeFinal(tables){
    //console.log("mergeFinal start");

    if(tables.length == 1){
        return tables;
    }

    var res = [];
    var mergedTable=[];
    var mergeToTable=[];

    //step 1
    //delete useless column(output==false)
    for (var i = 0; i < tables.length; i++){
        var outputColumnNumber=[];
        var outputColumns=[];
        var title = tables[i][0];

        //get out useful column , put into outputColumnNumber array
        for(var index=0; index < title.length; index++){
            if(title[index].output){
                outputColumnNumber.push(index);
            }
        }
        for(index in tables[i]){

            outputColumns.push(reduceColumn(tables[i][index],outputColumnNumber));
        }

        res.push(outputColumns);
    }


    //step2
    //merge same title tables
    for (var i = 0; i < res.length; i++){
        if(mergedTable.length>0 && mergedTable.indexOf(i)>-1){
            //console.log("merged before");
            continue;
        }
        var title = res[i][0];

        for (var j = i+1; j < res.length; j++){
            //this table merged by privious
            if(mergedTable.length>0 && mergedTable.indexOf(j)>-1){
                //console.log("merged before");
                continue;
            }

            //merge
            var anotherTitle = res[j][0];

            var mergeMark=checkTitle(title,anotherTitle);

            //check title, if same, set merge mark = true
            if(mergeMark==false){
                continue;
            }else{
                mergedTable.push(j);
                mergeToTable.push([j,i])
            }

            //if merge mark = true, then merge
            if(mergeMark==true){
                for (var index = 1 ; index < res[j].length; index++ ){
                    //build row
                    var tempRow = res[i].slice(0);
                    tempRow.push(res[j][index]);
                    res[i]=tempRow;
                }

                //console.log("merge them");
            }else{
                continue;
            }
        }
        //var title = treatJS[i][0]

        //console.log(title);


    }

//    console.log("mergedTable"+mergedTable);
//    console.log("mergeToTable"+mergeToTable);

    //get out non-empty tables
    var result=[];

    for(var i = 0; i < res.length; i ++){
        if(mergedTable.indexOf(i)==-1){
            result.push(res[i]);
        }
    }

//    console.log("mergeFinal end");
    return result;
}


function cleanResult(res){
    var resCopy = res.slice(0);
    var uselessArray = [];
    uselessArray.push(": {");
    uselessArray.push(":[");
    uselessArray.push("-");
    uselessArray.push(" ");
    uselessArray.push("");
    for(var idx=0; idx<res.length; idx++){
        //console.log("happend at "+ idx);
        var data = res[idx];
        var titleLine = data[0].slice(0);
        var associativeArray = {};
        for (var i = 0; i < titleLine.length; i++){

            if(Object.keys(associativeArray).indexOf(titleLine[i].att)>-1)　{
                associativeArray[titleLine[i].att]++;
            }else {
                associativeArray[titleLine[i].att]=1;
            }

            if(Object.keys(associativeArray).indexOf(titleLine[i].att)>-1)　{
                if(associativeArray[titleLine[i].att]>1){
                    titleLine[i].val = titleLine[i].att +　associativeArray[titleLine[i].att];
                }

            }
        }

        //console.log("data[0].length" + data[0].length);
        //console.log("data.length" + data.length);

        for(var i = 0; i < data.length ; i++){
            //console.log("data["+i+"].length" + data[i].length);
        }

        //i is column
        for(var i = 0; i < data[0].length ; i++){
            //j is row
            for(var j = 1; j < data.length ; j++){

                //console.log("data["+j+"]["+i+"]="+data[j][i]);
                //console.log("data["+j+"]["+i+"].att="+data[j][i].att);
                //console.log("data["+j+"]["+i+"].val="+data[j][i].val);
                //console.log("uselessArray.indexOf(data["+j+"]["+i+"].val)="+uselessArray.indexOf(data[j][i].val));
                if((uselessArray.indexOf(data[j][i]))!=undefined){
                    if(uselessArray.indexOf(data[j][i].val)!=undefined){
                        if(uselessArray.indexOf(data[j][i].val)==-1){
                            titleLine[i]["output"]=true;
                            break;
                        }else {
                            titleLine[i]["output"]=false;
                        }
                    }
                }


            }
//console.log("log is"+titleLine[i]["output"]);
        }
        resCopy[idx][0]=titleLine;
    }
    return resCopy;
}
function buildIndentation(index){
    //var strindent = '----';
    var strindent = '';
    var temp = index;
    var res="";
    while(temp >0){
        res+=strindent;
        temp--;
    }
    //console.log("transform from JOSN to HTML:end");
    return res;
}

function addNewPage(response,request, postdata){
//console.log("postData is " +postdata);
//console.log(typeof(postdata));
//console.log("addNewPage");
    response.write(postdata);
    response.end;
}


//this function is mainly work on the data(detect by other function)
//if the datas are regular (same format or same construction)
//if the data is single (without a brother leaf)
//if the data is irregular(different from each other)
function treatData(prefix,data ,simpledataFlag){
//console.log("build datablock:start");
//console.log("entered prefix");
//console.log(prefix);
//console.log("entered prefix");
//console.log("entered data");
//console.log(data);
//console.log("entered data");
    var title = []
    var rows = [];
    var rowPrefix = prefix.slice(0);
    var dataStack = [];


    //copy prefix
    for(idx in prefix){
        var ele = {};
        ele={};
        ele["indentation"] = prefix[idx].indentation;
        ele["att"]= cleanValue(prefix[idx].att);
        ele["val"]= cleanValue(prefix[idx].att);
        title.push(ele);
    }

    var count = 0;
    var pieceOfDataFlag = 0;
    var rowItemCount = 0;
    var inRowFlag = false;
    var tempTitle = [];

    //data is not a simple data
    if(simpledataFlag==false){

        //this loop determains title
        for(var i = 0 ; i < data.length; i++) {

            //for some data has attribute
            var splitPoint = data[i].line.indexOf(":");

            //detect a start
            if (data[i].line.indexOf("{") > -1) {
                if (pieceOfDataFlag == 0) {
//console.log("start of a piece of data");
                    dataStack.length = 0;
                    count++;
                }
                pieceOfDataFlag++;
                inRowFlag = true;
            }

            //detect an end
            if (data[i].line.indexOf("}") > -1) {
                pieceOfDataFlag--;
                inRowFlag = false;
            }

            //split attribute
            if (splitPoint > -1) {
                var att = data[i].line.substring(0, splitPoint);
                var val = data[i].line.substring(splitPoint + 1);
                if (count == 1) {
                    ele = {};
                    ele["indentation"] = "";
                    ele["att"] = cleanValue(att);
                    ele["val"] = cleanValue(att);
//console.log("add an element to title: "+ att);
                    title.push(ele);
                    tempTitle.push(ele);
                }
                else if(count>1){
                    break;
                }
            }
        }

        pieceOfDataFlag=0;

        //this loop determains data
        for(var i = 0 ; i < data.length; i++){

            //for some data has attribute
            var splitPoint = data[i].line.indexOf(":");

            //detect a start
            if(data[i].line.indexOf("{")>-1){
                if(pieceOfDataFlag==0){
//console.log("start of a piece of data");
                    dataStack.length = 0;
                    count++;
                }
                pieceOfDataFlag++;
                inRowFlag=true;
            }

            //detect an end
            if(data[i].line.indexOf("}")>-1){
                pieceOfDataFlag--;
                inRowFlag=false;
            }
            //split attribute
            if (splitPoint > -1) {
                var att = data[i].line.substring(0, splitPoint);
                var val = data[i].line.substring(splitPoint + 1);

                var temp = val;
                //delete useless comma
                if(temp.substring(val.length-1)==","){
                    temp = temp.substring(0,val.length-1);
                }
                //mark useless column
                if(temp.substring(val.length-1)=="{"){
                    temp = "-";
                }

                //not first row
                if(rows.length >1){
                    /*
                    //normal branch,
                    if(tempTitle.length>rowItemCount){
                        if(tempTitle[rowItemCount].att==att){
                            //usual case, all same
                            //add an element
                            ele={};
                            ele["indentation"] = data[i].indentation;
                            ele["att"]=cleanValue(att);
                            ele["val"]=cleanValue(temp);
                            dataStack.push(ele);
                        }else{
                            //unusual case, row item is different from title at[rowItemCount]
                            //temproary :omit this item, keep title
                            ele={};
                            ele["indentation"] = tempTitle[rowItemCount].indentation;
                            ele["att"]=tempTitle[rowItemCount].att;
                            ele["val"]="-";

                            rowItemCount--;
                        }
                    }else{
                        //this branch means, rows has more column than title
                    }
                    */

                    ele={};
                    ele["indentation"] = data[i].indentation;
                    ele["att"]=cleanValue(att);
                    ele["val"]=cleanValue(temp);
                    dataStack.push(ele);

                }

                //very first row, always same as title
                else{
                    ele={};
                    ele["indentation"] = data[i].indentation;
                    ele["att"]=cleanValue(att);
                    ele["val"]=cleanValue(temp);
                    dataStack.push(ele);
                }
                rowItemCount++;

                //the new build row, has length smaller than the last row in [rows]-[prefix]
                if(rows.length>1 && rowItemCount<=(rows[rows.length-1].length-prefix.length)){
                    //the last row in [rows],the element of index of [new build last] not equal to new build row's last
                    if(rows[rows.length-1][prefix.length+rowItemCount-1].att!=att){
//console.log("not same");
//console.log(rows[rows.length-1][prefix.length+rowItemCount-1]);
//console.log(att);
                    }else{
//console.log("same");
//console.log(rows[rows.length-1][prefix.length+rowItemCount-1]);
//console.log(att);
                    }
                }else{
                    //rowItemCount--;
                }
            }

            //piece of data finish, attach to rows
            //console.log("pieceOfDataFlag = "+pieceOfDataFlag);
            if(data[i].line.indexOf("}")>-1 && (pieceOfDataFlag==0)){
//console.log("end of a piece of data")
                var temp = prefix.slice(0);
//console.log("sepecial treat");
//console.log(prefix);
//console.log("sepecial treat");
                //console.log(tempTitle);
                //console.log(dataStack);
                var tempData = adaptDataToTitle(tempTitle,dataStack);
                //console.log(tempData);

                for (idx in tempData){
                    temp.push(tempData[idx]);
                }
                var row = temp;
                rowItemCount=0;
                //console.log("row-----"+row.length);
                rows.push(row);
            }
        }

        //attach title to the first row
        //console.log("title-----"+title.length);

        rows.unshift(title);
    }
    //this is for simple/single data
    else{
        for(var i = 0 ; i < data.length; i++){
            var splitPoint = data[i].line.indexOf(":");
            if(splitPoint>-1){
                var att = data[i].line.substring(0,splitPoint);
                var val = data[i].line.substring(splitPoint);
            }
            else{
                var att = data[i].line;
                var val = data[i].line;
            }
            ele={};
            ele["indentation"] ="";

            ele["att"]=cleanValue(att);
            ele["val"]=cleanValue(val);
            title.push(ele);
        }
        rows.push(title);
    }
//console.log("build datablock:end");
    return rows;
}


function adaptDataToTitle(title, data){
    var res=[];
    var sameMark=true;

    if(title.length==data.length){
        for(var i = 0; i < title.length; i++){
            if(title[i].att!=data[i].att){
                sameMark=false;
            }
        }
    }else{
        sameMark=false;
    }

    //same structure, change nothing, return directly
    if(sameMark==true){
        return data;
    }

    //title is fix,
    //data shorter?
    //data longer?
    //data different?
    var index = [];
//console.log("--------------")
    if(sameMark==false){
        var tempTitle = title.slice(0);

        for(var i = 0; i <tempTitle.length; i++){
            //console.log("i= "+i);
            //console.log("title "+title[i]);
            var temp = tempTitle.slice(i,i+1);
            //var ele = temp[0];

            var att = temp[0].att;
            var val = temp[0].val;

            var changed=false;
            var ele = {};
            //search att in data, replace val in ele
            for (var j = 0; j < data.length ; j ++){
                //grab same attribute , this attribute must not used before.
                /*
                console.log("data[j].att "+data[j].att);
                console.log("ele.att "+ele.att);
                console.log("ele.val before "+ ele.val);
                console.log("data[j].att == ele.att "+(data[j].att == ele.att));
                console.log("index.indexOf(j)"+index.indexOf(j))
                */
                if(data[j].att == att && index.indexOf(j)==-1){

                    var ele = {};
                    ele["att"] = att;
                    ele["val"] = data[j].val;
                    index.push(j);
                    changed = true;
                    break;
                }else{
                    change = false;
                }
            }

            if(changed==false){
                var ele = {};
                ele["att"] = att;
                ele["val"] = "-";
            }
            res.push(ele);
        }
    }

    return res;
}

function JSONtoCSV(inputCSV, title){
    var res = "";
    res+="";
    for(idx in inputCSV){
        if(title[idx].output==true){
            res+=inputCSV[idx].val;
            if(res.substring(res.length-1)==","){
            }else {
                res+=",";
            }
        }
    }
    res = res.substring(0,res.length-1);
    res+="<br/>";
    return res;
}

function cleanValue(aValue){
    var res="";
    var heading="";
    var tail="";

    if(aValue.slice(aValue.length-1)==","){
        tail = aValue.slice(0,aValue.length-1);
        res = tail;
    }else if(aValue.slice(aValue.length-1)=="]"){
        tail = aValue.slice(0,aValue.length-1);
        res = tail;
    }else{
        tail = aValue;
        res = aValue;
    }


    if(aValue.slice(0,2)==":["){
        heading = tail.slice(2,tail.length);
        res=heading;
    }else if(aValue.slice(0,2)==":{"){
        heading = tail.slice(2,tail.length);
        res=heading;
    }else if(aValue.slice(0,1)=="{"){
        heading = tail.slice(1,tail.length);
        res=heading;
    }else if(aValue.slice(0,1)=="["){
        heading = tail.slice(1,tail.length);
        res=heading;
    }else if(aValue.slice(0,1)==":"){
        heading = tail.slice(1,tail.length);
        res=heading;
    }else{
        res = tail;
    }

    //console.log("in  "+ aValue);
    //console.log("out "+ res);
    return res;
}
function JSONtoConsoleCSV(inputCSV, title){
    var res = "";
    res+="";
    for(idx in inputCSV){
        if(title[idx].output==true){
            if(inputCSV[idx]==undefined){
                res+="wrong here";
            }else{
                res+=inputCSV[idx].val;
            }
            if(res.substring(res.length-1)==","){
            }else {
                res+=",";
            }
        }
    }
    res = res.substring(0,res.length-1);
    //res+="\n";
    return res;
}

function JSONtoConsoleCSVALL(inputCSV, title){
    var res = "";
    res+="";
    for(idx in inputCSV){
        if(1==1){
            if(inputCSV[idx]==undefined){
                res+="wrong here";
            }else{
                res+=inputCSV[idx].val;
            }
            if(res.substring(res.length-1)==","){
            }else {
                res+=",";
            }
        }
    }
    res = res.substring(0,res.length-1);
    //res+="\n";
    return res;
}


function debugValue(){

}
function JSONtoHTML(inputCSV, title){

    if(inputCSV.length!=title.length){
//console.log("lets see input one is wrong :"+inputCSV.length);
//console.log("lets see title one is wrong:"+title.length);
        for(indexA in inputCSV){
//console.log("inputCSV is "+inputCSV[indexA].att);
        }
        for(indexB in title){
//console.log("title is "+title[indexB].att);
        }
    }
    var res = "";
    res+="<tr>";
    for(idx in inputCSV){

        if(title[idx].output==true){
            res+="<td>";
            if(inputCSV[idx]==undefined){
                res+="wrong here";
            }else{
                res+=inputCSV[idx].val;
            }

            res+="</td>";
        }
    }
    res+="</tr>";
    return res;
}
function cleanPrefix(prefix){
//console.log("################################prefix to be clean#################################################################");
//console.log(prefix);
//console.log("################################prefix to be clean#################################################################");
    for(indexA in prefix){
        //console.log("before clean"+prefix[indexA].indentation+prefix[indexA].line);
    }
    var title = [];

    var startMark = 0;
    var endMark = 0;
    var startLine = 0;
    var endLine = 0;
    var startData = "";
    var part1 = [];
    var part2 = [];
    var res = [];
    //check from backward
    for(var i = prefix.length-1; i >3; i--){
//console.log("prefix["+i+"] is "+prefix[i].indentation+prefix[i].line);
        if((prefix[i].indentation-prefix[i-1].indentation)<=-1
            && (prefix[i-1].indentation-prefix[i-2].indentation)<=-1){
            endLine = i;
            startMark = prefix[i].indentation;
//console.log("here is a start mark with indentation =" + startMark);
            break;
        }
    }

    for(var i = endLine; i >3; i--){
        if(prefix[i].indentation==startMark){
            endMark++;
            if(endMark==2){
//console.log("here is an end mark with " + startMark);
                startLine=i;
                break;
            }
        }
    }
    if(prefix.indexOf(prefix[startLine])>0){
        //startLine=prefix.indexOf(prefix[startLine]);
    }
//console.log("startLine = "+startLine +"; endLine = "+ endLine);
    if(startLine<endLine) {
        part1 = prefix.slice(0, startLine);
        part2 = prefix.slice(endLine);
        for (idx in part2){
            part1.push(part2[idx]);
        }
//console.log("start another loop with length = " + part1.length);
        res = cleanPrefix(part1);
    }else {
//console.log("final loop with length = " + prefix.length);

        var ele={};
        for(var i = 0 ; i < prefix.length; i++){
            var splitPoint = prefix[i].line.indexOf(":");
            if (splitPoint>-1){
                var att = prefix[i].line.substring(0,splitPoint);
                var val = prefix[i].line.substring(splitPoint);

                if(val !=  ": {" && val !=":["){
                    ele={};
                    ele["indentation"] =prefix[i].indentation;
                    ele["att"]=att;
                    ele["val"]=val;
                    title.push(ele);
                }else {
                    ele={};
                    ele["indentation"] =prefix[i].indentation;
                    ele["att"]=att;
                    ele["val"]=val;
                    title.push(ele);
                }
            }
        }
        res = title;
    }

    for(indexA in res){
        //console.log("after clean"+res[indexA].indentation+res[indexA].line);
    }
    return res;
}

function checkPrefix(datas, prefix){
//console.log("checkPrefix start");
    for(idx in datas){

//console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
//console.log("prefix is " + prefix.length);
        for(indexA in prefix){
            //console.log(prefix[indexA].indentation+prefix[indexA].line);
        }
//console.log("datas[idx].prefi is " + datas[idx].prefix.length);
//console.log("----------------------------------------------------------------------------------------------------");
        for(indexB in datas[idx].prefix){
            //console.log(datas[idx].prefix[indexB].indentation+datas[idx].prefix[indexB].line);
        }
//console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
        if(datas[idx].prefix.length != prefix.length){
            //console.log("checkPrefix end: index is -1");
            return -1;
        }
        for(var i = 0 ; i < datas[idx].length; i++){
            if(datas[idx].prefix[i]!=prefix[i]){
                //console.log("checkPrefix end: index is -1");
                return -1;
            }
        }
//console.log("checkPrefix end: index is "+ idx);
        return idx;
    }

    return -1;
}
function findSameTitle(datas, prefix, comparedData, simpledataFlag){
//console.log("findSameTitle start");
    var title = prefix;

//console.log("title log start");
//console.log(title);
//console.log("title log end");

    var res;
    //console.log("datas length " +datas.length);
    for(var i = 0; i < datas.length; i++){
        //console.log("the "+i+" of datas");
        //log for compare title console.log("it is "+ i + "th data");
        res = true;
        if(datas[i].prefix.length < title.length){
            if(datas.length == 9||datas.length == 8) {
                //console.log("datas["+i+"].prefix.length="+datas[i].prefix.length +" is smaller than current cleaned title.length = "+title.length);
            }
            res = false;
            continue;
        }else{
            for(indexA in datas[i].prefix){

                if(datas.length == 9 || datas.length == 8) {
              //      console.log(datas[i].prefix[indexA].att);
                }
            }
            //console.log("data[i].prefix.length is "+datas[i].prefix.length);
            //console.log("-----------------")
            //console.log(title.length);
            for(indexB in title){

                if(datas.length == 9 || datas.length == 8) {

                    //console.log(title[indexB].att);
                }
            }
//            console.log("datas["+i+"].prefix.length="+datas[i].prefix.length +" is larger than current cleaned title.length = "+title.length);
        }

        for(idx in title){
            var cleanedValue = cleanValue((title[idx].att));
            if(cleanedValue != (datas[i].prefix[idx].att)){

                if(datas.length == 8||datas.length == 9) {
//console.log(title[idx].att+" and "+datas[i].prefix[idx].att + " are different");
                }
                res = false;
                break;
            }
            else{
                //console.log(title[idx].att+" and "+datas[i].prefix[idx].att + " are same");
                //console.log(res);
            }
        }
        if(res == true){
            //log for compare title console.log("findSameTitle : data "+ i +" has same title");
            resOfCheckData = checkData(datas[i],title.length, comparedData, simpledataFlag);
            //console.log(resOfCheckData);
            if(resOfCheckData>=0){
                //log for compare title console.log("findSameTitle : data "+ i +" has same data type");
                return i;
            }else if (resOfCheckData==-99){
                return -99;
            }
            //return i;
        }
    }
//console.log("findSameTitle end: Title different");
    return -1;
}


function addDataToExist(prefix, originalData, additionalData, simpledataFlag){
    var rowPrefix = prefix.slice(0);
    var dataStack = [];

//console.log("rowPrefix log start");
//console.log(rowPrefix);
//console.log("rowPrefix log end");
    var rows = originalData.datablock.slice(0);

    if(simpledataFlag == false){
        for(var i = 0 ; i < additionalData.length; i++) {
            var splitPoint = additionalData[i].line.indexOf(":");
            //var row =rowPrefix.slice(0);
            if (additionalData[i].line.indexOf("{") > -1) {
                dataStack.length = 0;
            }
            if (splitPoint > -1) {
                var att = additionalData[i].line.substring(0, splitPoint);
                var val = additionalData[i].line.substring(splitPoint+1);
                var temp = val.substring(1);
                if (temp.substring(val.length - 1) == ",") {
                    temp = temp.substring(0, val.length - 1);
                }
                ele = {};
                ele["indentation"] = additionalData[i].indentation;
                ele["att"] = cleanValue(att);
                ele["val"] = cleanValue(temp);
                dataStack.push(ele);
            }
            if(additionalData[i].line.indexOf("}")>-1){
                var temp = rowPrefix.slice(0);
                for (idx in dataStack){
                    temp.push(dataStack[idx]);
                }
                //var res = cleanPrefix(temp);
                var row = temp;
                rows.push(row);
            }
        }
    }else {
        for(var i = 0 ; i < additionalData.length; i++){
            var splitPoint = additionalData[i].line.indexOf(":");
            //        var row =rowPrefix.slice(0);

            if(splitPoint>-1){
                var att = additionalData[i].line.substring(0,splitPoint);
                var val = additionalData[i].line.substring(splitPoint+1);
            }
            else{
                var att = additionalData[i].line;
                var val = additionalData[i].line;
            }
            ele={};
            ele["indentation"] ="";
            ele["att"] = cleanValue(att);
            ele["val"] = cleanValue(val);
            rowPrefix.push(ele);
        }
        rows.push(rowPrefix);
    }
//console.log("add additional data end");
    return rows;
}
function checkSimpleData(comparedData){
    var dataStack = [];
    var dataTitle = [];
    var count = 0;
    for(var i = 0 ; i < comparedData.length; i++) {
        if (comparedData[i].line.indexOf("{") > -1) {
            count++;
            dataStack.length = 0;
        }
        var splitPoint = comparedData[i].line.indexOf(":");
        if (splitPoint > -1) {
            if (count == 1) {
                var att = comparedData[i].line.substring(0, splitPoint);
                ele = {};
                ele["indentation"] = "";
                ele["line"] = att;
                dataTitle.push(ele);
            }
        }
    }
    //this is a single data
    if(count == 0){
        for(var i = 0 ; i < comparedData.length; i++) {
            if (comparedData[i].line.indexOf("[") > -1) {
                //console.log("this data is a single data, has no title");
                count++;
                dataStack.length = 0;
            }
            var splitPoint = comparedData[i].line.indexOf(":");
            if (splitPoint > -1) {
                if (count == 1) {
                    var att = comparedData[i].line.substring(0, splitPoint);
                    ele = {};
                    ele["indentation"] = "";
                    ele["line"] = att;
                    dataTitle.push(ele);
                }
            }else{
                if (count == 1) {
                    var att = comparedData[i].line;
                    ele = {};
                    ele["indentation"] = "";
                    ele["line"] = att;
                    dataTitle.push(ele);
                }
            }
        }
        if (count == 1) {
            //console.log("this is a simple data");
            return true;
        }
    }
    return false;
}
function checkData(originalData, prefixLength, comparedData, simpledataFlag){
//console.log("checkData start");
//console.log("comparedData log");
//console.log(comparedData);
//console.log("comparedData log");
//console.log("originalData.simple="+originalData.simple);
    var dataStack = [];
    var dataTitle = [];
    var count = 0;
    var originalTitle = originalData.datablock[0]
    if((originalData.simple!=true) && (simpledataFlag==true)){
//console.log("simple data can not be the same with array datas");
        return -1;
    }else if((originalData.simple==true) && (simpledataFlag==true)){
        for(var i = 0 ; i < comparedData.length; i++) {
            if (comparedData[i].line.indexOf("[") > -1) {
//console.log("this data is a single data, has no title");
                count++;
                dataStack.length = 0;
            }
            var splitPoint = comparedData[i].line.indexOf(":");
            if (splitPoint > -1) {
                if (count == 1) {
                    var att = comparedData[i].line.substring(0, splitPoint);
                    var val = comparedData[i].line.substring(splitPoint+1);
                    ele = {};
                    ele["indentation"] = comparedData[i].indentation;
                    ele["att"] = att;
                    ele["val"] = val;
                    dataTitle.push(ele);
                }
            }else{
                if (count == 1) {
                    var att = comparedData[i].line;
                    ele = {};
                    ele["indentation"] = "";
                    ele["att"] = att;
                    ele["val"] = att;
                    dataTitle.push(ele);
                }
            }
        }
        if((prefixLength + dataTitle.length)!=originalTitle.length){
            //console.log("checkData end: title length different, return -1");
            return -1;
        }else {
            return dataTitle.length;
        }
    }

    var deepTitle = false;
    for(var i = 0 ; i < comparedData.length; i++) {
        if (comparedData[i].line.indexOf("{") > -1) {
            count++;
            dataStack.length = 0;
        }
        var splitPoint = comparedData[i].line.indexOf(":");
        //console.log("for line " +comparedData[i].line+" the split point is at "+splitPoint);
        //console.log("count is "+count);
        if (splitPoint > -1) {
            if(count == 2 && dataTitle.length==0){
                deepTitle = true;
            }
            if (count == 1 ||(count == 2 && deepTitle==true)) {
                var att = comparedData[i].line.substring(0, splitPoint);
                var val = comparedData[i].line.substring(splitPoint+1);
                ele = {};
                ele["indentation"] = comparedData[i].indentation;
                ele["att"] = att;
                ele["val"] = val;
                dataTitle.push(ele);
            }
        }
    }
    //this is a single data
    if(count == 0){
        for(var i = 0 ; i < comparedData.length; i++) {
            if (comparedData[i].line.indexOf("[") > -1) {
//console.log("this data is a single data, has no title");
                count++;
                dataStack.length = 0;
            }
            var splitPoint = comparedData[i].line.indexOf(":");
            if (splitPoint > -1) {
                if (count == 1) {
                    var att = comparedData[i].line.substring(0, splitPoint);
                    var val = comparedData[i].line.substring(splitPoint+1);
                    ele = {};
                    ele["indentation"] = comparedData[i].indentation;
                    ele["att"] = att;
                    ele["val"] = val;
                    dataTitle.push(ele);
                }
            }else{
                if (count == 1) {
                    var att = comparedData[i].line;
                    ele = {};
                    ele["indentation"] = "";
                    ele["att"] = att;
                    ele["val"] = att;
                    dataTitle.push(ele);
                }
            }
        }
        if (count == 1) {
//console.log("checkData end: find same title with data legth = " + dataTitle.length);
            return -99;
        }
    }

    if((prefixLength + dataTitle.length)!=originalTitle.length){
        //console.log(prefixLength +" + "+ dataTitle.length+" != "+originalTitle.length)
        //console.log("checkData end: title length different, return -1");
        return -1;
    }

    //console.log("original title is "+originalTitle);
    for (var i = 0; i < dataTitle.length ; i++){
        if(dataTitle[dataTitle.length-i-1].att!=originalTitle[originalTitle.length-i-1].att){
//console.log("checkData end: title context different, return -1");
            return -1;
        }
    }
//console.log("checkData end: find same title with data legth = " + dataTitle.length);
    return dataTitle.length;
}
function writeLog(msg){
    var fs = require('fs');
    var util = require('util');
    var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
    var log_stdout = process.stdout;
    console.log = function(d) { //
        log_file.write(util.format(d) + '\n');
        log_stdout.write(util.format(d) + '\n');
    };

}
function realfunction(response,request,postData) {
    var date = new Date();
    console.log(date.toISOString()+": reading file " + postData );
    var test ;
    var treatJS =[];
    var req = require('request');
    var xml = "";
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("received data:<br/>");
    var func =
        '<script type="text/javascript">'+
        'function showButton(id){' +
        '   if(document.getElementById(id).style.display=="block"){' +
        '       document.getElementById(id).style.display="none"' +
        '   } else {' +
        '       document.getElementById(id).style.display="block";' +
        '   }'+
        '}'+
        '</script>';

    response.write(func);
    //req(postData).pipe(fs.createWriteStream('/home/wk/result.html'))
    req.get(postData, function (error, res, body) {
        if (!error && res.statusCode == 200) {
                //test = body.toString();
            //toJson = sync(toJson);
            sync(parser, 'toJson');
            var json = parser.toJson(body);
            //console.log("json log");

            //this is the handle the tag given by xml2json
            var str = json.replace(/\"\$t\"/g,"\"description\"");

            //console.log(str);
            //console.log("json log");
            treatJS = treatJson(str);

            var result = "";
            var resultArray = [] ;
            result+=func;
            for (var i = 0 ; i<treatJS.length; i ++){
                result+=("<input type = 'button' onclick='showButton(\"toc"+i+"\")' value = data"+i+">");
                result+=("<div id=\"toc"+i+"\" hidden>");
                result+=("<table style=\"width:100%\">");

                var title = treatJS[i][0];
                //console.log("^^^^^^^^final log^^^^^^^^");
                //console.log(title);
                //console.log("^^^^^^^^final log end^^^^");

                var aCSV = "";
                for (var j = 0; j < treatJS[i].length; j++){
                    //var htmlLine = JSONtoCSV(treatJS[i][j],title);
                    //var htmlLine = JSONtoConsoleCSV(treatJS[i][j],title);
                    var htmlLine = JSONtoHTML(treatJS[i][j],title);
                    result+=(htmlLine);
                    var consoleLine = JSONtoConsoleCSV(treatJS[i][j],title);
                    console.log(consoleLine);
                    aCSV+=consoleLine;
                    aCSV+='\n';
                    var consoleLineall = JSONtoConsoleCSVALL(treatJS[i][j],title);
                    //console.log(consoleLineall);
                }
                resultArray.push(aCSV);
                console.log("");
                result+=("</table>");
                result+=("</div>");
                result+=("<br/>");
            }


            var fs    = require('fs');
            var path  = require('path');
            var fileName = postData.substring(postData.lastIndexOf('/')+1,postData.length-4);
            //console.log("123456"+fileName);
            var directory = "/tmp/transformTool/"+fileName;
            var mkdirp = require('mkdirp');
            mkdirp(directory, function(err) {

                // path exists unless there was an error

            });

            //additional floder
            mkdirp(directory+"/"+ resultArray.length, function(err) {

                // path exists unless there was an error

            });

            for (var i = 0; i < resultArray.length; i ++){
                //console.log("temp "+ resultArray.length)
                var fs = require('fs');
                fs.writeFile(directory+"/"+i+".csv", resultArray[i], function(err) {
                    ///console.log("in sync");
                    if(err) {
                        return console.log(err);
                    }
                    var date = new Date();
                    //console.log(date.toISOString()+": The file "+i+" was saved!");
                });
            }
            //console.log("result log");
            //console.log(result);
            //console.log("result log");
            var fs = require('fs');
            fs.writeFile("/tmp/result.html", result, function(err) {
                if(err) {
                    return console.log(err);
                }
                var date = new Date();
                console.log(date.toISOString()+": The file was saved!");
            });


        }
    });

    var date = new Date();
    console.log(date.toISOString()+": reading file finished");

    response.end();

    var date = new Date();
    console.log(date.toISOString()+": response.end()");
}
exports.start = start;
exports.upload = upload;
exports.show = show;
exports.xmlload = xmlload;
//exports.showxml2json = showxml2json;
exports.showtraverse = showtraverse;
exports.addNewPage = addNewPage;
exports.realfunction = realfunction;
