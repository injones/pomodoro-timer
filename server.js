const io = require('socket.io')();
const port = 8000;

let times = [];
let teamTimes = [];
io.on('connection', (client) => {
    let addedUser = false;
    // here you can start emitting events to the client

    // subscribeToTimer is called by client whenever they update
    client.on('subscribeToTimer', (time) => {
        console.log('client is subscribing to timer with interval ', time.time);
        client.username = time.username;
        // teamTimes.push({
        //     username: 'name',
        //     time: 10
        // });
        let index = teamTimes.findIndex(element => element.username === client.username);
        if (index !== -1){
            teamTimes[index].time = time.time
        } else {
            teamTimes.push({
                username: client.username,
                time: time.time
            })
        }
        times.push(time.time);
        client.emit('times', teamTimes); // update all clients with updated times
    });

    client.on('addUser', (username) => {
        if (addedUser) return;

        client.username = username;
        addedUser = true;
        client.broadcast.emit('userOnline', {
            username: client.username
        })
    })
});

io.listen(port);
console.log('listening on port ', port);