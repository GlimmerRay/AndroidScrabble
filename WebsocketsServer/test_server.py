import socket
from protocol import make_handshake_from_request, get_payload


######## CREATE THE SOCKET #########
server_socket = socket.socket(
    socket.AF_INET,
    socket.SOCK_STREAM,
    proto=0
)

server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
server_socket.bind(('localhost', 10000))
####################################

server_socket.listen(10)

while True:
    connection, address = server_socket.accept()
    data = connection.recv(1024)
    print(data)
    handshake = make_handshake_from_request(data)
    connection.send(handshake)
    data = connection.recv(1024)
    print(data)
    print(get_payload(data))