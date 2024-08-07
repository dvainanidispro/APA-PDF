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
 * @param {Uint8Array|Buffer} attachment Το αρχείο που θα αποσταλεί ως συνημμένο
 * @param {string} pdfName Το όνομα του συνημμένου χωρίς την επέκταση ".pdf"
 * @returns {Promise<any>} Promise που επιστρέφει info ή error.
 */
async function sendEmail (recipient, attachment, pdfName="filled") {
    return new Promise((resolve, reject) => {
        let email = {
            from: {
                name: process.env.MAILSENDERNAME,
                address: process.env.MAILFROM
            },
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
        console.debug('Sending email...');
        transporter.sendMail(email, (error, info) => {
            if (error) {
                console.error(error);
                reject(error);
            } else {
                console.debug('Email sent: ' + info.response);
                resolve(info);
            }
        });
    });
};


export { sendEmail };