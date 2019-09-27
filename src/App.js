import React from 'react';
import OwnerHeirSwitch from './components/OwnerHeirSwitch';
import Person from './components/Person';
import Transactions from './components/Transactions';
import config from './config';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render(){
    return (
      <div>
        <header>
          <p align="center">Trustless Bitcoin transferring</p>
        </header>
        <OwnerHeirSwitch/>
        <div className="ui three column doubling stackable grid container">
          <div className="column">
            <Person config={config.owner}/>
          </div>
          <div className="column">
            <Transactions/>
          </div>
          <div className="column">
            <Person config={config.heir}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
