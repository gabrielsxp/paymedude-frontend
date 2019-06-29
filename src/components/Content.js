import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import Posts from './Posts';
import { connect } from 'react-redux';
import axios from '../axios';

class Content extends React.Component {
    state = {
        loading: null,
        likeActionLoad: false,
        offset: 0,
        category: 'Public',
        paymentDialogLoad: false
    }
    componentDidMount(){
        this.props.profile ? this.getProfilePosts(true) : this.getPosts(true); 
    }
    getProfilePosts = (init = false, resetOffset = false) => {
        axios.get(`${this.props.profilePath}/posts?offset=${!resetOffset ? this.state.offset : 0}&category=${this.state.category.toLowerCase()}`)
            .then((response) => {
                init ? this.props.initPosts(response.data.posts) : this.props.loadPosts(response.data.posts);
                
                this.setState({ loading: false, limit: response.data.limit, offset: this.state.offset + 6 });
            })
            .catch((error) => {
                this.setState({ loading: false, error });
            })
    }
    getPosts = (init = false, resetOffset = false) => {
        axios.get(`/posts?offset=${!resetOffset ? this.state.offset : 0}&category=${this.state.category.toLowerCase()}`)
            .then((response) => {
                init ? this.props.initPosts(response.data.posts) : this.props.loadPosts(response.data.posts);
                this.setState({ loading: false, limit: response.data.limit, offset: this.state.offset + 6 });
            })
            .catch((error) => {
                this.setState({ loading: false, error });
            })
    }
    likePost = (id, index) => {
        this.setState({likeActionLoad: true});
        axios.patch(`/posts/${id}/like`)
            .then((response) => {
                console.log('like post');
                console.log(this.props.user.likedPosts);
                this.props.incrementLikePost(response.data.post, index, response.data.user);
                console.log(this.props.user.likedPosts);
                this.props.userChanged();
                this.setState({ ok: true, likeActionLoad: false });
            })
            .catch((error) => {
                this.setState({ error });
            })
    }
    unlikePost = (id, index) => {
        this.setState({likeActionLoad: true});
        axios.patch(`/posts/${id}/unlike`)
            .then((response) => {
                console.log('unlike post');
                console.log(response.data, response.data.post, response.data.user);
                console.log(this.props.user.likedPosts);
                if (response.data.post && response.data.user) {
                    this.props.decrementLikePost(response.data.post, index, response.data.user);
                    console.log(this.props.user.likedPosts);
                    this.props.userChanged();
                    this.setState({ ok: true, likeActionLoad: false });
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }
    changeCategory = (value) => {
        this.setState({ offset: 0, category: value});
    }
    handlePaymentDialogShow = (value, postId, sellerId, sellerUsername, sellerEmail, productName) => {
        const seller = {
            sellerId,
            sellerUsername,
            sellerEmail
        };
        console.log(value, postId, sellerId, sellerUsername, sellerEmail, productName);
        this.props.checkOutValue(value);
        this.props.checkoutProduct(productName);
        this.props.setPostId(postId);
        this.props.setSellerId(seller);
        this.props.dispatchDisplayCheckoutModal(true);
    }
    render() {
        return !this.state.loading && this.props.posts && this.props.user ? <Posts profile={this.props.profile} getProfilePosts={this.getProfilePosts} paymentDialogLoad={this.props.displayCheckoutModal} handlePaymentDialogShow={this.handlePaymentDialogShow} category={this.state.category} changeCategory={this.changeCategory} profileLink={true} posts={this.props.posts} user={this.props.user} limit={this.state.limit} getPosts={this.getPosts} likePost={this.likePost} unlikePost={this.unlikePost} /> : <Container fluid><Row><Spinner style={{ margin: '50px auto' }} animation="border" role="status">
            <span className="sr-only">Loading...</span>
        </Spinner></Row></Container>
    }
}

const mapStateToProps = state => {
    return {
        auth: state.authenticated,
        user: state.user,
        posts: state.posts,
        profileOwner: state.profileOwner,
        displayCheckoutModal: state.displayCheckoutModal,
        checkoutPostTitle: state.checkoutPostTitle
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadPosts: (posts) => dispatch({ type: 'POSTS_LOAD', posts }),
        initPosts: (posts) => dispatch({ type: 'POSTS_INIT', posts }),
        setPostId: (postId) => dispatch({type: 'SET_POST_ID', id: postId}),
        setSellerId: (seller) => dispatch({type: 'SET_SELLER', seller}),
        userChanged: () => dispatch({ type: 'USER_CHANGED' }),
        dispatchDisplayCheckoutModal: (display) => dispatch( {type: 'DISPLAY_CHECKOUT_MODAL', display }),
        checkoutProduct: (checkoutPostTitle) => dispatch({type: 'SET_CHECKOUT_POST_TITLE', checkoutPostTitle }),
        checkOutValue: (value) => dispatch({type: 'SET_CHECKOUT_VALUE', checkoutValue: value }),
        incrementLikePost: (post, index, user) => dispatch({ type: 'POST_INCREMENT_LIKE', post, index, user }),
        decrementLikePost: (post, index, user) => dispatch({ type: 'POST_DECREMENT_LIKE', post, index, user }),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Content);