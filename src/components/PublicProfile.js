import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import axios from '../axios';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Content from './Content';
import ProfileBanner from './ProfileBanner'

class PublicProfile extends React.Component {
    state = {
        loading: null,
        profileOwner: null,
        error: null
    }
    componentDidMount() {
        this.getProfile();
    }
    getProfile = () => {
        this.setState({ loading: true });
        axios.get(`${this.props.location.pathname}`)
            .then((response) => {
                this.setState({ loading: false, profileOwner: response.data.profile });
            })
            .catch((error) => {
                this.setState({ loading: false, error });
            });
    }
    render() {
        return <div style={{ minHeight: '100vh', paddingTop: '0px', paddingBottom: '80px' }}>
            {
                this.state.profileOwner ? <ProfileBanner profileOwner={this.state.profileOwner} /> : <Container><Row><Spinner style={{ margin: '50px auto' }} animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner></Row></Container>
            }
            { 
                this.props.user && this.props.posts ? <Content profilePath={this.props.location.pathname} profile={true} /> : <Container><Row><Spinner style={{ margin: '50px auto' }} animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner></Row></Container>

            }
        </div>
    }
}

const mapStateToProps = state => {
    return {
        auth: state.authenticated,
        user: state.user,
        posts: state.posts,
        profileOwner: state.profileOwner
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadPosts: (posts) => dispatch({ type: 'POSTS_LOAD', posts }),
        initPosts: (posts) => dispatch({ type: 'POSTS_INIT', posts }),
        incrementLikePost: (post, index, user) => dispatch({ type: 'POST_INCREMENT_LIKE', post, index, user }),
        decrementLikePost: (post, index, user) => dispatch({ type: 'POST_DECREMENT_LIKE', post, index, user }),
        saveUser: (user) => dispatch({ type: 'SAVE_USER', user }),
        userChanged: () => dispatch({ type: 'USER_CHANGED' })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PublicProfile));