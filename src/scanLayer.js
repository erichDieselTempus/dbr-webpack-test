class ScanLayer {
    constructor(template_name) {
        this.results = {}

        if (template_name == "CORNERS") {
            this.cell_x = 80;
            this.cell_y = 80;
            this.x_offset = 55;
            this.y_offset = 0;
            this.x_gap = 400;
            this.y_gap = 200;
            this.num_rows = 2;
            this.num_cols = 2;
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
    }

    resetResultsList() {
        this.results = {}
        for (let i = 0; i < this.num_rows * this.num_cols; i++) {
            this.results[i + 1] = ""
        }
        this.pushResultToBrowser()
    }
    
    pushResultToBrowser() {
        let resultString = ""
        for (let key in this.results) {
            resultString += key.toString() + ": " + this.results[key].toString() + "\n"
        }
        if (document.getElementById("result_list")) {
            document.getElementById("result_list").innerText = resultString
        }
    }
    getCellIndexAt(x,y) {
        //Indexes left to right, then top to bottom starting at 1.
        //1 is start index for compatibility with spreadsheets?
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
            this.pushResultToBrowser()
            return cell_index
        }
        return false
    }

}