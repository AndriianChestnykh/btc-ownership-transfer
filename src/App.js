import React from 'react'
import Person from './components/Person'
import Transactions from './components/Transactions'
import config from './config'
import Intermediate from './components/Intermediate'
import { getHDChild } from './utils'
import axios from 'axios'

class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      owner: config.owner,
      heir: config.heir,
      network: config.network,
      blocks: undefined,
      statsTime: undefined
    }

    const { owner, heir, network } = this.state
    Object.assign(this.state, this.getStorage(owner, heir, network))

    this.updateMnemonic = this.updateMnemonic.bind(this)
    this.addTx = this.addTx.bind(this)
    this.removeTx = this.removeTx.bind(this)
    this.addIntermediate = this.addIntermediate.bind(this)
    this.removeIntermediate = this.removeIntermediate.bind(this)
    this.refresh = this.refresh.bind(this)

    this.refresh()
  }

  getStorageKey (owner, heir, network) {
    const { address: addressOwner } = getHDChild(owner.mnemonic, owner.derivationPath, network)
    const { address: addressHeir } = getHDChild(heir.mnemonic, heir.derivationPath, network)
    return `${addressOwner}_${addressHeir}`
  }

  getStorage (owner, heir, network) {
    const storage = JSON.parse(localStorage.getItem(this.getStorageKey(owner, heir, network)))
    return {
      intermediate: storage ? storage.intermediate : [],
      txs: storage ? storage.txs : []
    }
  }

  setStorage (data) {
    const { owner, heir, network, storage } = data
    localStorage.setItem(this.getStorageKey(owner, heir, network), JSON.stringify(storage))
  }

  updateMnemonic (person, mnemonic) {
    const { owner, heir, network } = this.state
    person === 'owner' ? owner.mnemonic = mnemonic : heir.mnemonic = mnemonic
    const storage = this.getStorage(owner, heir, network)
    const newState = Object.assign(
      {},
      this.state,
      { [person]: Object.assign({}, this.state[person], { mnemonic }) },
      storage
    )

    this.setState((state, props) => {
      return newState
    })
  }

  addStateData (data, propName, keyName) {
    let newProp
    if (this.state[propName].filter(value => value[keyName] === data[keyName]).length === 0) {
      newProp = this.state[propName].concat([data])
    } else {
      newProp = this.state[propName].slice()
      const index = newProp.indexOf(value => value[keyName] === data[keyName])
      newProp[index] = data
    }

    this.setState(state => {
      const { owner, heir, network } = this.state
      const storage = this.getStorage(owner, heir, network)
      storage[propName] = newProp
      this.setStorage({ owner, heir, network, storage })
      return { [propName]: newProp }
    })
  }

  removeStateData (propName, keyName, keyValue) {
    const filtered = this.state[propName].filter(value => value[keyName] === keyValue)
    if (filtered.length !== 0) {
      const newProp = this.state[propName].slice()
      const index = this.state[propName].indexOf(filtered[0])
      newProp.splice(index, 1)
      this.setState(state => {
        const { owner, heir, network } = this.state
        const storage = this.getStorage(owner, heir, network)
        storage[propName] = newProp
        this.setStorage({ owner, heir, network, storage })
        return { [propName]: newProp }
      })
    }
  }

  addTx (tx) {
    this.addStateData(tx, 'txs', 'id')
  }

  removeTx (txid) {
    this.removeStateData('txs', 'id', txid)
  }

  addIntermediate (data) {
    this.addStateData(data, 'intermediate', 'address')
  }

  removeIntermediate (address) {
    this.removeStateData('intermediate', 'address', address)
  }

  async refresh () {
    const uri = config.apiURIs.stats
    console.log(`Fetching for blockchain stats from ${uri}`)
    const response = await axios.get(uri)
      .catch(error => alert('Blockchain API request error: ' + error))
    this.setState({ blocks: response.data.data.blocks, statsTime: Date.now() })
  }

  render () {
    const refreshButton = <button onClick={() => this.refresh()}><b>Refresh Blockchain data</b></button>
    return (
      <div className='ui container'>
        <br />
        <h2 className='ui header center aligned'>Bitcoin safe inheritance</h2>
        <p>This Proof-of-Concept represents secure and convenient Bitcoin transfer from owner to heir(recovery) party in case if owner's keys are lost or some accident happens. This is trustless model between owner and heir as long as owner has exclusive control of her private keys. Heir delay time is fixed and equals to 6 Bitcoin blocks.</p>
        <p>Please refer to <a href='https://bitcointalk.org/index.php?topic=5185907.0'>this Bitcointalk discussion</a> for more motivation info and details.</p>
        <p style={{ color: 'red' }}>It works on Bitcoin TESTNET. Please DON'T use mnemonics from your Bitcoin mainnet funds! That is potentially not safe and may cause your funds to be lost forever.</p>
        <p align='center'>{refreshButton}</p>
        <div className='ui four column doubling stackable grid container'>
          <div className='column'>
            <Person
              person='owner'
              owner={this.state.owner}
              heir={this.state.heir}
              updateMnemonic={this.updateMnemonic}
              actions={{ addTx: this.addTx }}
              blocks={this.state.blocks}
              statsTime={this.state.statsTime}
            />
          </div>
          <div className='column'>
            <Transactions txs={this.state.txs} removeTx={this.removeTx} addIntermediate={this.addIntermediate} />
          </div>
          <div className='column'>
            <Intermediate
              addressesData={this.state.intermediate}
              actions={{ sendToOwner: this.removeIntermediate, sendToHeir: this.removeIntermediate }}
              blocks={this.state.blocks}
              statsTime={this.state.statsTime}
              owner={this.state.owner}
              heir={this.state.heir}
            />
          </div>
          <div className='column'>
            <Person
              person='heir'
              owner={this.state.owner}
              heir={this.state.heir}
              updateMnemonic={this.updateMnemonic}
              actions={{}}
              blocks={this.state.blocks}
              statsTime={this.state.statsTime}
            />
          </div>
        </div>
        <h3>Bitcoin testnet faucet</h3>
        <ul>
          <li><a href='https://coinfaucet.eu/en/btc-testnet/'>https://coinfaucet.eu/en/btc-testnet/</a></li>
        </ul>
        <h3>Source code</h3>
        <ul>
          <li><a href='https://github.com/AndriianChestnykh/btc-safe-inherinance'>https://github.com/AndriianChestnykh/btc-safe-inherinance</a></li>
        </ul>
        <h3>Libraries</h3>
        <ul>
          <li><a href='https://github.com/bitcoinjs/bitcoinjs-lib'>BitcoinJS</a></li>
          <li><a href='https://github.com/bitcoinjs/bip39'>bip39</a></li>
          <li><a href='https://github.com/bitcoinjs/bip68'>bip68</a></li>
        </ul>
        <h3>Blockchain API providers</h3>
        <ul>
          <li><a href='https://blockchair.com/'>Blockchair</a></li>
        </ul>
      </div>
    )
  }
}

export default App

// Send coins back, when you don't need them anymore to the address
// mv4rnyY3Su5gjcDNzbMLKBQkBicCtHUtFB
