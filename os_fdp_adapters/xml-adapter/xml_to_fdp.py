import json
import subprocess
import os
import sys
from time import sleep

#github lib of the xml->csv package
XCGITHUB="https://github.com/wk0206/testPorject2.git"
#nodejs package name of the xml->csv
XCPACKAGE = "combineXMLdata"
PORT = 8888

testfile1 = "https://raw.githubusercontent.com/wk0206/testPorject2/master/test.xml" #works
testfile2 = "file:///Users/tdong/git/os-fdp-adapters/os_fdp_adapters/xml-adapter/tests/test.xml" #not work
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
    

def xml_csves(xmlFile):
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
        xmlLink = "http://localhost:8888/\[{}\]".format(xmlFile)
    else:
        xmlLink = "http://localhost:8888/\[{}\]".format(xmlFile)
    
    command = "curl \'"+xmlLink + "' &"
    os.system(command)


def generate_fdp(xmlFile):
    basename = os.path.splitext(os.path.basename(xmlFile))[0]
    print('to do : create datapackage.json using <basename>')


def xml_2_fdp(xmlFile):
    xml_csves(xmlFile)
    generate_fdp(xmlFile)


xmlfilename = sys.argv[1]
xml_csves(xmlfilename)

'''
if __name__ == '__main__':
    if no_xml2csv_package():
        print('no xml2csv package')
    else:
        print('have xml2csv package')
    if have_tools():
        print('have tools')
    else:
        print('have no tools')
    if is_service_started(PORT):
        print('service started')
    else:
        print('service not started')
    
    xml_csves(testfile1)
'''