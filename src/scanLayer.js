// Object defined to describe a single "Scan & Match" process.
// Object should describe both the spatial pattern, and the contents of the barcodes being detected.
const SCANNING_PLANS = {
    BLASTOFF: ["TUBES", "LEFT_RACK", "RIGHT_RACK"]
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
    constructor(template_name) {
        this.results = {}
        this.cell_x = LAYER_TEMPLATES[template_name]["cell_x"]
        this.cell_y = LAYER_TEMPLATES[template_name]["cell_y"]
        this.x_offset = LAYER_TEMPLATES[template_name]["x_offset"]
        this.y_offset = LAYER_TEMPLATES[template_name]["y_offset"]
        this.x_gap = LAYER_TEMPLATES[template_name]["x_gap"]
        this.y_gap = LAYER_TEMPLATES[template_name]["y_gap"]
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
        let x_unit = this.cell_x + this.x_gap
        let y_unit = this.cell_y + this.y_gap

        console.log("Scan Layer (Before Applied): " + x.toString() + ", " + y.toString())
        // Correct for Offset
        x -= this.x_offset
        y -= this.y_offset
        console.log("Scan Layer (Offset Applied): " + x.toString() + ", " + y.toString())

        // Isolate point to bounds of a single unit
        let col_idx = Math.floor(x / x_unit) 
        let row_idx = Math.floor(y / y_unit) 
        let dx = x % x_unit 
        let dy = y % y_unit
        
        // Break if either point is past min
        if (x < 0 || y < 0) return false
        // Break if either point falls in the gap
        if (dx > this.cell_x || dy > this.cell_y) return false
        // Break if either point is past max
        if (x > x_unit * this.num_cols || y > y_unit * this.num_rows) return false
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