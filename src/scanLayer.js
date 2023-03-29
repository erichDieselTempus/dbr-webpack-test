class ScanLayer {
    constructor(template_name) {
        if (template_name == "CORNERS") {
            this.cell_x = 80;
            this.cell_y = 80;
            this.x_offset = 20;
            this.y_offset = 20;
            this.x_gap = 600;
            this.y_gap = 250;
            this.num_rows = 2;
            this.num_cols = 2;
        }
        else if (template_name == "SIX-BY-FOUR") {
            this.cell_x = 80;
            this.cell_y = 80;
            this.x_offset = 20;
            this.y_offset = 20;
            this.x_gap = 20;
            this.y_gap = 20;
            this.num_rows = 4;
            this.num_cols = 6;
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
        }
    }

    getCellIndexAt(x,y) {
        //Indexes left to right, then top to bottom starting at 1.
        //1 is start index for compatibility with spreadsheets?
        let x_unit = this.cell_x + this.x_gap
        let y_unit = this.cell_y + this.y_gap
        // Isolate point to bounds of a single unit

        let col_idx = Math.floor(x / x_unit) 
        let row_idx = Math.floor(y / y_unit) 
        let dx = x % x_unit 
        let dy = y % y_unit
        console.log(col_idx,row_idx)
        console.log("Click at: " + x.toString() + ", " + y.toString())
        console.log("Change is: " + dx.toString() + ", " + dy.toString())
        // Break if either point falls in the gap
        if (dx > this.cell_x || dy > this.cell_y) return false
        
        return (row_idx * this.num_cols) + col_idx + 1
    }

}