// Online demo did not build properly, it was only importing the Barcode Scanner Object.
// Resolved by importing entire module and prepending dbr to all BarcodeScanner references.

import * as dbr from "dynamsoft-javascript-barcode";
dbr.BarcodeScanner.license = 'DLS2eyJoYW5kc2hha2VDb2RlIjoiMTAxNzU1MzczLVRYbFhaV0pRY205cVgyUmljZyIsIm1haW5TZXJ2ZXJVUkwiOiJodHRwczovL21sdHMuZHluYW1zb2Z0LmNvbSIsIm9yZ2FuaXphdGlvbklEIjoiMTAxNzU1MzczIiwiY2hlY2tDb2RlIjoyODA2NjU1NTV9';
dbr.BarcodeScanner.engineResourcePath = "https://cdn.jsdelivr.net/npm/dynamsoft-javascript-barcode/dist/";

let pScanner = null;
if (document.getElementById('readBarcode')) {
    document.getElementById('readBarcode').onclick = async function() {
        try {
            let scanner = await (pScanner = pScanner || dbr.BarcodeScanner.createInstance());
            scanner.onFrameRead = results => {
                console.log("Barcodes on one frame:");
                for (let result of results) {
                    const format = result.barcodeFormat ? result.barcodeFormatString : result.barcodeFormatString_2;
                    console.log(format + ": " + result.barcodeText);
                }
            };
            scanner.onUniqueRead = (txt, result) => {
                alert(txt);
                console.log("Unique Code Found: " + result);
            }
            await scanner.show();
        } catch (ex) {
            alert(ex.message);
            throw ex;
        }
    };
}