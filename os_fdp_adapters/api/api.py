from flask import Blueprint, request, abort, Response
from .. import manager as manager


OSFdpAdapter = Blueprint('os-fdp-adapter', __name__)


@OSFdpAdapter.route('convert')
def convert():
    url = request.values.get('url')
    content_type, output = manager.run_url(url)
    if output is None or content_type is None:
        abort(404)
    return Response(output, content_type=content_type)
