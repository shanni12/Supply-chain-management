import pdb

from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from block_chain import Blockchain


app = Flask(__name__)
CORS(app, resources={r'/*': {'origins': 'http://localhost:3000'}})
blockchain = Blockchain()


@app.route('/')
def route_default():
    return 'Welcome to the blockchain'


@app.route('/blockchain')
def route_blockchain():
    return jsonify(blockchain.to_json())


@app.route('/find/<string:id>')
def find_product_id(id):
    product_history = []
    for block in blockchain.chain:
         if block.data and id == block.data.get("product_id"):
             product_history.append(block)
    return jsonify(list(map(lambda data: data.to_json(), product_history)))


@app.route('/blockchain/range')
@cross_origin(origin='localhost', headers=['Content- Type', 'Authorization'])
def route_blockchain_range():
    start = int(request.args.get('start'))
    end = int(request.args.get('end'))
    return jsonify(blockchain.to_json()[::-1][start:end])


@app.route('/blockchain/length')
@cross_origin(origin='localhost')
def route_blockchain_length():
    return jsonify(len(blockchain.chain))


@app.route('/blockchain/add_block', methods=['POST'])
@cross_origin(origin='localhost')
def add_block():
    transaction_data = request.get_json()
    blockchain.add_block(transaction_data)
    block = blockchain.chain[-1]
    return jsonify(block.to_json())


print(blockchain)
app.run(port=5000, debug=True)