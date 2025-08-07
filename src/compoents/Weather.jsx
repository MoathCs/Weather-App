import { useEffect, useRef, useState } from 'react'
import clear_icon from '../assets/clear.png'
import cloud_icon from '../assets/cloud.png'
import drizzle_icon from '../assets/drizzle.png'
import humidity_icon from '../assets/humidity.png'
import rain_icon from '../assets/rain.png'
import search_icon from '../assets/search.png'
import snow_icon from '../assets/snow.png'
import wind_icon from '../assets/wind.png'
import './Weather.css'



const Weather = () => {
    const [error, setError] = useState("");
    const inputRef = useRef()
    const [weatherData , setWeatherData] = useState(true);

    const allIcons = {       //icon according to the weather !
        "01d" : clear_icon,
        "01n" : clear_icon,
        "02d" : cloud_icon,
        "02n" : cloud_icon,
        "03d" : cloud_icon,
        "03n" : cloud_icon,
        "04d" : drizzle_icon,
        "04n" : drizzle_icon,
        "09d" : rain_icon,
        "09n" : rain_icon,
        "10d" : rain_icon,
        "10n" : rain_icon,
        "13d" : snow_icon,
        "13n" : snow_icon
    }


    const apiKey = import.meta.env.VITE_APP_ID;

    const search = async(city)=>{
        if(city === ""){
            setError("Please enter a city name.");
            setWeatherData(false);
            return;
        }
        try {
            const url =`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
            const res = await fetch(url);
            const data = await res.json();
            
            if(!res.ok){
                setError("City not found. Please enter a valid city name.");
                setWeatherData(false);
                return;
            }
            
            console.log(data);
            const iconCode = data.weather[0].icon;
            const icon = allIcons[iconCode] || clear_icon;
            setWeatherData({
                humidity:data.main.humidity,
                windSpeed:data.wind.speed,
                temperature:data.main.temp,
                location:data.name,
                icon: icon
            })
            setError("")
        } catch (error) {
            setWeatherData(false);
            console.error(error)
        }
    }
    useEffect(() =>{
        search("Nablus");
    } , [])

    const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      search(inputRef.current.value);
    }
  }

  return (
    <div className='weather'>
        <div className="search-bar">
            <input ref={inputRef} type="text" placeholder='Search' onKeyDown={handleKeyDown} />
            <img src={search_icon} alt="" onClick={()=>search(inputRef.current.value)} />
        </div>
        {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}

        {weatherData?<>
            <img src={weatherData.icon} alt="" className='weather-icon' />
            <p className='temperature'>{weatherData.temperature}°c</p>
            <p className='location'>{weatherData.location}</p>
            <div className="weather-data">
                <div className="col">
                    <img src={humidity_icon} alt="" />
                    <div>
                        <p>{weatherData.humidity} %</p>
                        <span>Humidity</span>
                    </div>
                </div>
                <div className="col">
                    <img src={wind_icon} alt="" />
                    <div>
                        <p>{weatherData.windSpeed} Km/h</p>
                        <span>Wind Speed</span>
                    </div>
                </div>
            </div>

        </>:<>
        </>}
    </div>
  )
}

export default Weather
