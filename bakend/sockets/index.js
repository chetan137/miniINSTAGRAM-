
const sockets = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
};

module.exports = {

    experimental: {
        reactRefresh: false
    }
};



module.exports = sockets;
