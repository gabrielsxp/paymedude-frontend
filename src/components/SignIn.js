import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import axios from '../axios';
import {Link} from 'react-router-dom';
import {login, saveUserData} from '../services/auth';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import styled from 'styled-components';

const Styles = styled.div`
    #sign-up {
        height: calc(100vh-3rem);
        padding-top: 50px;
        padding-bottom: 50px;
    }
`;

class SignIn extends React.Component {
    state = {
        error: null,
        validUser: null,
        username: '',
        password: '',
        submit: false
    }
    signInAccount = (e) => {
        e.preventDefault();
        const body = {
            username: this.state.username,
            password: this.state.password
        }
        this.setState({ submit: true });
        axios.post('/signin', body)
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
                this.setState({ submit: false, error: 'Unable to access your account' });
            })
    }
    checkUsername = () => {
        this.state.username.length >= 6 ? this.setState({validUser: true}) : this.setState({validUser: false});
    }
    checkPassword = () => {
        this.state.password.length >= 6 ? this.setState({validPassword: true}) : this.setState({validPassword: false});
    }
    render(){
        const canSubmit = this.state.validUser && this.state.password.length >= 6;
        return <Styles>
        <div id="sign-up">
            <Container>
                <Row>
                    <Col xs={12} md={{span: 8, offset: 2}} lg={{span: 6, offset: 3}}>
                    <h3>Access Your Account</h3>
                    <Form>
                        {
                            this.state.error ? <Alert variant="danger">
                                {this.state.error}
                            </Alert> : null
                        }
                        <Form.Group controlId="formBasicUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control isInvalid={this.state.User === false} isValid={this.state.validUser === true} value={this.state.username} onChange={e => this.setState({username: e.target.value})} onBlur={ this.checkUsername } type="text" placeholder="Type your username" />
                            <Form.Text className="text-muted">
                                This will be the name that points to your profile
                            </Form.Text>
                            <Form.Text className="text-muted">
                                Must have at leat 6 characters
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control isValid={this.state.password >= 6} type="password" placeholder="Password" onBlur={this.checkPassword} value={this.state.password} onChange={e => this.setState({ password:e.target.value })}/>
                            <Form.Text className="text-muted">
                                Must have at leat 6 characters
                            </Form.Text>
                        </Form.Group>
                        <Form.Group controlId="formRecoveryPassword">
                            <Link to="/">Recovery Password</Link>
                        </Form.Group>
                        
                        <Button variant="primary" type="submit" onClick={this.signInAccount} disabled={this.state.submit || !canSubmit}>
                            {
                                !this.state.submit ? 'Access Account' :
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
        onAuthentication: (user) => dispatch({type: 'SIGNIN', user })
    }
}

export default connect(mapPropsToProps, mapDispatchToProps)(withRouter(SignIn));