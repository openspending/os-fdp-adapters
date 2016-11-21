import json
import os
import yaml
import urllib.parse
import os_fdp_adapters.manager as manager

from os_fdp_adapters.common.urls import to_github

ENDPOINT = 'http://example.com/endpoint'


def setup():
    os.environ['OS_FDP_ADAPTER_ENDPOINT'] = ENDPOINT


def teardown():
    pass


def _single_module_test(module):
    module_path = module['path']
    with open(os.path.join(module_path, 'tests', 'tests.yml')) as test_spec:
        tests = yaml.load(test_spec.read())
        for test in tests:
            source = test['source']
            print("TESTING FOR {}".format(source))
            expected_datapackage = test['expected']['datapackage']
            expected_resources = test['expected']['resources']
            sources = []
            if not source.startswith('http'):
                source = os.path.join(module_path, 'tests', source)
                source = os.path.abspath(source).replace(os.path.abspath(os.curdir)+'/os_fdp_adapters/', '')
                github_url = to_github(source)
                sources.extend([source, github_url])
            else:
                sources = [source]
            for _url in sources:
                print("\tURL: {}".format(_url))
                _, output = manager.run_url(_url)
                assert(output is not None)
                datapackage = open(os.path.join(module_path, 'tests', expected_datapackage), 'rb').read().rstrip()
                if _url == source:
                    assert(output.rstrip() == datapackage)
                print("\tDATAPACKAGE OK: {}".format(output))
                datapackage = json.loads(output.decode('ascii'))
                for resource, expected_resource in \
                        zip(datapackage.get('resources',[]), expected_resources):
                    res_url = resource.get('url',resource.get('path'))
                    if res_url.startswith(ENDPOINT):
                        res_url = res_url.split('?', 1)[1].split('=', 1)[1]
                        res_url = urllib.parse.unquote_plus(res_url)
                    # elif not res_url.startswith('http'):
                        # res_url = os.path.join(module_path, 'tests', res_url)
                    print("\t\tRES_URL: {}".format(res_url))
                    _, output = manager.run_url(res_url)
                    assert(output is not None)
                    resource = open(os.path.join(module_path, 'tests', expected_resource), 'rb').read().rstrip()
                    print(output.rstrip())
                    print(resource)
                    assert(output.rstrip() == resource)


for module in manager.all_modules():
    if module['kind'] != 'fdp':
        continue

    name = '_'+module['id']

    def _tester(m):
        _module = m
        return lambda: _single_module_test(_module)
    globals()['test'+name] = _tester(module)
