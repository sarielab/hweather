const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config()

const token = process.env.TELEGRAM_TOKEN;
const { getWeather } = require('./model/weather');

console.log('dalam index.js');

var bot = new TelegramBot(token, {polling: true});
bot.getMe().then(function (me) {
  console.log('Hi my name is %s!', me.username);
});

//matches /start
bot.onText(/\/start/, function (msg, match) {
  var fromId = msg.from.id; // get the id, of who is sending the message
  var message = "Welcome to ppweather\n"
  message += "Get weather update by sending /weather [your_city] [your_country_id] command.\n"
  message += "e.g: /weather jakarta id";
  bot.sendMessage(fromId, message);
});


//match /weather [whatever]
bot.onText(/\/weather (.+)/, function (msg, match) {

  let fromId = msg.from.id || 'anon'; // get the id, of who is sending the message
  let data = match[1].trim(' ').split(' ');

  if (data.length === 2) {
    let message = `The result from ${data[0] + ' '+ data[1] } is :\n`;

    getWeather(data[0],data[1])
    .then(res => {
      let weather = res.weather[0];
      let main = res.main;
      let wind = res.wind;
      let cloud = res.clouds.all || '-';
      let result = `
        ${weather.main}  - ${weather.description}
        temp: ${main.temp}
        pressure: ${main.pressure}
        humidity: ${main.humidity}
        temp: ${main.temp_min} - ${main.temp_max}
        wind: ${wind.speed} speed ${wind.deg} deg
        clouds: ${cloud}
      `
      bot.sendMessage(fromId, message+`${result}`);
    })
    .catch(err => {bot.sendMessage(fromId, message+`${err}`);  })
  }
  else bot.sendMessage(fromId, 'Please follow the correct Format!');
});


