'use strict'

import { PDFDocument, PDFFont, PDFForm } from 'pdf-lib';
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

 
/**
 * Συμπληρώνει ένα συγκεκριμένο πεδίο της φόρμας με τη συγκεκριμένη τιμή 
 * @param {PDFForm} form H φόρμα σε μορφή που την χειρίζεται το pdf-lib form
 * @param {string} fieldName 
 * @param {string|Array<string>} fieldValue 
 * @param {PDFFont} font Η γραμματοσειρά σε μορφή που την χειρίζεται το pdf-lib font
 * @returns {void}
 */
function fillField(form, fieldName, fieldValue, font){
    
    /** Το πεδίο του PDF */
    let field;
    try{
        field = form.getField(fieldName);
    }catch(e){  // το πεδίο της φόρμας δεν αντιστοιχεί σε πεδίο στο PDF
        return; 
    }

    /** Το είδος του πεδίου σύμφωνα με την ονομασία του PDF-LIB */
    let fieldType = field.constructor.name;
    
    fieldValue = (isDate(fieldValue)) ? greekDate(fieldValue) : fieldValue;     // Ειδική μεταχείριση ημερομηνιών
    // console.debug({fieldType,fieldName,fieldValue});            // TODO: Να εμφανίζεται μόνο σε περίπτωση λάθους

    try{
    
        switch(fieldType){
            case 'PDFTextField':
                form.getTextField(fieldName).setText(fieldValue, {font: font});
                field.updateAppearances(font);
                break;
            case 'PDFCheckBox':
                if (fieldValue !="0"){      // κάποιες html φόρμες στέλνουν και με value="0" όταν δεν είναι checked
                    form.getCheckBox(fieldName).check();
                }
                break;
            case 'PDFRadioGroup':
                form.getRadioGroup(fieldName).select(fieldValue, {font: font});
                break;
            case 'PDFDropdown':
                form.getDropdown(fieldName).select(fieldValue, false);
                field.updateAppearances(font);
                break;
            case 'PDFOptionList':    // αυτό παίρνει και array, 
                let listOfValues = (Array.isArray(fieldValue)) ? fieldValue : [fieldValue];
                form.getOptionList(fieldName).select(listOfValues, true); 
                form.getOptionList(fieldName).setOptions(listOfValues, true);   // Δεν λειτουργεί σωστά το προηγούμενο, οπότε αφήνω μόνο τις επιλεγμένες
                field.updateAppearances(font);
                break;
            // case 'PDFButton':
            // case 'PDFSignature':
            default:
                break;
        }

    }catch(e){
        console.error(`Λάθος στο πεδίο ${fieldName}: ${e.message}`);
    }

} 

/**
 * Συμπληρώνει ένα fillable PDF που βρίσκεται στο pdfLocation με βάση τα στοιχεία μιας φόρμας
 * @param {URL} pdfLocation Το public URL του "άδειου" προς συμπλήρωση PDF
 * @param {Object.<string, string>} formData To αντικείμενο με τα δεδομένα μορφής πεδίο:τιμή προς συμπλήρωση
 * @returns {Promise<Uint8Array>} Το συμπληρωμένο PDF σε μορφή Uint8Array
 */
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
            console.error(err);
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