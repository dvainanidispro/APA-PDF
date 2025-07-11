'use strict';



/////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////         DEPENDENCIES         /////////////////////////////////////


// import fs from 'fs';
import 'dotenv/config';

import express, { urlencoded, json } from 'express';
const server = express();
server.use(urlencoded({extended: false})); 
server.use(json());
server.use(express.static('public')); 

import { multipleSelectParser } from './controllers/multipleselect.js';
import { fillForm } from './controllers/fillform.js';
import { sendEmail } from './controllers/email.js';
import { validateKey } from './controllers/validatekey.js';
import { log } from './controllers/logger.js';




/////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////        WEB ROUTES         ////////////////////////////////////////



server.get('/', (req, res) => {
    res.status(200).send('PDF Service is up!\n').end();
    // το \n υπάρχει ώστε με την εντολή "curl localhost" στο terminal να γίνεται αλλαγή γραμμής για την επόμενη εντολή
});



server.post('/', log.formSubmission, validateKey, multipleSelectParser, async (req, res) => {

    let formData = req.body;

    /** Πεδία φόρμας με δεσμευμένο όνομα και συγκεκριμένη λειτουργία */
    let metaData = {
        /** Η τοποθεσία του άδειου fillable PDF */
        pdfUrl: req.body.PdfTemplateUrl,
        recipients: {
            /** Παραλήπτης του email θα είναι είτε το πεδίο που ορίζεται στο RecipientField, είτε το πεδιό email */ 
            to: req.body[req.body.RecipientField] ?? req.body.email ?? null,
            cc: req.body.Cc ?? null,
            bcc: req.body.Bcc ?? null,
        },
        /** Το όνομα του αρχείου pdf που θα δημιουργηθεί */
        pdfName: req.body.PdfName ?? 'filled',
        /** Τα στοιχεία του email */
        mailOptions: {
            subject: req.body.Subject ?? null,
            html: req.body.Body ?? null,
        }
    }
    // console.debug({metaData});
    
    /** Το συμπληρωμένο PDF ως αρχείο */
    let outputPdf = await fillForm(metaData.pdfUrl, formData);
    if (!outputPdf) {
        res.status(500).send('Error filling the PDF.');
        return;
    }

    // Αποθήκευση αρχείου τοπικά. 
    // fs.writeFile(`public/output/${metaData.pdfName}.pdf`, outputPdf, (err) => {
    //     if (err) {throw err};
    //     console.debug('The file has been saved!');
    // });

    // Αποστολή αρχείου με email
    if (metaData.recipients.to) {
        sendEmail(metaData.recipients, outputPdf, metaData.pdfName, metaData.mailOptions)       // do now await this
            .catch(err=>{
                log.error(`Error sending email to ${metaData.recipients.to}`);
                log.error(err);
            });      
    }

    // res.status(200).send(outputPdf); // για αποστολή αρχείου ως απάντηση στο request
    res.status(200).send('OK');

});




/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////          START THE SERVER         /////////////////////////////////////



let port = process.env.PORT??80;
const startWebServer = (server,port) => {
    server.listen(port, () => {
        log.system(`Server is listening on ${process.env.LISTENINGURL}:${port}.`);
    });
};
startWebServer(server,port);