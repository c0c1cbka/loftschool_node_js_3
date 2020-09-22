const express = require('express');
const fs = require('fs');
const path = require('path');

const config = JSON.parse(fs.readFileSync(path.join(__dirname,'config.json'), 'utf8'));

const app = express();
const PORT = config.port;
const publicPath = path.join(__dirname,config.public_path);

require('./models');
require('./auth/passport');

app.use(express.json());
app.use(express.static(publicPath));


app.use('/api',require('./router'));
app.use('*',(req,res)=>{
    const file = path.join(publicPath,'index.html');
    res.sendFile(file);
});

app.listen(PORT,()=>{
    console.log(`server listen ${PORT}`);
});