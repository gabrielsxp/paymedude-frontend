import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

const confirmationModal = ({show, closeConfirmationModalTrigger, deletePost, id, loading}) => {
    return <div>
      <Modal
        show={show}
        onHide={closeConfirmationModalTrigger}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Confirm Post Delete
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure that you want to delete this post ?</p>

          <Button disabled={loading} style={{marginRight: '25px'}} variant="danger" onClick={() => deletePost()}>
            {
                !loading ? 'Confirm' : <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            }
          </Button>
          <Button variant="secondary" onClick={closeConfirmationModalTrigger}>Cancel</Button>
        </Modal.Body>
      </Modal>
    </div>
}

export default confirmationModal;