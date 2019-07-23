import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import axios from '../axios';
import { withRouter } from 'react-router-dom';

class CreatePost extends React.Component {
    state = {
        title: '',
        user: { username: '' },
        youtubeVideo: false,
        youtubeVideoUrl: '',
        postImage: false,
        file: null,
        validUrl: false,
        content: '',
        imageDescription: null,
        paidContent: false,
        validValue: true,
        postValue: '1.00',
        submit: false,
        error: null,
        success: null,
    }
    componentDidMount() {
        axios.get('/me')
            .then((response) => {
                if(!response.data.user.creator){
                    this.props.history.push('/plans');
                }
                this.setState({ user: response.data.user });
            })
            .catch((error) => {
                this.setState({ error });
            })
    }
    checkUrl = () => {
        this.setState({ validUrl: this.state.youtubeVideoUrl.length === 11 ? true : false });
    }
    createPost = (e) => {
        e.preventDefault();
        if (this.state.postImage && this.state.file) {
            let data = new FormData();
            data.append('title', this.state.title);
            data.append('author', this.state.user._id);
            data.append('authorImage', this.state.user.image);
            data.append('authorEmail', this.state.user.email);
            data.append('content', this.state.content);
            data.append('username', this.state.user.username);
            data.append('value', this.state.postValue);
            data.append('category', this.state.paidContent ? 'premium' : 'public');
            data.append('postValue', this.state.paidContent ? this.state.postValue : 0);
            data.append('file', this.state.file);
            data.append('imageDescription', this.state.imageDescription);
            console.log(data);

            this.setState({ submit: true, success: null, error: null });
            axios.post('/posts', data, { headers: { 'Content-Type': 'multipart/form-data' } })
                .then((response) => {
                    this.setState({
                        submit: false,
                        success: true,
                        title: '',
                        content: '',
                        youtubeVideoUrl: '',
                        youtubeVideo: false,
                        postImage: false,
                        imageDescription: '',
                        file: null,
                    });
                })
                .catch((error) => {
                    this.setState({ submit: false, error: error });
                    console.log(error);
                })
        } else {
            const postData = {
                title: this.state.title,
                author: this.state.user._id,
                authorImage: this.state.user.image,
                authorEmail: this.state.user.email,
                content: this.state.content,
                username: this.state.user.username,
                value: this.state.postValue,
                category: this.state.paidContent ? 'premium' : 'public',
                postValue: this.state.paidContent ? this.state.postValue : 0,
                youtubeVideoUrl: this.state.youtubeVideo ? `${this.state.youtubeVideoUrl}` : null
            }
            this.setState({ submit: true, success: null, error: null });
            axios.post('/posts', postData)
                .then((response) => {
                    this.setState({
                        submit: false,
                        success: true,
                        title: '',
                        content: '',
                        youtubeVideoUrl: '',
                        youtubeVideo: false,
                        postImage: false,
                        postDescription: '',
                        file: null,
                    });
                    console.log(response);
                })
                .catch((error) => {
                    this.setState({ submit: false, error: error });
                    console.log(error);
                })
        }
    }
    verifyValue = () => {
        const limitCheck = this.state.user.accountLevel === 1 ? this.state.postValue <= 1 : this.state.user.accountLevel === 2 ? this.state.postValue <= 5 : this.state.user.accountLevel === 3 ? this.state.postValue <= 10 : false;
        this.setState({ validValue: this.state.postValue.match('^[0-9]+(\.[0-9]{1,2})?$') && limitCheck });
    }
    render() {
        const canSubmit = (this.state.youtubeVideo ? (this.state.validUrl && this.state.title.length > 0 && this.state.content.length > 0) : this.state.postImage ? (this.state.title.length > 0 && this.state.content.length > 0 && this.state.file && this.state.imageDescription) : this.state.title.length > 0 && this.state.content.length > 0);
        return <div style={{ padding: '50px 0' }}>
            <Container>
                <Row>
                    <Col xs={12} lg={{ span: 8, offset: 2 }} style={{ borderRadius: '5px', border: '1px solid #dedede', padding: '50px' }}>
                        <h3>Create Post</h3>
                        <hr />
                        <Form.Group controlId="Form.ControlPostTitleLabel">
                            <Form.Label>Post Title</Form.Label>
                            <Form.Control value={this.state.title} onChange={e => this.setState({ title: e.target.value, success: null, error: null })} type="text" placeholder="Type the title of the article" />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Post Author</Form.Label>
                            {
                                this.state.user ? <Form.Control value={`${this.state.user.username}`} type="text" placeholder="Small text" disabled /> : <Spinner animation="border" role="status">
                                    <span className="sr-only">Loading...</span>
                                </Spinner>
                            }
                        </Form.Group>
                        {
                            this.state.user.accountLevel >= 1 ? <div>
                                <Form.Check
                                    checked={this.state.youtubeVideo}
                                    type='checkbox'
                                    label='Embed a Youtube Video'
                                    id='premium-option-1'
                                    style={{ margin: '20px 0' }}
                                    onChange={e => this.setState({ youtubeVideo: e.target.checked, postImage: false })}
                                />
                                <Form.Check
                                    checked={this.state.postImage}
                                    type='checkbox'
                                    label='Post Image'
                                    id='premium-option-2'
                                    style={{ margin: '20px 0' }}
                                    onChange={e => this.setState({ postImage: e.target.checked, youtubeVideo: false })}
                                />
                                <Form.Check
                                    checked={this.state.user.paidContent}
                                    type='checkbox'
                                    label='Check to monetize this content'
                                    id='premium-option-3'
                                    style={{ margin: '20px 0' }}
                                    onChange={e => this.setState({ paidContent: e.target.checked })}
                                />
                            </div>
                                : null
                        }
                        {
                            this.state.youtubeVideo ? <InputGroup style={{ margin: '20px 0' }} className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="youtube-video-input">
                                        https://www.youtube.com/watch?v=
                                </InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl value={this.state.youtubeVideoUrl} onChange={e => this.setState({ youtubeVideoUrl: e.target.value, success: null, error: null })} isInvalid={!this.state.validUrl} isValid={this.state.validUrl} onBlur={this.checkUrl} id="basic-url" aria-describedby="basic-addon3" />
                            </InputGroup> : null
                        }
                        {
                            this.state.postImage ?
                                <div>
                                    <InputGroup className="mb-3">
                                        <FormControl onChange={e => this.setState({ file: e.target.files[0] })} type="file" />
                                    </InputGroup>
                                    <p className="text-muted"><b className="text-danger"> Warning: </b>This image will be resize to 1280x1024 and 480x360</p>
                                    <Form.Group controlId="exampleForm.ControlTextarea1">
                                        <Form.Label>Full post image description</Form.Label>
                                        <Form.Control onChange={e => this.setState({ imageDescription: e.target.value })} as="textarea" rows="3" />
                                    </Form.Group>
                                </div> : null
                        }
                        {
                            this.state.paidContent ? <div><Form.Text className="text-muted">
                                Max value for this post is $ {this.state.user.accountLevel ? '1' : this.state.user.accountLevel ? '5' : '10'}
                            </Form.Text>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1">$</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                        value={this.state.postValue}
                                        onBlur={this.verifyValue}
                                        placeholder="Post value"
                                        aria-label="Post value"
                                        aria-describedby="basic-addon1"
                                        isValid={this.state.validValue}
                                        isInvalid={!this.state.validValue}
                                        onChange={e => this.setState({ postValue: e.target.value })}
                                    />

                                </InputGroup></div> : null
                        }
                        <Form.Group controlId="Form.ControlTextarea">
                            <Form.Label>Post Content</Form.Label>
                            <Form.Control value={this.state.content} onChange={e => this.setState({ content: e.target.value, success: null, error: null })} as="textarea" rows="6" />
                        </Form.Group>
                        <Button size="lg" block variant={this.state.success ? 'success' : this.state.error ? 'danger' : 'primary'} type="submit" onClick={this.createPost} disabled={this.state.submit || this.state.error || !canSubmit}>
                            {
                                !this.state.submit && !this.state.success && !this.state.error ? 'Create Post' : !this.state.submit && this.state.success ? <i className="fas fa-check"></i> : !this.state.submit && this.state.error ? <i className="fas fa-times"></i> :
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
                        {
                            this.state.error ? <Alert variant="danger" style={{ marginTop: '20px' }}>
                                <Alert.Heading><i className="fas fa-exclamation-circle"></i> Oops... Something Went Wrong !</Alert.Heading>
                                <hr />
                                <p><b>Error Message:</b> {this.state.error}</p>
                            </Alert> : null
                        }
                    </Col>
                </Row>
            </Container>
        </div>
    }
}

export default withRouter(CreatePost);