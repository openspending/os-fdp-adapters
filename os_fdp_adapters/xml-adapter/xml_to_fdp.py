import sys
import csv
import json
import os
import subprocess
import six
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
    orginBaseName = os.path.basename(url)
    if not url.startswith('http'):
        url = os.path.abspath(url)
    csvString = subprocess.check_output(['xml2csv', url, '-a', '135']).decode("utf-8")
    return split_str_into_single_csvs(csvString, orginBaseName)


def gen_all_csv_file_names(url):
    """
    :param url: url can be the absolute address of an xml file, or  an xml file located at web (http://..../<name>.xml
    :return: list of csv files, each contains a data-table extracted from the input xml file
    """
    orginBaseName = os.path.basename(url)
    if not url.startswith('http'):
        url = os.path.abspath(url)
    csvString = subprocess.check_output(['xml2csv', url, '-a', '135']).decode("utf-8")
    return create__csv_file_names(csvString, orginBaseName)


def create__csv_file_names(csvString, orginBaseName, tableSeparator="\n\n\n"):
    """
    :param csvString:  is the extracted content
    :param orginBaseName: the file name selected by the user
    :param tableSeparator:
    :return: a list of csv file names
    """
    count = -1
    csvLst = []
    for oneTable in csvString.split(tableSeparator)[:-1]:
        if oneTable != '':
            count += 1
            baseName = os.path.splitext(orginBaseName)[0]
            csvFileName = os.path.join(baseName + "#" + str(count) + ".xml.csv")
            csvLst.append(csvFileName)
    return csvLst


def print_n_th_csv_content(url, n=0, tableSeparator="\n\n\n"):
    """
    :param url: url can be the absolute address of an xml file, or  an xml file located at web (http://..../<name>.xml
    :param n: n-th csv, the first csv is pointed by n=0
    :return: content of n-th csv
    """
    if not url.startswith('http'):
        url = os.path.abspath(url)
    csvString = subprocess.check_output(['xml2csv', url, '-a', '135']).decode("utf-8")
    csvContentLst = csvString.split(tableSeparator)[:-1]
    if n < len(csvContentLst) and n > -1:
        print(csvContentLst[n])
    else:
        print("Totally ", len(csvContentLst), " csv files.\n n=",n, " is out of the range\n")


def split_str_into_single_csvs(csvString, orginBaseName, tableSeparator="\n\n\n"):
    """
    :param  csvString is the extracted content
            orginBaseName: the file name selected by the user
    :return: a list of csv file names, each is csv file containing one data-table
    """
    count = -1
    csvLst = []
    for oneTable in csvString.split(tableSeparator)[:-1]:
        if oneTable != '':
            count += 1
            testPath = "xml-adapter/tests"
            baseName = os.path.splitext(orginBaseName)[0]
            csvFileName = os.path.join(testPath, baseName+"#"+str(count)+".xml.csv")
            with open(csvFileName, 'bw+') as csvFd:
                oneTable = '\r\n'.join(oneTable.split('\n'))
                csvFd.write(str.encode(oneTable, 'utf8'))
            csvLst.append(csvFileName)
    return csvLst


filename = sys.argv[1]

if filename.endswith('.csv'):
    xmlfilename = filename.split('#')[0]+".xml"
    nThCsv = int(filename.split('#')[1][:-8])
    print_n_th_csv_content(xmlfilename, n=nThCsv)
else:
    """
    input url link of xml,
    extract csv files, and save them as template files
    wrap file names, and list them in the 'resources' key
    """
    csvLst = gen_all_csv_file_names(filename)
    nameLst = []
    for csvName in csvLst:
        nameLst.append({"url": wrap(csvName)})
    json.dump({
        "name": "xml2csv",
        "title": "xml2csv",
        "model": {
            "measures":{},
            "dimensions":{}
        },
        "resources": nameLst
    }, sys.stdout, sort_keys=True)
