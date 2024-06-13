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

let sendEmail = (recepient, attachment) => {
    let email = {
        from: process.env.MAILFROM,
        to: recepient,
        subject: 'Η φόρμα σας',
        html: `<p>Παρακαλούμε, ελέγξτε τη συνημμένη φόρμα, υπογράψτε τη και στείλτε τη, σύμφωνα με τις οδηγίες που έχετε λάβει.</p>`,
        attachments: [
            {
                filename: 'filled.pdf',
                content: attachment
            }
        ]
    };
    transporter.sendMail(email, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};


export { sendEmail };