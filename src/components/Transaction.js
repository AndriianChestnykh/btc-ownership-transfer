import React from 'react';

function Transaction(props){
  return (<div>
    <p>Transaction:</p>
    <p>{props.tx}</p>
  </div>);
}

export default Transaction;