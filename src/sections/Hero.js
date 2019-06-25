import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import bg from '../assets/back.jpg';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Styles = styled.div`
    .hero {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        height: calc(100vh - 3rem);
        background: url('${bg}') no-repeat fixed;
        background-size: cover;
    }
    .hero .btn {
        
    }
`;

const hero = () => {
    return <div>
        <Styles>
            <div className="hero">
                <Container>
                    <Row>
                        <Col xs={12} md={{ span: 6, offset: 2 }} lg={{span: 4, offset: 0}}>
                            <h2>Greet access of exclusive content created by the people that you love ♥</h2>
                            <div className="btnWrap" style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', flexWrap: 'wrap', marginBottom: '20px'}}>
                                <Link to="/signup?creator=false"><Button variant="primary" style={{marginRight: '20px'}}>Sign Up</Button></Link>
                                <Link to="/signup?creator=true"><Button variant="primary">Create Content</Button></Link>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </Styles>
    </div>
}

export default hero;