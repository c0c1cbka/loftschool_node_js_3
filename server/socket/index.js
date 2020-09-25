const connectUsers = {};

function connectionSocket (socket){
    socket.on('users:connect', function (data) {
        let user = {
            ...data, 
            socketId: socket.id,
            activeRoom: null
        }

        connectUsers[socket.id] = user;

        socket.emit('user:list',Object.values(connectUsers));
        socket.broadcast.emit('users:add', user);
    });
}

module.exports = connectionSocket;