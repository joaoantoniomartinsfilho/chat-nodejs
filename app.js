require('dotenv').config();

const path = require('path');
const express = require('express');
const PORT = process.env.PORT || 3000;
const app = express();
const webServer = require('http').createServer(app);
const io = require('socket.io')(webServer);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.get('/', (req, res) => 
{
    var socketServerAddress = process.env.SOCKETSERVER || `http://localhost:${PORT}`

    res.render('index.ejs', 
    {
        socketServerAddress: socketServerAddress
    });
});

let messages = [];

io.on('connection', socket => 
{
    console.log(`New socket ${socket.id}`);

    socket.on('sendMessage', (message) => 
    {        
        messages.push(message);

        socket.broadcast.emit('receivedMessage', message);
    });
});

webServer.listen(PORT, () => 
{
    console.log(`App is running on port: ${PORT}`)
});