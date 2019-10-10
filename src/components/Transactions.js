import React from 'react';
import Transaction from "./Transaction";

function Transactions(props){
  return (<div>
      <p>Transactions</p>
      {props.txs.map((tx, index) => <Transaction key={index} tx={tx}/>)}
    </div>);
}

export default Transactions;