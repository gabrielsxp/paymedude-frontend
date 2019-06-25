import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import axios from '../axios';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { login, saveUserData } from '../services/auth';
import styled from 'styled-components';

const Styles = styled.div`
    #sign-up {
        height: calc(100vh-3rem);
        padding-top: 50px;
        padding-bottom: 50px;
    }
`;

class SignUp extends React.Component {
    state = {
        validUser: null,
        validEmail: null,
        error: null,
        validPassword: null,
        matchPasswords: null,
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        sex: 'Boy',
        creator: null,
        submit: false
    }
    componentDidMount() {
        const arrSearch = this.props.location.search.split('=');
        const value = arrSearch.pop();
        this.setState({ creator: JSON.parse(value) });
    }
    checkUsername = () => {
        if (this.state.username.length < 6) {
            this.setState({ validUser: false });
            return;
        }
        axios.post('/findUser', { username: this.state.username })
            .then((response) => {
                response.data.user === false ? this.setState({ validUser: true }) : this.setState({ validUser: false });
            })
            .catch((error) => {
                this.setState({ error: error });
            })
    }
    checkEmail = () => {
        axios.post('/findEmail', { email: this.state.email })
            .then((response) => {
                console.log(this.state.email, response);
                response.data.user === false ? this.setState({ validEmail: true }) : this.setState({ validEmail: false });
            })
            .catch((error) => {
                this.setState({ error: error });
            })
    }
    checkPassword = () => {
        return this.setState({ validPassword: true });
    }
    checkPasswords = () => {
        return this.setState({ matchPasswords: this.state.password === this.state.confirmPassword });
    }
    createAccount = (e) => {
        e.preventDefault();
        const body = {
            username: this.state.username,
            email: this.state.email,
            password: this.state.password,
            creator: this.state.creator,
            sex: this.state.sex === 'Boy' ? true : false
        }
        this.setState({ submit: true });
        axios.post('/signup', body)
            .then((response) => {
                login(response.data.token);
                const userData = {
                    ...response.data.user
                };
                saveUserData(userData);
                this.setState({ submit: false });
                this.props.onAuthentication(userData);
                this.props.history.push(`/dashboard`);
            })
            .catch((error) => {
                this.setState({ submit: false, error: error });
            })
    }
    render() {
        const canSubmit = this.state.validUser && this.state.validEmail && this.state.matchPasswords;
        return <Styles>
            <div id="sign-up">
                <Container>
                    <Row>
                        <Col xs={12} md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
                            <h3>Create Your Account</h3>
                            <Form>
                                {
                                    this.state.error ? <Alert variant="danger">
                                        {this.state.error}
                                    </Alert> : null
                                }
                                <Form.Group controlId="formBasicUsername">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control isInvalid={this.state.validUser === false} isValid={this.state.validUser === true} value={this.state.username} onChange={e => this.setState({ username: e.target.value })} onBlur={this.checkUsername} type="text" placeholder="Type your username" />
                                    <Form.Text className="text-muted">
                                        Must have at least 6 characters
                            </Form.Text>
                                </Form.Group>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control isInvalid={this.state.validEmail === false} isValid={this.state.validEmail} value={this.state.email} onChange={e => this.setState({ email: e.target.value })} onBlur={this.checkEmail} type="email" placeholder="Enter email" />
                                    <Form.Text className="text-muted">
                                        We'll never share your email with anyone else.
                            </Form.Text>
                                </Form.Group>

                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control isValid={this.state.validPassword} type="password" placeholder="Password" onBlur={this.checkPassword} value={this.state.password} onChange={e => this.setState({ password: e.target.value })} />
                                    <Form.Text className="text-muted">
                                        Must have at least 6 characters
                            </Form.Text>
                                </Form.Group>
                                <Form.Group controlId="formConfirmPassword">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control isValid={this.state.matchPasswords} type="password" placeholder="Confirm your Password" onBlur={this.checkPasswords} value={this.state.confirmPassword} onChange={e => this.setState({ confirmPassword: e.target.value })} />
                                </Form.Group>
                                <Form.Group controlId="formSexSelect">
                                    <Form.Label>You are a...</Form.Label>
                                    <Form.Control as="select" value={this.state.sex} onChange={e => this.setState({ sex: e.target.value })}>
                                        <option>Boy</option>
                                        <option>Girl</option>
                                    </Form.Control>
                                </Form.Group>

                                <Button variant="primary" type="submit" onClick={this.createAccount} disabled={this.state.submit || !canSubmit}>
                                    {
                                        !this.state.submit ? 'Create Account' :
                                            <div>
                                                Working...&nbsp;&nbsp;
                                    <Spinner
                                                    as="span"
                                                    animation="border"
                                                    size="sm"
                                                    role="status"
                                                    aria-hidden="false"
                                                />
                                                <span className="sr-only">Working...</span>
                                            </div>
                                    }
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
        </Styles>
    }
}

const mapPropsToProps = state => {
    return {
        auth: state.authenticated,
        user: state.user
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuthentication: (user) => dispatch({ type: 'SIGNIN', user })
    }
}

export default connect(mapPropsToProps, mapDispatchToProps)(withRouter(SignUp));