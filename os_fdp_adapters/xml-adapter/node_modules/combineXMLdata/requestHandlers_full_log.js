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
    console.log(xml);
    var json = parser.toJson(xml); //returns a string containing the JSON structure by default
    console.log(json);
    var form = new formidable.IncomingForm();
    console.log("about to parse");
    form.parse(request, function(error, fields, files) {
         console.log("parsing done");
        console.log(files);
        console.log(files.upload);
         console.log(files.upload.path);
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
            console.dir(leaves);
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
            console.log(typeof (leaves));
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
    console.log("transform from JOSN to HTML:start");
    //var temp = json.indexOf("{");
    var str = json;
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
    console.log("transform log");
    console.log(temp13);
    console.log("transform log");
    var datas = [];
    var dataflag = false;
    for(var i=0; i<temp13.length;i++) {
        if(temp13[i].line.indexOf("[")>-1){
            if(dataflag == false){
                data.push(temp13[i]);
                console.log("################################a new block#################################################################");
                console.log("first line#########"+ temp13[i].line + " at line " + i);
            } else{
                console.log("################################delete a block#################################################################");
                console.log("because of" + temp13[i].line + " at line " + i);
                for (var idx in data){
                    prefix.push(data[idx]);
                    //console.log("data to prefix#########");
                }
                data.length = 0;
                data.push(temp13[i]);
                console.log("first line after delete#########"+ temp13[i].line + " at line " + i);
            }
            dataflag = true;
        } else if ((temp13[i].line.indexOf("]")>-1) && (dataflag == true)){
            data.push(temp13[i]);
            dataflag = false;
            console.log("################################end of a block#################################################################");
            console.log("because of" + temp13[i].line + " at line " + i);
            //remove duplicate
            var cleanedPrefix = cleanPrefix(prefix);
            console.log("-------------cleanedPrefix start-----------");
            console.log(cleanedPrefix);
            console.log("-------------cleanedPrefix end-------------");
            //if this prefix is already exist ,return index
            //var index = checkPrefix(datas, cleanedPrefix);

            var index = -1;
            var simpledataFlag = false;
            if(checkSimpleData(data)){
                simpledataFlag=true;
                console.log("this is a simple data");
            }
            index = findSameTitle(datas, cleanedPrefix, data, simpledataFlag);
            console.log("-------------index is "+index+"-------------");
            //prefix is same ,
            if(index>=0){
                //check data title , return data title length
                //var dataLength = checkData(datas[index],cleanedPrefix, data);
                //prefix exist, and data title is same , add to exist
                var dataBlock = addDataToExist(cleanedPrefix, datas[index], data, simpledataFlag);
                var ele = {};
                ele["prefix"] =dataBlock[0];
                ele["datablock"]=dataBlock;
                if(simpledataFlag==true){
                    ele["simple"]=true;
                }
                console.log("update data " + index);
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

                console.log("-------------dataBlock start-----------");
                console.log(dataBlock);
                console.log("-------------dataBlock end-------------");

                console.log("add a new data to datas with number"+ datas.length);
                datas.push(ele);
            }
            data.length = 0;
        } else if ( dataflag == true ){
            console.log("line " + i +"add to data");
            data.push(temp13[i]);
        } else if (dataflag == false){
            console.log("line " + i +"add to prefix");
            prefix.push(temp13[i]);
        }
    }
    var res = [];
    for(var i = 0; i< datas.length ; i++){
        res.push(datas[i].datablock);
    }

    var result = cleanResult(res);
    return result;
}
function cleanResult(res){
    var resCopy = res.slice(0);
    var uselessArray = [];
    uselessArray.push(": {");
    uselessArray.push(":[");
    uselessArray.push("-");
    for(idx in res){
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
                titleLine[i].val = titleLine[i].att +　associativeArray[titleLine[i].att];
            }
        }

        for(var i = 0; i < data[0].length ; i++){
            for(var j = 1; j < data.length ; j++){
                console.log("data[j][i].val="+data[j][i].val);
                console.log("uselessArray.indexOf(data[j][i].val)="+uselessArray.indexOf(data[j][i].val));
                if(uselessArray.indexOf(data[j][i].val)==-1){
                    titleLine[i]["output"]=true;
                    break;
                }else {
                    titleLine[i]["output"]=false;
                }
            }
            console.log("log is"+titleLine[i]["output"]);
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
    console.log("postData is " +postdata);
    console.log(typeof(postdata));
    console.log("addNewPage");
    response.write(postdata);
    response.end;
}
function treatData(prefix,data ,simpledataFlag){
    console.log("build datablock:start");
    console.log("entered prefix");
    console.log(prefix);
    console.log("entered prefix");
    console.log("entered data");
    console.log(data);
    console.log("entered data");
    var title = []
    var rows = [];
    var rowPrefix = prefix.slice(0);
    var dataStack = [];
    for(idx in prefix){
        var ele = {};
        ele={};
        ele["indentation"] = prefix[idx].indentation;
        ele["att"]= prefix[idx].att;
        ele["val"]= prefix[idx].att;
        title.push(ele);
    }
    var count = 0;
    var pieceOfDataFlag = 0;
    var rowItemCount = 0;
    var inRowFlag = false;
    var tempTitle = [];
    if(simpledataFlag==false){
        for(var i = 0 ; i < data.length; i++){
            var splitPoint = data[i].line.indexOf(":");
            if(data[i].line.indexOf("{")>-1){
                if(pieceOfDataFlag==0){
                    console.log("start of a piece of data");
                    dataStack.length = 0;
                    count++;
                }
                pieceOfDataFlag++;
                inRowFlag=true;
            }
            if(data[i].line.indexOf("}")>-1){
                pieceOfDataFlag--;
                inRowFlag=false;
            }
            if (splitPoint>-1){
                var att = data[i].line.substring(0,splitPoint);
                var val = data[i].line.substring(splitPoint+1);
                if(count==1){
                    ele={};
                    ele["indentation"] ="";
                    ele["att"]=att;
                    ele["val"]=att;
                    console.log("add an element to title: "+ att);
                    title.push(ele);
                    tempTitle.push(ele);
                }
                var temp = val;
                //delete useless comma
                if(temp.substring(val.length-1)==","){
                    temp = temp.substring(0,val.length-1);
                }
                //mark useless column
                if(temp.substring(val.length-1)=="{"){
                    temp = "-";
                }
                if(rows.length >1){
                    //normal branch,
                    if(tempTitle.length>rowItemCount){
                        if(tempTitle[rowItemCount].att==att){
                            //usual case, all same
                            //add an element
                            ele={};
                            ele["indentation"] = data[i].indentation;
                            ele["att"]=att;
                            ele["val"]=temp;
                            dataStack.push(ele);
                        }else{
                            //unusual case, row item is different from title at[rowItemCount]
                            //temproary :omit this item, keep title
                            rowItemCount--;
                        }
                    }else{
                        //this branch means, rows has more column than title
                    }
                }else{
                    ele={};
                    ele["indentation"] = data[i].indentation;
                    ele["att"]=att;
                    ele["val"]=temp;
                    dataStack.push(ele);
                }
                rowItemCount++;
                if(rows.length>1 && rowItemCount<=(rows[rows.length-1].length-prefix.length)){
                    if(rows[rows.length-1][prefix.length+rowItemCount-1].att!=att){
                        console.log("not same");
                        console.log(rows[rows.length-1][prefix.length+rowItemCount-1]);
                        console.log(att);
                    }else{
                        console.log("same");
                        console.log(rows[rows.length-1][prefix.length+rowItemCount-1]);
                        console.log(att);
                    }
                }else{
                    rowItemCount--;
                }
            }
            if(data[i].line.indexOf("}")>-1 && (pieceOfDataFlag==0)){
                console.log("end of a piece of data")
                var temp = prefix.slice(0);
                console.log("sepecial treat");
                console.log(prefix);
                console.log("sepecial treat");
                for (idx in dataStack){
                    temp.push(dataStack[idx]);
                }
                var row = temp;
                rowItemCount=0;
                rows.push(row);
            }
        }
        rows.unshift(title);
    }else{
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
            ele["att"]=att;
            ele["val"]=val;
            title.push(ele);
        }
        rows.push(title);
    }
    console.log("build datablock:end");
    return rows;
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

function JSONtoHTML(inputCSV, title){

    if(inputCSV.length!=title.length){
        console.log("lets see input one is wrong :"+inputCSV.length);
        console.log("lets see title one is wrong:"+title.length);
        for(indexA in inputCSV){
            console.log("inputCSV is "+inputCSV[indexA].att);
        }
        for(indexB in title){
            console.log("title is "+title[indexB].att);
        }
    }
    var res = "";
    res+="<tr>";
    for(idx in inputCSV){

        if(title[idx].output==true){
            res+="<td>";
            res+=inputCSV[idx].val;
            res+="</td>";
        }
    }
    res+="</tr>";
    return res;
}
function cleanPrefix(prefix){
    console.log("################################prefix to be clean#################################################################");
    console.log(prefix);
    console.log("################################prefix to be clean#################################################################");
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
        console.log("prefix["+i+"] is "+prefix[i].indentation+prefix[i].line);
        if((prefix[i].indentation-prefix[i-1].indentation)<=-1
            && (prefix[i-1].indentation-prefix[i-2].indentation)<=-1){
            endLine = i;
            startMark = prefix[i].indentation;
            console.log("here is a start mark with indentation =" + startMark);
            break;
        }
    }

    for(var i = endLine; i >3; i--){
        if(prefix[i].indentation==startMark){
            endMark++;
            if(endMark==2){
                console.log("here is an end mark with " + startMark);
                startLine=i;
                break;
            }
        }
    }
    if(prefix.indexOf(prefix[startLine])>0){
        //startLine=prefix.indexOf(prefix[startLine]);
    }
    console.log("startLine = "+startLine +"; endLine = "+ endLine);
    if(startLine<endLine) {
        part1 = prefix.slice(0, startLine);
        part2 = prefix.slice(endLine);
        for (idx in part2){
            part1.push(part2[idx]);
        }
        console.log("start another loop with length = " + part1.length);
        res = cleanPrefix(part1);
    }else {
        console.log("final loop with length = " + prefix.length);

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
    console.log("checkPrefix start");
    for(idx in datas){

        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
        console.log("prefix is " + prefix.length);
        for(indexA in prefix){
            //console.log(prefix[indexA].indentation+prefix[indexA].line);
        }
        console.log("datas[idx].prefi is " + datas[idx].prefix.length);
        console.log("----------------------------------------------------------------------------------------------------");
        for(indexB in datas[idx].prefix){
            //console.log(datas[idx].prefix[indexB].indentation+datas[idx].prefix[indexB].line);
        }
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
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
        console.log("checkPrefix end: index is "+ idx);
        return idx;
    }

    return -1;
}
function findSameTitle(datas, prefix, comparedData, simpledataFlag){
    console.log("findSameTitle start");
    var title = prefix;
    console.log("title log start");
    console.log(title);
    console.log("title log end");

    var res;
    //console.log("datas length " +datas.length);
    for(var i = 0; i < datas.length; i++){
        //log for compare title console.log("it is "+ i + "th data");
        res = true;
        if(datas[i].prefix.length < title.length){
            for(indexA in datas[i].prefix){
                console.log(datas[i].prefix[indexA].line);
            }
            console.log("datas["+i+"].prefix.length="+datas[i].prefix.length +" is larger than title.length = "+title.length);
            res = false;
            continue;
        }
        for(idx in title){
            if((title[idx].att) != (datas[i].prefix[idx].att)){
                console.log(title[idx].att+" and "+datas[i].prefix[idx].att + " are different");
                res = false;
                break;
            }
        }
        if(res == true){
            //log for compare title console.log("findSameTitle : data "+ i +" has same title");
            resOfCheckData = checkData(datas[i],title.length, comparedData, simpledataFlag);
            if(resOfCheckData>=0){
                //log for compare title console.log("findSameTitle : data "+ i +" has same data type");
                return i;
            }else if (resOfCheckData==-99){
                return -99;
            }
            //return i;
        }
    }
    console.log("findSameTitle end: Title different");
    return -1;
}
function addDataToExist(prefix, originalData, additionalData, simpledataFlag){
    var rowPrefix = prefix.slice(0);
    var dataStack = [];

    console.log("rowPrefix log start");
    console.log(rowPrefix);
    console.log("rowPrefix log end");
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
                var val = additionalData[i].line.substring(splitPoint);
                var temp = val.substring(1);
                if (temp.substring(val.length - 1) == ",") {
                    temp = temp.substring(0, val.length - 1);
                }
                ele = {};
                ele["indentation"] = additionalData[i].indentation;
                ele["att"] = att;
                ele["val"] = temp;
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
                var val = additionalData[i].line.substring(splitPoint);
            }
            else{
                var att = additionalData[i].line;
                var val = additionalData[i].line;
            }
            ele={};
            ele["indentation"] ="";
            ele["att"]=att;
            ele["val"]=val;
            rowPrefix.push(ele);
        }
        rows.push(rowPrefix);
    }
    console.log("add additional data end");
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
    console.log("checkData start");
    console.log("comparedData log");
    console.log(comparedData);
    console.log("comparedData log");
    console.log("originalData.simple="+originalData.simple);
    var dataStack = [];
    var dataTitle = [];
    var count = 0;
    var originalTitle = originalData.datablock[0]
    if((originalData.simple!=true) && (simpledataFlag==true)){
        console.log("simple data can not be the same with array datas");
        return -1;
    }else if((originalData.simple==true) && (simpledataFlag==true)){
        for(var i = 0 ; i < comparedData.length; i++) {
            if (comparedData[i].line.indexOf("[") > -1) {
                console.log("this data is a single data, has no title");
                count++;
                dataStack.length = 0;
            }
            var splitPoint = comparedData[i].line.indexOf(":");
            if (splitPoint > -1) {
                if (count == 1) {
                    var att = comparedData[i].line.substring(0, splitPoint);
                    var val = comparedData[i].line.substring(splitPoint);
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

    for(var i = 0 ; i < comparedData.length; i++) {
        if (comparedData[i].line.indexOf("{") > -1) {
            count++;
            dataStack.length = 0;
        }
        var splitPoint = comparedData[i].line.indexOf(":");
        if (splitPoint > -1) {
            if (count == 1) {
                var att = comparedData[i].line.substring(0, splitPoint);
                var val = comparedData[i].line.substring(splitPoint);
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
                console.log("this data is a single data, has no title");
                count++;
                dataStack.length = 0;
            }
            var splitPoint = comparedData[i].line.indexOf(":");
            if (splitPoint > -1) {
                if (count == 1) {
                    var att = comparedData[i].line.substring(0, splitPoint);
                    var val = comparedData[i].line.substring(splitPoint);
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
            console.log("checkData end: find same title with data legth = " + dataTitle.length);
            return -99;
        }
    }

    if((prefixLength + dataTitle.length)!=originalTitle.length){
        //console.log("checkData end: title length different, return -1");
        return -1;
    }

    //console.log("original title is "+originalTitle);
    for (var i = 0; i < dataTitle.length ; i++){
        if(dataTitle[dataTitle.length-i-1].att!=originalTitle[originalTitle.length-i-1].att){
            console.log("checkData end: title context different, return -1");
            return -1;
        }
    }
    console.log("checkData end: find same title with data legth = " + dataTitle.length);
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
    console.log("reading file " + postData );
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
            console.log("json log");
            console.log(json);
            console.log("json log");
            treatJS = treatJson(json);

            var result = "";
            result+=func;
            for (var i = 0 ; i<treatJS.length; i ++){
                result+=("<input type = 'button' onclick='showButton(\"toc"+i+"\")' value = data"+i+">");
                result+=("<div id=\"toc"+i+"\" hidden>");
                result+=("<table style=\"width:100%\">");
                if(i == 17){
                    for(indexA in treatJS[17]){
                        var temp = treatJS[17][indexA];
                        console.log("%%%%%%%%%%%%%%%%%%%%%%%%")
                        console.log("temp: "+temp);
                        for(indexB in temp){
                            console.log("att: "+temp[indexB].att+" "+temp[indexB].val);
                        }
                        console.log("%%%%%%%%%%%%%%%%%%%%%%%%")
                    }

                }
                var title = treatJS[i][0];
                console.log("^^^^^^^^final log^^^^^^^^");
                console.log(title);
                console.log("^^^^^^^^final log end^^^^");
                for (var j = 0; j < treatJS[i].length; j++){
                    //var htmlLine = JSONtoCSV(treatJS[i][j],title);
                    var htmlLine = JSONtoHTML(treatJS[i][j],title);
                    result+=(htmlLine);
                }
                result+=("</table>");
                result+=("</div>");
                result+=("<br/>");
            }

            console.log("result log");
            console.log(result);
            console.log("result log");
            var fs = require('fs');
            fs.writeFile("/tmp/result.html", result, function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            });
        }
    });

    console.log("reading file finished");

    //response.write("<a href = '/tmp/test'> test ");
    for (var i = 0 ; i<treatJS.length; i ++){
        response.write("<input type = 'button' onclick='showButton(\"toc"+i+"\")' value = data"+i+">");
        response.write("<div id=\"toc"+i+"\" hidden>");
        response.write("<table style=\"width:100%\">");
        for (var j = 0; j < treatJS[i].length; j++){
            var htmlLine = JSONtoCSV(treatJS[i][j]);
            response.write(htmlLine);
        }
        response.write("</table>");
        response.write("</div>");
        response.write("<br/>");
    }
    response.end();

    console.log("response.end()");
}
//exports.start = start;
//exports.upload = upload;
//exports.show = show;
//exports.xmlload = xmlload;
//exports.showxml2json = showxml2json;
//exports.showtraverse = showtraverse;
//exports.addNewPage = addNewPage;
//exports.realfunction = realfunction;
