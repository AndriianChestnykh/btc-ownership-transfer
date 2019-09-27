import React from 'react';

function UTXO(props) {
  return (<div>
    <p><strong>utxo {props.index + 1}</strong></p>
    <span>Transaction hash: {props.utxo.transaction_hash}</span><br/>
    <span>Index: {props.utxo.index}</span><br/>
    <span>Value: {props.utxo.value}</span>
  </div>)
}

export default UTXO;