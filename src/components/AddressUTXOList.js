import React from 'react'
import UTXO from './UTXO'
import axios from 'axios'
import config from '../config'
import PropTypes from 'prop-types'
import * as utils from '../utils'

class AddressUTXOList extends React.Component {
  constructor (props) {
    super(props)
    this.loadingUTXOs = false
    this.state = {
      needToRerenderUTXOs: false,
      utxos: []
    }
    this.updateUTXOList = this.updateUTXOList.bind(this)
  }

  componentDidMount () {
    this.updateUTXOList(this.props.address)
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (nextProps.address !== this.props.address || nextProps.statsTime !== this.props.statsTime) {
      this.updateUTXOList(nextProps.address)
      return true
    }
    return nextState.needToRerenderUTXOs
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (!prevState && this.state.needToRerenderUTXOs) this.setState({ needToRerenderUTXOs: false })
  }

  async updateUTXOList (address) {
    if (!utils.validateAddress(address).isValid) return
    this.loadingUTXOs = true
    const uri = `${config.apiURIs.address}/${address}`
    const responseAddress = await axios.get(uri)
      .catch(error => alert('Blockchain API request error: ' + error))
    console.log(`Fetching for address utxos from ${uri}`)
    this.loadingUTXOs = false
    this.setState({ needToRerenderUTXOs: true, utxos: responseAddress.data.data[address].utxo })
  }

  getAllUtxo () {
    if (!this.loadingUTXOs) {
      const utxos = this.state.utxos
      return (utxos.length
        ? utxos.map((utxo, index) => (<UTXO
          key={index}
          index={index}
          utxo={utxo}
          redeem={this.props.redeem}
          actions={this.props.actions}
          blocks={this.props.blocks}
          owner={this.props.owner}
          heir={this.props.heir}
                                      />))
        : <div>No UTXOs</div>)
    } else {
      return <div>Loading...</div>
    }
  }

  getHeader () {
    const validateAddressResult = utils.validateAddress(this.props.address)
    const redeem = this.props.redeem ? <span><b>Redeem: </b><br />{this.props.redeem}</span> : ''
    const info = this.props.info ? <span><b>Info: </b><br />{JSON.stringify(this.props.info, null, '\t')}</span> : ''
    return validateAddressResult.isValid
      ? <div style={{ wordWrap: 'break-word' }}>
        <h4>{this.props.address}</h4>
        {redeem ? <p><br />{redeem}<br /></p> : ''}
        {info ? <p>{info}<br /></p> : ''}
        <br />
        </div>
      : <h4>Address is not valid: {validateAddressResult.message}</h4>
  }

  render () {
    return (<div className='content'>
      {this.getHeader()}
      {this.getAllUtxo()}
    </div>)
  }
}

AddressUTXOList.propTypes = {
  address: PropTypes.string
}

export default AddressUTXOList
