import React from 'react';
import AddressUTXOList from "./AddressUTXOList";
import config from '../config';
import PropTypes from 'prop-types';
import { getHDClild } from '../utils';
import * as bitcoin from "bitcoinjs-lib";

class Person extends React.Component {
  render(){
    const { person, mnemonic, updateMnemonic, addIntermTx } = this.props;
    const { derivationPath, name } = config[person];
    const network = config.network;
    const child = getHDClild(mnemonic, derivationPath, network);
    const address = bitcoin.payments.p2pkh({pubkey: child.publicKey, network}).address;
    addIntermTx ? console.log(addIntermTx.name): console.log();

    return (<div className="ui card">
      <div className="content">
        <div className="header">{name}</div>
      </div>
      <div className="content">
        <form>
          <label htmlFor="mnemonic"></label><br/>
          <textarea id="mnemonic" name="mnemonic" cols="30" rows="3" onChange={(e) => updateMnemonic(person, e.target.value)} defaultValue={mnemonic}></textarea>
        </form>
        <p>Derivation path: {derivationPath}</p>
      </div>
      <div className="content">
        <AddressUTXOList address={address} addIntermTx={addIntermTx} actions={['signToInterm']}/>
      </div>
    </div>)
  }
}

Person.propTypes = {
  mnemonic: PropTypes.string,
  person: PropTypes.string.isRequired,
  updateMnemonic: PropTypes.func.isRequired,
  counterPartyAddress: PropTypes.string,
  addIntermTx: PropTypes.func
};

export default Person;