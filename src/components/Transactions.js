import React from 'react'
import Transaction from './Transaction'

function Transactions (props) {
  return (<div className='ui card'>
    <div className='content'>
      <div className='header'>Transactions</div>
    </div>
    {props.txs.map((tx, index) => <Transaction key={index} tx={tx} removeTx={props.removeTx} addIntermediate={props.addIntermediate} />)}
          </div>)
}

export default Transactions
