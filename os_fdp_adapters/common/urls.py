import os
import urllib.parse


OS_FDP_ADAPTER_ENDPOINT = \
    os.environ.get('OS_FDP_ADAPTER_ENDPOINT',
                   'https://openspending.org/fdp-adapter/convert')


def wrap(url):
    if url.startswith('http://') or url.startswith('https://'):
        return OS_FDP_ADAPTER_ENDPOINT + '?url=' + urllib.parse.quote_plus(url)
    else:
        return url


def to_github(path):
    repo_slug = \
        os.environ.get('TRAVIS_REPO_SLUG', 'openspending/os-fdp-adapters')
    commit = os.environ.get('TRAVIS_COMMIT', 'master')
    return os.path.join(
        'https://raw.githubusercontent.com/{}/{}/os_fdp_adapters/'
        .format(repo_slug, commit), path)
