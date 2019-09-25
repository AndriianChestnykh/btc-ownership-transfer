import React from 'react';
import OwnerHeirSwitch from './components/OwnerHeirSwitch';
import Owner from './components/Owner';
import Heir from './components/Heir';
import Transactions from './components/Transactions';

function App() {
  return (
    <div>
      <header>
        <p align="center">Trustless Bitcoin transferring</p>
      </header>
      <OwnerHeirSwitch/>
      <div className="ui three column doubling stackable grid container">
        <div className="column">
          <Owner/>
        </div>
        <div className="column">
          <Transactions/>
        </div>
        <div className="column">
          <Heir/>
        </div>
      </div>
    </div>
  );
}

export default App;
