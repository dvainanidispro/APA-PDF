'use strict'

import { PDFDocument } from 'pdf-lib';
import fs from 'fs';

import fontkit from '@pdf-lib/fontkit'
// const fontLocation = './public/fonts/OpenSans-Regular.ttf';
const fontLocation = './public/fonts/Ubuntu-R.ttf';     // ΠΡΟΣΟΧΗ! Να είναι path σχετικό με το κύριο script που τρέχει (server.js)
const fontBytes = fs.readFileSync(fontLocation);


/** Ελέγχει αν η τιμή το πεδίου είναι ημερομηνία */
function isDate(value) {
    const dateRegex = /^\d{4}-\d{1,2}-\d{1,2}( .+)?$/;
    return dateRegex.test(value);
}
/** Λαμβάνει ένα string με ημερομηνία και επιστρέφει την ημερομηνία με Ελληνικό format */
function greekDate(dateAsString){
    return (new Date(dateAsString)).toLocaleDateString('el-GR');
}

 
/** Συμπληρώνει ένα συγκεκριμένο πεδίο της φόρμας με τη συγκεκριμένη τιμή */
function fillField(form, fieldName, fieldValue, font){
    
    /** Το πεδίο του PDF */
    let field;
    try{
        field = form.getField(fieldName);
    }catch(e){  // το πεδίο της φόρμας δεν αντιστοιχεί σε πεδίο στο PDF
        return; 
    }

    let fieldType = field.constructor.name;
    
    fieldValue = (isDate(fieldValue)) ? greekDate(fieldValue) : fieldValue;     // Ειδική μεταχείριση ημερομηνιών
    console.debug({fieldType,fieldName,fieldValue});            // TODO: Να αφαιρεθεί

    try{
    
        switch(fieldType){
            case 'PDFTextField':
                form.getTextField(fieldName).setText(fieldValue, {font: font});
                field.updateAppearances(font);
                break;
            case 'PDFCheckBox':
                form.getCheckBox(fieldName).check();
                break;
            case 'PDFRadioGroup':
                form.getRadioGroup(fieldName).select(fieldValue, {font: font});
                break;
            case 'PDFDropdown':
                form.getDropdown(fieldName).select(fieldValue, {font: font});
                break;
            // case 'PDFOptionList':            // αυτό παίρνει και array
            // case 'PDFButton':
            // case 'PDFSignature':
            default:
                break;
        }

    }catch(e){
        console.error(`Λάθος στο πεδίο ${fieldName}: ${e.message}`);
    }

} 

/** Συμπληρώνει ένα fillable PDF που βρίσκεται στο pdfLocation με βάση τα στοιχεία μιας φόρμας */
async function fillForm(pdfLocation, formData){

    let pdfBytes = await fetch(pdfLocation)
        .then(response => {
            if (!response.ok) {
                throw new Error('PDF template was not found');
            }
            return response;
        })
        .then(res => res.arrayBuffer())
        .catch(err => {         // error in any previous step
            console.log(err);
            return false;
        });
    if(!pdfBytes){ return false }
    
    const pdfDoc = await PDFDocument.load(pdfBytes);
    pdfDoc.registerFontkit(fontkit);
    const unicodeFont = await pdfDoc.embedFont(fontBytes);
    const form = pdfDoc.getForm();

    // const fields = form.getFields();
    for (const [key, value] of Object.entries(formData)) {
        fillField(form, key, value, unicodeFont);
    }
    const filledPDF = await pdfDoc.save();
    return filledPDF;
}


export { fillForm };