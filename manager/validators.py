import json

def validate_csv(stream):
    stream = stream.decode('utf8')
    return True

def validate_fdp(stream):
    stream = stream.decode('ascii')
    stream = json.loads(stream)
    return True
