import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import DropIn from 'braintree-web-drop-in-react';
import axios from '../axios';
import { connect } from 'react-redux';

class Payment extends React.Component {
    instance;
    state = {
        error: null,
        clientToken: null,
        canClick: false,
        loading: false,
        paymentNonce: null,
        instanceLoaded: false
    }
    componentDidMount() {
        axios.get('/client_token')
            .then((response) => {
                this.setState({ clientToken: response.data });
            })
            .catch((error) => {
                console.log(error)
            })
    }
    async createPayment() {
        console.log(this.props.checkoutPostTitle);
        this.setState({ loading: true, paymentNonce: null });
        try {
            let { nonce } = await this.instance.requestPaymentMethod();
            const paymentMethod = await axios.post(`/purchase/${nonce}?value=${this.props.checkoutValue}`);
            const paymentResponse = await axios.post(`/purchase/complete/${paymentMethod.data}?value=${this.props.checkoutValue}`)
            if (paymentResponse.data.success) {
                const user = await axios.patch(`/user?post=${this.props.checkoutPostId}`, {
                    customer: this.props.user._id,
                    customerUsername: this.props.user.username,
                    customerEmail: this.props.user.email,
                    sellerId: this.props.seller.sellerId,
                    sellerUsername: this.props.seller.sellerUsername,
                    sellerEmail: this.props.seller.sellerEmail,
                    amount: parseFloat(this.props.checkoutValue),
                    productBuyed: this.props.checkoutPostId,
                    productNames: this.props.checkoutPostTitle
                });
                if (user) {
                    this.handleClose();
                    this.props.saveUser(user.data.user);
                    this.props.userChanged();
                    this.setState({ loading: false });
                }
            }
        } catch (error) {
            this.setState({ error: 'error', loading: false });
        }
    }
handleClose = () => {
    this.props.dispatchDisplayCheckoutModal(false);
}
handleShow = () => {
    this.props.dispatchDisplayCheckoutModal(true);
}
allowClick = () => {
    this.setState({ canClick: true });
}
disallowClick = () => {
    this.setState({ canClick: false });
}
render() {
    return <div>
        <Modal centered show={this.props.displayCheckoutModal} onHide={this.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Checkout</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    this.state.error ?
                        <Alert variant="danger">
                            {this.state.error}
                        </Alert>
                        : null
                }
                {
                    this.state.clientToken ? <div>
                        <DropIn options={{ authorization: this.state.clientToken }} onInstance={instance => { this.instance = instance; this.setState({ instanceLoaded: true }) }} />
                        <div style={{ padding: '20px', border: '1px solid #dedede', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', alignContent: 'center' }}>
                            <b>Total Value:&nbsp;&nbsp;${this.props.checkoutValue}</b>
                            <Button disabled={!this.state.instanceLoaded || this.state.loading} variant="primary" onClick={!this.state.paymentNonce ? this.createPayment.bind(this) : this.buyAction.bind(this)}>
                                {
                                    !this.state.instanceLoaded || this.state.loading ? 'Processing...' : 'Complete Transaction'
                                }
                            </Button>
                        </div>
                    </div> : <Container><Row><Spinner style={{margin: '10px auto'}} animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner></Row></Container>
                }
            </Modal.Body>
        </Modal>
    </div>
}
}

const mapStateToProps = state => ({
    checkoutValue: state.checkoutValue,
    displayCheckoutModal: state.displayCheckoutModal,
    user: state.user,
    checkoutPostId: state.checkoutPostId,
    checkoutPostTitle: state.checkoutPostTitle,
    seller: state.seller
});

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchDisplayCheckoutModal: (display) => dispatch({ type: 'DISPLAY_CHECKOUT_MODAL', display }),
        saveUser: (user) => dispatch({ type: 'SAVE_USER', user }),
        userChanged: (user) => dispatch({ type: 'USER_CHANGED' })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Payment);