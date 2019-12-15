import * as bitcoin from 'bitcoinjs-lib'

const network = bitcoin.networks.testnet
const networkUrlPart = new Map([
  [bitcoin.networks.testnet, 'bitcoin/testnet'],
  [bitcoin.networks.bitcoin, 'bitcoin']
])

const config = {
  network: network,
  apiURIs: {
    address: `https://api.blockchair.com/${networkUrlPart.get(network)}/dashboards/address`,
    pushTx: `https://api.blockchair.com/${networkUrlPart.get(network)}/push/transaction`,
    stats: `https://api.blockchair.com/${networkUrlPart.get(network)}/stats`
  },
  owner: {
    name: 'Alice (owner)',
    mnemonic: '',
    derivationPath: 'm/44\'/1\'/0\'/0/0'
  },
  heir: {
    name: 'Bob (heir)',
    mnemonic: '',
    derivationPath: 'm/44\'/1\'/0\'/0/0'
  },
  sequenceFeed: { blocks: 6 },
  fee: 10000
}

export default config
