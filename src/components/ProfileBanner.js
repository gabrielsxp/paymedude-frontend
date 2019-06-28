import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

const profileBanner = ({profileOwner,}) => {
    return <Container fluid>
        <Row>
            {
                profileOwner ? <Col xs={12} style={{ padding: '20px', backgroundColor: `${profileOwner.bannerColor}`, borderBottom: '1px solid #dedede' }}>
                    <div className="profileStats" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', alignContent: 'center', justifyContent: 'space-between', padding: '0 50px' }}>
                        <div style={{marginTop: '25px'}}>
                            <Image style={{ border: `5px solid ${profileOwner.borderColor}` }} src={`http://127.0.0.1:3001/${profileOwner.fullImage}`} roundedCircle></Image>
                        </div>
                        <div style={{marginTop: '25px'}}>
                            <blockquote style={{ color: `${profileOwner.fontColor}` }}>
                                {profileOwner.bio ? profileOwner.bio : ''}
                            </blockquote>
                        </div>
                        <div style={{ display: 'flex', flexFlow: 'column', color: `${profileOwner.fontColor}`, padding: '20px', border: `5px solid ${profileOwner.borderColor}`, borderRadius: '5px', marginTop: '25px' }}>
                            <h5 style={{ textAlign: 'center', marginBottom: '15px' }}>Informations</h5>

                            <p>/profile/<b>{profileOwner.username}</b></p>
                            <p><b>Subscribers: </b> {profileOwner.subscriptions}</p>
                            <p><b>Posts: </b>{profileOwner.numberOfPosts}</p>
                            {profileOwner.sex ? <p><b>Male: </b> <i className="fas fa-male"></i> </p> : <p><b>Female: </b> <i className="fas fa-female"></i> </p>}
                            <p><b>Since: </b>{profileOwner.createdAt}</p>
                        </div>
                    </div>

                </Col> : null
            }
        </Row>
    </Container>
}

export default profileBanner;