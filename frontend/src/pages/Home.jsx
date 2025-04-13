import React from 'react'
import '../styles/home.css'

import { Container, Row, Col } from 'reactstrap'
import Img01 from '../assets/site_data/attraction_photos/0_AUy1YQ0AhZ.jpg'
import Img02 from '../assets/site_data/attraction_photos/0_AUy1YQ1-Qm.jpg'
import Img03 from '../assets/site_data/attraction_photos/0_AUy1YQ0wQq.jpg'
import worldImg from '../assets/images/world.png'
import Subtitle from './../shared/Subtitle'
import ServiceList from '../services/ServiceList'
/* import FeaturedTourList from '../components/Featured tours/FeaturedTourList' */
import experienceImg from '../assets/images/experience.png'
import Newsletter from '../shared/Newsletter'

const Home = () => {
  return <>
    {/*==================hero section start===================*/}
    <section>
      <Container>
        <Row>
          <Col lg='6'>
            <div className='hero_content'>
              <div className='hero_subtitle d-flex align-items-center'>
                <Subtitle subtitle={'Plan Before You Go'} />
                <img src={worldImg} alt='' />
              </div>
              <h1>Traveling opens the door to creating <span className='highlight'>memories</span></h1>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est nulla quam consequuntur adipisci qui sit id labore! Accusantium doloribus maiores nobis alias praesentium, sint laborum consequatur consectetur deserunt quia neque.</p>
            </div>
          </Col>
          <Col lg='2'>
            <div className='hero_img-box'>
              <img src={Img01} alt=''/>
            </div>
          </Col>
          <Col lg='2'>
            <div className='hero_img-box mt-4'>
              <img src={Img02} alt=''/>
            </div>
          </Col>
          <Col lg='2'>
            <div className='hero_img-box mt-5'>
              <img src={Img03} alt='' controls/>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  {/*==================hero section start===================*/}
    <section>
      <Container>
        <Row>
          <Col lg='3'>
            <h5 className='services_subtitle'>What we serve</h5>
            <h2 className='services_title'>We offer our best services</h2>
          </Col>
          <ServiceList/>
        </Row>
      </Container>
    </section>

    {/*==================featured tour section start===================*/}
    <section>
      <Container>
        <Row>
          <Col lg='12' className='mb-5'>
            <Subtitle subtitle={'Explore'}/>
            <h2 className='featured_tour-title'>Our featured tour</h2>
          </Col>
          {/* <FeaturedTourList/> */}
        </Row>
      </Container>
    </section>
    {/*==================featured tour section end===================*/}

    {/*==================experience section start===================*/}
    <section>
      <Container>
        <Row>
          <Col lg='6'>
            <div className='experience_content'>
              <Subtitle subtitle={'Experience'}/>
              <h2>With our all expreience <br /> we will serve you</h2>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus reprehenderit incidunt, impedit autem eveniet quibusdam labore, tempore dolores itaque consequatur officiis maiores harum voluptas tenetur provident similique voluptatum totam eos.
                <br/>
              </p>
            </div>

            <div className='counter_wrapper d-flex align-items-center gap-5'>
              <div className='counter_box'>
                <span>12k+</span>
                <h6>Successful trip</h6>
              </div>
              <div className='counter_box'>
                <span>2k+</span>
                <h6>Regular clients</h6>
              </div>
              <div className='counter_box'>
                <span>15</span>
                <h6>Years exprience</h6>
              </div>
            </div>
          </Col>
          <Col lg='6'>
            <div className='experience_img'>
              <img src={experienceImg} alt=''/>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
    {/*==================experience section end===================*/}

    {/*==================subscribe section start===================*/}
    <Newsletter/>
    {/*==================subscribe section end===================*/}
  </>
}

export default Home