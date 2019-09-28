import React from 'react';
import Person from './components/Person';
import Transactions from './components/Transactions';
import config from './config';
import AddressUTXOList from "./components/AddressUTXOList";

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
  }

  updateMnemonic(person, mnemonic){
    this.setState((state, props) => {
      return {[person]: Object.assign({}, this.state[person], {mnemonic})}
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
            <Person mnemonic={this.state.owner.mnemonic} person="owner" updateMnemonic={this.updateMnemonic} counterPartyAddress={this.state.heir.address}/>
          </div>
          <div className="column">
            <h3>Intermediate addresses</h3>
            <AddressUTXOList address=""/>
          </div>
          <div className="column">
            <Transactions/>
          </div>
          <div className="column">
            <Person mnemonic={this.state.heir.mnemonic} person="heir" updateMnemonic={this.updateMnemonic} counterPartyAddress={this.state.owner.address}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;


// Send coins back, when you don't need them anymore to the address
// mv4rnyY3Su5gjcDNzbMLKBQkBicCtHUtFB