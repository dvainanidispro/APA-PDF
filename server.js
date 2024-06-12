'use strict';




///////////////////////////////////         DEPENDENCIES         /////////////////////////////////////
const express = require('express');
const server = express();
server.use(express.urlencoded({extended: false})); 
server.use(express.json());
// server.use(express.static('public')); 




/////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////        WEB ROUTES         ////////////////////////////////////////

server.get('/', (req, res) => {
   res.status(200).send('PDF Server is up!');
});






/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////          START THE SERVER         /////////////////////////////////////


let port = 80;
const startWebServer = (server,port) => {
    server.listen(port, () => {
        let presentTime = () => (new Date()).toLocaleString('el-GR',{hourCycle: 'h23', dateStyle: 'short', timeStyle: 'short', timeZone: 'Europe/Athens'});
        console.log(`\x1b[35m Server is listening. Started at: ${presentTime()}. \x1b[0m`);
    });
};
startWebServer(server,port);