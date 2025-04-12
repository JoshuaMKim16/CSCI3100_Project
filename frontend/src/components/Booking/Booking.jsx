import React, {useState} from 'react'
import './booking.css'
import {Form, FormGroup, ListGroup, ListGroupItem, Button} from 'reactstrap'
import {useNavigate} from 'react-router-dom'

const Booking = ({tour, avgRating}) => {

  const {title, reviews} = tour

  const navigate = useNavigate()

  const handleClick = e => {
    e.preventDefault()
    navigate('/thank-you')
  }

  return <div className='booking'>
    <div className='booking_top d-flex align-items-center justify-content-between'>
      <h3>{title}<span></span></h3>
      <span className='tour_rating d-flex align-items-center'>
        <i class='ri-star-s-fill'></i>
        {avgRating === 0 ? null: avgRating} ({reviews?.length})
      </span>
    </div>

    {/*================booking form start=================*/}
    <div className='booking_form'></div>
    <Button className='btn primary__btn w-100 mt-4' onClick={handleClick}>Add to Planner</Button>
    {/*================booking form end=================*/}
  </div>
}

export default Booking