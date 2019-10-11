import React from 'react';
import Person from './components/Person';
import Transactions from './components/Transactions';
import config from './config';
import Intermediate from "./components/Intermediate";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      owner: {
        mnemonic: config.owner.mnemonic,
        // address: ''
      },
      heir: {
        mnemonic: config.heir.mnemonic,
        // address: ''
      },
      intermediate: {
        // address: {
        //   redeemScript: '',
        //   lockPeriod: {},
        //   txs: []
        // }
      }
    };

    this.updateMnemonic = this.updateMnemonic.bind(this);
    this.addIntermTx = this.addIntermTx.bind(this);
  }

  updateMnemonic(person, mnemonic){
    this.setState((state, props) => {
      return {[person]: Object.assign({}, this.state[person], {mnemonic})}
    });
  }

  addIntermTx(data){
    const { address, redeemScript, lockPeriod, rawTx, txid } = data;
    let updatedIntermediate;

    if (this.state.intermediate[address]) {
      updatedIntermediate = this.addTxToAddress(address, txid, rawTx);
    } else {
      updatedIntermediate = this.addNewAddress(address, redeemScript, lockPeriod, txid, rawTx);
    }

    this.setState(state => ({ intermediate: updatedIntermediate }));
  }

  addTxToAddress(address, txid, rawTx){
    const updatedTxs = this.state.intermediate[address].txs
      .concat({ id: txid, raw: rawTx });
    const updatedAddress = Object.assign({}, this.state.intermediate[address], { txs: updatedTxs });
    return Object.assign({}, this.state.intermediate, { [address]: updatedAddress });
  }

  addNewAddress(address, redeemScript, lockPeriod, txid, rawTx){
    const addressValue = {
      redeemScript: redeemScript,
      lockPeriod: lockPeriod,
      txs: [
        {
          id: txid,
          raw: rawTx
        }
      ]
    };
    return Object.assign({}, this.state.intermediate, { [address]: addressValue });
  }

  render(){
    const intermAddresses = Object.keys(this.state.intermediate);
    const intermTxs = Object.keys(this.state.intermediate)
      .reduce((acc, value) => acc.concat(this.state.intermediate[value].txs), []);
    return (
      <div className="ui container">
        <p/>
        <h2 className="ui header center aligned">Safe Bitcoin inheritance</h2>
        <div className="ui four column doubling stackable grid container">
          <div className="column">
            <Person mnemonic={this.state.owner.mnemonic}
                    person="owner"
                    updateMnemonic={this.updateMnemonic}
                    addIntermTx={this.addIntermTx}
            />
          </div>
          <div className="column">
            <Intermediate addresses={intermAddresses}/>
          </div>
          <div className="column">
            <Transactions txs={intermTxs}/>
          </div>
          <div className="column">
            <Person mnemonic={this.state.heir.mnemonic}
                    person="heir"
                    updateMnemonic={this.updateMnemonic}
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