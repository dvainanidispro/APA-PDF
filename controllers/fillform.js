'use strict'

import { PDFDocument } from 'pdf-lib';

let fillCommands = [
    (form, key, value) => { form.getTextField(key).setText(value) },
    (form, key, value) => { form.getCheckBox(key).check() },
    (form, key, value) => { }   // do nothing
];

 
function fillField(form, fieldName, fieldValue){
    // for (const command of fillCommands) {
    //     try{
    //         command(form, fieldName, fieldValue);
    //         break; // Exit the loop if the command succeeds
    //     }
    //     catch(e){}
    // }
    let field;
    try{
        field = form.getField(fieldName);
    }catch(e){
        return;
    }
    let fieldType = field.constructor.name;
    console.log(fieldType);
    
    switch(fieldType){
        case 'PDFTextField':
            form.getTextField(fieldName).setText(fieldValue);
            break;
        case 'PDFCheckBox':
            form.getCheckBox(fieldName).check();
            break;
        case 'PDFRadioGroup':
            form.getRadioGroup(fieldName).select(fieldValue);
            break;
        default:
            break;
    }
} 

async function fillForm(pdfLocation, fillData){
    const pdfBytes = await fetch(pdfLocation).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();
    // const fields = form.getFields();
    for (const [key, value] of Object.entries(fillData)) {
        // let field = form.getField(key);
        // console.log(field.constructor.name);
        fillField(form, key, value);
    }
    const pdfBytesFilled = await pdfDoc.save();
    return pdfBytesFilled;
}


export { fillForm };