const express = require('express');
const fs = require('fs');
const path = require('path');
const http = require('http');

const connectSocket = require('./socket');


const config = JSON.parse(fs.readFileSync(path.join(__dirname,'config.json'), 'utf8'));

const app = express();
const server = http.createServer(app);

const io = require('socket.io').listen(server);
io.on('connection', connectSocket);

const PORT = config.port;
const publicPath = path.join(__dirname,config.public_path);

require('./models');
require('./auth/passport');

app.use(express.json());
app.use(express.static(publicPath));


app.use('/api',require('./routers'));
app.use('*',(req,res)=>{
    const file = path.join(publicPath,'index.html');
    res.sendFile(file);
});

server.listen(process.env.PORT || PORT,()=>{
    console.log(`server listen ${process.env.PORT || PORT}`);
});