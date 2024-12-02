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
 * @param {object} recipients Tα email των παραληπτών ως αντικείμενο
 * @param {Uint8Array|Buffer} attachment Το αρχείο που θα αποσταλεί ως συνημμένο
 * @param {string} pdfName Το όνομα του συνημμένου χωρίς την επέκταση ".pdf"
 * @returns {Promise<any>} Promise που επιστρέφει info ή error.
 */
async function sendEmail (recipients, attachment, pdfName="filled", mailOptions) {
    return new Promise((resolve, reject) => {
        let email = {
            from: {
                name: process.env.MAILSENDERNAME,
                address: process.env.MAILFROM
            },
            to: [recipients.to, process.env.MAILADDITIONALTO],
            cc: [process.env.MAILADDITIONALCC, recipients.cc],
            bcc: [process.env.MAILADDITIONALBCC, recipients.bcc],
            subject: mailOptions.subject ?? process.env.MAILSUBJECT,
            html: mailOptions.html ?? process.env.MAILBODY,
            attachments: [
                {
                    filename: `${pdfName}.pdf`,
                    content: attachment
                }
            ]
        };
        console.debug('Sending email...');
        // console.debug(email);
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