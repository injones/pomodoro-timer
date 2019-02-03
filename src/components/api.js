import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8000');

function subscribeToTimer(current, cb) {
    socket.on('times', times => cb(null, times));
    socket.emit('subscribeToTimer', current);
}

function addUser(username, cb){
    socket.emit('addUser', username);
    socket.on()
    // socket.on('addUser', () => cb());
}

export { subscribeToTimer, addUser }