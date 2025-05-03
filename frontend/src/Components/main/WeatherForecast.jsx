import React, { useState, useEffect } from 'react'
import { Container, Card, Row, Col } from 'react-bootstrap';

const WeatherForecast = () => {
    // State for fetching weather
    const [weathers, setWeathers] = useState([]);

    // Fetch weather
    const fetchWeathers = async() => {
        try{
          const response = await fetch('https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=en');
          const data = await response.json();
          const weatherForecast = data.weatherForecast
          setWeathers(weatherForecast);
        } catch(error) {
          console.error('Error fetching weather:', error);
          setWeathers([]);
        }}

      useEffect(() => {
        fetchWeathers();
      }, []);

    return (
        <div>
            <Container style={{height: '90vh' ,width: '100vh'}}>
                {weathers.map((weather) => (
                    <Card style={{width: '100%'}}>
                        <p>Forecast Date: {weather.forecastDate} ({weather.week})</p>
                        
                    </Card>
                ))}
            </Container>
        </div>
    )
  };

export default WeatherForecast