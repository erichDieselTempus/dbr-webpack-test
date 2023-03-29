// Online demo did not build properly, needed to add curly brace around the import
/* Useful Links
 -- https://www.dynamsoft.com/barcode-reader/docs/web/programming/javascript/samples-demos/helloworld-webpack.html
 -- https://www.dynamsoft.com/barcode-reader/docs/web/programming/javascript/user-guide/


document.getElementById('UIElement').appendChild(scanner.getUIElement());

*/


import {BarcodeScanner} from "dynamsoft-javascript-barcode";
BarcodeScanner.license = 'DLS2eyJoYW5kc2hha2VDb2RlIjoiMTAxNzU1MzczLVRYbFhaV0pRY205cVgyUmljZyIsIm1haW5TZXJ2ZXJVUkwiOiJodHRwczovL21sdHMuZHluYW1zb2Z0LmNvbSIsIm9yZ2FuaXphdGlvbklEIjoiMTAxNzU1MzczIiwiY2hlY2tDb2RlIjoyODA2NjU1NTV9';
BarcodeScanner.engineResourcePath = "https://cdn.jsdelivr.net/npm/dynamsoft-javascript-barcode/dist/";

let pScanner = null;


if (document.getElementById('readBarcode')) {
    document.getElementById('readBarcode').onclick = async function() {
        try {
            //BarcodeScanner.defaultUIElementURL = "./src/dbr.ui.html";
            let scanner = await (pScanner = pScanner || BarcodeScanner.createInstance());
            await scanner.setUIElement(document.getElementById('div-ui-container'));
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