import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import styled from 'styled-components';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Loadable from 'react-loadable';
import { Link } from 'react-router-dom';

const Payment = Loadable({
    loader: () => import('./Payment'),
    loading: () => {
        return <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
        </Spinner>
    }
})

const Styles = styled.i`
    .fa-heart,
    .fa-comment-dots {
        font-size: 1.25rem;
    }
    .fa-heart:hover {
        color: red;
    }
    .red { color: red; },
    .cardFooterAlign {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: flex-start;
        align-content: center;
        font-style: normal;
    }
    .black { color: black; }
    .privateContent {
        position: relative;
        width: 480px;
        height: 360px;
        border-radius: 5px 5px 0 0;
        border: 2px solid #dedede;
        background: rgb(52,227,101);
        background: linear-gradient(90deg, rgba(52,227,101,0.6867121848739496) 28%, rgba(0,255,244,0.6166841736694677) 76%);   
        z-index: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        font-style: normal;
    }
    .contentLock {
        position: relative;
        width: 240px;
        min-height: 180px;
        background-color: #fff;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        display: flex;
        flex-flow: column;
        padding: 25px;
    }
    .fa-lock {
        font-size: 2rem;
        color: #333;
    }
    .premiumPostTitle {
        width:480px;
        height: 50px;
        border-left: 1px solid rgba(0,0,0,.125);
        border-bottom: 1px solid rgba(0,0,0,.125);
        border-right: 1px solid rgba(0,0,0,.125);
        border-top: none;
        border-radius: 0 0 5px 5px;
        padding: 10px 25px;
        background-color: rgba(0,0,0,.03);
        color: #333;
        font-style: normal;
        display: flex;
    }
`;

