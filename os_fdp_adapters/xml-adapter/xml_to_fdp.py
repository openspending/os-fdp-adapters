import sys
import csv
import json
import tempfile
import os
import six

sys.path.append('..')
from common.fetchers import fetch_local_filename
from common.urls import wrap

csvDelimiter = ','


def to_bytes(x):
    if six.PY2 and type(x) is six.text_type:
        return x.encode('utf8')
    return x


def gen_csv_file(url):
    """
    :param url: url can be the absolute address of an xml file, or  an xml file located at web (http://..../<name>.xml
    :return: list of csv files, each contains a data-table extracted from the input xml file
    """
    orginBaseName = os.path.basename(url).strip(' ')
    if url.find('http') == -1:
        url = os.path.abspath(url)
    with tempfile.NamedTemporaryFile(delete=False) as fd:
        cmd = "xml2csv {} -a 135 >> {}".format(url, fd.name)
        print('running ', cmd)
        os.system(cmd)
        return split_into_single_csvs(fd.name, orginBaseName)


def split_into_single_csvs(filename, orginBaseName, tableSeparator="\n\n\n"):
    """
    :param  filename: a file containing several data-tables, which are separated by blank lines
    :return: a list of csv file names, each is csv file containing one data-table
    """
    with open(filename, 'r') as fd:
        data = fd.read().split("file exist\n")[-1]
        count = -1
        csvLst = []
        for oneTable in data.split(tableSeparator)[:-1]:
            if oneTable != '':
                count += 1
                #tmpFile = ""
                #with tempfile.NamedTemporaryFile(delete=False) as csvFd:
                #    csvFd.write(str.encode(oneTable, 'utf8'))
                #    tmpFile = csvFd.name
                #path, base = os.path.split(tmpFile)
                #csvFileName = os.path.join(path, orginBaseName+"_"+str(count)+".csv")
                #os.renames(tmpFile , csvFileName)
                absTestPath = os.path.abspath("xml-adapter/tests")
                if count == 0:
                    csvFileName = os.path.join(absTestPath, orginBaseName + "#" + str(count) + ".csv")
                    with open(csvFileName, 'bw+') as csvFd:
                        oneTable = '\n'.join(oneTable.split('\n')[2:])
                        csvFd.write(str.encode(oneTable, 'utf8'))
                else:
                    csvFileName = os.path.join(absTestPath, orginBaseName+"#"+str(count)+".csv")
                    with open(csvFileName, 'bw+') as csvFd:
                        csvFd.write(str.encode(oneTable, 'utf8'))
                csvLst.append(csvFileName)
    return csvLst


filename = sys.argv[1]

if filename.endswith('.csv'):
    filename = fetch_local_filename(filename)
    data = []
    with open(filename, newline='') as csvfile:
        csvreader = csv.reader(csvfile, delimiter=csvDelimiter, quotechar='|')
        data = [[to_bytes(cell) for cell in row] for row in csvreader]
        
    w = csv.writer(sys.stdout)
    w.writerows(data)

else:
    """
    input url link of xml,
    extract csv files, and save them as template files
    wrap file names, and list them in the 'resources' key
    """
    csvLst = gen_csv_file(filename)
    nameLst = []
    for csvName in csvLst:
        nameLst.append({"path": wrap(csvName)})

    json.dump({
        "name": "xml2csv",
        "title": "xml2csv",
        "model": {
            "measures":{},
            "dimensions":{}
        },
        "resources": nameLst
    }, sys.stdout, sort_keys=True)
