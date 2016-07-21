import sys
import os
import subprocess
from .components import all_modules
from .validators import *


def get_adapter_for_url(url):
    adapters = all_modules()
    for adapter in adapters:
        for rule in adapter['rules']:
            if rule.search(url):
                return adapter


def run_adapter(adapter, url):
    parameters = [sys.executable, adapter['runner'], url]
    parameters.extend(adapter['parameters'])

    cwd = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

    pythonpath = os.environ.get('PYTHONPATH', '')
    if pythonpath != '':
        pythonpath += ';'
    pythonpath += cwd

    env = os.environ.copy()
    env['PYTHONPATH'] = pythonpath

    stdout_data = subprocess.check_output(parameters, env=env, cwd=cwd)
    return stdout_data


def run_url(url):
    adapter = get_adapter_for_url(url)
    if adapter is not None:
        output = run_adapter(adapter, url)
        if adapter['kind'] == 'csv':
            if validate_csv(output):
                return 'text/csv', output
        elif adapter['kind'] == 'fdp':
            if validate_fdp(output):
                return 'application/json', output
    return None, None