const posts = ({ profile, posts, limit, user, getPosts, getProfilePosts, likePost, unlikePost, profileLink, changeCategory, category, paymentDialogLoad, handlePaymentDialogShow  }) => {
    const classNameLikedPost = `fas fa-heart red`;
    const classNameNotLikedPost = `fas fa-heart black`;
    return <Container style={{ marginTop: '50px', paddingBottom: '80px' }}>
        { paymentDialogLoad ? <Payment /> : null }
        <h3 style={{ textAlign: 'center' }}>Posts</h3>
        <hr />
        <div className="control" style={{ border: '1px solid #dedede', borderRadius: '5px', padding: '20px', display: 'flex', justifyContent: 'space-between', flexFlow: 'row', flexWrap: 'wrap' }}>
            <Form inline>
                <Form.Label>Sort By</Form.Label>&nbsp;&nbsp;
                <Form.Control as="select" className="mr-sm-2" value={category} onChange={e => changeCategory(e.target.value)}>
                    <option>Public</option>
                    <option>Premium</option>
                </Form.Control>
                <Button onClick={() => profile ? getProfilePosts(true, true) : getPosts(true, true)} variant="outline-primary">Sort</Button>
            </Form>
        </div>
        <Row>
            {
                posts.length === 0 ? <Container><Row><Alert style={{ margin: '50px auto' }} variant="primary">
                    There is nothing to show. Have you subscribe to any creator ?
                    <br />
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}><Link to="/creators"><Button variant="outline-primary">Creators</Button></Link></div>
                </Alert></Row></Container>
                    : user && posts ? posts.map((post, index) => {
                        return <Col key={index} xs={12} lg={6} style={{ marginTop: '50px' }}>
                            {
                                post.category === 'public' ?
                                    <Card style={{ width: '480px' }}>
                                        {
                                            post.youtubeVideoUrl ?
                                                <iframe title={post.title + post.index} id="ytplayer" type="text/html" width="480" height="360"
                                                    src={`http://www.youtube.com/embed/${post.youtubeVideoUrl}?autoplay=0`}
                                                    frameBorder="0" />
                                                : <Image src="https://via.placeholder.com/480x360"></Image>
                                        }
                                        <Card.Body>
                                            <div className="userSection" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px', alignContent: 'center' }}>
                                                <div>
                                                    <Image style={{ marginRight: '15px' }} src={`http://127.0.0.1:3001/${post.authorImage}`} roundedCircle></Image>
                                                    {
                                                        profileLink ? <Link style={{ color: "#333", fontWeight: "bold" }} to={`/profile/${post.username}`}>{post.username}</Link> : post.username
                                                    }
                                                </div>
                                                <div><i className="far fa-clock"></i>&nbsp;{post.createdAt}</div>
                                            </div>
                                            <Card.Title>{post.title}</Card.Title>
                                            <Card.Text>
                                                {post._id}
                                                <br />
                                                {post.content}
                                            </Card.Text>
                                        </Card.Body>
                                        <Card.Footer>
                                            <Styles>
                                                <div style={{ fontStyle: 'normal' }}>
                                                    {
                                                        user ?
                                                            <i
                                                                onClick={() => user.likedPosts.includes(post._id) ? unlikePost(post._id, index) : likePost(post._id, index)}
                                                                style={{ cursor: user ? 'pointer' : 'auto' }}
                                                                className={`${user.likedPosts.includes(post._id) ? classNameLikedPost : classNameNotLikedPost}`}>
                                                            </i> : <i
                                                                onClick={() => likePost(post._id, index)}
                                                                style={{ cursor: user ? 'pointer' : 'auto' }}
                                                                className={classNameNotLikedPost}>
                                                            </i>
                                                    }
                                                    &nbsp;{post.likes}
                                                    &nbsp;&nbsp;
                                                    <i className="fas fa-comment-dots"></i> 0
                                                </div>
                                            </Styles>
                                        </Card.Footer>
                                    </Card>
                                    : !user.unlockedPosts.includes(post._id) && user._id !== post.author ?
                                        <Styles>
                                            <div>
                                                <div className="privateContent">
                                                    <div className="contentLock">
                                                        <i className="fas fa-lock"></i> <p className="text-muted">Locked Content</p>
                                                        <Button variant="outline-primary">See Plans</Button>
                                                        or
                                                        <Button onClick={() => handlePaymentDialogShow(post.postValue, post._id, post.author, post.username, post.authorEmail, post.title)} variant="primary"><i className="fas fa-unlock"></i> post for <b>${post.postValue}</b></Button>
                                                    </div>
                                                </div>
                                                <div className="userSection" style={{ border: '1px solid rgba(0,0,0,.125)', backgroundColor: 'rgba(0,0,0,.03)', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', alignContent: 'center' }}>
                                                    <div>
                                                        <Image style={{ marginRight: '15px' }} src={`http://127.0.0.1:3001/${post.authorImage}`} roundedCircle></Image>
                                                        {
                                                            profileLink ? <Link style={{ color: "#333", fontWeight: "bold" }} to={`/profile/${post.username}`}>{post.username}</Link> : post.username
                                                        }
                                                    </div>
                                                    <div><i className="far fa-clock"></i>&nbsp;{post.createdAt}</div>
                                                </div>
                                                <div className="premiumPostTitle"><b>{post.title}</b></div>
                                            </div>
                                        </Styles>
                                        : <Card style={{ width: '480px' }}>
                                            {
                                                post.youtubeVideoUrl ?
                                                    <iframe title={post.title + post.index} id="ytplayer" type="text/html" width="480" height="360"
                                                        src={`http://www.youtube.com/embed/${post.youtubeVideoUrl}?autoplay=0`}
                                                        frameBorder="0" />
                                                    : <Image src="https://via.placeholder.com/480x360"></Image>
                                            }
                                            <Card.Body>
                                                <div className="userSection" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px', alignContent: 'center' }}>
                                                    <div>
                                                        <Image style={{ marginRight: '15px' }} src={`http://127.0.0.1:3001/${post.authorImage}`} roundedCircle></Image>
                                                        {
                                                            profileLink ? <Link style={{ color: "#333", fontWeight: "bold" }} to={`/profile/${post.username}`}>{post.username}</Link> : post.username
                                                        }
                                                    </div>
                                                    <div><i className="far fa-clock"></i>&nbsp;{post.createdAt}</div>
                                                </div>
                                                <Card.Title>{post.title}</Card.Title>
                                                <Card.Text>
                                                    {post.content}
                                                </Card.Text>
                                            </Card.Body>
                                            <Card.Footer>
                                                <Styles>
                                                    <div className="cardFooterAlign">
                                                        <div>
                                                            {
                                                                user ?
                                                                    <i
                                                                        onClick={() => user.likedPosts.includes(post._id) ? unlikePost(post._id, index) : likePost(post._id, index)}
                                                                        style={{ cursor: user ? 'pointer' : 'auto' }}
                                                                        className={`${user.likedPosts.includes(post._id) ? classNameLikedPost : classNameNotLikedPost}`}>
                                                                    </i> : <i
                                                                        onClick={() => likePost(post._id, index)}
                                                                        style={{ cursor: user ? 'pointer' : 'auto' }}
                                                                        className={classNameNotLikedPost}>
                                                                    </i>
                                                            }
                                                            &nbsp;{post.likes}
                                                            &nbsp;&nbsp;
                                                            <i className="fas fa-comment-dots"></i> 0
                                                        </div>
                                                        <div>
                                                            <i className="fas fa-unlock"></i>
                                                        </div>
                                                    </div>
                                                </Styles>
                                            </Card.Footer>
                                        </Card>
                            }
                        </Col>
                    }) : <Container>
                        <Row>
                        <Spinner style={{margin: '50px auto'}} animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                        </Row>
                    </Container>
            }
        </Row>
        {
            !limit && posts.length > 0 ? <Button style={{ marginTop: '50px' }} variant="secondary" block size="sm" onClick={() => profile ? getProfilePosts(false) : getPosts(false)}>Load More</Button> : <Alert style={{ marginTop: '50px' }} variant="primary">
                <p>All posts were loaded</p>
            </Alert>
        }
    </Container>
}

export default posts;