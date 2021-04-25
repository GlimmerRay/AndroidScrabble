import socket

def create_server_socket():
    server_socket = socket.socket(
        socket.AF_INET,      # set protocol family to 'Internet' (INET)
        socket.SOCK_STREAM,  # set socket type to 'stream' (i.e. TCP)
        proto=0              # set the default protocol (for TCP it's IP)
    )
    # So we can easily stop and restart the server
    # Only necessary during development
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server_socket.bind(('localhost', 8888))
    return server_socket