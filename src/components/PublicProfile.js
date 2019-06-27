import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import axios from '../axios';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ProfileBanner from './ProfileBanner'
import Posts from './Posts';

class PublicProfile extends React.Component {
    state = {
        loading: null,
        posts: [],
        profileOwner: null,
        ok: null,
        offset: 0,
        category: 'Public',
        error: null
    }
    componentDidMount() {
        this.getProfile();
        this.getPosts(true);
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
    getPosts = (init = false) => {
        this.setState({ loading: true });
        axios.get(`${this.props.location.pathname}/posts?offset=${this.state.offset}`)
            .then((response) => {
                init ? this.props.initPosts(response.data.posts) : this.props.loadPosts(response.data.posts);
                
                this.setState({ loading: false, limit: response.data.limit, offset: this.state.offset + 6 });
            })
            .catch((error) => {
                this.setState({ loading: false, error });
            })
    }
    likePost = (id, index) => {
        console.log(id, index);
        axios.patch(`/posts/${id}/like`)
            .then((response) => {
                console.log('like post');
                console.log(this.props.user.likedPosts);
                this.props.incrementLikePost(response.data.post, index, response.data.user);
                console.log(this.props.user.likedPosts);
                this.props.userChanged();
                this.setState({ ok: true });
            })
            .catch((error) => {
                this.setState({ error });
            })
    }
    unlikePost = (id, index) => {
        console.log(id);
        axios.patch(`/posts/${id}/unlike`)
            .then((response) => {
                console.log('unlike post');
                console.log(response.data, response.data.post, response.data.user);
                console.log(this.props.user.likedPosts);
                if (response.data.post && response.data.user) {
                    this.props.decrementLikePost(response.data.post, index, response.data.user);
                    console.log(this.props.user.likedPosts);
                    this.props.userChanged();
                    this.setState({ ok: true });
                }
            })
            .catch((error) => {
                this.setState({ error });
            })
    }
    changeCategory = (value) => {
        this.setState({ offset: 0, category: value});
    }
    render() {
        return <div style={{ minHeight: '100vh', paddingTop: '0px', paddingBottom: '80px' }}>
            {
                !this.state.loading ? <ProfileBanner profileOwner={this.state.profileOwner} /> : <Container><Row><Spinner style={{ margin: '50px auto' }} animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner></Row></Container>
            }
            {
                !this.state.loading && this.props.user && this.props.posts ? <Posts category={this.state.category} changeCategory={this.changeCategory} profileLink={false} posts={this.props.posts} user={this.props.user} limit={this.state.limit} getPosts={this.getPosts} likePost={this.likePost} unlikePost={this.unlikePost} /> : <Container><Row><Spinner style={{ margin: '50px auto' }} animation="border" role="status">
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