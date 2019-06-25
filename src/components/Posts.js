import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import styled from 'styled-components';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import {Link} from 'react-router-dom';

const Styles = styled.i`
    .fa-heart,
    .fa-comment-dots {
        font-size: 1.25rem;
    }
    .fa-heart:hover {
        color: red;
    }
    .red { color: red; },
    .black { color: black; }
`;

const posts = ({posts, limit, user, getPosts, likePost, unlikePost, profileLink, changeCategory, category}) => {
    const classNameLikedPost = `fas fa-heart red`;
    const classNameNotLikedPost = `fas fa-heart black`;
    return <Container style={{ marginTop: '50px', paddingBottom: '80px' }}>
        <h3 style={{ textAlign: 'center' }}>Posts</h3>
        <hr />
        <div className="control" style={{ border: '1px solid #dedede', borderRadius: '5px', padding: '20px', display: 'flex', justifyContent: 'space-between', flexFlow: 'row', flexWrap: 'wrap' }}>
            <Form inline>
                <Form.Label>Sort By</Form.Label>&nbsp;&nbsp;
                <Form.Control as="select" className="mr-sm-2" value={category} onChange={e => changeCategory(e.target.value)}>
                    <option>Public</option>
                    <option>Premium</option>
                </Form.Control>
                <Button onClick={e => getPosts(true, true)} variant="outline-primary">Sort</Button>
            </Form>
        </div>
        <Row>
            {
                posts.length === 0 ? <Container><Row><Alert style={{margin: '50px auto'}} variant="primary">
                    There is nothing to show. Have you subscribe to any creator ?
                    <br/>
                    <div style={{display: 'flex', justifyContent: 'center', marginTop: '15px'}}><Link to="/creators"><Button variant="outline-primary">Creators</Button></Link></div>
                </Alert></Row></Container>
                : posts.map((post, index) => {
                    return <Col key={index} xs={12} lg={6} style={{ marginTop: '50px' }}>
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
                                        <Image style={{ marginRight: '15px' }} src={`http://127.0.0.1:3001/assets/${post.authorImage}`} roundedCircle></Image>
                                        {
                                            profileLink ? <Link style={{color: "#333", fontWeight: "bold"}} to={`/profile/${post.username}`}>{post.username}</Link> : post.username
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
                                <div className="postStats" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px', alignContent: 'center' }}>
                                    <Styles>
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
                                            {post.likes}
                                            &nbsp;&nbsp;
                                        <i className="fas fa-comment-dots"></i> 0
                                    </div>
                                    </Styles>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                })
            }
        </Row>
        {
            !limit && posts.length > 0 ? <Button style={{ marginTop: '50px' }} variant="secondary" block size="sm" onClick={() => getPosts(false)}>Load More</Button> : <Alert style={{ marginTop: '50px' }} variant="primary">
                <p>All posts were loaded</p>
            </Alert>
        }
    </Container>
}

export default posts;