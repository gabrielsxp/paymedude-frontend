import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Accordion from 'react-bootstrap/Accordion';
import { CirclePicker } from 'react-color';
import axios from '../axios';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import colors from 'nice-color-palettes';

class Profile extends React.Component {
    state = {
        user: null,
        show: false,
        changePassword: false,
        password: '',
        newPassword: '',
        bio: null,
        file: null,
        success: null,
        validPasword: null,
        validNewPasword: null,
        submit: false,
        loading: false,
        error: null,
        bannerColor: '',
        fontColor: '',
        borderColor: '',
        randomColorsBanner: [],
        randomColorsBorder: [],
        randomColorsFont: [],
    }
    componentDidMount() {
        this.setBannerColors();
        this.setBorderColors();
        this.setFontColors();
        this.getProfile();
    }
    getProfile = () => {
        this.setState({ loading: true });
        console.log(this.props);
        axios.get(`/me`)
            .then((response) => {
                this.setState({ user: response.data.user, loading: false, bio: response.data.user.bio, fontColor: response.data.user.fontColor, borderColor: response.data.user.borderColor, bannerColor: response.data.user.bannerColor});
            })
            .catch((error) => {
                this.setState({ error: error, loading: false });
            });
    }
    handleClose = () => {
        this.setState({ show: false });
    }
    handleShow = () => {
        this.setState({ show: true });
    }
    verifyPassword = () => {
        return this.state.password.length >= 6 ? this.setState({validPassword: true}) : this.setState({validPassword: false});
    }
    editProfile = () => {
        this.setState({ submit: true, success: null });
        const dataPassword = {
            password: this.state.password,
            bannerColor: this.state.bannerColor,
            fontColor: this.state.fontColor,
            borderColor: this.state.borderColor,
            bio: this.state.bio
        };
        const data = {
            bio: this.state.bio,
            bannerColor: this.state.bannerColor,
            fontColor: this.state.fontColor,
            borderColor: this.state.borderColor,
        }
        if(!this.state.file){
            axios.patch(`${this.props.location.pathname}`, this.state.changePassword ? dataPassword : data)
                .then((response) => {
                    this.setState({ submit: false, success: 'Profile Updated !' })
                    this.props.userChanged();
                    this.getProfile();
                    this.handleClose();
                })
                .catch((error) => {
                    this.setState({ submit: false, error });
                    this.handleClose();
                })
        } else {
            const data = new FormData();
            data.append('bio', this.state.bio);
            data.append('bannerColor', this.state.bannerColor);
            data.append('fontColor', this.state.fontColor);
            data.append('borderColor', this.state.borderColor);
            data.append('file', this.state.file);

            const passwordData = new FormData();
            passwordData.append('password', this.state.password);
            passwordData.append('bio', this.state.bio);
            passwordData.append('bannerColor', this.state.bannerColor);
            passwordData.append('fontColor', this.state.fontColor);
            passwordData.append('borderColor', this.state.borderColor);
            passwordData.append('file', this.state.file);

            axios.patch(`${this.props.location.pathname}`, this.state.changePassword ? dataPassword : data, { headers: {  'Content-Type': 'multipart/form-data' }})
            .then((response) => {
                this.setState({ submit: false, success: 'Profile Updated !' })
                this.props.userChanged();
                this.getProfile();
                this.handleClose();
            })
            .catch((error) => {
                this.setState({ submit: false, error });
                this.handleClose();
            })
        }
    }
    handleChangeBannerColor = (color, event) => {
        this.setState({ bannerColor: color.hex });
    }
    handleChangeBorderColor = (color, event) => {
        this.setState({ borderColor: color.hex });
    }
    handleChangeFontColor = (color, event) => {
        this.setState({ fontColor: color.hex });
    }
    randomizeColors = () => {
        let allColors = []
        for(let i = 0; i < 4; i++){
            const index = Math.floor(Math.random() * (100 -1) + 1);
            const pallete = colors[index];
            for(let c of pallete){
                allColors.push(c);
            }
        }
        return allColors.slice(0,18);
    }
    setBannerColors = () => {
        const c = this.randomizeColors();
        this.setState({randomColorsBanner: c });
    }
    setFontColors = () => {
        const c = this.randomizeColors();
        this.setState({randomColorsFont: c});
    }
    setBorderColors = () => {
        const c = this.randomizeColors();
        this.setState({randomColorsBorder: c});
    }
    render() {
        const validNewPassword = this.state.validPassword && this.state.password === this.state.newPassword;
        return <div style={{ paddingTop: '80px', paddingBottom: '80px', minHeight: '100vh' }}>
            <Container>
                <Row>
                    <Col xs={{span: 8, offset: 2}} lg={{span: 4, offset: 0}} md={{span: 6, offset: 0}}>
                        {
                            this.state.loading === false && this.state.user !== null ?
                                <Card style={{ width: '18rem' }}>
                                    <Card.Img variant="top" src={`http://127.0.0.1:3001/${this.state.user.fullImage}`} />
                                    <Card.Body>
                                        <Card.Title>{this.state.user.username}</Card.Title>
                                        <Card.Text>
                                            {this.state.user.bio ? this.state.user.bio : 'Tell people what you’re interested in.'}
                                        </Card.Text>
                                        <div style={{display: 'flex', alignContent: 'flex-start', flexFlow: 'row', flexWrap: 'wrap', justifyContent: 'space-between'}}>
                                            <Button onClick={this.handleShow} size="sm" variant="primary">Edit Profile</Button>
                                            <Button size="sm" variant="outline-info">Upgrade Account</Button>
                                        </div>
                                    </Card.Body>
                                </Card> : <Spinner animation="border" role="status">
                                    <span className="sr-only">Loading...</span>
                                </Spinner>
                        }
                    </Col>
                    <Col xs={12} lg={8} md={6} style={{ border: '1px solid #dedede', borderRadius: '5px', padding: '50px 25px' }}>
                        <h3>Account Details</h3>
                        <hr/>
                        <Accordion defaultActiveKey="0" style={{marginTop: '30px'}}>
                            <Card>
                                <Accordion.Toggle as={Card.Header} eventKey="0">
                                    People that you are paying in the moment
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body>Hello! I'm the body</Card.Body>
                                </Accordion.Collapse>
                            </Card>
                            <Card>
                                <Accordion.Toggle as={Card.Header} eventKey="1">
                                    Payment Information
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey="1">
                                    <Card.Body>

                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                    </Col>
                </Row>
            </Container>
            {
                this.state.user ? 
                <Modal size="lg" centered show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Profile</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container>
                            <Row>
                                <Col xs={12} md={6}>
                                    <h5>Personal Information</h5>
                                    <hr/>
                                    <Form>
                                        <Form.Group controlId="formUsername">
                                            <Form.Label>Username</Form.Label>
                                            <Form.Control type="text" value={this.state.user.username} disabled/>
                                        </Form.Group>
                                        <Form.Group controlId="formChecbox">
                                            <Form.Check  checked={this.state.changePassword} onChange={e => this.setState({changePassword: e.target.checked})} type="checkbox" label="Change Password ?" />
                                        </Form.Group>
                                        {
                                            this.state.changePassword ? <div>
                                                <Form.Group controlId="formPassword">
                                                    <Form.Label>New Password</Form.Label>
                                                    <Form.Control onBlur={this.verifyPassword} isValid={this.state.validPassword} isInvalid={!this.state.validPassword} value={this.state.password} onChange={e => this.setState({password: e.target.value})} type="password" placeholder="Password" />
                                                </Form.Group>
                                                <Form.Group controlId="formConfirmPassword">
                                                    <Form.Label>Confirm New Password</Form.Label>
                                                    <Form.Control isValid={validNewPassword} isInvalid={!validNewPassword} value={this.state.newPassword} onChange={e => this.setState({newPassword: e.target.value})} type="password" placeholder="Password" />
                                                </Form.Group>
                                            </div> : null
                                        }
                                        
                                        <Form.Group controlId="formBio">
                                            <Form.Label>Biography</Form.Label>
                                            <Form.Control value={this.state.bio} onChange={e => this.setState({ bio: e.target.value })} as="textarea" rows="3" />
                                        </Form.Group>
                                        <InputGroup className="mb-3">
                                            <FormControl onChange={e => this.setState({file: e.target.files[0]})} type="file"/>
                                        </InputGroup>
                                </Form>
                                </Col>
                                <Col xs={12} md={6}>
                                    <h5>Layout Information</h5>
                                    <hr/>
                                    <p><b>Profile Banner Color</b><Button onClick={this.setBannerColors} variant="secondary" style={{marginLeft: '15px'}}><i className="fas fa-dice-five"></i></Button></p>
                                    <br/>
                                    <div style={{width: '238px', boxSizing: 'border-box', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>Current Color: <div style={{display: 'inline-block', width: '28px', height: '28px', borderRadius: '50%', backgroundColor: `${this.state.bannerColor}`}}></div></div>
                                    <hr/>
                                    <CirclePicker 
                                        colors={this.state.randomColorsBanner} 
                                        onChange={this.handleChangeBannerColor}
                                    />
                                    <hr/>
                                    <p><b>Profile Banner Borders Color</b><Button onClick={this.setBorderColors} variant="secondary" style={{marginLeft: '15px'}}><i className="fas fa-dice-five"></i></Button></p>
                                    <div style={{width: '238px', boxSizing: 'border-box', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>Current Color: <div style={{display: 'inline-block', width: '28px', height: '28px', borderRadius: '50%', backgroundColor: `${this.state.borderColor}`}}></div></div>
                                    <hr/>
                                    <CirclePicker 
                                        colors={this.state.randomColorsBorder} 
                                        onChange={this.handleChangeBorderColor} 
                                    />
                                    <hr/>
                                    <p><b>Profile Banner Font Color</b><Button onClick={this.setFontColors} variant="secondary" style={{marginLeft: '15px'}}><i className="fas fa-dice-five"></i></Button></p>
                                    <div style={{width: '238px', boxSizing: 'border-box', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>Current Color: <div style={{display: 'inline-block', width: '28px', height: '28px', borderRadius: '50%', backgroundColor: `${this.state.fontColor}`}}></div></div>
                                    <hr/>
                                    <CirclePicker 
                                        colors={this.state.randomColorsFont} 
                                        onChange={this.handleChangeFontColor} 
                                    />
                                </Col>
                            </Row>
                            <Button variant="primary" type="submit" onClick={this.editProfile} disabled={this.state.submit}>
                            {
                                !this.state.submit ? 'Update Profile' :
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
                        </Container>
                    </Modal.Body>
                </Modal> : null
            }
            
        </div>
    }
}

const mapStateToProps = state => ({
    user: state.user,
    userChanged: state.userChanged
});

const mapDispatchToProps = dispatch => {
    return {
        userChanged: (user) => dispatch({type: 'USER_CHANGED' })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Profile));