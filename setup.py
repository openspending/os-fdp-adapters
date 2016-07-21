
try:
    from setuptools import setup
except ImportError:
    from distutils.core import setup

config = {
    'description': 'OS FDP Adapters',
    'author': 'Adam Kariv',
    'url': 'http://github.com/openspending/os-fdp-adapters',
    'download_url': 'http://github.com/openspending/os-fdp-adapters',
    'author_email': 'adam.kariv@okfn.org',
    'version': '0.1',
    'install_requires': [],
    'packages': ['os_fdp_adapters'],
    'scripts': [],
    'name': 'projectname'
}

setup(**config)
