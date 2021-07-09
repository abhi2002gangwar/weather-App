const http = require("http");
const fs = require("fs");
const requests = require("requests");



const homeFile = fs.readFileSync("index.html", "utf-8");
// const cssfile = fs.readFileSync("style.css", "utf-8");
// const scriptFile = fs.readFileSync("script.js", "utf-8");

const replaceVal = (tempVal, orgVal) => {
    temprature = tempVal.replace("{%tempVal%}", Math.floor(orgVal.main.temp - 273));
    temprature = temprature.replace("{%tempMin}", Math.floor(orgVal.main.temp_min - 273));
    temprature = temprature.replace("{%tempMax%}", Math.floor(orgVal.main.temp_max - 273));
    temprature = temprature.replace("{%location%}", orgVal.name);
    temprature = temprature.replace("{%country%}", orgVal.sys.country);
    temprature = temprature.replace("{%tempratureStatus%}", orgVal.weather[0].main);
    return temprature;
}


const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests(
                `https://api.openweathermap.org/data/2.5/weather?q=Bareilly&appid=6122bbdd9602513495d49aef836eb38d`
            )
            .on("data", (chunk) => {
                const objdata = JSON.parse(chunk);
                const arrData = [objdata];

                console.log(arrData[0].main.temp);
                const realTimeData = arrData
                    .map((val) => replaceVal(homeFile, val))
                    .join("");
                res.write(realTimeData);
                // console.log(realTimeData);
            })
            .on("end", (err) => {
                if (err) return console.log("connection closed due to errors", err);
                res.end();
            });
    } else {
        res.end("File not found");
    }
});
server.listen(5800, "127.0.0.1");