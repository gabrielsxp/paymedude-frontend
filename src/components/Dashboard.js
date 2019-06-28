import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import {Link} from 'react-router-dom';
import axios from '../axios';
import styled from 'styled-components';

const Styles = styled.div`
    .customCard {
        width: 250px;
        height: 125px;
        border-radius: 5px;
        padding: 20px;
        margin-top: 25px;
    }
    .topCardAlign {
        display: flex;
        justify-content: space-between;
        align-content: center;
        align-items: center;
    }
    .cardsWrapper {
        display: flex;
        flex-flow: row;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        align-content: center;
    }
    .cardIcon {
        box-sizing: border-box;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;

class Dashboard extends React.Component {
    state = {
        loading: false,
        loadingFiltered: false,
        error: null,
        limit: false,
        offset: 0,
        totalSells: 0,
        user: null,
        balance: 0,
        transactions: [],
        filteredTransactions: []
    }
    componentDidMount(){
        axios.get('/me')
            .then((response) => {
                this.setState({user: response.data.user});
            })
        this.getBuyerTransactions();
        this.getFilteredTransactions();
    }
    getBuyerTransactions = () => {
        this.setState({loading: true});
        axios.get(`/transactions?seller=${true}&offset=${this.state.offset}`)
            .then((response) => {
                console.log(response.data);
                this.setState({ limit: response.data.limit, loading: false, transactions: this.state.transactions.concat(response.data.transactions), offset: this.state.offset + 3, balance: response.data.balance, totalSells: response.data.total });
            })
            .catch((error) => {
                console.log(error);
                this.setState({loading: false, error});
            })
    }
    getFilteredTransactions = () => {
        this.setState({loadingFiltered: true});
        axios.get('/transactions/date')
            .then((response) => {
                this.setState({ loadingFiltered: false, filteredTransactions: this.state.filteredTransactions.concat(response.data)});
                console.log(response);
            })
            .catch((error) => {
                this.setState({loading: false});
                console.log(error);
            })
    }
    getSellerTransactions = () => {
        axios.get(`/transactions?seller=${true}`)
            .then((response) => {
                console.log(response.dta);
                this.setState({ loading: false, transactions: this.state.transactions.concat(response.data)});
            })
            .catch((error) => {
                this.setState({loading: false, error});
        })
    }
    render(){
        return <div style={{marginTop: '0px', paddingBottom: '80px'}}>
            {
                this.state.user ? 
                    <Jumbotron style={{backgroundColor: `${this.state.user.bannerColor}`, padding: '80px' }} fluid>
                        <h2 style={{color: `${this.state.user.fontColor}`}}>Dashboard</h2>
                        <hr style={{border: `1px solid ${this.state.user.fontColor}`}}/>
                        <Styles>
                            <div className="cardsWrapper" >
                                <div className="customCard" style={{backgroundColor: `${this.state.user.borderColor}`}} >
                                    <div className="topCardAlign">
                                        <p className="cardTitle" style={{color: `${this.state.user.bannerColor}`, fontSize: '1.00rem', fontTransform: 'uppercase'}} ><b>Balance</b></p>
                                        <div className="cardIcon" style={{color: `${this.state.user.borderColor}`, backgroundColor: `${this.state.user.bannerColor}`}}>
                                            <i style={{fontSize: '1.25rem', color:`${this.state.user.fontColor}`}} className="fas fa-dollar-sign"></i>
                                        </div>
                                    </div>
                                    <p style={{fontSize: '1.5rem', color:`${this.state.user.bannerColor}`}}><b>${this.state.user.balance}</b></p>
                                </div>
                                <div className="customCard" style={{backgroundColor: `${this.state.user.borderColor}`}} >
                                    <div className="topCardAlign">
                                        <p className="cardTitle" style={{color: `${this.state.user.bannerColor}`, fontSize: '1.00rem', fontTransform: 'uppercase'}} ><b>Total Sells</b></p>
                                        <div className="cardIcon" style={{color: `${this.state.user.borderColor}`, backgroundColor: `${this.state.user.bannerColor}`}}>
                                            <i style={{fontSize: '1.25rem', color:`${this.state.user.fontColor}`}} className="fas fa-money-bill"></i>
                                        </div>
                                    </div>
                                    <p style={{fontSize: '1.5rem', color:`${this.state.user.bannerColor}`}}><b>{this.state.totalSells} {this.state.transactions.length === 1 ? 'sell' : 'sells'}</b></p>
                                </div>
                                <div className="customCard" style={{backgroundColor: `${this.state.user.borderColor}`}} >
                                    <div className="topCardAlign">
                                        <p className="cardTitle" style={{color: `${this.state.user.bannerColor}`, fontSize: '1.00rem', fontTransform: 'uppercase'}} ><b>{this.state.user.subscriptions === 1 ? 'subscriber' : 'subscribers'}</b></p>
                                        <div className="cardIcon" style={{color: `${this.state.user.borderColor}`, backgroundColor: `${this.state.user.bannerColor}`}}>
                                            <i style={{fontSize: '1rem', color:`${this.state.user.fontColor}`}} className="fas fa-user-plus"></i>
                                        </div>
                                    </div>
                                    <p style={{fontSize: '1.5rem', color:`${this.state.user.bannerColor}`}}><b>{this.state.user.subscriptions} subscribers</b></p>
                                </div>
                                <div className="customCard" style={{backgroundColor: `${this.state.user.borderColor}`}} >
                                    <div className="topCardAlign">
                                        <p className="cardTitle" style={{color: `${this.state.user.bannerColor}`, fontSize: '1.00rem', fontTransform: 'uppercase'}} ><b>Total Revenue</b></p>
                                        <div className="cardIcon" style={{color: `${this.state.user.borderColor}`, backgroundColor: `${this.state.user.bannerColor}`}}>
                                            <i style={{fontSize: '1.25rem', color:`${this.state.user.fontColor}`}} className="fas fa-arrow-up"></i>
                                        </div>
                                    </div>
                                    <p style={{fontSize: '1.5rem', color:`${this.state.user.bannerColor}`}}><b>${this.state.user.balance}</b></p>
                                </div>
                            </div>
                        </Styles>
                    </Jumbotron>
                : <Container><Row><Spinner style={{margin: '10px auto'}} animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner></Row></Container>
            }
            <Container>
                <Row>
                    <Col xs={{span: 12, offset: 0, order: 2}} md={6} lg={{span: 4, offset: 0, order: 2}}>
                        <h3>Last Sells</h3>
                        <hr/>
                        {
                            !this.state.transactions ? <Container><Row><Spinner style={{margin: '10px auto'}} animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner></Row></Container> : this.state.transactions.length > 0 ? this.state.transactions.map((transaction, index) => {
                                return <Accordion key={index} defaultActiveKey="0">
                                <Card>
                                  <Accordion.Toggle as={Card.Header} eventKey={`${index}`}>
                                    {transaction.productNames[0]}
                                  </Accordion.Toggle>
                                  <Accordion.Collapse eventKey={`${index}`}>
                                    <Card.Body>
                                        <div key={index} style={{border: '1px solid #dedede', borderRadius: '5px', padding: '20px', marginBottom: '20px'}}>
                                        <div className="transactionsSummary">
                                            <p><b>Product id: </b>{transaction.productBuyed}</p>
                                            <p><b>Products: </b>{transaction.productNames}</p>
                                            <p><b>Customer: </b>{transaction.customerUsername}</p>
                                            <p><b>Customer Email: </b>{transaction.customerEmail}</p>
                                            <p><b>Customer Profile: </b><Link to={`/profile/${transaction.customerUsername}`}>Visit profile</Link></p>
                                            <p><b>Value: </b>${transaction.amount}</p>
                                        </div>
                                </div>
                                    </Card.Body>
                                  </Accordion.Collapse>
                                </Card>
                              </Accordion>  
                            }) : <Alert variant="primary">
                                You do not have any transactions stored
                            </Alert>
                        }
                        {
                            !this.state.limit ? <Button style={{marginTop: '50px'}} variant="secondary" block onClick={this.getBuyerTransactions}>
                                {
                                    !this.state.loading  ? 'Load More' : <Spinner style={{margin: '10px auto'}} animation="border" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </Spinner>
                                }
                            </Button> : null
                        }
                    </Col>
                    <Col xs={{span: 12, offset: 0, order: 1}} md={6} lg={8}>
                        <h3>Filtered Transactions</h3>
                        <hr/>
                        {
                            !this.state.loadingFiltered && this.state.filteredTransactions ? 
                                this.state.filteredTransactions.map((transaction, index) => {
                                    return <div key={index} style={{border: '1px solid #dedede', borderRadius: '5px', padding: '20px', marginBottom: '20px'}}>
                                        <div className="transactionsSummary">
                                            <p><b>Product id: </b>{transaction.productBuyed}</p>
                                            <p><b>Products: </b>{transaction.productNames}</p>
                                            <p><b>Customer: </b>{transaction.customerUsername}</p>
                                            <p><b>Customer Email: </b>{transaction.customerEmail}</p>
                                            <p><b>Value: </b>${transaction.amount}</p>
                                        </div>
                                    </div>
                                }) : <Spinner style={{margin: '10px auto'}} animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner> 
                        }
                    </Col>
                </Row>
            </Container>
        </div>
    }
}

export default Dashboard;