'use strict';


/** Validates req.body.ApiKey */
function validateKey(req,res,next){
    if (!req.body.ApiKey) {
        let message = "API Key missing";
        console.warn(message);
        return res.status(401).send(message);
    } else if (req.body.ApiKey !== process.env.PDF_API_KEY) {
        let message = "Invalid API Key";
        console.warn(message);
        return res.status(401).send(message);
    } else {
        next();
    }
}

export { validateKey }