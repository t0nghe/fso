import React, { useEffect, useState } from "react"
import axios from "axios"

const { REACT_APP_API_KEY } = process.env

const WeatherReport = (props) => {
    const [weather, setWeather] = useState(null)

    const queryUrl = `http://api.weatherstack.com/current?access_key=${REACT_APP_API_KEY}&query=${props.city},+${props.country}&units=m`

    const initialFetch = (url) => {
        axios.get(url).then(
            (response) => {
                console.log(response.data);
                setWeather(response.data);
            }
        )
    }

    useEffect(
        ()=>initialFetch(queryUrl)
        , [queryUrl]
    )

    if (weather) {
        const {current: {temperature, wind_speed, wind_dir, weather_icons}} = weather
        return <div><h3>Weather in {props.city}</h3>
        <div>
            <strong>Temperature: </strong>{temperature} ºC<br />
            <strong>Wind: </strong>{wind_speed} mph, <strong>direction</strong>: {wind_dir}<br />
            <img src={weather_icons[0]} alt="weather" />
        </div>
    </div>
    } else {
        return ""
    }
    
} 

export default WeatherReport