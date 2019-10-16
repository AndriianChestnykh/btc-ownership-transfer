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
      txs: [
        {
          raw:
            '020000000142d80f0d0f6ee2dbca4cb3b8e8c1082600ee60bf76a4b86f57c3f27cef0d26d0000000006a473044022010348b1ea7bba37ab570c993e0ec8f0faa2aa94700f236fdd3f4de73e93e4a51022044998fff29e81645754f654d3148afd518b53022e0820907b27c01827d53533001210266ab4d82240a5e52982272db25b85ac2798c83fb37cc348488f8cc1a4e370e61ffffffff010b3335000000000017a91446d5e583bed6f7d61e71bef8a8a7a2ad72d169c88700000000',
          id:
            '3088c22864790a44f1f985f4511e76540d1c40274362265d479035a73958c655',
          redeem:
            '63210266ab4d82240a5e52982272db25b85ac2798c83fb37cc348488f8cc1a4e370e61ac6755b2752102b71345d53b521fc8b4b7271a17fe20cf4eeb1800bf9761212246101dc80a3bf7ac68',
          lockFeed: { blocks: 5 },
          address: '2MyhmXWCppJMQH1ui42J7jF4iw4j5aPufHU'
        }
      ]
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
    if (this.state.txs.filter(value => value.id === tx.id).length === 0)
      this.setState(state => ({ txs: this.state.txs.concat([tx]) }));
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