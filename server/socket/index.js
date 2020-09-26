const db = require('../models');

const connectUsers = {};

function connectionSocket(socket) {
    socket.on('users:connect', function (data) {
        let user = {
            ...data,
            socketId: socket.id,
            activeRoom: null
        }

        connectUsers[socket.id] = user;

        socket.emit('users:list', Object.values(connectUsers));
        socket.broadcast.emit('users:add', user);
    });

    socket.on('message:add', async (data) => {
        socket.emit('message:add', data);
        socket.broadcast.to(data.roomId).emit('message:add', data);

        try {
            await db.addNewMessange(data.recipientId, data.senderId, data.text);
            await db.addNewMessange(data.senderId, data.recipientId, data.text);
        } catch (err) {
            console.error(err);
            return;
        }
    })

    socket.on('disconnect', (data) => {
        delete connectUsers[socket.id];
        socket.broadcast.emit('users:leave', socket.id);
    });

    socket.on('message:history', async (data) => {
        socket.emit('message:history', await db.getHistoryMessanges(data.userId, data.recipientId));
    });
}

module.exports = connectionSocket;