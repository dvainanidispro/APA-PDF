'use strict';


/** Console logs the incoming fields */
function consolelog(req,res,next){
    console.log('Received a POST request.');
    let formData = req.body;
    console.debug({formData});      // TODO: Να αφαιρεθεί αργότερα. 
    next();
}

export { consolelog }