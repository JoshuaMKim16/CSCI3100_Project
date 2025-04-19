import React, {useState, useEffect} from 'react'
import CommonSection from '../shared/CommonSection'

import '../styles/tour.css'
import TourCard from './../shared/TourCard'
import Newsletter from './../shared/Newsletter'
import {Container, Row, Col} from 'reactstrap'

const Tours = () => {

  const [locations, setLocations] = useState([]);
  const [pageCount, setPageCount] = useState(0)
  const [page, setPage] = useState(0)

  const fetchLocations = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/locations');
        console.log(response);
        const data = await response.json();
        console.log(data);
        setLocations(data);
      } catch (error) {
        console.error('Error fetching locations:', error);
        setLocations([]);
      }
    };
  
    // Fetch initial locations on component mount
    useEffect(() => {
      fetchLocations();
    }, []);

  useEffect(() => {
    const pages = Math.ceil(locations.length/8)
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
            {locations.map((location) => (
              <Col lg='3' className='mb-4' key={location._id}>
                <TourCard location={location}/>
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