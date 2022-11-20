const { initialize, userConnected } = require("../controllers/socket.controller");

module.exports = (io) => {
  initialize(io);

  io.on("connection", (socket) => {
    userConnected(socket);
  });
};
