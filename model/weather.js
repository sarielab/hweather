const weather = require('openweather-apis');
const axios = require('axios');

function getWeather(city_name,country_code) {
  return new Promise (
    function(resolve, reject){
      axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city_name},${country_code}&appid=${process.env.WEATHER_KEY}`)
      .then(res => resolve(res.data) )
       .catch(err => reject (err))
  })
}

module.exports = {
  getWeather
}