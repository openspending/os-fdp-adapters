/**
 * Created by wk on 3/17/16.
 */
lines = [];
columnInfo = [];
columnInfo_add = [];
JSON_data = [];
JSON_opt = [];
JSON_ctrl = [];
DSDfinal="";
CODELIST=[];
CODELISTfinal=[];
DATASETTTL="";
indentation="----"


DROPLIST1={varName:'dplist1',varData:["Dimensions","Measures","Attributes"]};

DROPLIST2={varName:'dplist2',varData:["Budget Unit","Fiscal Period","Fiscal Year","Classification","Operation character","Budget phase","others"]};
DROPLIST3={varName:'dplist3',varData:["Amount"]};
DROPLIST4={varName:'dplist4',varData:["Curency","Tax Included"]};


TESTLIST= {varName:'testList', varData:["budegetaryUnit", "budgetPhase","operationCharacter", "fiscalPeriod", "currency","administrativeClassification","fund", "functionalClassification", "amountEU", "amountNational","amountTotal"]};

REUSELIST={varName:'reuseList', varData:["budegetaryUnit", "budgetPhase","operationCharacter", "fiscalPeriod", "currency","administrativeClassification"]};
SPECIFICLIST={varName:'specificList', varData:["fund", "functionalClassification", "amountEU", "amountNational","amountTotal"]};

BUDGETLIST={varName:'budgetList',varData:[["Budgetary Unit","dimension"],  ["Fiscal Period","dimension"],  ["Fiscal Year","dimension"],["Classification","dimension"],  ["Functional Classification","dimension"],  ["Programme Classification","dimension"],  ["Economic Classification","dimension"],  ["Administrative Classification","dimension"],  ["Operation Character","dimension"],  ["Budget phase","dimension"],  ["Amount","measure"],  ["Currency","attribute"],  ["Taxes Included","attribute"]]};
//BUDGETLIST={varName:'budgetList',varData:["Budgetary Unit","Fiscal Period","Fiscal Year","Functional Classfication","Programme Classfication","Economic Classfication","Administrative Classfication","Operation Character","Budget phase","Amount","Currency","Taxes Included"]};
SPENDINGLIST={varName:'spendingList',varData:[["Organization","dimension"], ["Partner","dimension"], ["Date","dimension"], ["Operation Character","dimension"],  ["Budget Line","dimension"], ["Currency(D)","dimension"],  [ "Taxes Included(D)","dimension"],  [ "Project","dimension"],["Classification","dimension"],  ["Functional Classification","dimension"],  ["Programme Classification","dimension"],  ["Economic Classification","dimension"],  ["Administrative Classification","dimension"],   ["Accounting Record","dimension"],   ["Amount","measure"], ["Currency(A)","attribute"], ["Location","attribute"],["Taxes Included(A)","attribute"]]};



//[ "Currency","dimension"],


OBEUnamespace="# ----- OpenBudgets.eu namespaces -----\n\n\@prefix obeu:             <http:\/\/data.openbudgets.eu\/ontology\/> .\n\@prefix obeu-attribute:   <http:\/\/data.openbudgets.eu\/ontology/dsd\/attribute/> .\n\@prefix obeu-dimension:   <http:\/\/data.openbudgets.eu\/ontology/dsd\/dimension\/> .\n\@prefix obeu-measure:     <http:\/\/data.openbudgets.eu\/ontology/dsd\/measure\/> .\n\n";
GENERICnamespace="# ----- Generic namespaces ------\n\n\@prefix qb:               <http:\/\/purl.org\/linked-data\/cube#> .\n@prefix rdf:              <http:\/\/www.w3.org\/1999\/02\/22-rdf-syntax-ns#> .\n\@prefix rdfs:             <http:\/\/www.w3.org\/2000\/01\/rdf-schema#> .\n\n";



