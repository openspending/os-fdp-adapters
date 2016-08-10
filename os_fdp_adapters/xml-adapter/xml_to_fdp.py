import json
import subprocess
import threading
import os
import sys
from time import sleep

#github lib of the xml->csv package
XCGITHUB="https://github.com/wk0206/testPorject2.git"
#nodejs package name of the xml->csv
XCPACKAGE = "combineXMLdata"
PORT = 8888
TARGET_BASE_PATH = '/tmp/transformTool'

testfile1 = "https://raw.githubusercontent.com/wk0206/testPorject2/master/test_simple.xml" #works
testfile2 = "file:///Users/tdong/git/os-fdp-adapters/os_fdp_adapters/xml-adapter/tests/test_eu2014_10.xml" #not work for local file for the moment
testfile3 = "http://www.wenxion.net/pub/test.xml" #works

toolList = ['npm', 'node', 'curl']


def check_tools():
    for tl in toolList:
        checkFail = subprocess.call(['which', tl])
        if checkFail:
            print('Missing tools: ', tl)
            return False
    return True


def no_xml2csv_package():
    for ftuple in os.walk('.'):
        if XCPACKAGE in ftuple[0]:
            return False
    return True


def is_service_started(PORT):
    if subprocess.call(["lsof", "-i:"+str(PORT)]) == 0:
        return True
    else:
        return False


def get_process_id_str_using(PORT):
    out = subprocess.check_output(["lsof", "-i:"+str(PORT)])
    return out.split()[10].decode("utf-8") 
    

def xml2csv(xmlLink):
    if (no_xml2csv_package() and check_tools()):
        subprocess.call(["npm", "install", XCGITHUB])
        if is_service_started(PORT):
            pid_str = get_process_id_str_using(PORT)
            subprocess.call(['kill', '-9', pid_str])
    elif (no_xml2csv_package() and  not check_tools()):
        print('tools missing for installing xml2csv package.\n')
        return 
    
    if not is_service_started(PORT):
        subprocess.Popen(['node', 'node_modules/'+XCPACKAGE, '&'])  
        print('service started...')
        sleep(5)
        xmlLink = "http://localhost:8888/\[{}\]".format(xmlLink)
    else:
        xmlLink = "http://localhost:8888/\[{}\]".format(xmlLink)
    
    command = "curl \'"+xmlLink + "' &"
    os.system(command)


def generate_fdp(xmlLink):
    """
    :param xmlLink: https://XXXXX/test_simple_obeu.xml
    :return: print the datapackage.json on the stdout

    """
    global TARGET_BASE_PATH
    basename = os.path.splitext(os.path.basename(xmlLink))[0]
    targetpath = os.path.join(TARGET_BASE_PATH, basename)
    sourcelst = []

    while not os.path.isdir(targetpath):
        print('waiting...for... producing.. in..', targetpath)
        sleep(3)

    found = False
    wait_time = 60
    count = 0
    while not found:
        for file in os.listdir(targetpath):
            if os.path.isdir(os.path.join(targetpath, file)):
                total_csvs = int(file)
                for i in range(total_csvs):
                    csvfile = str(i)+".csv"
                    sourcelst.append({'path': os.path.join(targetpath, csvfile)})
                found = True
        sleep(3)
        count += 4
        if count > wait_time:
            break
    print()
    json.dump({
        "name": basename,
        "title": basename,
        "model": {
            "measures": {},
            "dimensions": {}
        },
        "resources": sourcelst
    }, sys.stdout, sort_keys=True)
    print()


def xml_2_fdp(xmlLink):
    xml2csv(xmlLink)
    generate_fdp(xmlLink)


xmlAtWeb = sys.argv[1]
xml_2_fdp(xmlAtWeb)
