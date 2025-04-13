import React from 'react'
import './footer.css'

import {Container, Row, Col, ListGroup, ListGroupItem} from 'reactstrap'
import {Link} from 'react-router-dom' 
import logo from '../../assets/images/logo.png'

const quick_links = [
  { 
    path: '/home',
    display: 'Home'
  }, 
  {
  path: '/tours',
  display: 'Tours'
  }, 
  {
  path: '/planner',
  display: 'Planner'
  },
] 

const quick_links2 = [ 
  {
  path: '/login',
  display: 'Login'
  }, 
  {
  path: '/registers',
  display: 'Register'
  },
] 

const Footer = () => {

  const year = new Date().getFullYear()

  return <footer className='footer'>
    <Container>
      <Row>
        <Col lg='7'>
          <div className='logo'>
            <img src={logo} alt='' />
          </div>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nesciunt dicta exercitationem veniam reiciendis assumenda beatae quam impedit, nam dignissimos praesentium, nobis ipsa ab veritatis nihil accusantium id fugit ea ut!
          </p>
        </Col>

        <Col lg='2'>
          <h5 className='footer_link-title'>Discover</h5>
          <ListGroup className='footer_quick-links'>
            {
              quick_links.map((item, index) => (
                <ListGroupItem key={index} className='ps-0 border-0'>
                  <Link to={item.path}>{item.display}</Link>
                </ListGroupItem>
              ))
            }
          </ListGroup>
        </Col>

        <Col lg='2'>
          <h5 className='footer_link-title'>Quick Links</h5>
          <ListGroup className='footer_quick-links'>
            {
              quick_links2.map((item, index) => (
                <ListGroupItem key={index} className='ps-0 border-0'>
                  <Link to={item.path}>{item.display}</Link>
                </ListGroupItem>
              ))
            }
          </ListGroup>
        </Col>
      </Row>

      <Col lg='12' className='text-center pt-5'>
            <p className='copyright'>
              Copyright {year}, designed and developed by Group XXX. All rights reserved.
            </p>
      </Col>
    </Container>
  </footer>
}

export default Footer