//---------------------------Deliverable 1.2----------
//---------------------------Budget data--------------
Budget_General_budgetaryUnit    ="obeu-dimension:budgetaryUnit a rdf:Property, qb:DimensionProperty, qb:CodedProperty ;\n\t" +"rdfs:label \"budgetary unit\"@en ;\n\t" + "rdfs:range org:Organization .\n\n";
Budget_General_fiscalPeriod     ="obeu-dimension:fiscalPeriod a rdf:Property, qb:DimensionProperty, qb:CodedProperty ;\n\t" +"rdfs:label \"fiscal period\"@en ;\n\t" +"rdfs:subPropertyOf sdmx-dimension:refPeriod ;\n\t" +"rdfs:range time:Interval ;\n\t" +"qb:concept sdmx-concept:refPeriod .\n\n";
Budget_General_fiscalYear       ="obeu-dimension:fiscalYear a rdf:Property, qb:DimensionProperty, qb:CodedProperty ;\n\t" +"rdfs:label \"fiscal year\"@en ;\n\t" +"rdfs:comment \"The year reflected in financial statements.\"@en ;\n\t" +"rdfs:subPropertyOf obeu-dimension:fiscalPeriod ;\n\t" +"rdfs:range interval:Year ;\n\t" +"qb:concept sdmx-concept:refPeriod .\n\n";
Budget_General_classification   ="obeu-dimension:classification a rdf:Property, qb:DimensionProperty, qb:CodedProperty ;\n\t" +"rdfs:subPropertyOf dcterms:subject ;\n\t" +"rdfs:label \"classification\"@en .\n\n";
Budget_General_functionalClassification     ="obeu-dimension:functionalClassification a rdf:Property, qb:DimensionProperty, qb:CodedProperty ;\n\t" +"rdfs:label \"functional classification\"@en ;\n\t" +"rdfs:comment \"Categorizes expenditures according to the   purposes and objectives for which they are intended.\"@en ;\n\t" +"rdfs:subPropertyOf obeu-dimension:classification .\n\n";
Budget_General_programmeClassification      ="obeu-dimension:programmeClassification a rdf:Property, qb:DimensionProperty, qb:CodedProperty ;\n\t" +"rdfs:label \"programme classification\"@en ;\n\t" +"rdfs:comment \"Grouping of expenditure by common objective for budgeting purposes.\"@en ;\n\t" +"rdfs:subPropertyOf obeu-dimension:classification .\n\n"
Budget_General_economicClassification       ="obeu-dimension:economicClassification a rdf:Property, qb:DimensionProperty, qb:CodedProperty ;\n\t" +"rdfs:label \"economic classification\"@en ;\n\t" +"rdfs:comment \"Identifies the type of expenditure incurred.\"@en;\n\t" +"rdfs:subPropertyOf obeu-dimension:classification .\n\n";
Budget_General_administrativeClassification ="obeu-dimension:administrativeClassification a rdf:Property, qb:DimensionProperty, qb:CodedProperty ;\n\t"  + "rdfs:label \"administrative classification\"@en ;\n\t"  + "rdfs:comment \"Identifies the entity responsible for managing the public funds concerned.\"@en ;\n\t"  + "rdfs:subPropertyOf obeu-dimension:classification .\n\n";
Budget_General_operationCharacter           ="obeu-dimension:operationCharacter a rdf:Property, qb:DimensionProperty, qb:CodedProperty ;\n\t"  + "rdfs:label \"operation character\"@en ;\n\t"  + "rdfs:comment \"Distinguishes among expenditure and revenue.\"@en ;\n\t"  + "rdfs:range obeu:OperationCharacter ;\n\t"  + "qb:codeList obeu-codelist:operationCharacter .\n\n";
Budget_General_budgetPhase      ="obeu-dimension:budgetPhase a rdf:Property, qb:DimensionProperty, qb:CodedProperty ;\n\t"  + "rdfs:label \"budget phase\"@en ;\n\t"  + "rdfs:comment \"Distinguishes among phases of the budget.\"@en ;\n\t"  + "rdfs:range obeu:BudgetPhase ;\n\t"  + "qb:codeList obeu-codelist:budgetPhase .\n\n";
Budget_General_amount           ="obeu-measure:amount a rdf:Property, qb:MeasureProperty ;\n\t"  + "rdfs:label \"amount\"@en ;\n\t"  + "rdfs:comment \"The amount budgeted.\"@en ;\n\t"  + "rdfs:subPropertyOf sdmx-measure:obsValue ;\n\t"  + "rdfs:range xsd:decimal ;\n\t"  + "qb:concept sdmx-concept:obsValue .\n\n";
Budget_General_currency         ="obeu-attribute:currency a rdf:Property, qb:AttributeProperty, qb:CodedProperty ;\n\t"  + "rdfs:label \"currency\"@en ;\n\t"  + "rdfs:comment \"The currency of the financial amount\"@en ;\n\t"  + "rdfs:subPropertyOf sdmx-attribute:currency ;\n\t"  + "rdfs:range obeu:Currency ;\n\t"  + "qb:concept sdmx-concept:currency .\n\n";
Budget_General_taxesIncluded    ="obeu-attribute:taxesIncluded a rdf:Property, qb:AttributeProperty, qb:CodedProperty ;\n\t"  + "rdfs:label \"tax included\"@en ;\n\t"  + "rdfs:comment \"Indicates whether the reported amount includes taxes.\"@en ;\n\t"  + "rdfs:range xsd:boolean .\n\n";

