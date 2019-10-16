import React from 'react';
import AddressUTXOList from "./AddressUTXOList";
import config from '../config';
import PropTypes from 'prop-types';
import { getHDChild } from '../utils';
import * as bitcoin from "bitcoinjs-lib";

class Person extends React.Component {
  getVariables(){
    const { person, mnemonic, updateMnemonic } = this.props;
    const { derivationPath, name } = config[person];
    const network = config.network;
    const child = getHDChild(mnemonic, derivationPath, network);
    const address = bitcoin.payments.p2pkh({pubkey: child.publicKey, network}).address;
    return { person, name, mnemonic, updateMnemonic, derivationPath, address }
  }

  render(){
    const { person, name, mnemonic, updateMnemonic, derivationPath, address } = this.getVariables();

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
        <AddressUTXOList address={address} actions={this.props.actions}/>
      </div>
    </div>)
  }
}

Person.propTypes = {
  mnemonic: PropTypes.string,
  person: PropTypes.string.isRequired,
  updateMnemonic: PropTypes.func.isRequired,
  counterPartyAddress: PropTypes.string,
  signTx: PropTypes.func
};

export default Person;