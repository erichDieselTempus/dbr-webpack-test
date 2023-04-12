// Online demo did not build properly, needed to add curly brace around the import
/* Useful Links
 -- https://www.dynamsoft.com/barcode-reader/docs/web/programming/javascript/samples-demos/helloworld-webpack.html
 -- https://www.dynamsoft.com/barcode-reader/docs/web/programming/javascript/user-guide/


document.getElementById('UIElement').appendChild(scanner.getUIElement());

*/

import {BarcodeReader, BarcodeScanner} from "dynamsoft-javascript-barcode";
import {EnumBarcodeFormat} from "dynamsoft-javascript-barcode";
BarcodeScanner.license = 'DLS2eyJoYW5kc2hha2VDb2RlIjoiMTAxNzU1MzczLVRYbFhaV0pRY205cVgyUmljZyIsIm1haW5TZXJ2ZXJVUkwiOiJodHRwczovL21sdHMuZHluYW1zb2Z0LmNvbSIsIm9yZ2FuaXphdGlvbklEIjoiMTAxNzU1MzczIiwiY2hlY2tDb2RlIjoyODA2NjU1NTV9';
BarcodeScanner.engineResourcePath = "https://cdn.jsdelivr.net/npm/dynamsoft-javascript-barcode/dist/";

var pScanner = null;

startCamera()

async function startCamera() {
    try {
        let scanner = await (pScanner = pScanner || BarcodeScanner.createInstance());

        // Can't get API to report cameras, it is returning an empty array.  Ignoring for now
        //  because I suspect it might be a permissions issue that will be influenced by build process.
        /*
        let cameras = await scanner.getAllCameras()
        console.log(cameras)
        */
        let settings = await scanner.getRuntimeSettings();
        await scanner.setResolution(1280, 720);
        let camRes = await scanner.getResolution()
        

        //  Set general decoding settings (These remain unchanged across scanning layers)
        settings.furtherModes.deformationResistingModes = [2, 0, 0, 0, 0, 0, 0, 0];
        settings.deblurModes = [1, 2, 4, 8, 0, 0, 0, 0, 0, 0];
        await scanner.updateRuntimeSettings(settings);
        await scanner.setUIElement(document.getElementById('div-ui-container'));
        // Would it be worth forcing you to wait for a frame where all codes can be read simultaneously?
        // Does this change if we're trying to archive photos from the scan?


        /*
        scanner.onFrameRead = results => {
            //console.log("Barcodes on one frame:");
            for (let result of results) {
                const format = result.barcodeFormat ? result.barcodeFormatString : result.barcodeFormatString_2;
                //console.log(format + ": " + result.barcodeText);
            }
        };
        */
        scanner.onUniqueRead = (txt, result) => {
            check_grid_scan(txt, result, camRes)
        }

        await scanner.show();
        await scanner.pauseScan();
        
        //confirm('Please ensure the camera and scan target are properly aligned, then click "Begin Scanning"')
            
    } catch (ex) {
        //alert(ex.message);
        throw ex;
    }
}



if (document.getElementById('scanner_settings_update_trigger')) {
    document.getElementById('scanner_settings_update_trigger').onclick = async function() {
        try {
            let scanner = await (pScanner = pScanner || BarcodeScanner.createInstance());
            let settings = await scanner.getRuntimeSettings();
            // Critical to recast this value as Number during assignement.
            // console.log(typeof(~~document.getElementById('bc_format_trigger').dataset.value))
            settings.barcodeFormatIds = ~~document.getElementById('scanner_settings_update_trigger').dataset.value;
            settings.region.regionMeasuredByPercentage = 1;
            settings.region.regionLeft = document.getElementById('roi_left_input').value;
            settings.region.regionTop = document.getElementById('roi_top_input').value;
            settings.region.regionRight = document.getElementById('roi_right_input').value;
            settings.region.regionBottom = document.getElementById('roi_bottom_input').value;
            settings.autoFocus = true
            settings.expectedBarcodesCount = ~~document.getElementById("num_cols_input").value *  ~~document.getElementById('num_rows_input').value

            console.log("Barcode Format has been changed to " + document.getElementById('scanner_settings_update_trigger').dataset.value.toString())
            console.log("ROI has been updated")
            console.log("expected BC counted updated", settings.expectedBarcodesCount)
            await scanner.updateRuntimeSettings(settings);
        } catch (ex) {
            alert(ex.message);
            throw ex;
        }
    }
}


if (document.getElementById('scanner_pause_trigger')) {
    document.getElementById('scanner_pause_trigger').onclick = async function() {
        try {
            console.log("Attempting to pause scanner")
            let scanner = await (pScanner = pScanner || BarcodeScanner.createInstance());
            scanner.pauseScan()
        } catch (ex) {
            alert(ex.message);
            throw ex;
        }
    }
}
if (document.getElementById('scanner_resume_trigger')) {
    document.getElementById('scanner_resume_trigger').onclick = async function() {
        try {
            console.log("Attempting to resume scanner")
            let scanner = await (pScanner = pScanner || BarcodeScanner.createInstance());
            scanner.resumeScan()
        } catch (ex) {
            alert(ex.message);
            throw ex;
        }
    }
}
/*
if (document.getElementById('get_cameras')) {
    document.getElementById('get_cameras').onclick = async function() {
        try {

            let scanner = await (pScanner = pScanner || BarcodeScanner.createInstance());
            let cameras = await scanner.getAllCameras()
            console.log(cameras)
        } catch (ex) {
            alert(ex.message);
            throw ex;
        }
    }
}
*/


/* Experimental code written while exploring camera identification and automatic switching.


            if (!navigator.mediaDevices?.enumerateDevices) {
                console.log("enumerateDevices() not supported.");
                } else {
                // List cameras and microphones.
                navigator.mediaDevices
                    .enumerateDevices()
                    .then((devices) => {
                    devices.forEach((device) => {
                        console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
                    });
                    })
                    .catch((err) => {
                    console.error(`${err.name}: ${err.message}`);
                    });
                }
            console.log(scanner.getCapabilities())
            //console.log(scanner.getCurrentCamera())
            const foo = async () => {
                const res = await scanner.getCurrentCamera();
                console.log(res);
              }
              
            foo()
            */
