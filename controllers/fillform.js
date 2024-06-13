'use strict'

import { PDFDocument } from 'pdf-lib';


/** Συμπληρώνει ένα συγκεκριμένο πεδίο της φόρμας με τη συγκεκριμένη τιμή */
function fillField(form, fieldName, fieldValue){

    /** Το πεδίο του PDF */
    let field;
    try{
        field = form.getField(fieldName);
    }catch(e){  // το πεδίο της φόρμας δεν αντιστοιχεί σε πεδίο στο PDF
        return; 
    }
    let fieldType = field.constructor.name;
    // console.log(fieldType);
    
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

/** Συμπληρώνει ένα fillable PDF που βρίσκεται στο pdfLocation με βάση τα στοιχεία μιας φόρμας */
async function fillForm(pdfLocation, formData){
    const pdfBytes = await fetch(pdfLocation).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();
    // const fields = form.getFields();
    for (const [key, value] of Object.entries(formData)) {
        fillField(form, key, value);
    }
    const pdfBytesFilled = await pdfDoc.save();
    return pdfBytesFilled;
}


export { fillForm };