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
      },
      heir: {
        mnemonic: config.heir.mnemonic,
      },
      txs: JSON.parse(localStorage.getItem('txs')) || []
    };

    this.updateMnemonic = this.updateMnemonic.bind(this);
    this.addTx = this.addTx.bind(this);
    this.getIntermediateUTXOData = this.getIntermediateUTXOData.bind(this);
  }

  updateMnemonic(person, mnemonic){
    this.setState((state, props) => {
      return {[person]: Object.assign({}, this.state[person], {mnemonic})}
    });
  }

  addTx(tx){
    if (this.state.txs.filter(value => value.id === tx.id).length === 0) {
      const newTxs = this.state.txs.concat([tx]);
      localStorage.setItem('txs', JSON.stringify(newTxs));
      this.setState(state => ({txs: newTxs}));
    }
  }

  getIntermediateUTXOData(){
    return this.state.txs.reduce((acc, value) => {
      if (acc.filter(v => v.address === value.address).length === 0)
        acc.push({ address: value.address, redeem: value.redeem});
      return acc;
    }, []);
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
            <Transactions txs={this.state.txs}/>
          </div>
          <div className="column">
            <Intermediate addressesData={this.getIntermediateUTXOData()}
                          actions={{ sendToOwner: 'sendToOwner', sendToHeir: 'sendToHeir' }}/>
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