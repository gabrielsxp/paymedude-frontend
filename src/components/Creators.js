import React from 'react';
import axios from '../axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Spinner from 'react-bootstrap/Spinner';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class Creators extends React.Component {
    state = {
        loading: null,
        subscribing: false,
        searching: null,
        sorting: false,
        offset: 0,
        sort: 'Popularity',
        searchQuery: '',
        currentAction: '',
        limit: false,
        creators: [],
        error: null
    }
    componentDidMount() {
        this.loadCreators();
    }
    loadCreators = () => {
        this.setState({ loading: true });
        axios.get(`/creators?offset=${this.state.offset}`)
            .then((response) => {
                console.log(response.data);
                this.setState({ loading: false, creators: this.state.creators.concat(response.data.creators), offset: this.state.offset + 6, currentAction: 'load', limit: response.data.limit });
            })
            .catch((error) => {
                this.setState({ loading: false, error: error });
            })
    }
    subscribe = (username) => {
        console.log(username);
        this.setState({ subscribing: true });
        axios.post('/subscribe', { creator: username })
            .then((response) => {
                this.props.subscribe(response.data.user);
                this.props.userChanged();
                this.setState({ subscribing: false });
            })
            .catch((error) => {
                this.setState({ subscribing: false, error });
            })
    }
    unsubscribe = (username) => {
        this.setState({ subscribing: true });
        axios.post('/unsubscribe', { creator: username })
            .then((response) => {
                this.props.unsubscribe(response.data.user);
                this.props.userChanged();
                this.setState({ subscribing: false });
            })
            .catch((error) => {
                this.setState({ subscribing: false, error });
            })
    }
    searchCreator = (e) => {
        e.preventDefault();
        this.setState({ searching: true, loading: true, creators: [] });
        axios.get(`/creators?search=${this.state.searchQuery}&offset=${this.state.offset}`)
            .then((response) => {
                console.log(response.data);
                this.setState({ creators: this.state.creators.concat(response.data.creators), searching: false, loading: false, offset: this.state.offset + 6, currentAction: 'search' });
            })
            .catch((error) => {
                this.setState({ searching: false, loading: false, error });
            })
    }
    sortCreators = (clicked) => {
        this.setState({ sorting: true, loading: true, creators: clicked ? [] : this.state.creators });
        const option = this.state.sort === 'Popularity' ? '1' : this.state.sort === 'Posts' ? '2' : this.state.sort === 'Newest' ? '3' : 'error';
        axios.get(`/creators?sort=${option}&offset=${clicked ? '0' : this.state.offset}`)
            .then((response) => {
                console.log(response.data.creators);
                this.setState({ sorting: false, loading: false, creators: this.state.creators.concat(response.data.creators), offset: this.state.offset + 6, currentAction: 'sort', limit: response.data.limit });
            })
            .catch((error) => {
                this.setState({ sorting: false, loading: false, error, currentAction: 'sort' });
            })
    }
    chooseAction = (clicked) => {
        if(this.state.currentAction === 'load'){
            this.loadCreators();
        }
        if(this.state.currentAction === 'sort'){
            this.sortCreators(clicked);
        }
    }
    render() {
        return <div style={{ paddingTop: '80px', paddingBottom: '80px', minHeight: '100vh' }}>
            <Container>
                <h2 style={{ textAlign: 'center' }}>Top Creators</h2>
                <hr />
                <div className="control" style={{ border: '1px solid #dedede', borderRadius: '5px', padding: '20px', display: 'flex', justifyContent: 'space-between', flexFlow: 'row', flexWrap: 'wrap' }}>
                    <Form inline>
                        <Form.Label>Sort By</Form.Label>&nbsp;&nbsp;
                        <Form.Control value={this.state.sort} onChange={e => this.setState({ offset: 0, currentAction: 'sort', sort: e.target.value })} as="select" className="mr-sm-2">
                            <option>Popularity</option>
                            <option>Posts</option>
                            <option>Newest</option>
                        </Form.Control>
                        <Button onClick={() => this.sortCreators(true)} variant="outline-primary">Sort</Button>
                    </Form>
                    <Form inline>
                        <FormControl onChange={e => this.setState({ searchQuery: e.target.value })} type="text" placeholder="username" className="mr-sm-2" />
                        <Button onClick={e => this.searchCreator(e)} type="submit" variant="outline-success">Search</Button>
                    </Form>
                </div>
                <Row>
                    {
                        this.state.creators ? this.state.creators.map((creator, index) => {
                            return <Col key={index} xs={12} md={6} lg={4} style={{ marginTop: '50px' }}>
                                <Card style={{ width: '18rem' }}>
                                    <Card.Img variant="top" src={`http://127.0.0.1:3001/${creator.fullImage}`} />
                                    <Card.Body>
                                        <Card.Title>{creator.username}</Card.Title>
                                        <Card.Text>
                                            {creator.bio}
                                        </Card.Text>
                                        <div className="btnWrap" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                            <Link to={`/profile/${creator.username}`}><Button variant="primary">Visit Profile</Button></Link>
                                            {
                                                this.props.user ?
                                                    <Button
                                                        disabled={this.state.subscribing}
                                                        onClick={() => !this.props.user.creators.includes(creator.username) ? this.subscribe(creator.username) : this.unsubscribe(creator.username)}
                                                        variant={this.props.user.creators.includes(creator.username) ? `success` : this.props.user.creators.includes(creator.username) ? `danger` : `info`}>
                                                        {
                                                            this.state.subscribing ? <i class="fas fa-ellipsis-h"></i> : this.props.user.creators.includes(creator.username) ? <i className="fas fa-check"></i> : this.props.user.creators.includes(creator.username) ? <i className="fas fa-times"></i> : <i className="fas fa-plus"></i>
                                                        }
                                                    </Button> : null
                                            }
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        }) : null
                    }
                </Row>
                <hr />
                {
                    this.state.currentAction !== 'search' || this.state.limit === false ?
                        <Button variant="secondary" type="null" block size="sm" onClick={e => this.chooseAction(false)} disabled={this.state.loading || this.state.limit}>
                            {!this.state.loading ? 'Load More' : <div>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        />
                                        <span className="sr-only">Loading...</span>
                                    </div>
                            }
                        </Button>
                    : null
                }
            </Container>
        </div>
    }
}

const mapStateToProps = state => {
    return {
        auth: state.authenticated,
        user: state.user
    }
}

const mapDispatchToProps = dispatch => {
    return {
        subscribe: (user) => dispatch({ type: 'SUBSCRIBE', user }),
        unsubscribe: (user) => dispatch({ type: 'UNSUBSCRIBE', user }),
        userChanged: () => dispatch({ type: 'USER_CHANGED' })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Creators);