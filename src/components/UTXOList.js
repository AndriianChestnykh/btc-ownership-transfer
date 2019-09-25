import React from 'react';
import UTXO from './UTXO';

function UTXOList(){
  return (<div>
    <p>UTXO List</p>
    <UTXO/>
    <UTXO/>
    <UTXO/>
  </div>)
}

export default UTXOList;