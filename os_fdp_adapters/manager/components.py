import os
import yaml
import re

ROOT=os.path.join(os.path.dirname(__file__),'..')


def resolve_runner(path, filename):
    for fullpath in [
        os.path.join(path,filename+'.py'),
        os.path.join(path, '..', 'common', filename+'.py'),
    ]:
        if os.path.exists(fullpath):
            return fullpath
    raise FileNotFoundError(filename)


def parse_adapter(path, filename):
    try:
        with open(os.path.join(path, filename)) as stream:
            adapters = stream.read()
            adapters = yaml.load(adapters)
            i = 1
            for adapter in adapters['adapters']:
                assert(adapter['kind'] in ['csv', 'fdp'])
                adapter['rules'] = [
                    re.compile(rule)
                    for rule in adapter['rules']
                ]
                adapter['parameters'] = adapter.get('parameters', [])
                assert(type(adapter['parameters']) is list)
                adapter['runner'] = resolve_runner(path, adapter['runner'])
                adapter['path'] = os.path.abspath(path)
                adapter['id'] = os.path.basename(path).replace('-','_')+"_{}".format(i)
                yield adapter
                i += 1
    except Exception as e:
        print(e)


def all_modules(root=ROOT, descriptor_filename='adapter.yml'):
    for dirpath, dirnames, filenames in os.walk(root):
        if descriptor_filename in filenames:
            adapters = parse_adapter(dirpath, descriptor_filename)
            if adapters is not None:
                for adapter in adapters:
                    yield adapter
