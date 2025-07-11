'use strict';

import { styleText } from 'node:util';

const greekNow = () => (new Date()).toLocaleString('el-GR',{hourCycle: 'h23', dateStyle: 'short', timeStyle: 'short', timeZone: 'Europe/Athens'});


const log = (message) => {
  console.log(message);
}
log.dev = (message='- - - here - - -') => {
    if (process.env.ENVIRONMENT == 'development') {
        console.debug(styleText(['bold', 'italic', 'blue'], `📘 ${message}`));
    }
}
log.system = (message, icon=true) => {
    const prefix = icon ? '☑️  ' : '';
    console.log(styleText(['magenta','bold'], `${prefix}${greekNow()} - ${message}`));
}
log.info = (message, icon=true) => {
    const prefix = icon ? 'ℹ️  ' : '';
    console.log(styleText('blue', `${prefix}${greekNow()} - ${message}`));
}
log.error = (message, icon=true) => {
    const prefix = icon ? '🔴 ' : '';
    console.error(styleText(['red', 'bold'], `${prefix}${greekNow()} - ${message}`));
}
log.warn = (message, icon=true) => {
    const prefix = icon ? '⚠️  ' : '';
    console.warn(styleText('yellow', `${prefix}${greekNow()} - ${message}`));
}
log.success = (message, icon=true) => {
    const prefix = icon ? '✅ ' : '';
    console.log(styleText('green', `${prefix}${greekNow()} - ${message}`));
}
log.formSubmission = (req, res, next) => {
    log.info(`Received a POST request to fill a form`);
    // let formData = req.body;
    // console.debug({formData});  
    // log(`Request body: ${JSON.stringify(req.body, null, 2)}`);
    next();
}


// Test those
// log('This is a simple log message');
// log.dev('This is a development message');
// log.dev();
// log.system('Server is running...');
// log.info('This is an info message');
// log.error("This is an error! Check it out!");
// log.error("This is an error! Check it out!", false);
// log.warn('This is a warning message');
// log.warn('This is a warning message', false);
// log.success('This is a success message');

export default log;






export { log }