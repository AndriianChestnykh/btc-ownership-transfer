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
        address: ''
      },
      heir: {
        mnemonic: config.heir.mnemonic,
        address: ''
      },
      inheritanceTransactions: []
    };
    this.updateMnemonic = this.updateMnemonic.bind(this);
    this.addInheritanceTx = this.addInheritanceTx.bind(this);
  }

  updateMnemonic(person, mnemonic){
    this.setState((state, props) => {
      return {[person]: Object.assign({}, this.state[person], {mnemonic})}
    });
  }

  addInheritanceTx(data){
    this.setState((state, props) => {
      return { inheritanceTransactions: state.inheritanceTransactions.concat([data]) };
    });
  }

  render(){
    return (
      <div>
        <header>
          <h2 align="center">Trustless Bitcoin transferring</h2><br/>
        </header>
        <div className="ui four column doubling stackable grid container">
          <div className="column">
            <Person mnemonic={this.state.owner.mnemonic}
                    person="owner"
                    updateMnemonic={this.updateMnemonic}
                    counterPartyAddress={this.state.heir.address}
                    addInheritanceTx={this.addInheritanceTx}
            />
          </div>
          <div className="column">
            <Intermediate txs={this.state.inheritanceTransactions}/>
          </div>
          <div className="column">
            <Transactions txs={this.state.inheritanceTransactions}/>
          </div>
          <div className="column">
            <Person mnemonic={this.state.heir.mnemonic}
                    person="heir"
                    updateMnemonic={this.updateMnemonic}
                    counterPartyAddress={this.state.owner.address}
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