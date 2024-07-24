'use strict'

/** Middleware που μετατρέπει τα multiple select πεδία που έρχονται ως ξεχωριστά πεδία 
 * τύπου:   'choices[0]':'option0', 'choices[1]':'option1'
 * σε ένα "array" πεδίο choices */
function multipleSelectParser(req, res, next) {
    const newBody = {};
  
    for (const key in req.body) {
      const match = key.match(/(.*)\[(\d+)\]$/);            // Αν το key είναι της μορφής 'something[number]', 'something[othernumber]', ...
      if (match) {
        const arrayName = match[1];                         // Το μέρος του key πριν το [
        if (!newBody[arrayName]) {
          newBody[arrayName] = [];
        }
        newBody[arrayName].push(req.body[key]);
      } else {
        newBody[key] = req.body[key];
      }
    }
  
    req.body = newBody;
    next();
  }

export { multipleSelectParser };