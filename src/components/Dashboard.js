import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import ConfirmationModal from './ConfirmationModal';
import EditPostModal from './EditPostModal'
import BundleModal from './BundleModal';
import { Link } from 'react-router-dom';
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
    @media(min-width: 576px){
        .customSizeCardSm {
            margin-bottom: 50px;
        }
    }
`;

class Dashboard extends React.Component {
    state = {
        loading: false,
        loadingPosts: false,
        loadingFiltered: false,
        loadingBundles: false,
        error: null,
        limit: false,
        offset: 0,
        category: "Public",
        bundleCategory: "Active",
        totalSells: 0,
        user: null,
        balance: 0,
        transactions: [],
        posts: [],
        bundles: [],
        postId: '',
        bundleId: '',
        isBundleDelete: false,
        showConfirmationModal: false,
        showEditPostModal: false,
        showCreateBundleModal: false,
        loadingDelete: false,
        filteredTransactions: []
    }
    componentDidMount() {
        axios.get('/me')
            .then((response) => {
                this.setState({ user: response.data.user });
                this.getBuyerTransactions();
                this.getFilteredTransactions();
                this.getPosts();
                this.getBundles();
            })
    }
    getBuyerTransactions = () => {
        this.setState({ loading: true });
        axios.get(`/transactions?seller=${true}&offset=${this.state.offset}`)
            .then((response) => {
                console.log(response.data);
                this.setState({ limit: response.data.limit, loading: false, transactions: this.state.transactions.concat(response.data.transactions), offset: this.state.offset + 3, balance: response.data.balance, totalSells: response.data.total });
            })
            .catch((error) => {
                console.log(error);
                this.setState({ loading: false, error });
            })
    }
    getFilteredTransactions = () => {
        this.setState({ loadingFiltered: true });
        axios.get('/transactions/date')
            .then((response) => {
                this.setState({ loadingFiltered: false, filteredTransactions: this.state.filteredTransactions.concat(response.data) });
                console.log(response);
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.log(error);
            })
    }
    getBundles = () => {
        this.setState({ loadingBundles: true });
        axios.get(`/bundles?category=${this.state.bundleCategory.toLowerCase()}`)
            .then((response) => {
                console.log(response.data);
                this.setState({ loadingBundles: false, bundles: response.data.bundles });
            })
            .catch((error) => {
                this.setState({ loadloadingBundlesing: false, error });
            })
    }
    deleteBundle = () => {
        this.setState({ loadingDelete: true });
        axios.delete(`/bundles/${this.state.bundleId}`)
            .then(() => {
                this.setState({ loadingDelete: false, showConfirmationModal: false });
                this.getBundles();
            })
            .catch((error) => {
                this.setState({ error });
            })
    }
    getSellerTransactions = () => {
        axios.get(`/transactions?seller=${true}`)
            .then((response) => {
                console.log(response.dta);
                this.setState({ loading: false, transactions: this.state.transactions.concat(response.data) });
            })
            .catch((error) => {
                this.setState({ loading: false, error });
            })
    }
    getPosts = (reload = false) => {
        this.setState({ loadingPosts: true });
        axios.get(`/profile/${this.state.user.username}/posts?offset=${!reload ? this.state.offset : 0}&category=${this.state.category.toLowerCase()}`)
            .then((response) => {
                console.log(response.data);
                this.setState({ loadingPosts: false, posts: !reload ? this.state.posts.concat(response.data.posts) : response.data.posts, offset: this.state.offset + 6 });
            })
            .catch((error) => {
                this.setState({ error, loadingPosts: false });
            })
    }
    deletePost = () => {
        this.setState({ loadingDelete: true });
        axios.delete(`/posts/${this.state.postId}`)
            .then(() => {
                console.log('deleted');
                this.getPosts(true);
                this.setState({ loadingDelete: false, showConfirmationModal: false });
            })
            .catch((error) => {
                console.log(error);
                this.setState({ loadingDelete: false, error });
            })
    }
    changeCategory = (category) => {
        this.setState({ category, offset: 0 });
    }
    changeBundleCategory = (category) => {
        this.setState({ bundleCategory: category });
    }
    showConfirmationModalTrigger = (id, type) => {
        console.log(id, type);
        this.setState({ showConfirmationModal: true, postId: type === 'post' ? id : '', bundleId: type === 'bundle' ? id : '', isBundleDelete: type === 'bundle' ? true : false });
    }
    showEditPostModalTrigger = (postId) => {
        this.setState({ showEditPostModal: true, postId });
    }
    showCreateBundleModalTrigger = () => {
        this.setState({ showCreateBundleModal: true });
        this.getBundles();
    }
    closeConfirmationModalTrigger = () => {
        this.setState({ showConfirmationModal: false });
    }
    closeEditPostModalTrigger = () => {
        this.getPosts(true);
        this.setState({ showEditPostModal: false });
    }
    closeBundleModalTrigger = () => {
        this.setState({ showCreateBundleModal: false });
    }

    render() {
        return <div style={{ marginTop: '0px', paddingBottom: '80px' }}>
            {
                this.state.user ?
                    <Jumbotron style={{ backgroundColor: `${this.state.user.bannerColor}`, padding: '80px' }} fluid>
                        <h2 style={{ color: `${this.state.user.fontColor}` }}>Dashboard</h2>
                        <hr style={{ border: `1px solid ${this.state.user.fontColor}` }} />
                        <Styles>
                            <div className="cardsWrapper" >
                                <div className="customCard" style={{ backgroundColor: `${this.state.user.borderColor}` }} >
                                    <div className="topCardAlign">
                                        <p className="cardTitle" style={{ color: `${this.state.user.bannerColor}`, fontSize: '1.00rem', fontTransform: 'uppercase' }} ><b>Balance</b></p>
                                        <div className="cardIcon" style={{ color: `${this.state.user.borderColor}`, backgroundColor: `${this.state.user.bannerColor}` }}>
                                            <i style={{ fontSize: '1.25rem', color: `${this.state.user.fontColor}` }} className="fas fa-dollar-sign"></i>
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '1.5rem', color: `${this.state.user.bannerColor}` }}><b>${this.state.user.balance}</b></p>
                                </div>
                                <div className="customCard" style={{ backgroundColor: `${this.state.user.borderColor}` }} >
                                    <div className="topCardAlign">
                                        <p className="cardTitle" style={{ color: `${this.state.user.bannerColor}`, fontSize: '1.00rem', fontTransform: 'uppercase' }} ><b>Total Sells</b></p>
                                        <div className="cardIcon" style={{ color: `${this.state.user.borderColor}`, backgroundColor: `${this.state.user.bannerColor}` }}>
                                            <i style={{ fontSize: '1.25rem', color: `${this.state.user.fontColor}` }} className="fas fa-money-bill"></i>
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '1.5rem', color: `${this.state.user.bannerColor}` }}><b>{this.state.totalSells} {this.state.transactions.length === 1 ? 'sell' : 'sells'}</b></p>
                                </div>
                                <div className="customCard" style={{ backgroundColor: `${this.state.user.borderColor}` }} >
                                    <div className="topCardAlign">
                                        <p className="cardTitle" style={{ color: `${this.state.user.bannerColor}`, fontSize: '1.00rem', fontTransform: 'uppercase' }} ><b>{this.state.user.subscriptions === 1 ? 'subscriber' : 'subscribers'}</b></p>
                                        <div className="cardIcon" style={{ color: `${this.state.user.borderColor}`, backgroundColor: `${this.state.user.bannerColor}` }}>
                                            <i style={{ fontSize: '1rem', color: `${this.state.user.fontColor}` }} className="fas fa-user-plus"></i>
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '1.5rem', color: `${this.state.user.bannerColor}` }}><b>{this.state.user.subscriptions} subscribers</b></p>
                                </div>
                                <div className="customCard" style={{ backgroundColor: `${this.state.user.borderColor}` }} >
                                    <div className="topCardAlign">
                                        <p className="cardTitle" style={{ color: `${this.state.user.bannerColor}`, fontSize: '1.00rem', fontTransform: 'uppercase' }} ><b>Total Revenue</b></p>
                                        <div className="cardIcon" style={{ color: `${this.state.user.borderColor}`, backgroundColor: `${this.state.user.bannerColor}` }}>
                                            <i style={{ fontSize: '1.25rem', color: `${this.state.user.fontColor}` }} className="fas fa-arrow-up"></i>
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '1.5rem', color: `${this.state.user.bannerColor}` }}><b>${this.state.user.balance}</b></p>
                                </div>
                            </div>
                        </Styles>
                    </Jumbotron>
                    : <Container><Row><Spinner style={{ margin: '10px auto' }} animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner><Spinner style={{ margin: '10px auto' }} animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner></Row></Container>
            }
            <Container>
                <Row>
                    <Col xs={{ span: 12, offset: 0, order: 2 }} md={6} lg={{ span: 4, offset: 0, order: 2 }}>
                        <h3>Last Sells</h3>
                        <hr />
                        {
                            !this.state.transactions ? <Container><Row><Spinner style={{ margin: '10px auto' }} animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner></Row></Container> : this.state.transactions.length > 0 ? this.state.transactions.map((transaction, index) => {
                                return <Accordion key={index} defaultActiveKey="-1">
                                    <Card>
                                        <Accordion.Toggle as={Card.Header} eventKey={`${index}`}>
                                            {transaction.productNames[0]}
                                        </Accordion.Toggle>
                                        <Accordion.Collapse eventKey={`${index}`}>
                                            <Card.Body>
                                                <div key={index} style={{ border: '1px solid #dedede', borderRadius: '5px', padding: '20px', marginBottom: '20px' }}>
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
                            this.state.user ? <Button disabled={this.state.limit || this.state.loading} style={{ marginTop: '0px', borderRadius: '0 0 5px 5px', backgroundColor: `${this.state.user.bannerColor}`, color: `${this.state.user.fontColor}` }} variant="secondary" block onClick={this.getBuyerTransactions}>
                                {
                                    !this.state.loading && !this.state.limit ? 'Load More' : !this.state.loading && this.state.limit  ? 'All transactions were loaded' : <Spinner animation="border" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </Spinner>
                                }
                            </Button> : null
                        }
                    </Col>
                    <Col xs={{ span: 12, offset: 0, order: 1 }} md={6} lg={8}>
                        <h3>Filtered Transactions</h3>
                        <hr />
                        {
                            !this.state.loadingFiltered && this.state.filteredTransactions ?
                                this.state.filteredTransactions.map((transaction, index) => {
                                    return <div key={index} style={{ border: '1px solid #dedede', borderRadius: '5px', padding: '20px', marginBottom: '20px' }}>
                                        <div className="transactionsSummary">
                                            <p><b>Product id: </b>{transaction.productBuyed}</p>
                                            <p><b>Products: </b>{transaction.productNames}</p>
                                            <p><b>Customer: </b>{transaction.customerUsername}</p>
                                            <p><b>Customer Email: </b>{transaction.customerEmail}</p>
                                            <p><b>Value: </b>${transaction.amount}</p>
                                        </div>
                                    </div>
                                }) : <Spinner style={{ margin: '10px auto' }} animation="border" role="status">
                                    <span className="sr-only">Loading...</span>
                                </Spinner>
                        }
                    </Col>
                </Row>
                <hr />
                {
                    this.state.user ? <Jumbotron style={{ backgroundColor: `${this.state.user.bannerColor}` }}>
                        <h3 style={{ color: `${this.state.user.fontColor}` }}>Make a bundle <i className="fas fa-box-open"></i></h3>
                        <Button onClick={this.showCreateBundleModalTrigger} style={{ color: `${this.state.user.fontColor}`, backgroundColor: `${this.state.user.bannerColor}`, border: `2px solid ${this.state.user.borderColor}` }}>Try out</Button>
                    </Jumbotron> : null
                }
                <Row>
                    <Col xs={{ span: 12, order: 1 }} md={12} lg={6} style={{ marginBottom: '50px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', alignContent: 'center' }}>
                            <h3>Posts</h3>
                            <Form inline>
                                <Form.Label>Sort By</Form.Label>&nbsp;&nbsp;
                                    <Form.Control as="select" className="mr-sm-2" value={this.state.category} onChange={e => this.changeCategory(e.target.value)}>
                                    <option>Public</option>
                                    <option>Premium</option>
                                </Form.Control>
                                <Button onClick={this.getPosts} variant="outline-primary">Sort</Button>
                            </Form>
                        </div>
                        <hr />
                        {
                            this.state.loadingPosts ? <Container><Row><Spinner style={{ margin: '25px auto' }} animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner></Row></Container> : this.state.posts.length > 0 ? this.state.posts.map((post, index) => {
                                return <div key={index} style={{ borderRadius: '5px', marginTop: '25px', padding: '20px', border: '2px solid #dedede', display: 'flex', justifyContent: 'space-between', alignContent: 'center' }}>
                                    {post.title}
                                    <div>
                                        <i style={{ cursor: 'pointer' }} onClick={() => this.showEditPostModalTrigger(post._id)} className="fas fa-pencil-alt text-primary"></i>
                                        {
                                            post.category === 'public' ? <i onClick={() => this.showConfirmationModalTrigger(post._id, 'post')} style={{ marginLeft: '50px', cursor: 'pointer' }} className="fas fa-times text-danger"></i> : null
                                        }
                                    </div>
                                </div>
                            }) : <Alert variant="primary" style={{ marginTop: '25px' }}>No posts to show</Alert>
                        }
                    </Col>
                    <Col xs={{ span: 12, order: 1 }} md={12} lg={6} style={{ marginBottom: '50px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', alignContent: 'center' }}>
                            <h3>Bundles</h3>
                            <Form inline>
                                <Form.Label>Sort By</Form.Label>&nbsp;&nbsp;
                                    <Form.Control as="select" className="mr-sm-2" value={this.state.bundleCategory} onChange={e => this.changeBundleCategory(e.target.value)}>
                                    <option>Active</option>
                                    <option>Inactive</option>
                                </Form.Control>
                                <Button onClick={this.getBundles} variant="outline-primary">Sort</Button>
                            </Form>
                        </div>
                        <hr />
                        {
                            this.state.loadingBundles ? <Container><Row><Spinner style={{ margin: '25px auto' }} animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner></Row></Container> : this.state.bundles.length > 0 ? this.state.bundles.map((bundle, index) => {
                                return <div key={index} style={{ borderRadius: '5px', marginTop: '25px', padding: '20px', border: '2px solid #dedede', display: 'flex', justifyContent: 'space-between', alignContent: 'center' }}>
                                    {bundle.name}
                                    <div>
                                        <i style={{ cursor: 'pointer' }} className="fas fa-pencil-alt text-primary"></i>
                                        <i onClick={() => this.showConfirmationModalTrigger(bundle._id, 'bundle')} style={{ marginLeft: '50px', cursor: 'pointer' }} className="fas fa-times text-danger"></i>
                                    </div>
                                </div>
                            }) : <Alert variant="primary" style={{ marginTop: '25px' }}>No bundles to show</Alert>
                        }
                    </Col>
                </Row>
                {this.state.showConfirmationModal ? <ConfirmationModal bundle={this.state.isBundleDelete} deleteBundle={this.deleteBundle} loading={this.state.loadingDelete} deletePost={this.deletePost} closeConfirmationModalTrigger={this.closeConfirmationModalTrigger} show={this.state.showConfirmationModal} id={this.state.postId} /> : null}
                {this.state.showCreateBundleModal ? <BundleModal show={this.state.showCreateBundleModal} closeBundleModalTrigger={this.closeBundleModalTrigger}></BundleModal> : null}
                {this.state.showEditPostModal ? <EditPostModal postId={this.state.postId} showEditModal={this.state.showEditPostModal} closeEditPostModalTrigger={this.closeEditPostModalTrigger} ></EditPostModal> : null}
            </Container>
        </div>
    }
}

export default Dashboard;