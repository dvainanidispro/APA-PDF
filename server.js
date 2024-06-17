'use strict';




///////////////////////////////////         DEPENDENCIES         /////////////////////////////////////

import fs from 'fs';
import 'dotenv/config';

import express, { urlencoded, json } from 'express';
const server = express();
server.use(urlencoded({extended: false})); 
server.use(json());
server.use(express.static('public')); 

import { fillForm } from './controllers/fillform.js';
import { sendEmail } from './controllers/email.js';



///////////////////////////////////        TEST FILL FORM         /////////////////////////////////////


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


server.post('/', async (req, res) => {
    let formData = req.body;
    console.log({formData});
    let metaData = {       // Πεδία φόρμας με συγκεκριμένη λειτουργία
        pdfUrl: req.body.PdfTemplateUrl,
        recepient: req.body.email ?? null,
    }
    console.log({metaData});
    

    fillForm(metaData.pdfUrl, formData).then((outputPdf) => {

        if (!outputPdf) {
            res.status(500).send('Error filling the PDF.');
            return;
        }

        // Αποθήκευση αρχείου τοπικά. Να αφαιρεθεί αργότερα. 
        fs.writeFile('public/output/filled.pdf', outputPdf, (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        });

        // Αποστολή αρχείου με email
        if(metaData.recepient){
            sendEmail(metaData.recepient, outputPdf);
        }

        // res.status(200).send(outputPdf); // για αποστολή αρχείου ως απάντηση στο request
        // res.status(200).send('PDF has been filled and sent to the submitter.');
        res.status(200).send('OK.');
    });
});






/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////          START THE SERVER         /////////////////////////////////////


let port = process.env.PORT??80;
const startWebServer = (server,port) => {
    server.listen(port, () => {
        let presentTime = () => (new Date()).toLocaleString('el-GR',{hourCycle: 'h23', dateStyle: 'short', timeStyle: 'short', timeZone: 'Europe/Athens'});
        console.log(`\x1b[35m Server is listening on ${process.env.LISTENINGURL}:${port}. Started at: ${presentTime()}. \x1b[0m`);
    });
};
startWebServer(server,port);