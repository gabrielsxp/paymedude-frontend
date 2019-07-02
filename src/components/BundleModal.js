import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import axios from '../axios';

class BundleModal extends React.Component {
    state = {
        posts: [],
        price: 0,
        name: '',
        submiting: false,
        success: null,
        error: null,
        post: null,
        items: [],
        loading: false,
        exists: false
    }
    componentDidMount() {
        axios.get('/posts/premium')
            .then((response) => {
                console.log(response.data);
                this.setState({ loading: false, posts: this.state.posts.concat(response.data.posts), post: 0 })
            })
            .catch((error) => {
                console.log(error);
                this.setState({ error, loading: false });
            })
    }
    createBundle = () => {
        const body = {
            name: this.state.name,
            price: this.state.price,
            items: this.state.items,
            discount: 0
        }
        this.setState({ submiting: true });
        axios.post('/bundle', body)
            .then((response) => {
                if (response.data.bundle) {
                    this.setState({ submiting: false, success: 'Bundle created successfully !' });
                }
            })
            .catch((error) => {
                this.setState({ error })
            })

    }
    addToBundle = (index) => {
        if (this.state.items.find((post) => post._id === this.state.posts[index]._id)) {
            return;
        }
        this.setState({ items: this.state.items.concat(this.state.posts[index]) });
    }
    removeForBundle = (id) => {
        const posts = this.state.items;
        const index = posts.findIndex((post) => post._id === id);
        posts.splice(index, 1);
        this.setState({ items: posts });
    }
    verifyValue = () => {
        return this.state.price.match('^[0-9]+(\.[0-9]{1,2})?$');
    }
    render() {
        return <div>
            <Modal
                show={this.props.show}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={this.props.closeBundleModalTrigger}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Create a bundle
                </Modal.Title>
                </Modal.Header>
                {
                    this.state.success ? <Alert variant="success">{this.state.success}</Alert>
                        : this.state.error ? <Alert variant="danger">{this.state.error}</Alert>
                            : null
                }
                {
                    this.state.loading ? <Spinner style={{ margin: '10px auto' }} animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner> : this.state.posts.length > 0 ?
                            <Modal.Body>
                                <Form>
                                    <Form.Group required>
                                        <Form.Label>Select the name of the bundle</Form.Label>
                                        <Form.Control value={this.state.name} onChange={e => this.setState({ name: e.target.value })} type="text"></Form.Control>
                                    </Form.Group>
                                    <Form.Group controlId="exampleForm.ControlSelect2">
                                        <Form.Label>Select the posts that you want to add to the bundle</Form.Label>
                                        <Container fluid>
                                            <Row>
                                                <Col xs={8}>
                                                    <Form.Control value={this.state.post} onChange={e => this.setState({ post: e.target.value })} as="select">
                                                        {
                                                            this.state.posts.map((post, index) => {
                                                                return <option value={index} key={post._id}>{post.title}</option>
                                                            })
                                                        }
                                                    </Form.Control>
                                                </Col>
                                                <Col xs={4}>
                                                    <Button variant="outline-success" onClick={() => this.addToBundle(this.state.post)}>Add</Button>
                                                </Col>
                                            </Row>
                                            <hr />
                                            <Row>
                                                <Col xs={12}>
                                                    {
                                                        this.state.items.length > 0 ? this.state.items.map((item, index) => {
                                                            return <div key={index} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignContent: 'center', padding: '10px 15px', border: '2px solid #dedede', borderRadius: '5px', marginBottom: '20px' }}>
                                                                <p><b>{item.title}</b></p>
                                                                <i onClick={() => this.removeForBundle(item._id)} style={{ color: 'red', cursor: 'pointer' }} className="fas fa-times"></i>
                                                            </div>
                                                        }) : <Alert variant="primary">There is no items on the bundle</Alert>
                                                    }
                                                </Col>
                                            </Row>
                                        </Container>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Select the price of the bundle</Form.Label>
                                        <Form.Control value={this.state.price} onChange={e => this.setState({ price: e.target.value })} type="text"></Form.Control>
                                    </Form.Group>
                                    {
                                        this.state.items.length > 0 ?
                                            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                                                <Button disabled={this.state.submiting} onClick={this.createBundle}>
                                                    {
                                                        !this.state.submiting ? 'Create Bundle' : <Spinner style={{ margin: '10px auto' }} animation="border" role="status">
                                                            <span className="sr-only">Loading...</span>
                                                        </Spinner>
                                                    }
                                                </Button>
                                            </div> : <p className="text-danger">'Add items to create the bundle'</p>
                                    }
                                </Form>
                            </Modal.Body>
                            : <div style={{ width: '100%', padding: '20px' }}>
                                <Alert variant="primary">
                                    You don't have any premium posts !
                    </Alert></div>
                }
            </Modal>
        </div>
    }
}

export default BundleModal;