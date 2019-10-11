import React from 'react';
import { getHDClild, signInheritanceTx } from '../utils';
import config from '../config';

class UTXO extends React.Component {
  constructor(props) {
    super(props);
    this.getActionButtons = this.getActionButtons.bind(this);
    this.signToInterm = this.signToInterm.bind(this);
    this.sendToOwner = this.sendToOwner.bind(this);
    this.sendToHeir = this.sendToHeir.bind(this);
  }

  getActionButtons(actions){
    const signers = {
      signToInterm: <button onClick={this.signToInterm}>Sign intermediate tx</button>,
      sendToOwner: <button onClick={this.sendToOwner}>Widthraw to owner</button>,
      sendToHeir: <button onClick={this.sendToHeir}>Widthraw to heir</button>
    };

    return actions.map(dest => {
      return signers[dest] ? signers[dest]: '';
    })
  }

  signToInterm(){
    const { network } = config;
    const txData = signInheritanceTx({
      childOwner: getHDClild(config.owner.mnemonic, config.owner.derivationPath, network),
      childHeir: getHDClild(config.heir.mnemonic, config.heir.derivationPath, network),
      txid: this.props.utxo.transaction_hash,
      output: this.props.utxo.index,
      amount: this.props.utxo.value,
      fee: 1000,
      sequenceFeed: { blocks: 5 },
      network
    });

    this.props.addIntermTx(txData);
  }

  sendToOwner(){
    console.log(this.signToOwner({
      redeemScript: this.props.utxo.redeemScript,
      txid: this.props.utxo.transaction_hash,
      output: this.props.utxo.index,
      amount: this.props.utxo.value,
      fee: 1000,
      network: config.network
    }));
  }

  //todo this is temp code. Remove
  signToOwner(data){
    alert(JSON.stringify(data));
  }

  sendToHeir(){ alert('sendToHeir') }

  render(){
    return (<div>
      <p><strong>utxo {this.props.index + 1}</strong></p>
      <span>Transaction hash: {this.props.utxo.transaction_hash}</span><br/>
      <span>Index: {this.props.utxo.index}</span><br/>
      <span>Value: {this.props.utxo.value / (10**8) + ' BTC'}</span><br/><br/>
      { this.getActionButtons(this.props.actions) }
    </div>)
  }
}

export default UTXO;