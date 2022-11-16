require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const socketController = require("./controllers/socket.controller");
const database = require("./db");
const app = express();
const httpServer = require("http").createServer(app);

const WEATHER_API = process.env.WEATHER_API_HOST || "https://garden-local-dev.hoonyland.workers.dev/weather/latest";

const { Server } = require("socket.io");

const io = new Server(httpServer, {
  pingTimeout: 10 * 60 * 1000,
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

var corsOptions = {
  origin: ["*", "http://localhost:1234", "http://192.168.100.1", WEATHER_API],
  credential: true,
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Test." });
});

require("./routes/auth.routes")(app);
require("./routes/weather.routes")(app);
require("./routes/user.routes")(app);
require("./routes/socket.routes")(io);

// set port, listen for requests
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

socketController.startAnimatingCreatures();

setInterval(() => {
  database.persistence.compactDatafile();
}, 5000);
