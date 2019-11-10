import React from 'react';
import AddressUTXOList from "./AddressUTXOList";
import config from '../config';
import PropTypes from 'prop-types';
import { getHDChild, isValidMnemonic } from '../utils';

class Person extends React.Component {
  render(){
    const { person, mnemonic, updateMnemonic } = this.props;
    const { [person]: { derivationPath, name }, network } = config;
    const { address } = isValidMnemonic(mnemonic) ? getHDChild(mnemonic, derivationPath, network): {};

    return (<div className="ui card">
      <div className="content">
        <div className="header">{name}</div>
      </div>
      <div className="content">
        <form>
          <label htmlFor="mnemonic"></label><br/>
          <textarea id="mnemonic" name="mnemonic" cols="30" rows="3" onChange={(e) => updateMnemonic(person, e.target.value)} defaultValue={mnemonic}></textarea>
        </form>
        <p style={{color: 'red'}}>{!isValidMnemonic(mnemonic) ? 'Mnemonic is not valid! Please enter valid mnemonic': ''}</p>
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