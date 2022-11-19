const weatherService = require("../service/weather.service");

exports.create = async (req, res) => {
  try {
    const weather = await weatherService.create(req.body);
    res.json({ data: weather || null });
  } catch (e) {
    res.status(500).send(e.message);
  }
};

exports.fetchLatest = async (req, res) => {
  try {
    const weather = await weatherService.fetchWeather();
    res.json({ data: weather || null });
  } catch (e) {
    res.status(500).send(e.message);
  }
};
