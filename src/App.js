import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Contract from './contract'
import { Button, Form, Input, FormGroup, Container, Row, Col} from 'reactstrap'
import RinkebyToken from './contracts/MyRinkebyToken.json'
import Web3 from 'web3'

class App extends Component {
    constructor(props) {
        super(props)

        this.tokenId = React.createRef();

        this.contract = new Contract()
        this.value = 0

        this.state = {
            value: 0,
            isValid: false,
            isSending: false,
            tx: null,
            tries: 0,
            address: '',
            tokens: []
        }

        if (typeof web3 != 'undefined') {
            this.web3Provider = window.web3.currentProvider;
        } else {
            this.web3Provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/aef1483094d34971a33968ea7819f8c1');
        }
        window.web3 = new Web3(this.web3Provider);
        window.rinkebyToken = new window.web3.eth.Contract(RinkebyToken.abi, "0x8d7EAB5447bAdAd0cb016113394159faba7b7b18")

    }

    loadTokenBalance = async event => {
        try {
            let total = await window.rinkebyToken.methods.balanceOf(this.state.address).call()
            console.warn("in load token balance, total:", total.toString())
            const tokens = []
            for (let i = 0; i < Math.min(total, 5); i++) {
                const tokenId = await window.rinkebyToken.methods
                    .tokenOfOwnerByIndex(this.state.address, i)
                    .call()
                tokens.push(tokenId)
            }
            if (tokens.length !== 0)
                this.setState({ tokens: tokens })
            else
                this.setState({ tokens: "none" })
        }
        catch (error) {
            console.warn("blet", error)
        }
    }

    componentDidMount = async event => {
        try {
            const accounts = await window.web3.eth.getAccounts()
            console.log(accounts)
            this.setState({address: accounts[0]})
            await this.loadTokenBalance()
        } catch (error) {
            console.warn("caught", error)
        }
    }

    mintToken = async event => {
        const tokenId = await window.rinkebyToken.methods.totalSupply().call()
        const gasEstimate = await window.rinkebyToken.methods.mint(tokenId).estimateGas({ from: this.state.address })
        await window.rinkebyToken.methods.mint(tokenId).send({ from: this.state.address, gas: gasEstimate })
        await this.loadTokenBalance()
    }

    depositToGateway = async event => {
        event.preventDefault()
        console.log("In depositToGateway")
        let tokenId = event.target.elements[0].value
        const gasEstimate = await window.rinkebyToken.methods.depositToGateway("0xb73C9506cb7f4139A4D6Ac81DF1e5b6756Fab7A2", tokenId).estimateGas({ from: this.state.address })
        await window.rinkebyToken.methods.depositToGateway("0xb73C9506cb7f4139A4D6Ac81DF1e5b6756Fab7A2", tokenId).send({ from: this.state.address, gas: gasEstimate })
        await this.loadTokenBalance()
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <h1>Ethereum</h1>
                        <p>Your Address: { this.state.address }</p>
                        <p>Balance: { this.state.tokens }</p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form onSubmit={e => { e.preventDefault(); }}>
                            <FormGroup>
                                <Input type="text" name="text" id="withdrawToken" placeholder="Enter token id" />
                            </FormGroup>
                            <Button outline color="success" onClick={() => this.mintToken()}>
                                Mint
                            </Button>
                        </Form>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form onSubmit={(event) => this.depositToGateway(event) }>
                            <FormGroup>
                                <Input type="text" name="text" id="depositToken" placeholder="Enter token id" />
                            </FormGroup>
                            <Button outline color="warning"
                                    >Deposit to Gateway</Button>
                        </Form>
                    </Col>
                </Row>

                <hr />

                <div>
                    <h1>Loom Network / PlasmaChain</h1>
                    <p>Balance: </p>
                </div>

                <Form onSubmit={e => { e.preventDefault(); }}>
                    <FormGroup>
                        <Input type="text" name="text" id="withdrawToken" placeholder="Enter token id" />
                    </FormGroup>
                    <Button outline color="success">Withdraw</Button>{' '}
                </Form>

                {/*
        <form onSubmit={e => { e.preventDefault(); }}>
          <div className="form-group">
            <label>Value</label>
            <input type="number" className="form-control" onChange={(event) => this.onChangeHandler(event)} ref={this.textInput}/>
            <small className="form-text text-muted">Set a number</small>
          </div>
          <button type="button" disabled={!this.state.isValid || this.state.isSending} className="btn btn-primary" onClick={() => this.confirmValue()}>Confirm</button>
        </form>
        <div className="alert alert-success">
          Value set is {this.state.value} (this value only updates if values is 10 or ...)
        </div>
        { this.state.tries === 3 && loomyAlert }
        <hr />
        <pre>
          {this.state.tx && JSON.stringify(this.state.tx, null, 2)}
        </pre>
        */}
            </Container>
        )
    }
}

export default App;
