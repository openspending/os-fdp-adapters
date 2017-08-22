import sys

from flask import Flask
from flask.ext.cors import CORS
from werkzeug.contrib.fixers import ProxyFix

import logging

from .api import OSFdpAdapter

root = logging.getLogger()
root.setLevel(logging.DEBUG)

ch = logging.StreamHandler(sys.stderr)
ch.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
ch.setFormatter(formatter)
root.addHandler(ch)


def create_app():
    logging.info('OS-FDP-ADAPTERS create_app')
    app = Flask('os_fdp_adapters')
    app.wsgi_app = ProxyFix(app.wsgi_app)
    logging.info('OS-API configuring blueprints')
    app.register_blueprint(OSFdpAdapter, url_prefix='/')
    CORS(app)
    logging.info('OS-FDP-ADAPTERS app created')
    return app


wsgi = create_app()


@wsgi.route('/ping')
def ping():
    return 'pong'

