import React from 'react';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from '../axios';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';

const Styles = styled.div`
    .fa-heart,
    .fa-comment-dots {
        font-size: 1.25rem;
    }
    .fa-heart:hover {
        color: red;
    }
    .red { color: red; }
    .replyWrap {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        flex-wrap: wrap;
    }
    .hideForm {
        background: #fff;
        overflow: hidden;
        color: #000;   
        line-height: 50px;
    }
`;

class Post extends React.Component {
    state = {
        loading: null,
        commenting: false,
        loadingComments: false,
        postingComment: false,
        deletingComment: false,
        comments: [],
        showReply: false,
        expand: [],
        content: '',
        replyContent: '',
        error: null,
        post: null,
        user: null
    }
    componentDidMount() {
        axios.get(`${this.props.location.pathname}`)
            .then((response) => {
                axios.get('/me')
                    .then((userResponse) => {
                        this.setState({ loading: false, post: response.data.post, user: userResponse.data.user });
                        this.getComments();
                    })
            })
            .catch((error) => {
                this.setState({ error });
            })
    }


    likePost = (id) => {
        console.log(id);
        axios.patch(`/posts/${id}/like`)
            .then((response) => {
                if (response.data.post && response.data.user) {
                    this.setState({ user: response.data.user, post: response.data.post });
                    this.props.userChanged();
                }
            })
            .catch((error) => {
                this.setState({ error });
            })
    }
    unlikePost = (id, index) => {
        console.log(id);
        axios.patch(`/posts/${id}/unlike`)
            .then((response) => {
                if (response.data.post && response.data.user) {
                    this.setState({ user: response.data.user, post: response.data.post });
                    this.props.userChanged();
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }
    postComment = (replyTo = null, index) => {
        this.setState({ commenting: true, postingComment: true });
        const data = {
            content: replyTo ? this.state.replyContent : this.state.content,
            referedTo: this.state.post._id,
            author: this.state.user._id,
            userImage: this.state.user.image,
            username: this.state.user.username,
            root: replyTo ? false : true,
            replyTo
        }
        axios.post(`/posts/${this.state.post._id}/comment`, data)
            .then((response) => {
                if (replyTo) {
                    let comments = this.state.comments;
                    comments[index].replies.unshift(response.data.comment);
                    this.setState({ comments, postingComment: false });
                } else {
                    let comments = this.state.comments;
                    comments.unshift(response.data.comment);
                    this.setState({ commenting: false, comments, postingComment: false });
                }
            })
            .catch((error) => {
                console.log('not posted');
                this.setState({ error, commenting: false });
            })
    }
    getComments = () => {
        this.setState({ loadingComments: true });
        axios.get(`/posts/${this.state.post._id}/comments`)
            .then((response) => {
                const length = response.data.comments.length;
                const expand = new Array(length);
                for (let i = 0; i < expand.length; i++) {
                    expand[i] = false;
                }
                console.log(response.data.comments);
                this.setState({ comments: response.data.comments, expand });
            })
            .catch((error) => {
                this.setState({ error, comments: [], loadingComments: false });
            })
    }

    deleteComment(id, index, replyIndex = false) {
        this.setState({ deletingComment: true });
        axios.delete(`/posts/${this.state.post._id}/comments/${id}`)
            .then((response) => {
                let comments = this.state.comments;
                if(replyIndex){
                    comments[index].replies[replyIndex].content = null;
                } else {
                    comments[index].content = null;
                }
                this.setState({ comments, deletingComment: true });
            })
            .catch((error) => {
                this.setState({ error, deletingComment: true });
            })
    }

    expandReply(index) {
        let expand = this.state.expand;
        expand[index] = !expand[index];
        this.setState({ expand, replyContent: '' });
    }

    render() {
        const classNameLikedPost = `fas fa-heart red`;
        const classNameNotLikedPost = `fas fa-heart black`;
        return <Styles>
            <div style={{ paddingTop: '80px', paddingBottom: '80px', minHeight: '100vh' }}>
                {
                    this.state.post ? <Jumbotron style={{ width: '100%', backgroundColor: "#fff" }}>
                        <h2 style={{ marginLeft: '15px' }}>{this.state.post.title}</h2>
                        <hr />
                        <div style={{ fontSize: '1rem', display: 'flex', flexFlow: 'row', justifyContent: 'space-between', alignItems: 'center', alignContent: 'center', flexWrap: 'wrap', padding: '20px' }}>
                            <div>
                                <p><Image style={{ marginRight: '15px' }} roundedCircle src={`http://127.0.0.1:3001/${this.state.post.authorImage}`} /> <b><Link style={{ color: '#333' }} to={`/profile/${this.state.post.username}`}>{this.state.post.username}</Link></b></p>
                                <div style={{ fontStyle: 'normal' }}>
                                    {
                                        this.state.user ?
                                            <i
                                                onClick={() => this.state.user.likedPosts.includes(this.state.post._id) ? this.unlikePost(this.state.post._id) : this.likePost(this.state.post._id)}
                                                style={{ cursor: this.state.user ? 'pointer' : 'auto' }}
                                                className={`${this.state.user.likedPosts.includes(this.state.post._id) ? classNameLikedPost : classNameNotLikedPost}`}>
                                            </i> : <i className="fas fa heart"></i>
                                    }
                                    &nbsp;{this.state.post.likes}
                                    &nbsp;&nbsp;
                                    <i className="fas fa-comment-dots"></i> {this.state.post.comments}
                                </div>
                            </div>
                            <div>
                                <p><b><i className="fas fa-calendar-plus"></i></b> {this.state.post.relative} </p>
                                <p><b><i className="fas fa-clock"></i></b> {this.state.post.relativeUpdated}</p>
                                <p>{this.state.post.category === 'public' ? <i className="fas fa-eye"></i> : <i style={{ color: 'yellow' }} className="fas fa-star"></i>} Post</p>
                            </div>
                        </div>
                        {
                            this.state.post.youtubeVideoUrl !== null ?
                                <Jumbotron style={{ backgroundColor: '#fff' }}>
                                    <Container>
                                        <Row>
                                            <Col xs={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                                                <iframe title={this.state.post.title + this.state.post.index} id="ytplayer" type="text/html" width="800" height="600"
                                                    src={`http://www.youtube.com/embed/${this.state.post.youtubeVideoUrl}?autoplay=0`}
                                                    frameBorder="0" />
                                            </Col>
                                        </Row>
                                    </Container>
                                </Jumbotron> : this.state.post.fullImage !== 'uploads/resized/null' ?
                                    <Container>
                                        <Row>
                                            <Col xs={12} style={{ display: 'flex', flexFlow: 'column', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                                                <Image style={{ borderRadius: '5px 5px 0 0' }} src={`http://127.0.0.1:3001/${this.state.post.fullImage}`}></Image>
                                                <div style={{ width: '1280px', backgroundColor: '#dedede', color: '#333', padding: '15px', borderRadius: ' 0 0 5px 5px' }}><p><b>{this.state.post.imageDescription}</b></p></div>
                                            </Col>
                                        </Row>
                                    </Container>
                                    : null
                        }

                        <Container fluid style={{ marginTop: '50px' }}>
                            <Row>
                                <Col xs={12}>
                                    <h2>Content</h2>
                                    <hr />
                                    {
                                        this.state.post.content.split('\n').length > 0 ? this.state.post.content.split('\n').map((paragraph, index) => {
                                            return <p key={index}>{paragraph}</p>
                                        }) : <Alert variant="primary">No content added</Alert>
                                    }
                                </Col>
                            </Row>
                        </Container>

                        <Container fluid style={{ marginTop: '50px' }}>
                            <Row>
                                <Col xs={12}>
                                    <h2>Discussion</h2>
                                    <hr />
                                    <Row style={{ display: 'flex', alignItems: 'center' }}>
                                        <Col xs={3} sm={2} lg={1}>
                                            <Image style={{ marginRight: '15px' }} roundedCircle src={`http://127.0.0.1:3001/${this.state.post.authorImage}`} />
                                        </Col>
                                        <Col xs={9} sm={10} lg={11}>
                                            <Form.Group>
                                                <Form.Control value={this.state.content} onChange={e => this.setState({ content: e.target.value })} as="textarea" rows="4" />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <div className="btnwrap" style={{ marginRight: '15px', width: '100%', display: 'flex', alignContent: 'flex-end', justifyContent: 'flex-end' }}>
                                            <Button onClick={() => this.postComment(null, null)}>Comment</Button>
                                        </div>
                                    </Row>
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                {
                                    this.state.comments.length > 0 ? this.state.comments.map((comment, index) => {
                                        return <div key={index} style={{ width: '100%', display: 'flex', alignItems: 'flex-start' }}>
                                            <Col xs={3} sm={2} lg={1}>
                                                <Image style={{ marginRight: '15px' }} roundedCircle src={`http://127.0.0.1:3001/${comment.userImage}`} />
                                            </Col>
                                            <Col xs={9} sm={10} lg={11} style={{ marginTop: '15px' }}>
                                                {
                                                        <p><b><Link to={`/profile/${comment.username}`}>{comment.username}</Link></b>&nbsp;-&nbsp;{comment.content === null ? 'deleted' : comment.relative}</p>
                                                }
                                                {
                                                    comment.content === null ? <p><i>This comment was deleted</i></p> : comment.content.split('\n').map((paragraph, index) => {
                                                        return <p key={index}>{paragraph}</p>
                                                    })
                                                }
                                                <div className="replyWrap">
                                                    {
                                                        comment.author === this.state.user._id && comment.content !== null ? <Button onClick={() => this.deleteComment(comment._id, index)} style={{ marginRight: '15px' }} size="sm" variant="danger"><i className="fas fa-times"></i>&nbsp;Delete</Button> : null
                                                    }
                                                    <Button onClick={() => this.expandReply(index)} size="sm"><i className="fas fa-reply"></i>&nbsp;Reply</Button>
                                                </div>
                                                {
                                                    comment.replies.length > 0 ? comment.replies.map((reply, replyIndex) => {
                                                        return <Row key={replyIndex} style={{ display: 'flex', alignItems: 'center', marginBottom: '25px', borderLeft: '5px solid #dedede' }}>
                                                            <Col xs={3} sm={2} lg={1}>
                                                                <Image style={{ marginRight: '15px' }} roundedCircle src={`http://127.0.0.1:3001/${reply.userImage}`} />
                                                            </Col>
                                                            <Col xs={9} sm={10} lg={11} style={{ marginTop: '15px' }}>
                                                                { 
                                                                    <p><b><Link to={`/profile/${reply.username}`}>{reply.username}</Link></b>&nbsp;-&nbsp;{reply.content === null ? 'deleted' : reply.relative}</p>
                                                                }
                                                                {reply.content === null ? <p>This comment was deleted</p> : <p>{reply.content}</p>}
                                                            </Col>
                                                            <div className="replyWrap">
                                                                {
                                                                    reply.author === this.state.user._id && reply.content !== null ? <Button onClick={() => this.deleteComment(reply._id, index, replyIndex)} style={{ marginRight: '15px' }} size="sm" variant="danger"><i className="fas fa-times"></i>&nbsp;Delete</Button> : null
                                                                }
                                                            </div>
                                                        </Row>
                                                    }) : null
                                                }
                                                <div className="hideForm">
                                                    <div className={`comment`} style={{ height: this.state.expand[index] ? '100%' : '0px' }}>
                                                        <Row style={{ display: 'flex', alignItems: 'center' }}>
                                                            <Col xs={3} sm={2} lg={1}>
                                                                <Image style={{ marginRight: '15px' }} roundedCircle src={`http://127.0.0.1:3001/${this.state.user.image}`} />
                                                            </Col>
                                                            <Col xs={9} sm={10} lg={11} style={{ marginTop: '15px' }}>
                                                                <Form.Group>
                                                                    <Form.Control value={this.state.replyContent} onChange={e => this.setState({ replyContent: e.target.value })} as="textarea" rows="4" />
                                                                </Form.Group>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <div className="btnwrap" style={{ marginRight: '15px', width: '100%', display: 'flex', alignContent: 'flex-end', justifyContent: 'flex-end' }}>
                                                                <Button onClick={() => this.postComment(comment._id, index)}>Comment</Button>
                                                            </div>
                                                        </Row>
                                                    </div>
                                                </div>
                                                <hr />
                                            </Col>
                                        </div>
                                    }) : <Container fluid><Row>
                                        <Col xs={12}>
                                            <Alert variant="primary">No comments to show</Alert>
                                        </Col>
                                    </Row></Container>
                                }
                            </Row>
                        </Container>

                    </Jumbotron> : <Container>
                            <Row><Spinner style={{ margin: '50px auto' }} animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner></Row>
                        </Container>
                }
            </div>
        </Styles>
    }
}

const mapDispatchToProps = dispatch => {
    return {
        userChanged: () => dispatch({ type: 'USER_CHANGED' })
    }
}

export default connect(null, mapDispatchToProps)(withRouter(Post));