import React, {useState, useEffect} from 'react'
import CommonSection from '../shared/CommonSection'

import '../styles/tour.css'
import tourData from '../assets/site_data/hk_attractions'
import TourCard from './../shared/TourCard'
import Newsletter from './../shared/Newsletter'
import {Container, Row, Col} from 'reactstrap'

const Tours = () => {

  const [pageCount, setPageCount] = useState(0)
  const [page, setPage] = useState(0)

  useEffect(() => {
    const pages = Math.ceil(5/3)
    setPageCount(pages)
  }, [page])

  return (
    <>
      <CommonSection title={'All Tours'}/>
      <section>
        <Container>
          <Row>
            {/*SearchBar */}
          </Row>
        </Container>
      </section>

      <section className='pt-0'>
        <Container>
          <Row>
            {tourData?.map(tour => (
              <Col lg='3' className='mb-4' key={tour.id}>
                <TourCard tour={tour}/>
              </Col>
            ))}

            <Col lg='12'>
              <div className='pagination d-flex align-items-center justify-content-center mt-4 gap-3'>
                {[...Array(pageCount).keys()].map(number => (
                  <span key={number} onClick={() => setPage(number)} className={page === number ? 'active_page': ''}>
                    {number + 1}
                  </span>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <Newsletter/>
    </>
  )
}

export default Tours