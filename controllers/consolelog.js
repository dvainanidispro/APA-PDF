'use strict';


/** Console logs the incoming fields */
function consolelog(req,res,next){
    console.log('Received a POST request to fill a form.');
    // let formData = req.body;
    // console.debug({formData});      
    next();
}

export { consolelog }