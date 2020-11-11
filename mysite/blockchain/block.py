import time
import json
import hashlib


GENESIS_DATA = {
    'timestamp': 1,
    'last_hash': 'genesis_last_hash',
    'hash': 'genesis_hash',
    'data': [],
    'difficulty': 3,
    'nonce': 'genesis_nonce'
}


def crypto_hash(*args):
    stringified_args = sorted(map(lambda data: json.dumps(data), args))
    joined_data = ''.join(stringified_args)

    return hashlib.sha256(joined_data.encode('utf-8')).hexdigest()


class Block:
    def __init__(self, timestamp, last_hash, hash, data):
        self.data = data
        self.timestamp = timestamp
        self.last_hash = last_hash
        self.hash = hash

    def __repr__(self):
        return (
            'Block('
            f'timestamp:{self.timestamp}, '
            f'last-hash:{self.last_hash}, '
            f'hash:{self.hash}, '
            f'data:{self.data} ,'
        )

    def __eq__(self, other):
        return self.__dict__ == other.__dict__

    def to_json(self):
        return self.__dict__

    @staticmethod
    def mine_block(last_block, data):
        timestamp = time.time_ns()
        last_hash = last_block.hash
        hash = crypto_hash(timestamp, last_hash, data)
        return Block(timestamp, last_hash, hash, data)

    @staticmethod
    def genesis():
        return Block(GENESIS_DATA['timestamp'], GENESIS_DATA['last_hash'], GENESIS_DATA['hash'], GENESIS_DATA['data'])

    @staticmethod
    def from_json(block_json):
        return Block(**block_json)


def main():
    genesis_block = Block.genesis()
    bad_block = Block.mine_block(genesis_block, 'foo')
    bad_block.last_hash = 'evil-data'


if __name__ == '__main__':
    main()