Budget_General=[Budget_General_budgetaryUnit, Budget_General_fiscalPeriod, Budget_General_fiscalYear, Budget_General_classification, Budget_General_functionalClassification, Budget_General_programmeClassification, Budget_General_economicClassification, Budget_General_administrativeClassification, Budget_General_operationCharacter, Budget_General_budgetPhase, Budget_General_amount, Budget_General_currency, Budget_General_taxesIncluded];
//---------------------------Deliverable 1.3----------




outputRows = [];
outputListArr = [];
finalInfo = [];
usefulTable = [];
FILE2READ = "";
Dimensions = 0;
Measures = 1;
Attributes = 2;
Amount = 30;
Curency = 40;
TaxIncl =41;

RDFGraphArr = [];


function understandColumn(dic, idx){
    var mark = [];

    //column name
    var keyName1 = Object.keys(dic)[0];
    //column value
    var keyName2 = Object.keys(dic)[1];

    //String filter
    var pattString = new RegExp("[a-zA-Z]");
    //number filter
    var pattNumber = new RegExp("^\\d+,?\.?\\d*$");
    //amount filter
    var pattAmount = new RegExp("(^.+?,{1}\\d{2,}$)|(^.+?[.]\\d{2,}$)");
    //var pattAmount = new RegExp("(^.+?,{1}\\d{2,}$)");
    //date filter
    var pattDate = new RegExp("(^[1|2]{1}[0-9]{7}$)|(^[1|2]{1}[0-9]{3}$)");
    //EU fileter
    //var euCountry = new RegExp(/);


    //TO BE DONE
    //DEFINE CONSTANT
    if(dic[keyName2]==" " | dic[keyName2]==""){
        mark[0]=0;
        mark[1]=0;

    } else if(pattNumber.test(dic[keyName2])){

        //list1=measure
        //list2=amount
        if (pattAmount.test(dic[keyName2])){
            mark[0]=1;
            mark[1]=11;
        } else if (pattDate.test(dic[keyName2])){
            //list1 = dimension
            //list2 = fiscal year
            mark[0]=0;
            mark[1]=12;
        } else{
            mark[0] = 2;
            mark[1] = 16;
        }

    } else if(!pattNumber.test(dic[keyName2])){

        if(CODELIST_EU.indexOf(dic[keyName2])>-1 ||CODELIST_EU_ABBV.indexOf(dic[keyName2])>-1 ) {
            //console.log("test = "+CODELIST_EU);
            //console.log(CODELIST_EU.indexOf(dic[keyName2]));
            //list1 = dimesion
            //list2 = budget unit
            mark[0] = 0;
            mark[1] = 10;
        } else{
            mark[0]=0;
            mark[1]=15;
        }


    }

    return mark;
}

function testbb(cb){
    console.log("Clicked, new value = " + cb.checked);
    //console.log("in test");
}

