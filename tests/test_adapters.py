
import os
import yaml
import os_fdp_adapters.manager as manager


def setup():
    pass


def teardown():
    pass


def _single_module_test(module):
    module_path = module['path']
    with open(os.path.join(module_path, 'tests', 'tests.yml')) as test_spec:
        tests = yaml.load(test_spec.read())
        for url, expected in tests:
            if not url.startswith('http'):
                url = os.path.join(module_path, 'tests', url)
                url = os.path.abspath(url).replace(os.path.abspath(os.curdir)+'/os_fdp_adapters/', '')
            _, output = manager.run_url(url)
            assert(output is not None)
            assert(output.rstrip() == open(os.path.join(module_path, 'tests', expected), 'rb').read().rstrip())


for module in manager.all_modules():
    name = '_'+module['id']

    def _tester(m):
        _module = m
        return lambda: _single_module_test(_module)
    globals()['test'+name] = _tester(module)
