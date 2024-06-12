'use strict';




///////////////////////////////////         DEPENDENCIES         /////////////////////////////////////
import express, { urlencoded, json } from 'express';
const server = express();
server.use(urlencoded({extended: false})); 
server.use(json());
server.use(express.static('public')); 


import fs from 'fs';

import { fillForm } from './controllers/fillform.js';



///////////////////////////////////         FILL FORM         /////////////////////////////////////


/* 
//fill a test form
// fillForm('https://royalegroupnyc.com/wp-content/uploads/seating_areas/sample_pdf.pdf', 
fillForm('http://localhost/input/sample_pdf.pdf', 
    { 
        'Name': 'Dimitris',
        'Address': 'Home',
        'Check Box1': 1,
        'Check Box3': true,
        'Group6': "Choice1",
        "Text6": "Improv", 

    }).then((outputPdf) => {//save to output folder
        fs.writeFile('public/output/filled.pdf', outputPdf, (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        });
    });

fillForm('http://localhost/input/sample_application.pdf', 
        { 
            'Surname': 'Vainanidis',
            'Group36': 'Choice4',
            // 'Check Box1': 1,
            'Check Box33': 1,
            // 'Group6': "Choice1",
            // "Text6": "Improv", 
        }).then((outputPdf) => {//save to output folder
            fs.writeFile('public/output/filled_application.pdf', outputPdf, (err) => {
                if (err) throw err;
                console.log('The file has been saved!');
            });
        });
*/   
    



/////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////        WEB ROUTES         ////////////////////////////////////////

server.get('/', (req, res) => {
   res.status(200).send('PDF Server is up!');
});

server.post('/', (req, res) => {
    console.log(req.body);
    let pdfUrl = req.body.pdfTemplateUrl;
    let fillData = req.body;
    fillForm(pdfUrl, fillData).then((outputPdf) => {

        fs.writeFile('public/output/filled.pdf', outputPdf, (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        });

        // res.status(200).send(outputPdf); // για αποστολή αρχείου
        res.status(200).send('PDF has been filled and saved to the output folder.');
    });
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