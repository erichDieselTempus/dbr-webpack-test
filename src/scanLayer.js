// Object defined to describe a single "Scan & Match" process.
// Object should describe both the spatial pattern, and the contents of the barcodes being detected.
const SCANNING_PLANS = {
    BLASTOFF: ["TUBES", "LEFT_RACK", "RIGHT_RACK"]
}



const alt_LAYER_TEMPLATES = {

}
const LAYER_TEMPLATES = {
    TRAY_ID: {
        cell_x: 75,
        cell_y: 75,
        x_offset: 280,
        y_offset: 135,
        x_gap: 0,
        y_gap: 0,
        num_rows: 1,
        num_cols: 1,
        bc_format: 0x8000000,  // DataMatrix
    },
    TUBES: {
        cell_x: 35,
        cell_y: 140,
        x_offset: 285,
        y_offset: 5,
        x_gap: 0,
        y_gap: 55,
        num_rows: 2,
        num_cols: 2,
        bc_format: 0x3007FF,  // ONED (aka One-D aka broad category for linear codes)
    },
    LEFT_RACK: {
        cell_x: 8,
        cell_y: 13,
        x_offset: 4,
        y_offset: 1,
        x_gap: 1.5,
        y_gap: 4,
        num_rows: 6,
        num_cols: 4,
        bc_format: 0x8000000,  // DataMatrix
    },
    RIGHT_RACK: {
        cell_x: 50,
        cell_y: 50,
        x_offset: 370,
        y_offset: 10,
        x_gap: 9,
        y_gap: 9,
        num_rows: 6,
        num_cols: 4,
        bc_format: 0x8000000,  // DataMatrix
    }
}

class ScanLayer {
    constructor(template_name, cameraResolution, displayResolution) {
        // Load template settings into scan layer and calculate their Percentage based values.
        // Template Pct values are reported 0-100 and must be converted to 0-1 for multiplication.
        // This convention was selected because the scanner takes percentages as 0-100, and the values
        // are a bit more legible in the templates?

        // Can also check if the template is "too large" during construction if needed?
        this.results = {}
        this.display_width = displayResolution[0]
        this.display_height = displayResolution[1]
        this.cam_width = cameraResolution[0]
        this.cam_height = cameraResolution[1]
        // Set Cell Size
        this.cell_x_pct = LAYER_TEMPLATES[template_name]["cell_x"]
        this.cell_x_px = this.cell_x_pct * this.display_width/100
        this.cell_y_pct = LAYER_TEMPLATES[template_name]["cell_y"]
        this.cell_y_px = this.cell_y_pct * this.display_height/100
        // Set Offsets
        this.x_offset_pct = LAYER_TEMPLATES[template_name]["x_offset"]
        this.x_offset_px = this.x_offset_pct * this.display_width/100
        this.y_offset_pct = LAYER_TEMPLATES[template_name]["y_offset"]
        this.y_offset_px = this.y_offset_pct * this.display_height/100
        // Set gaps
        this.x_gap_pct = LAYER_TEMPLATES[template_name]["x_gap"]
        this.x_gap_px = this.x_gap_pct * this.display_width/100
        this.y_gap_pct = LAYER_TEMPLATES[template_name]["y_gap"]
        this.y_gap_px = this.y_gap_pct * this.display_height/100
        // Misc.
        this.num_rows = LAYER_TEMPLATES[template_name]["num_rows"]
        this.num_cols = LAYER_TEMPLATES[template_name]["num_cols"]     
        this.bc_format = LAYER_TEMPLATES[template_name]["bc_format"]
        this.resetResultsList()
       

        // Setup universal and derived parameters
        this.resetResultsList()
        this.scan_complete = false
        this.num_codes_scanned = 0
        this.num_codes_expected = this.num_rows * this.num_cols
        this.prohibited_locations = []
    }

    resetResultsList() {
        // Clear result list and rebuild with appropriate content for active ScanningLayer
        this.results = {}
        for (let i = 0; i < this.num_rows * this.num_cols; i++) {
            this.results[i + 1] = ""
        }
        this.pushResultToBrowser()
    }
    
