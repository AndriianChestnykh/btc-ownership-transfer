import React from 'react';
// const bcoin = require('bcoin').set('testnet');
// const Mnemonic = bcoin.hd.Mnemonic;
// const mnemonic = new Mnemonic({bits: 256});

function CryptoArtifacts() {
  return (<div>
    <form>
        <label htmlFor="mnemonic"></label><br/>
        <textarea id="mnemonic" name="mnemonic" cols="30" rows="3">Put your mnemonic here</textarea>
    </form>
  </div>)
}

export default CryptoArtifacts;