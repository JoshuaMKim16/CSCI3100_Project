import React from 'react'
import {Container, Row, Col, Button} from 'reactstrap'
import {Link} from 'react-router-dom'
import '../styles/thank-you.css'

const ThankYou = () => {
  return <section>
    <Container>
        <Row>
            <Col lg='12' className='pt-5 text-center'>
                <div className='thank_you'>
                    <span><i class='ri-checkbox-circle-line'></i></span>
                    <h1 className='mb-3 fw-semibold'>Success</h1>
                    <h3 className='mb-4'>Your location has been added to your timetable planner.</h3>

                    <Button className='btn primary__btn mb-3'><Link to='/home'>Back to Home</Link></Button>
                    <br/>
                    <Button className='btn primary__btn mb-3'><Link to='/tours'>Back to Tours</Link></Button>
                    <br/>
                    <Button className='btn primary__btn mb-3'><Link to='/planner'>Go to Planner</Link></Button>
                </div>
            </Col>
        </Row>
    </Container>
  </section>
}

export default ThankYou