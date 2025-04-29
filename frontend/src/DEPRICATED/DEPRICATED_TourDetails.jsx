import React, {useRef, useState, useEffect} from 'react'
import '../styles/tour-details.css'
import {Container, Row, Col, Form, ListGroup} from 'reactstrap'
import {useParams} from 'react-router-dom'
import tourData from '../assets/data/tours'
import calculateAvgRating from '../utils/avgRating'
import avatar from '../assets/images/avatar.jpg'
import Booking from '../components/Booking/Booking'

const TourDetails = () => {

  const {site_id} = useParams()
  const reviewMsgRef = useRef()
  const [tourRating, setTourRating] = useState(null)

  const tour = tourData.find(tour => tour.site_id === site_id)
  const {picture, name, desc, price, address, reviews, maxGroupSize, location} = tour
  const {totalRating, avgRating} = calculateAvgRating(reviews)
  const options = {day: 'numeric', month: 'long', year:'numeric'}

  const [imageSrc, setImageSrc] = useState(null)
  
    useEffect(() => {
      const loadImage = async () => {
        try {
          const imageModule = await import(`../assets/site_data/${picture}`)
          setImageSrc(imageModule.default)
        } catch (error) {
          console.error('Error loading the image:', error)
        }
      }
      loadImage();
    })

  const submitHandler = e => {
    e.preventDefault()
  const reviewText = reviewMsgRef.current.value
  }

  return (
    <>
      <section>
        <Container>
          <Row>
            <Col lg='8'>
              <div className='tour_content'>
                {imageSrc && <img src={imageSrc} alt='tour-image' />}
                <div className='tour_info'>
                  <h2>{name}</h2>
                  <div className='d-flex align-items-center gap-5'>
                    <span className='tour_rating d-flex align-items-center gap-1'>
                      <i class="ri-star-fill" style={{color: 'var(--secondary-color)'}}></i> {calculateAvgRating === 0 ? null:avgRating}
                      {totalRating === 0 ? ('Not rated') : (<span>({reviews.length})</span>)}
                    </span>
                      <span>
                        <i class="ri-map-pin-fill"></i>{address}
                      </span>
                  </div>
                  <div className='tour_extra-details'>
                    <span><i class="ri-map-pin-2-line"></i>{location}</span>
                    <span><i class="ri-money-dollar-circle-line"></i>${price} /person</span>
                    <span><i class="ri-group-line"></i>{maxGroupSize}</span>
                  </div>
                  <h5>Description</h5>
                  <p>{desc}</p>
                </div>

                {/* =================tour reviews section start===============*/}
                <div className='tour_reviews mt-4'>
                  <h4>Reviews ({reviews?.length} reviews)</h4>

                  <Form onSubmit={submitHandler}>
                    <div className='d-flex align-items-center gap-3 mb-4 rating_group'>
                      <span onClick={() => setTourRating(1)}>1 <i class="ri-star-s-fill"></i></span>
                      <span onClick={() => setTourRating(2)}>2 <i class="ri-star-s-fill"></i></span>
                      <span onClick={() => setTourRating(3)}>3 <i class="ri-star-s-fill"></i></span>
                      <span onClick={() => setTourRating(4)}>4 <i class="ri-star-s-fill"></i></span>
                      <span onClick={() => setTourRating(5)}>5 <i class="ri-star-s-fill"></i></span>
                    </div>

                    <div className='review_input'>
                      <input tyoe='text' ref={reviewMsgRef} placeholder='Share your thoughts' required/>
                      <button className='btn primary__btn text-white' type='submit'>Submit</button>
                    </div>
                  </Form>
                  <ListGroup className='user_reviews'>
                    {
                      reviews?.map(review => (
                      <div className='review_item'>
                        <img src={avatar} alt=''/>

                        <div className='w-100'>
                          <div className='d-flex align-items-center justify-content-between'>
                            <div>
                              <h5>muhib</h5>
                              <p>{new Date('01-18-2023').toLocaleDateString('en-US', options)}</p>
                            </div>
                            <span className='d-flex align-items-center'>
                              5<i class='ri-star-s-fill'></i>
                            </span>
                          </div>

                          <h6>Amazing tour</h6>
                        </div>
                      </div>))
                    }
                  </ListGroup>
                </div>
                {/* =================tour reviews section start===============*/}
              </div>
            </Col>

            <Col lg='4'>
              <Booking tour={tour} avgRating={avgRating}/>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  )
}

export default TourDetails