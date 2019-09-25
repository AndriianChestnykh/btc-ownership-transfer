import React from 'react';
import CryptoArtifacts from './CryptoArtifacts';
import { Card } from 'semantic-ui-react';
import UTXOList from "./UTXOList";

function Heir() {
  return <Card>
    Heir
    <CryptoArtifacts/>
    <UTXOList/>
  </Card>
}

export default Heir;