import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

const Styles = styled.div`
    @media(min-width: 920px){
        .navbar {
            border-bottom: 1px solid #dedede;
        }
    }
`;


class Navigation extends React.Component {
    render() {
        return <Styles>
            <Navbar bg="white" expand="lg">
                <Link className="navbar-brand" to="/">Pay-Me-Dude</Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Link className="nav-link" to="/main">Posts</Link>
                        <Link className="nav-link" to="/creators">Creators</Link>
                        <NavDropdown title="Plans" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    {
                        !this.props.auth ? <Nav>
                            <Link className="nav-link" to="/signup?creator=false">Sign Up</Link>
                            <Link to="/signin"><Button variant="outline-primary">Sign In</Button></Link>
                        </Nav> : <Nav>
                                {
                                    this.props.user ?
                                        <NavDropdown
                                            alignRight={true}
                                            drop="down"
                                            title={<div style={{display: "inline-block"}}>
                                                <Image src={`http://127.0.0.1:3001/assets/${this.props.user.image}`} roundedCircle ></Image>
                                            </div>
                                            }>
                                            <Link to={`/account/${this.props.user.username}`} className="dropdown-item">Edit Profile</Link>
                                            <Link to={`/profile/${this.props.user.username}`} className="dropdown-item">Public Profile</Link>
                                            <Link to={`/dashboard`} className="dropdown-item">Dashboard</Link>
                                            {this.props.user.creator ? <Link to={`/posts/new`} className="dropdown-item">Create Post</Link> : null }
                                            <Link to={`/plans/`} className="dropdown-item">Upgrade Account</Link>
                                            <NavDropdown.Divider />
                                            <div style={{cursor: 'pointer'}} className="dropdown-item" onClick={this.props.onLogout}>Logout</div>
                                    </NavDropdown> : null
                                }
                            </Nav>
                    }
                </Navbar.Collapse>
            </Navbar>
        </Styles>
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    user: state.user
});

const mapDispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch({ type: 'LOGOUT' })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Navigation));

