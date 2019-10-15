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
      intermediate: [
        // {
          // address: '',
          // redeemScript: '',
          // lockPeriod: {},
        // }
      ],
      txs: [
        // {
        //   id: '',
        //   raw: '',
        //   redeem: '',
        //   address: '',
        //   lockFeed: ''
        // },
      ]
    };

    this.updateMnemonic = this.updateMnemonic.bind(this);
    this.addTx = this.addTx.bind(this);
  }

  updateMnemonic(person, mnemonic){
    this.setState((state, props) => {
      return {[person]: Object.assign({}, this.state[person], {mnemonic})}
    });
  }

  addTx(data){
    if (this.state.txs.filter(value => value.id === data.id).length === 0)
      this.setState(state => ({ txs: this.state.txs.concat([data]) }));
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
                    signTx={this.addTx}
            />
          </div>
          <div className="column">
            <Intermediate addresses={intermAddresses}/>
          </div>
          <div className="column">
            <Transactions txs={this.state.txs}/>
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