import React from 'react';
import { Card } from 'semantic-ui-react';
import UTXOList from "./UTXOList";
import * as bip32 from 'bip32';
import * as bip39 from 'bip39';
import * as bitcoin from 'bitcoinjs-lib';
import config from '../config';

class Person extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      mnemonic: this.props.config.defaultMnemonic
    };
    this.updateMnemonic = this.updateMnemonic.bind(this);
  }

  updateMnemonic(mnemonic){
    this.setState({ mnemonic });
  }

  render(){
    const { defaultDerivationPath: derivationPath, name } = this.props.config;
    const network = config.network;
    const seed = bip39.mnemonicToSeedSync(this.state.mnemonic);
    const root = bip32.fromSeed(seed);
    const child = root.derivePath(derivationPath);
    const address = bitcoin.payments.p2pkh({pubkey: child.publicKey, network: network}).address;

    return <Card>
      <h5>{name}</h5>
      <div>
        <form>
          <label htmlFor="mnemonic"></label><br/>
          <textarea id="mnemonic" name="mnemonic" cols="30" rows="3" onChange={(e) => this.updateMnemonic(e.target.value)}>{this.state.mnemonic}</textarea>
        </form>
        <p>Derivation path: {derivationPath}</p>
        <p>Private key: {child.toWIF()}</p>
        <p>Address: {address}</p><br/>
      </div>
      <UTXOList address={address}/>
    </Card>
  }
}

export default Person;