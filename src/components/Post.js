import React from 'react';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Image from 'react-bootstrap/Image';
import axios from '../axios';
import styled from 'styled-components';
import {connect} from 'react-redux';
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
`;

class Post extends React.Component {
    state = {
        loading: null,
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
                this.setState({ user: response.data.user, post: response.data.post });
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
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }
    render() {
        const classNameLikedPost = `fas fa-heart red`;
        const classNameNotLikedPost = `fas fa-heart black`;
        return <div style={{ paddingTop: '80px', paddingBottom: '80px', minHeight: '100vh' }}>
            {
                this.state.post ? <Jumbotron  style={{width: '100%', backgroundColor: "#fff"}}>
                    <h2 style={{marginLeft: '15px'}}>{this.state.post.title}</h2>
                    <hr/>
                    <div style={{ fontSize: '1.2rem', display: 'flex', flexFlow: 'row', justifyContent: 'space-between', alignItems: 'center', alignContent: 'center', flexWrap: 'wrap', padding: '20px'}}>
                        <div>
                            <p><Image style={{marginRight: '15px'}} roundedCircle src={`http://127.0.0.1:3001/${this.state.post.authorImage}`} /> <b><Link style={{color: '#333'}} to={`/profile/${this.state.post.username}`}>{this.state.post.username}</Link></b></p>
                            <Styles>
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
                                    <i className="fas fa-comment-dots"></i> 0
                                </div>
                            </Styles>
                        </div>
                        <div>
                            <p><b><i className="fas fa-calendar-plus"></i></b> {this.state.post.createdAt} </p>
                            <p><b><i className="fas fa-clock"></i></b> {this.state.post.updatedAt}</p>
                            <p>{this.state.post.category === 'public' ? <i className="fas fa-eye"></i> : <i style={{color: 'yellow'}} className="fas fa-star"></i>} Post</p>
                        </div>
                    </div>
                    {
                            this.state.post.youtubeVideoUrl !== null ? 
                                <Jumbotron style={{backgroundColor: '#fff'}}>
                                    <Container>
                                        <Row>
                                            <Col xs={12} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center'}}>
                                    <iframe title={this.state.post.title + this.state.post.index} id="ytplayer" type="text/html" width="800" height="600"
                                    src={`http://www.youtube.com/embed/${this.state.post.youtubeVideoUrl}?autoplay=0`}
                                    frameBorder="0" />
                                            </Col>
                                        </Row>
                                    </Container>
                                </Jumbotron> : this.state.post.fullImage ? 
                                    <Container>
                                        <Row>
                                        <Col xs={12} style={{display: 'flex', flexFlow: 'column', justifyContent: 'center', alignItems: 'center', alignContent: 'center'}}>
                                                <Image style={{borderRadius: '5px 5px 0 0'}} src={`http://127.0.0.1:3001/${this.state.post.fullImage}`}></Image>
                                                <div style={{width: '1280px', backgroundColor: '#dedede', color: '#333', padding: '15px', borderRadius: ' 0 0 5px 5px'}}><p><b>{this.state.post.imageDescription}</b></p></div>
                                            </Col>
                                        </Row>
                                    </Container>
                                : null
                    }
                    
                    <Container fluid style={{marginTop: '50px'}}>
                        <Row>
                            <Col xs={12}>
                            <h2>Content</h2>
                            <hr/>
                                {
                                    this.state.post.content.split('\n').length > 0 ? this.state.post.content.split('\n').map((paragraph, index) => {
                                        return <p key={index}>{paragraph}</p>
                                    }) : <Alert variant="primary">No content added</Alert>
                                }
                            </Col>
                        </Row>
                    </Container>
                </Jumbotron> : <Container>
                    <Row><Spinner style={{margin: '50px auto'}} animation="border" role="status">
                                    <span className="sr-only">Loading...</span>
                            </Spinner></Row>
                </Container>
            }
        </div>
    }
}

export default withRouter(Post);