    pushResultToBrowser() {
        // Should probably change this to provide return a string and let the user decide what to do with it
        let resultString = ""
        console.log(this.results)
        for (let key in this.results) {
            resultString += key.toString() + ": " + this.results[key].toString() + "\n"
        }
        if (document.getElementById("result_list")) {
            document.getElementById("result_list").innerText = resultString
        }
    }
    getCellIndexAt(x,y) {
        // Returns false if point is not in a target region. otherwise returns an integer index.
        // Indexes are countedleft to right, then top to bottom starting at 1.
        // 1 is start index for compatibility with spreadsheets?

        let x_unit_px = (this.cell_x_px + this.x_gap_px)
        let y_unit_px = (this.cell_y_px + this.y_gap_px)

        console.log("Scan Layer (Before Applied): " + x.toString() + ", " + y.toString())
        // Correct for Offset
        x -= this.x_offset_px 
        y -= this.y_offset_px
        console.log("Scan Layer (Offset Applied): " + x.toString() + ", " + y.toString())

        // Isolate point to bounds of a single unit
        let col_idx = Math.floor(x / x_unit_px) 
        let row_idx = Math.floor(y / y_unit_px) 
        let dx = x % x_unit_px 
        let dy = y % y_unit_px
        
        // Break if either point is past min
        if (x < 0 || y < 0) return false
        // Break if either point falls in the gap
        if (dx > this.cell_x || dy > this.cell_y) return false
        // Break if either point is past max
        if (x > x_unit_px * this.num_cols || y > y_unit_px * this.num_rows) return false
        return (row_idx * this.num_cols) + col_idx + 1
    }

    checkNewScan(camera_x, camera_y, scale_factor, txt) {
        let cell_index = this.getCellIndexAt(camera_x * scale_factor, camera_y * scale_factor)
        if (cell_index) {
            this.results[cell_index] = txt
            console.log("Barcode registered with Scan Layer: " + txt)
            console.log("   - Cell IndexX " + cell_index.toString())
            if (this.getResultCount()== this.num_codes_expected) {this.scan_complete = true}
            this.pushResultToBrowser()
            return cell_index
        }
        return false
    }

    getResultCount() {
        let count = 0
        for (let key in this.results) {
            if (this.results[key].toString() != "") {
                count += 1
            }
        }
        return count
    }

    setDisplaySize(w,h) {
        this.display_width = ~~w
        this.display_height = ~~h
    }
}


// Old templates

 /*
        else if (template_name == "CORNERS") {
            this.cell_x = 80;
            this.cell_y = 80;
            this.x_offset = 55;
            this.y_offset = 0;
            this.x_gap = 400;
            this.y_gap = 200;
            this.num_rows = 2;
            this.num_cols = 2;            
            this.bc_format = 0x8000000;  // DataMatrix
            this.resetResultsList()
        }
        
        else if (template_name == "SIX-BY-FOUR") {
            this.cell_x = 70;
            this.cell_y = 70;
            this.x_offset = 60;
            this.y_offset = 10;
            this.x_gap = 25;
            this.y_gap = 20;
            this.num_rows = 4;
            this.num_cols = 6;
            this.bc_format = 0x8000000;  // DataMatrix
            this.resetResultsList()
        }
        else if (template_name == "SMALL-SIX-BY-FOUR") {
            this.cell_x = 40;
            this.cell_y = 40;
            this.x_offset = 170;
            this.y_offset = 75;
            this.x_gap = 15;
            this.y_gap = 15;
            this.num_rows = 4;
            this.num_cols = 6;
            this.bc_format = 0x8000000;  // DataMatrix
            this.resetResultsList()
        }
        else {// Default Settings
            this.cell_x = 50;
            this.cell_y = 50;
            this.x_offset = 100;
            this.y_offset = 20;
            this.x_gap = 5;
            this.y_gap = 80;
            this.num_rows = 2;
            this.num_cols = 4;
            this.resetResultsList()
        }
        */