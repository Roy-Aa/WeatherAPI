import { useState, useEffect } from 'react';
import './Card.css';

function Card() {
  const [city, setCity] = useState('Amsterdam');
  const [searchCity, setSearchCity] = useState('');
  const [temperature, setTemperature] = useState(null);
  const [weatherDescription, setWeatherDescription] = useState('');
  const [weatherLow, setWeatherLow] = useState(null);
  const [weatherHigh, setWeatherHigh] = useState(null);
  const [weatherFeelsLike, setWeatherFeelsLike] = useState(null);
  const [weatherIcon, setWeatherIcon] = useState('');
  const [forecast, setForecast] = useState([]);

  const apiKey = '1d696f6975feb0b2d167458f13db5164';

  useEffect(() => {
    if (city) {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error('City not found');
          }
          return response.json();
        })
        .then(data => {
          setTemperature(data.main.temp);
          setWeatherDescription(data.weather[0].description);
          setWeatherLow(data.main.temp_min);
          setWeatherHigh(data.main.temp_max);
          setWeatherFeelsLike(data.main.feels_like);
          setWeatherIcon(data.weather[0].icon); 
        });

      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

      fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
          const forecastData = data.list;
          const filteredForecast = filterThreeDayForecast(forecastData);
          setForecast(filteredForecast);
        })
        .catch(error => console.log('Error fetching forecast:', error));
    }
  }, [city]);

  const filterThreeDayForecast = (forecastData) => {
    const forecastByDay = {};

    forecastData.forEach(item => {
      const date = new Date(item.dt_txt);
      const day = date.toLocaleDateString(undefined, { weekday: 'long' });

      if (!forecastByDay[day] && date.getHours() === 12) {
        forecastByDay[day] = item;
      }
    });
    return Object.values(forecastByDay).slice(0, 5);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCity(searchCity);
    setSearchCity('');
  };

  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const currentDate = currentDateTime.toLocaleDateString();
  const currentTime = currentDateTime.toLocaleTimeString();

  return (
    <>
      <article className="container">
        <h1 className="title-h1">
          <i className="fa-solid fa-cloud-sun"></i> Weather Dashboard
        </h1>

        <header className="header">
          <div className="datetime">
            <p>Date: {currentDate}</p>
            <p>Time: {currentTime}</p>
          </div>

          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              placeholder="Enter city..."
            />
            <button type="submit">Search</button>
          </form>
          <div className='empty'><span class="material-symbols-outlined">partly_cloudy_day</span></div>
        </header>

        <section className='midsection'>
        {temperature !== null ? (
  <div className="weather-info">
    <h2>Weather in {city}</h2>
    <p>Temperature: {temperature}°C</p>
    <p>Feels like: {weatherFeelsLike}°C</p>
    <p>Low: {weatherLow}°C - High: {weatherHigh}°C</p>
    <img 
      src={`http://openweathermap.org/img/wn/${weatherIcon}@2x.png`} 
      alt={weatherDescription} 
      width="50" 
      height="50" 
    />
    <p>{weatherDescription}</p>
  </div>
) : (
  <p>Loading weather data...</p>
)}


          <div className="forecast-container">
            <h2>5-Day Forecast</h2>
            <div className="forecast-list">
            {forecast.length > 0 ? forecast.map((item, index) => {
  const dayName = new Date(item.dt_txt).toLocaleDateString(undefined, { weekday: 'long' });
  const isTuesday = dayName === 'Tuesday';
  const forecastIcon = item.weather[0].icon; 

  return (
    <div key={index} className={`forecast-item ${isTuesday ? 'tuesday' : ''}`}>
      <h3>{dayName}</h3>
      <p>{new Date(item.dt_txt).toLocaleDateString()}</p>
      <img 
        src={`http://openweathermap.org/img/wn/${forecastIcon}@2x.png`} 
        alt={item.weather[0].description} 
        width="50" 
        height="50" 
      />
      <p>Temp: {item.main.temp}°C</p>
      <p>Feels like: {item.main.feels_like}°C</p>
    </div>
  );
}) : (
  <p>Loading forecast data...</p>
)}

            </div>
          </div>
        </section>
      </article>
    </>
  );
}


export default Card;
