import sys
import csv
import json
import openpyxl
import xlrd
import six


def to_bytes(x):
    if six.PY2 and type(x) is six.text_type:
        return x.encode('utf8')
    return x

filename = sys.argv[1]
if filename.endswith('.csv'):
    filename = filename[:-4]
    try:
        wb = openpyxl.reader.excel.load_workbook(filename, read_only=True, data_only=True)
        ws = wb.worksheets[0]
        data = [[to_bytes(cell.value) for cell in row] for row in ws.rows]
    except:
       wb = xlrd.open_workbook(filename)
       sh = wb.sheet_by_index(0)
       data = [[to_bytes(cell.value) for cell in row] for row in sh.get_rows()]
        
    w = csv.writer(sys.stdout)
    w.writerows(data)
else:
    print(json.dumps({
        "name": "xls2csv",
        "title": "xls2csv",
        "model": {
            "measures":{},
            "dimensions":{}
        },
        "resources": [
            {
                "path": filename + ".csv"
            }
        ]
    },sort_keys=True))
