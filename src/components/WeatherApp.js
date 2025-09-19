import { useEffect, useState } from "react";
import axios from "axios";
import { API_KEY } from "../apiKey";
import "./WeatherApp.css";
import dayjs from "dayjs";

import {
  IconDropletHalfFilled,
  IconMapPinFilled,
  IconSearch,
  IconWind,
} from "@tabler/icons-react";

const API_URL = `https://api.openweathermap.org/data/2.5/weather`;

const WeatherApp = () => {
  const [city, setCity] = useState("New Delhi");
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchResult();
    // eslint-disable-next-line
  }, []);

  const fetchResult = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_URL, {
        params: { q: city, appid: API_KEY, units: "metric" },
      });
      setData(response.data);
    } catch {
      setData({ notFound: "Not Found" });
    }
    setIsLoading(false);
  };

  const handleInputChange = (e) => setCity(e.target.value);

  const handleEnterPress = (e) => {
    if (e.key === "Enter") fetchResult();
  };

  const handleSearchClick = () => fetchResult();

  const weatherName = data?.weather?.[0]?.main || "Clear";
  const date = dayjs().format("dddd, DD MMM YY");

  const backgroundClass =
    weatherName === "Clear"
      ? "sunny"
      : weatherName === "Clouds"
      ? "cloudy"
      : weatherName === "Rain"
      ? "rainy"
      : weatherName === "Snow"
      ? "snowy"
      : "mist";

  return (
    <div className={`container ${backgroundClass}`}>
      <div className="weather-app">
        {/* Search */}
        <div className="search">
          <div className="search-top">
            <IconMapPinFilled size={20} />
            <p>{city}</p>
          </div>
          <div className="search-bar">
            <input
              type="text"
              onChange={handleInputChange}
              onKeyDown={handleEnterPress}
              placeholder="Enter Location"
            />
            <IconSearch color="#fff" onClick={handleSearchClick} className="search-icon" />
          </div>
        </div>

        {isLoading ? (
          <p className="loading">Loading...</p>
        ) : data.notFound ? (
          <p className="not-found">City Not Found</p>
        ) : (
          <div className="weather-content">
            {/* Left side: Icon + Temp */}
            <div className="weather-left">
              <img
                src={`https://openweathermap.org/img/wn/${data?.weather?.[0]?.icon}@4x.png`}
                alt="weather icon"
                className="weather-icon"
              />
              <div className="weather-temp">
                {data?.main && <p>{Math.floor(data.main.temp)}ºC</p>}
                <p className="weather-type">{weatherName}</p>
              </div>
            </div>

            {/* Right side: Info */}
            <div className="weather-right">
              <p className="weather-date">{date}</p>
              <div className="weather-data">
                <div className="weather-box">
                  <IconDropletHalfFilled size={20} />
                  <p>{data?.main?.humidity} %</p>
                  <span>Humidity</span>
                </div>
                <div className="weather-box">
                  <IconWind size={20} />
                  <p>{data?.wind?.speed} km/h</p>
                  <span>Wind</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;
