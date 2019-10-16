import * as bitcoin from 'bitcoinjs-lib';

const config = {
  network: bitcoin.networks.testnet,
  apiURIs: {
    address: 'https://api.blockchair.com/bitcoin/testnet/dashboards/address',
    pushTx: 'https://api.blockchair.com/bitcoin/testnet/push/transaction'
  },
  owner: {
    name: 'Alice (owner)',
    mnemonic: 'assist drama typical garbage artwork devote expect invest theme speed surge you',
    derivationPath: `m/44'/1'/0'/0/0`
  },
  heir: {
    name: 'Bob (heir)',
    mnemonic: 'boat ecology top asthma second zero brush episode consider select noble unaware',
    derivationPath: `m/44'/1'/0'/0/0`
  },
  sequenceFeed: { blocks: 1 },
  fee: 10000
};

export default config;