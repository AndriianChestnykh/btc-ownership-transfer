import React from 'react';
import { getHDClild, signInheritanceTx } from '../utils';
import config from '../config';

class UTXO extends React.Component {
  constructor(props) {
    super(props);
    this.signHandler = this.signHandler.bind(this);
  }

  signHandler(){
    const { network } = config;
    const txData = signInheritanceTx({
      childOwner: getHDClild(config.owner.mnemonic, config.owner.derivationPath, network),
      childHeir: getHDClild(config.heir.mnemonic, config.heir.derivationPath, network),
      txid: this.props.utxo.transaction_hash,
      output: this.props.utxo.index,
      amount: this.props.utxo.value,
      fee: 1000,
      sequenceFeed: { blocks: 5 },
      network: network
    });

    this.props.addInheritanceTx(txData);
  }

  render(){
    return (<div>
      <p><strong>utxo {this.props.index + 1}</strong></p>
      <span>Transaction hash: {this.props.utxo.transaction_hash}</span><br/>
      <span>Index: {this.props.utxo.index}</span><br/>
      <span>Value: {this.props.utxo.value / (10**8) + ' BTC'}</span><br/><br/>
      <button onClick={this.signHandler}>Sign</button>
    </div>)
  }
}

export default UTXO;