function replaceInsideComma(str){
    //---SPLIT DATA START---
    //console.log(str);
    if (str.indexOf('"')>-1){
        var commaIndex = [];
        var temp = str;
        var num_matches = str.match(/"/g).length;

        for (var i = 0; i < num_matches; i ++){
            //console.log("i="+i);
            if (i!=0){
                /*
                 console.log("before sub,"+temp);
                 console.log("in temp   ,"+temp.indexOf('"'));
                 console.log("in commaIndex "+commaIndex[i-1]);
                 */
                commaIndex.push(temp.indexOf('"')+commaIndex[i-1]+1);
                //console.log("commaIndex now" +commaIndex[i]);
                temp = str.substring(commaIndex[i]+1);
                //console.log("commaIndex now" +commaIndex);
                //console.log("after sub  ," +temp);
            } else {
                commaIndex.push(temp.indexOf('"'));
                //console.log("before sub ," +temp);
                temp = temp.substring(commaIndex[i]+1);
                //console.log("after sub  ,"+temp);
            }
        }
        //console.log(commaIndex);
        var replacedArr=[];
        if(commaIndex[0]!=0){
            replacedArr.push(str.substring(0,commaIndex[0]));
            //console.log("first element"+temp);

        }
        for(var j = 0; j < commaIndex.length; j+=2){

            temp = str.substring(commaIndex[j],commaIndex[j+1]+1);
            //console.log("element "+temp);
            temp = temp.replace(/,/g,"INSIDE_COMMA_MARK");
            //console.log(temp);
            replacedArr.push(temp);
            //console.log("replacedArr "+replacedArr);

            //console.log(replacedArr);

            if(commaIndex[j+1]+1!=str.length){

                //console.log("commaIndex[j+1] = " +commaIndex[j+1]);
                //console.log("str.length+1    = " +(str.length+1));
                if(j+2!=commaIndex.length){
                    //if(","!=str.substring(commaIndex[j+1]+1,commaIndex[j+2])){
                    replacedArr.push(str.substring(commaIndex[j+1]+1,commaIndex[j+2]));
                    //}

                } else {
                    replacedArr.push(str.substring(commaIndex[j+1]+1));
                }

            }else {
                continue;
            }
        }

        //rebuild the string
        str = replacedArr.join("");
        return str;

    }
    return str;

}


function changeGerneal(cb){
    var optionList=document.getElementById("selectColumn").options;

    var columnName = optionList[optionList.selectedIndex].text;

    if(columnName!=""){
        //mapping to JSON
        for (var i = 0 ;i < JSON_ctrl["nodeDataArray"].length; i++){

            if(JSON_ctrl["nodeDataArray"][i].text == columnName) {
                if(cb=="specific"){
                    JSON_ctrl["nodeDataArray"][i].specific=true;

                    document.getElementById("specificName").style.display="block";
                    document.getElementById("div_codelist").style.display="block";
                }
                else if(cb=="general"){
                    JSON_ctrl["nodeDataArray"][i].specific=false;
                    document.getElementById("specificName").style.display="none";
                    document.getElementById("specificName").text="";

                    document.getElementById("div_codelist").style.display="none";
                    document.getElementById("form_codelist").style.display="none";
                }
                else {
                    JSON_ctrl["nodeDataArray"][i].specific=false;
                    document.getElementById("specificName").style.display="block";
                    document.getElementById("specificName").text="";
                    document.getElementById("general").selected = false;
                    document.getElementById("specific").selected = false;

                    document.getElementById("div_codelist").style.display="block";
                }
            }
        }
    }

}

/*	This work is licensed under Creative Commons GNU LGPL License.

 License: http://creativecommons.org/licenses/LGPL/2.1/
 Version: 0.9
 Author:  Stefan Goessner/2006
 Web:     http://goessner.net/
 */
function xml2json(xml, tab) {
    var X = {
        toObj: function(xml) {
            var o = {};
            if (xml.nodeType==1) {   // element node ..
                if (xml.attributes.length)   // element with attributes  ..
                    for (var i=0; i<xml.attributes.length; i++)
                        o["@"+xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue||"").toString();
                if (xml.firstChild) { // element has child nodes ..
                    var textChild=0, cdataChild=0, hasElementChild=false;
                    for (var n=xml.firstChild; n; n=n.nextSibling) {
                        if (n.nodeType==1) hasElementChild = true;
                        else if (n.nodeType==3 && n.nodeValue.match(/[^ \f\n\r\t\v]/)) textChild++; // non-whitespace text
                        else if (n.nodeType==4) cdataChild++; // cdata section node
                    }
                    if (hasElementChild) {
                        if (textChild < 2 && cdataChild < 2) { // structured element with evtl. a single text or/and cdata node ..
                            X.removeWhite(xml);
                            for (var n=xml.firstChild; n; n=n.nextSibling) {
                                if (n.nodeType == 3)  // text node
                                    o["#text"] = X.escape(n.nodeValue);
                                else if (n.nodeType == 4)  // cdata node
                                    o["#cdata"] = X.escape(n.nodeValue);
                                else if (o[n.nodeName]) {  // multiple occurence of element ..
                                    if (o[n.nodeName] instanceof Array)
                                        o[n.nodeName][o[n.nodeName].length] = X.toObj(n);
                                    else
                                        o[n.nodeName] = [o[n.nodeName], X.toObj(n)];
                                }
                                else  // first occurence of element..
                                    o[n.nodeName] = X.toObj(n);
                            }
                        }
                        else { // mixed content
                            if (!xml.attributes.length)
                                o = X.escape(X.innerXml(xml));
                            else
                                o["#text"] = X.escape(X.innerXml(xml));
                        }
                    }
                    else if (textChild) { // pure text
                        if (!xml.attributes.length)
                            o = X.escape(X.innerXml(xml));
                        else
                            o["#text"] = X.escape(X.innerXml(xml));
                    }
                    else if (cdataChild) { // cdata
                        if (cdataChild > 1)
                            o = X.escape(X.innerXml(xml));
                        else
                            for (var n=xml.firstChild; n; n=n.nextSibling)
                                o["#cdata"] = X.escape(n.nodeValue);
                    }
                }
                if (!xml.attributes.length && !xml.firstChild) o = null;
            }
            else if (xml.nodeType==9) { // document.node
                o = X.toObj(xml.documentElement);
            }
            else
                alert("unhandled node type: " + xml.nodeType);
            return o;
        },
        toJson: function(o, name, ind) {
            var json = name ? ("\""+name+"\"") : "";
            if (o instanceof Array) {
                for (var i=0,n=o.length; i<n; i++)
                    o[i] = X.toJson(o[i], "", ind+"\t");
                json += (name?":[":"[") + (o.length > 1 ? ("\n"+ind+"\t"+o.join(",\n"+ind+"\t")+"\n"+ind) : o.join("")) + "]";
            }
            else if (o == null)
                json += (name&&":") + "null";
            else if (typeof(o) == "object") {
                var arr = [];
                for (var m in o)
                    arr[arr.length] = X.toJson(o[m], m, ind+"\t");
                json += (name?":{":"{") + (arr.length > 1 ? ("\n"+ind+"\t"+arr.join(",\n"+ind+"\t")+"\n"+ind) : arr.join("")) + "}";
            }
            else if (typeof(o) == "string")
                json += (name&&":") + "\"" + o.toString() + "\"";
            else
                json += (name&&":") + o.toString();
            return json;
        },
        innerXml: function(node) {
            var s = ""
            if ("innerHTML" in node)
                s = node.innerHTML;
            else {
                var asXml = function(n) {
                    var s = "";
                    if (n.nodeType == 1) {
                        s += "<" + n.nodeName;
                        for (var i=0; i<n.attributes.length;i++)
                            s += " " + n.attributes[i].nodeName + "=\"" + (n.attributes[i].nodeValue||"").toString() + "\"";
                        if (n.firstChild) {
                            s += ">";
                            for (var c=n.firstChild; c; c=c.nextSibling)
                                s += asXml(c);
                            s += "</"+n.nodeName+">";
                        }
                        else
                            s += "/>";
                    }
                    else if (n.nodeType == 3)
                        s += n.nodeValue;
                    else if (n.nodeType == 4)
                        s += "<![CDATA[" + n.nodeValue + "]]>";
                    return s;
                };
                for (var c=node.firstChild; c; c=c.nextSibling)
                    s += asXml(c);
            }
            return s;
        },
        escape: function(txt) {
            return txt.replace(/[\\]/g, "\\\\")
                .replace(/[\"]/g, '\\"')
                .replace(/[\n]/g, '\\n')
                .replace(/[\r]/g, '\\r');
        },
        removeWhite: function(e) {
            e.normalize();
            for (var n = e.firstChild; n; ) {
                if (n.nodeType == 3) {  // text node
                    if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) { // pure whitespace text node
                        var nxt = n.nextSibling;
                        e.removeChild(n);
                        n = nxt;
                    }
                    else
                        n = n.nextSibling;
                }
                else if (n.nodeType == 1) {  // element node
                    X.removeWhite(n);
                    n = n.nextSibling;
                }
                else                      // any other node
                    n = n.nextSibling;
            }
            return e;
        }
    };
    if (xml.nodeType == 9) // document node
        xml = xml.documentElement;
    var json = X.toJson(X.toObj(X.removeWhite(xml)), xml.nodeName, "\t");
    return "{\n" + tab + (tab ? json.replace(/\t/g, tab) : json.replace(/\t|\n/g, "")) + "\n}";
}


function extractData(input){

    //<figure>103 414</figure>
    var figure = input.match(/<figure>(.*?)(<\/figure>){1}/g);

    //catpol="5.2.81"
    var captol = input.match(/catpol=(\"(.*?)\"){1}/g);
    //console.log(input);
    var values = [];

    for (var i = 0; i < figure.length ; i ++){
        values.push(figure[i].replace("<figure>","").replace("</figure>",""));
        if(captol!=null){
            values.push(captol[i].match(/(["'])(?:(?=(\\?))\2.)*?\1/g)[0]);
        }

    }

   // var values = [1,2,3];
    return values;
}

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    if(files[0])
    {
        var reader = new FileReader();
        reader.readAsText(files[0]);
        reader.onload = loaded;
    }
}

function loaded(evt) {
    var fileString = evt.target.result;
    alert(fileString);
}

function readSingleFile(e) {
    var file = e.target.files[0];
    if (!file) {
        return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
        var contents = e.target.result;
        displayContents(contents);
    };
    reader.readAsText(file);
}

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                console.log(allText);
            }
        }
    }
    console.log(rawFile);
    //rawFile.send(null);
}


function getFiles(dir){
    fileList = [];

    var files = fs.readdirSync(dir);
    for(var i in files){
        if (!files.hasOwnProperty(i)) continue;
        var name = dir+'/'+files[i];
        if (!fs.statSync(name).isDirectory()){
            fileList.push(name);
        }
    }
    return fileList;
}


function loadHandler2(event) {

    var str = event.target.result;

    CODELISTfinal.push(str);
}


function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
        //output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
        //    f.size, ' bytes, last modified: ',
        //    f.lastModifiedDate.toLocaleDateString(), '</li>');

        var reader = new FileReader();
        reader.readAsText(f);
        // Closure to capture the file information.
        reader.onload = loadHandler2;

        // Read in the image file as a data URL.
        //reader.readAsDataURL(f);

        console.log(reader);

    }
    //document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';


}


function getOptions(){
    var shortName=document.getElementById("short").value;
    var fullNmae=document.getElementById("full").value;

    var yearBegin = document.getElementById("year_begin").value.substring(0,4);
    var yearEnd = document.getElementById("year_end").value.substring(0,4);
    if(yearBegin == yearEnd){
        var interval = yearBegin;
    }else {
        var interval = document.getElementById("year_begin").value.substring(0,4)+"-"+document.getElementById("year_end").value.substring(0,4);
    }

    //var interval = "2000-2004"
    var identity = shortName.toUpperCase()+"-"+interval;

    var input =[shortName,fullNmae,interval,identity];

    return input;
}

