const express = require("express");
const https = require("https");
const dotenv = require("dotenv").config();

const uniqueUrl = process.env.APP_URL;
const uniqueKey = process.env.APP_KEY;
const imgUrl = process.env.IMG_URL;
const port = process.env.PORT || 3000;

const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));

app.get("/weather",function(req,res){
    res.sendFile(__dirname+"/index.html");
});

app.post("/weather",function(req,res){

    const query = req.body.cityName;
    const appKey = uniqueKey;
    const unit = "metric";

    const url = uniqueUrl+ query +"&appid="+ appKey +"&units="+ unit;
    https.get(url,function(response){
        console.log(response.statusCode);
        res.writeHead(200, {'Content-Type': 'text/html'});

        response.on('data',function(data){
            const weatherData = JSON.parse(data)
            const temp = weatherData.main.temp
            const weatherDescription = weatherData.weather[0].description
            const icon = weatherData.weather[0].icon
            const imageUrl = imgUrl+icon+"@2x.png"

            res.write('<img src="'+ imageUrl +'">');
            res.write('<h1>The temperature in '+ query +' is '+ temp +' degree Celcius.</h1>');
            res.write('<p>The weather is currently '+ weatherDescription +'</p>');
            res.send();
        });
    });
})

 

app.listen(port,function(){
    console.log("You Are Using Port "+port);
});