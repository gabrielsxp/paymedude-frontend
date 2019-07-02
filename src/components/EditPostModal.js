import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Alert from 'react-bootstrap/Alert';
import FormControl from 'react-bootstrap/FormControl';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import axios from '../axios';

class EditPostModal extends React.Component {
  state = {
    post: null,
    loading: false,
    submiting: false,
    title: '',
    file: null,
    error: null,
    success: null,
    validUrl: true,
    imageDescription: '',
    youtubeVideoUrl: null,
    content: '',
  }
  componentDidMount() {
    this.setState({ loading: true });
    axios.get(`/posts/${this.props.postId}`)
      .then((response) => {
        this.setState({ post: response.data.post, title: response.data.post.title, content: response.data.post.content, imageDescription: response.data.post.imageDescription, youtubeVideoUrl: response.data.post.youtubeVideoUrl, loading: false });
      })
      .catch((error) => {
        this.setState({ error, loading: false });
      })
  }
  editPost = (e) => {
    e.preventDefault();
    this.setState({ submiting: true, success: null, error: null });

    if (this.state.post.fullImage && this.state.file) {
      const b = new FormData();
      b.append('file', this.state.file);
      b.append('title', this.state.title);
      b.append('imageDescription', this.state.imageDescription);
      b.append('content', this.state.content);

      axios.patch(`/posts/${this.props.postId}`, b, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then((response) => {
          this.setState({ file: null, success: 'Post edited successfully!', submiting: false, post: response.data.post });
        })
        .catch((error) => {
          console.log(error);
          this.setState({ error, submiting: false });
        })
    } else {
      const data = {
        title: this.state.title,
        content: this.state.content,
        youtubeVideoUrl: this.state.youtubeVideoUrl
      }
      axios.patch(`/posts/${this.props.postId}`, data)
        .then((response) => {
          this.setState({ submiting: false, post: response.data.post, success: 'Post edited successfully!' });
        })
        .catch((error) => {
          console.log(error);
          this.setState({ error, submiting: false });
        })
    }
  }
  checkUrl = () => {
    this.setState({ validUrl: this.state.youtubeVideoUrl.length === 11 ? true : false });
  }
  render() {
    const canSubmit = this.state.youtubeVideoUrl && this.state.validUrl === true ? true : this.state.youtubeVideoUrl && !this.state.youtubeVideoUrl ? false : true;
    return <div>
      <Modal
        show={this.props.showEditModal}
        onHide={this.props.closeEditPostModalTrigger}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Edit Post
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            this.state.success !== null ?
              <Alert variant="success">
                {this.state.success}
              </Alert> : this.state.error !== null ?
                <Alert variant="danger">
                  {this.state.error}
                </Alert> : null
          }
          {
            this.state.post ?
              <Form>
                <Form.Group controlId="formBasicText">
                  <Form.Label>Post Title</Form.Label>
                  <Form.Control type="text" placeholder="Post Title" value={this.state.title} onChange={e => this.setState({ title: e.target.value })} />
                </Form.Group>
                <Form.Group controlId="formBasicText">
                  <Form.Label>Post Content</Form.Label>
                  <Form.Control type="text" placeholder="Post Title" value={this.state.content} onChange={e => this.setState({ content: e.target.value })} />
                </Form.Group>
                {
                  this.state.post.fullImage !== 'uploads/resized/null' ?
                    <InputGroup className="mb-3">
                      <FormControl onChange={e => this.setState({ file: e.target.files[0] })} type="file" />
                    </InputGroup> : null
                }
                {
                  this.state.post.imageDescription ?
                    <Form.Group controlId="formBasicText">
                      <Form.Label>Post Image Description</Form.Label>
                      <Form.Control type="text" placeholder="Post Title" value={this.state.imageDescription} onChange={e => this.setState({ imageDescription: e.target.value })} />
                    </Form.Group> : null
                }
                {
                  this.state.post.youtubeVideoUrl ? <InputGroup style={{ margin: '20px 0' }} className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="youtube-video-input">
                        https://www.youtube.com/watch?v=
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl value={this.state.youtubeVideoUrl} onChange={e => this.setState({ youtubeVideoUrl: e.target.value })} isInvalid={!this.state.validUrl} isValid={this.state.validUrl} onBlur={this.checkUrl} id="basic-url" aria-describedby="basic-addon3" />
                  </InputGroup> : null
                }
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button type="submit" disabled={this.state.submiting || !canSubmit} onClick={this.editPost} variant="primary">
                    {
                      !this.state.submiting ? 'Edit Post' : <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                      </Spinner>
                    }
                  </Button>
                </div>
              </Form> : null
          }
        </Modal.Body>
      </Modal>
    </div>
  }
}

export default EditPostModal;