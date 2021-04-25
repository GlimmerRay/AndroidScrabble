from base64 import b64encode
from hashlib import sha1

def make_handshake_from_request(request):
    client_key = get_client_key(request)
    hashed_key = hash_client_key(client_key)
    return make_handshake_from_key(hashed_key)

def make_handshake_from_key(hashed_key):
    response = b'HTTP/1.1 101 Switching Protocols\r\n'
    response += b'Upgrade: websocket\r\n'
    response += b'Connection: Upgrade\r\n'
    response += b'Sec-WebSocket-Accept: ' + hashed_key + b'\r\n'
    response += b'\r\n'
    return response

def hash_client_key(key):
    key = key + b'258EAFA5-E914-47DA-95CA-C5AB0DC85B11'
    encrypt = sha1()
    encrypt.update(key)
    return b64encode(encrypt.digest())
    
def get_client_key(request):
    target_header = b'Sec-WebSocket-Key'
    start = request.find(target_header) + len(target_header) + 2
    end = request.find(b'\r\n', start)
    return request[start:end]

# bit at index 0
def get_fin(request):
    return request[0] >> 7

# bits from index 4 thru 8 exclusive
def get_opcode(request):
    byte = request[0]
    return byte & 0b00001111

# bits from index 9 thru 16
def get_payload_len(request):
    byte = request[1]
    return byte & 0b01111111

def get_extended_payload_len(request):
    payload_len = get_payload_len(request)
    if payload_len == 126:
        return int.from_bytes(request[2:4], 'big')
    elif payload_len == 127:
        return int.from_bytes(request[4:7], 'big')

# bytes from index 4 thru 6 (assuming small payload)
def get_masking_key(request):
    payload_len = get_payload_len(request)
    if payload_len < 126:
        return request[2:6]
    elif payload_len == 126:
        return request[4:8]
    elif payload_len == 127:
        return request[7:11]

# bytes from index 6 thru 6 + payload_len (assuming small payload)
# XOR'd with the masking_key
def get_payload(request):

    payload_len = get_payload_len(request)
    masking_key = get_masking_key(request)

    if payload_len < 126:
        start = 6
        end = payload_len
    elif payload_len == 126:
        start = 8
        end = get_extended_payload_len(request)
    else:
        start = 11
        end = get_extended_payload_len(request)

    payload = []
    for i in range(start, start+end):
        secret_char = request[i]
        char = secret_char ^ masking_key[(i-start)%4]
        payload.append(char)
    return bytes(payload).decode()

def make_text_response(text):
    _bytes = []
    _bytes.append(0b10000001)
    if len(text) >= 126:
        _bytes.append(126)
        _bytes.append(len(text) // 256)
        _bytes.append(len(text) % 256)
        for char in text:
            _bytes.append(ord(char))
    else:
        _bytes.append(len(text))
        for char in text:
            _bytes.append(ord(char))
    return bytes(_bytes)