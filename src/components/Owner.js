import React from 'react';
import CryptoArtifacts from './CryptoArtifacts';
import { Card } from 'semantic-ui-react';
import UTXOList from "./UTXOList";

function Owner() {
  return <Card>
    Owner
    <CryptoArtifacts/>
    <UTXOList/>
  </Card>
}

export default Owner;