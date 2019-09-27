import React from 'react';
import UTXO from './UTXO';
import axios from 'axios';
import config from '../config';

class UTXOList extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      utxos: []
    }
  }

  componentDidMount() {
    const uri = `${config.apiURIs.address}/${this.props.address}`;
    axios.get(uri)
      .then(response => {
        console.log(response.data.data[this.props.address].utxo);
        this.setState({ utxos: response.data.data[this.props.address].utxo })
      })
      .catch(error => alert('Blockchain API request error: ' + error));
  }

  render(){
    const utxos = this.state.utxos;
    const utxosJSX = utxos && utxos.length
      ? this.state.utxos.map((utxo, index) => (<UTXO key={index} index={index} utxo={utxo}/>))
      : <div>Empty...</div>

    return (<div>
      <p>UTXO List</p>
      {utxosJSX}
    </div>)
  }
}

export default UTXOList;