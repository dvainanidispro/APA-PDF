'use strict';
import nodemailer from 'nodemailer';

let transporter = nodemailer.createTransport({
    host: process.env.MAILHOST,
    port: process.env.MAILPORT,
    auth: {
      user: process.env.MAILUSER,
      pass: process.env.MAILPASS
    }
});

/**
 * Στέλνει το PDF με email στον παραλήπτη
 * @param {string} recipient To email του παραλήπτη
 * @param {Uint8Array} attachment Το αρχείο που θα αποσταλεί ως συνημμένο
 * @param {string} pdfName Το όνομα του συνημμένου χωρίς την επέκταση ".pdf"
 * @returns {void}
 */
let sendEmail = (recipient, attachment, pdfName="filled") => {
    let email = {
        from: process.env.MAILFROM,
        to: recipient,
        subject: 'Η φόρμα σας',
        html: `<p>Παρακαλούμε, ελέγξτε τη συνημμένη φόρμα, υπογράψτε τη και στείλτε τη, σύμφωνα με τις οδηγίες που έχετε λάβει.</p>`,
        attachments: [
            {
                filename: `${pdfName}.pdf`,
                content: attachment
            }
        ]
    };
    console.log('Sending email...');
    transporter.sendMail(email, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};


export { sendEmail };