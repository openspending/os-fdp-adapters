import tempfile

import requests


def fetch_file_obj(url_or_filename):
    if url_or_filename.startswith('http:') or url_or_filename.startswith('https:'):
        return requests.get(url_or_filename, stream=True).raw
    else:
        return open(url_or_filename)


def fetch_local_filename(url_or_filename):
    if url_or_filename.startswith('http:') or url_or_filename.startswith('https:'):
        r = requests.get(url_or_filename, stream=True)
        with tempfile.NamedTemporaryFile(delete=False) as fd:
            for chunk in r.iter_content(64*1024):
                fd.write(chunk)
                return fd.name
    else:
        return url_or_filename
