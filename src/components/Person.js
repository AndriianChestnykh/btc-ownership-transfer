import React from 'react';
import { Card } from 'semantic-ui-react';
import AddressUTXOList from "./AddressUTXOList";
import * as bip32 from 'bip32';
import * as bip39 from 'bip39';
import * as bitcoin from 'bitcoinjs-lib';
import config from '../config';
import PropTypes from 'prop-types';

class Person extends React.Component {
  render(){
    const { person, mnemonic, updateMnemonic, counterPartyAddress } = this.props;
    const { derivationPath, name } = config[person];
    const network = config.network;
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const root = bip32.fromSeed(seed);
    const child = root.derivePath(derivationPath);
    const address = bitcoin.payments.p2pkh({pubkey: child.publicKey, network: network}).address;

    return <Card>
      <h3>{name}</h3>
      <div>
        <form>
          <label htmlFor="mnemonic"></label><br/>
          <textarea id="mnemonic" name="mnemonic" cols="30" rows="3" onChange={(e) => updateMnemonic(person, e.target.value)} defaultValue={mnemonic}></textarea>
        </form>
        <p>Derivation path: {derivationPath}</p>
        <p>Counterparty address: {counterPartyAddress}</p><br/>
      </div>
      <AddressUTXOList address={address}/>
    </Card>
  }
}

Person.propTypes = {
  mnemonic: PropTypes.string,
  person: PropTypes.string.isRequired,
  updateMnemonic: PropTypes.func.isRequired,
  counterPartyAddress: PropTypes.string
};

export default Person;