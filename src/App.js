import React, { Component } from 'react';
import './App.css';
import Contract from './contract'
import { Button, Form, Input, FormGroup, Container, Row, Col} from 'reactstrap'
import RinkebyToken from './contracts/MyRinkebyToken.json'
//import Web3 from 'web3'
import web3 from './web3';

class App extends Component {
    constructor(props) {
        super(props)

        this.tokenId = React.createRef();

        this.loom = new Contract()
        this.value = 0

        this.state = {
            value: 0,
            isValid: false,
            isSending: false,
            tx: null,
            tries: 0,
            address: '',
            tokens: [],
            gatewayTokens: [],
            extdevTokens: []
        }
        /*
        if (typeof this.web3 != 'undefined') {
            this.web3Provider = this.web3.currentProvider;
        } else {
            this.web3Provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/aef1483094d34971a33968ea7819f8c1');
        }
        this.web3 = new Web3(this.web3Provider);
*/

    }

    async componentWillMount() {
        try {
            const accounts = await web3.eth.getAccounts()
            web3.eth.defaultAccount = accounts[0]
            this.setState({address: accounts[0]})
            this.rinkebyToken = new web3.eth.Contract(RinkebyToken.abi, "0x2ADf9D1CD5E7D90c135936228dE8118DB912BaFc")
            await this.loom.loadContract()
            await this.loadTokenBalance(this.rinkebyToken)
            await this.loadTokenBalance(this.loom.loomToken)
            await this.loadGatewayBalance("rinkeby")
            await this.loadGatewayBalance("extdev")

        } catch (error) {
            console.error("CAUGHT", error)
        }
    }

    loadTokenBalance = async contract => {
        try {

            let total = await contract.methods.balanceOf(this.state.address).call()
            console.warn("in load token balance, total:", total.toString())
            const tokens = []
            for (let i = 0; i < Math.min(total, 5); i++) {
                const tokenId = await contract.methods
                    .tokenOfOwnerByIndex(this.state.address, i)
                    .call()
                if(tokens.length > 0)
                    tokens.push(", ")
                tokens.push(tokenId)
            }
            if (tokens.length !== 0)
                this.setState({ tokens: tokens })
            else
                this.setState({ tokens: "none" })
        }
        catch (error) {
            console.warn(error)
        }
    }

    loadGatewayBalance = async chain => {
        try {
            let contract, address
            if(chain === "rinkeby") {
                contract = this.rinkebyToken
                address = "0xb73C9506cb7f4139A4D6Ac81DF1e5b6756Fab7A2"
                // 0xb73C9506cb7f4139A4D6Ac81DF1e5b6756Fab7A2
                // 0x2ADf9D1CD5E7D90c135936228dE8118DB912BaFc
            }
            else if(chain === "extdev") {
                contract = this.loom.loomToken
                address = "0xE754d9518bF4a9C63476891eF9Aa7D91c8236a5d"
                // 0xE754d9518bF4a9C63476891eF9Aa7D91c8236a5d
            }
            let total = await contract.methods.balanceOf(address).call()
            console.warn("in load Gateway balance, total:", total.toString())
            const tokens = []
            for (let i = 0; i < Math.min(total, 5); i++) {
                const tokenId = await contract.methods
                    .tokenOfOwnerByIndex(address, i)
                    .call()
                if(tokens.length > 0)
                    tokens.push(", ")
                tokens.push(tokenId)
            }
            if (tokens.length !== 0)
                this.setState({ gatewayTokens: tokens })
            else
                this.setState({ gatewayTokens: "none" })
        }
        catch (error) {
            console.warn("loadGatewayBalance Catch:", error)
        }
    }

    async mintToken() {
        const tokenId = await this.rinkebyToken.methods.totalSupply().call()
        console.log(tokenId)
        const gasEstimate = await this.rinkebyToken.methods.mint(tokenId).estimateGas({ from: this.state.address })
        console.log(gasEstimate)
        let tx = await this.rinkebyToken.methods.mint(tokenId).send({ from: web3.eth.defaultAccount, gas: gasEstimate })
        console.log(tx)
        //await this.loadTokenBalance()
    }

    depositToGateway = async event => {
        event.preventDefault()
        let tokenId = event.target.elements[0].value
        const gasEstimate = await this.rinkebyToken.methods.depositToGateway("0xb73C9506cb7f4139A4D6Ac81DF1e5b6756Fab7A2", tokenId).estimateGas({ from: this.state.address })
        await this.rinkebyToken.methods.depositToGateway("0xb73C9506cb7f4139A4D6Ac81DF1e5b6756Fab7A2", tokenId).send({ from: this.state.address, gas: gasEstimate })
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
                    <p>Gateway Balance: {this.state.gatewayTokens}</p>
                    <p>Extdev Balance: {this.state.extdevTokens}</p>
                </div>

                <Form onSubmit={e => { e.preventDefault(); }}>
                    <FormGroup>
                        <Input type="text" name="text" id="withdrawToken" placeholder="Enter token id" />
                    </FormGroup>
                    <Button outline color="success">Withdraw</Button>{' '}
                </Form>
            </Container>
        )
    }
}

export default App;
