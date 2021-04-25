import json
from protocol import *

def get_bag_from(connection):

    to_send = {'message_type': 'send bag'}
    to_send =  json.dumps(to_send)
    to_send = make_text_response(to_send)
    connection.send(to_send)
    
    data = connection.recv(1024)
    payload = get_payload(data)
    bag = json.loads(payload)
    return bag

def send_bag(connection, bag):
    data = {
        'message_type': 'bag',
        'data': bag
    }
    to_send = json.dumps(bag)
    to_send = make_text_response(to_send)
    connection.send(to_send)

def send_turn(connection, turn):
    data = {
        'message_type': 'turn',
        'data': turn
    }
    to_send = json.dumps(data)
    to_send = make_text_response(to_send)
    connection.send(to_send)

def send_board_and_bag(board_and_bag, connection):
    data = {
        'message_type': 'board_and_bag',
        'data': board_and_bag
    }
    to_send = json.dumps(data)
    to_send = make_text_response(to_send)
    connection.send(to_send)
