import json
import datapackage


def validate_csv(stream):
    stream = stream.decode('utf8')
    return True


def validate_fdp(stream):
    stream = stream.decode('ascii')
    stream = json.loads(stream)
    dpo = datapackage.schema.Schema('fiscal')
    dpo.validate(stream)
    return True
