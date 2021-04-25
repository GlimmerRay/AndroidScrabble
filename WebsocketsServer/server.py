from random import randint
import sys
import threading
import json

from server_utils import create_server_socket
from protocol import *
from game_management import *

def main_server():
    # set up the socket and the connections queue
    server_socket = create_server_socket()
    server_socket.listen(10)
    connections = []
    while True:
        # block until an incoming connection is received
        connection, address = server_socket.accept()
        print('made a connection')

        # upgrade to a websocket connection
        handshake = make_handshake_from_request(connection.recv(1024))
        connection.send(handshake)

        connections.append(connection)

        # if there are two connections in the queue, send them off
        # to the game server and reset the queue
        if len(connections) == 2:
            threading.Thread(target=game_server, args=(connections[0], connections[1])).start()
            connections = []

def game_server(connection1, connection2):

    print('starting game server')

    # make sure each client has the same bag
    bag = get_bag_from(connection1)
    send_bag(connection2, bag)
    
    # connection1 gets the first turn
    send_turn(connection1, True)
    send_turn(connection2, False)

    while True:
        # block until data is received
        data = connection1.recv(1024)

        # assume that the data is the board and bag
        board_and_bag = get_payload(data)
        board_and_bag = json.loads(board_and_bag)

        # sync w/ connection2
        send_board_and_bag(board_and_bag, connection2)

        send_turn(connection1, False)
        send_turn(connection2, True)

        # block until data is received
        data = connection2.recv(1024)

        # assume that the data is the board and bag
        board_and_bag = get_payload(data)
        board_and_bag = json.loads(board_and_bag)

        # sync w/ connection1
        send_board_and_bag(board_and_bag, connection1)

        send_turn(connection1, True)
        send_turn(connection2, False)
        
main_server()