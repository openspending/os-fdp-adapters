# OS-FDP-Adapters
Convert various data formats into FDP

## Purpose

This repository contains a collection of converters from various data formats and sources into FDP.
These adapters are used by OpenSpending when importing data into the OpenSpending Data Store. The goal is for OpenSpending importer to handle only FDP sources, and support all other sources through the use of this adapter collection.

## Basic flow

Each converter is used for a single data source. When used, it will convert the data source into a Fiscal Data Package with all its resources.

Common use case:
 - User provides a URL to OS Importer, which then needs convert to a proper FDP
 - The correct adapter to handle this URL is found by matching the URL with a URL pattern per adapter 
 - The adapter code is called, it returns a `datapackage.json` file
   - The FDP might contain any meta-data that was extracted from the original source
   - It should also have a list of resources. Each resource with a custom URL - which will be used to extract a CSV file.
 - The file is validated against the schema and if valid is returned to OS Importer
 - The importer then iterates through all resources, and fetches each resource exactly as above:
   - The correct adapter to handle this URL is found by matching the URL with a URL pattern per adapter
   - The adapter code is called, it returns the resource's csv file
   - The file is then validated to be a valid CSV with UTF-8 encoding
   - If valid, the file is returned to OS Importer
   
## Configuration

Each datasource code resides in a separate directory.
In the directory there must be a `adapter.yml` file which contains the adapter definitions.
`adapter.yml` has a root element named `adapters`, which is a list of adapter definitions. Each adapter has the following properties:
  - `urlmatch`: a list of regular expressions for matching potential URLs
  - `run`: name of a python script (without the `.py`) which performs the conversion. The script is resolved from the path containing the adapter definition file.
  - `parameters`: an optional list of string parameters which will be passed to the adapter script
  - `kind`: either `json` or `csv`

## Adapter operation

Each adapter script will receive parameters through the command line.
First argument will always be the matched URL. After that, parameters that were specified in the adapter configuration.
Output file should be printed to `stdout`

## Testing

Each adapter directory should have a subdirectory named `tests`. In this directory a `testcases.yml` file must be present. It must have a `testcases` root element which is a list of test cases. 
Each test case is a list of two elements - a URL and an expected result. The URL must match in one of the rules of the adapter; when running the adapter with the specified URL it must return a file identical to the expected result.
URL can be an external URL or the name of a local file in the `tests` directory.

## Example

Directory structure:
```
/sample-excel-adapter/
   adapter.yml
   excel-adapter.py
   tests/
      testcases.yml
      sample.xls
      datapackage.json
      sample.csv
```

**adapter.yml**
```yml
adapters:
  - urlmatch:
      - "\.xls$"
      - "\.xlsx$"
    run: excel-adapter
    kind: json
  - urlmatch:
      - "\.xls#[0-9]+$"
      - "\.xlsx#[0-9]+$"
    run: excel-adapter
    kind: csv
```

**excel-adapter.py (pseudo-code)**
```py
import sys
import filefetcher
from xls2csv import xls2csv

url = sys.args[1]

if '#' not in url:
  print """{
    "resources": [
      {
        "path": {0}
      }
    ]
  }""".format(url+"#0")
else:
  csv = xls2csv(filefetcher.get(url.split('#')[0]), sheet_index=0)
  print csv
```

**tests/testcases.yml**
```yml
testcases:
  -
    - sample.xls
    - datapackage.json
  -
    - sample.xls#0
    - sample.csv
```
