import os
import io
from setuptools import setup, find_packages

__version__ = '0.0.1'


# Helpers
def read(*segments):
    path = os.path.join(*segments)
    with io.open(path, encoding='utf-8') as f:
        return f.read().strip()


README = read('README.md')

setup(
    name='os_fdp_adapters',
    version=__version__,
    description='Convert various data formats into FDP',
    long_description=README,
    classifiers=[
        'Development Status :: 3 - Alpha',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.6'
    ],
    keywords='api fiscal datapackage fdp openspending',
    author='OpenSpending',
    author_email='info@openspending.org',
    url='http://github.com/openspending/os-fdp-adapters',
    download_url='http://github.com/openspending/os-fdp-adapters',
    license='MIT',
    packages=find_packages(exclude=['ez_setup', 'examples', 'test']),
    namespace_packages=[],
    package_data={
        '': ['*.json'],
    },
    zip_safe=False,
    install_requires=[
        # We're using requirements.txt
    ],
    tests_require=[
        'tox',
    ]
)
