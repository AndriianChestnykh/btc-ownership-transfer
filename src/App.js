import React from 'react';
import Person from './components/Person';
import Transactions from './components/Transactions';
import config from './config';
import Intermediate from "./components/Intermediate";
import {getHDChild} from "./utils";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      owner: config.owner,
      heir: config.heir,
      network: config.network
    };

    const { owner, heir, network } = this.state;
    Object.assign(this.state, this.getStorage(owner, heir, network));

    this.updateMnemonic = this.updateMnemonic.bind(this);
    this.addTx = this.addTx.bind(this);
    this.removeTx = this.removeTx.bind(this);
    this.addIntermediate = this.addIntermediate.bind(this);
    this.removeIntermediate = this.removeIntermediate.bind(this);
  }

  getStorageKey(owner, heir, network) {
    const { address: addressOwner } = getHDChild(owner.mnemonic, owner.derivationPath, network);
    const { address: addressHeir } = getHDChild(heir.mnemonic, heir.derivationPath, network);
    return `${addressOwner}_${addressHeir}`
  }

  getStorage(owner, heir, network) {
    const storage = JSON.parse(localStorage.getItem(this.getStorageKey(owner, heir, network)));
    return {
      intermediate: storage ? storage.intermediate: [],
      txs: storage ? storage.txs: []
    }
  }

  setStorage(data) {
    const { owner, heir, network, storage } = data;
    localStorage.setItem(this.getStorageKey(owner, heir, network), JSON.stringify(storage));
  }

  updateMnemonic(person, mnemonic) {
    const { owner, heir, network } = this.state;
    person === 'owner' ? owner.mnemonic = mnemonic: heir.mnemonic = mnemonic;
    const storage = this.getStorage(owner, heir, network);
    const newState = Object.assign(
      {},
      this.state,
      {[person]: Object.assign({}, this.state[person], { mnemonic })},
      storage
    );

    this.setState((state, props) => {
      return newState
    });
  }

   addStateData(data, propName, keyName) {
    let newProp;
    if (this.state[propName].filter(value => value[keyName] === data[keyName]).length === 0) {
      newProp = this.state[propName].concat([data]);
    } else {
      newProp = this.state[propName].slice();
      const index = newProp.indexOf(value => value[keyName] === data[keyName]);
      newProp[index] = data;
    }

    this.setState(state => {
     const { owner, heir, network } = this.state;
     let storage = this.getStorage(owner, heir, network);
     storage[propName] = newProp;
     this.setStorage({ owner, heir, network, storage });
     return { [propName]: newProp }
    });
  }

  removeStateData(propName, keyName, keyValue) {
    const filtered = this.state[propName].filter(value => value[keyName] === keyValue);
    if (filtered.length !== 0) {
      const newProp = this.state[propName].slice();
      const index = this.state[propName].indexOf(filtered[0]);
      newProp.splice(index, 1);
      this.setState(state => {
        const { owner, heir, network } = this.state;
        let storage = this.getStorage(owner, heir, network);
        storage[propName] = newProp;
        this.setStorage({ owner, heir, network, storage });
        return { [propName]: newProp }
      });
    }
  }

  addTx(tx) {
    this.addStateData(tx, 'txs', 'id');
  }

  removeTx(txid) {
    this.removeStateData('txs', 'id', txid);
  }

  addIntermediate(data) {
    this.addStateData(data, 'intermediate', 'address');
  }

  removeIntermediate(address) {
    this.removeStateData('intermediate', 'address', address);
  }

  // '2MyhmXWCppJMQH1ui42J7jF4iw4j5aPufHU'
  render(){
    return (
      <div className="ui container">
        <p/>
        <h2 className="ui header center aligned">Safe Bitcoin inheritance</h2>
        <div className="ui four column doubling stackable grid container">
          <div className="column">
            <Person mnemonic={this.state.owner.mnemonic}
                    person="owner"
                    updateMnemonic={this.updateMnemonic}
                    actions={{ addTx: this.addTx }}
            />
          </div>
          <div className="column">
            <Transactions txs={this.state.txs} removeTx={this.removeTx} addIntermediate={this.addIntermediate}/>
          </div>
          <div className="column">
            <Intermediate addressesData={this.state.intermediate}
                          actions={{ sendToOwner: this.removeIntermediate, sendToHeir: this.removeIntermediate }}/>
          </div>
          <div className="column">
            <Person mnemonic={this.state.heir.mnemonic}
                    person="heir"
                    updateMnemonic={this.updateMnemonic}
                    actions={{}}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;


// Send coins back, when you don't need them anymore to the address
// mv4rnyY3Su5gjcDNzbMLKBQkBicCtHUtFB