import * as bitcoin from 'bitcoinjs-lib';

const config = {
  network: bitcoin.networks.testnet,
  apiURIs: {
    address: 'https://api.blockchair.com/bitcoin/testnet/dashboards/address'
  },
  owner: {
    name: 'Alice (owner)',
      defaultMnemonic: 'assist drama typical garbage artwork devote expect invest theme speed surge you',
      defaultDerivationPath: `m/44'/1'/0'/0/0`
  },
  heir: {
    name: 'Bob (heir)',
      defaultMnemonic: 'boat ecology top asthma second zero brush episode consider select noble unaware',
      defaultDerivationPath: `m/44'/1'/0'/0/0`
  }
};

export default config;