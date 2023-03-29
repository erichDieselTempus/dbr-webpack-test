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
let result_ele = document.getElementById("result")
console.log(result_ele)
if (document.getElementById('readBarcode')) {
    document.getElementById('readBarcode').onclick = async function() {
        try {
            //BarcodeScanner.defaultUIElementURL = "./src/dbr.ui.html";
            let scanner = await (pScanner = pScanner || BarcodeScanner.createInstance());
            await scanner.setResolution(1280, 720);
            let camRes = await scanner.getResolution()
            
            //await scanner.setVideoFit("cover")
            //await scanner.setResolution(800, 450)
            await scanner.setUIElement(document.getElementById('div-ui-container'));
            scanner.onFrameRead = results => {
                console.log("Barcodes on one frame:");
                for (let result of results) {
                    const format = result.barcodeFormat ? result.barcodeFormatString : result.barcodeFormatString_2;
                    //console.log(format + ": " + result.barcodeText);
                }
            };
            scanner.onUniqueRead = (txt, result) => {
                check_grid_scan(txt, result, camRes)
                result_ele.innerText = camRes
            }
            await scanner.show();
            
        } catch (ex) {
            //alert(ex.message);
            throw ex;
        }
    };
}

if (document.getElementById('activate_ROI')) {
    document.getElementById('activate_ROI').onclick = async function() {
        try {

            let scanner = await (pScanner = pScanner || BarcodeScanner.createInstance());
            let settings = await scanner.getRuntimeSettings();
            settings.region.regionMeasuredByPercentage = 1;
            settings.region.regionLeft = 25;
            settings.region.regionTop = 25;
            settings.region.regionRight = 75;
            settings.region.regionBottom = 75;
            await scanner.updateRuntimeSettings(settings);
        } catch (ex) {
            alert(ex.message);
            throw ex;
        }
    }
}