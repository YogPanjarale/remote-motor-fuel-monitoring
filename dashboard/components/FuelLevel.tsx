import { CalibrationTable } from "../lib/types";

const FuelLevel = ({ level, calibration_table }:{level:number,calibration_table:CalibrationTable}) => {
    const {value,percentage} = getFuelLiters(level,calibration_table);
    
	return (
		<h1 className={`text-lg font-semibold text-gray-800 ${percentage<20?"bg-red-500":percentage<50?"bg-yellow-400":"bg-green-500"} w-min whitespace-nowrap p-1 rounded-md`}>
			Fuel level: {value} liters ({percentage}%)  {percentage < 20 ?<span className="bg-white">Low Fuel!!</span>  :"" }
		</h1>
	);
};
export default FuelLevel;
function getFuelLiters(level: number, calibration_table: CalibrationTable) {
    
    // array of size 500
    let table_inv = Array(calibration_table.table.length).fill(0);
    let min = calibration_table.min;
    let max = calibration_table.max;
    let step = calibration_table.step;
    let table_raw = calibration_table.table;
    let prev = 0;
    if (!global.cal_table) {
    for (let i = min ; i <= max ; i+=step) {
        for (let j = i ; j <= i+step ; j++) {
            let diff = j-i;
            let val = table_raw[i];
            let diffval = val-prev;

            table_inv[j] = table_raw[i] + diffval*diff/step;
        }
        prev = table_raw[i] || prev;
    }
    global.cal_table = table_inv;
}else{
    table_inv = global.cal_table;
}
    let table = Array(438).fill(0);
    let table_inv_len = table_inv.length;
    prev = 0;
    for (let i = 0 ; i < table_inv_len ; i++) {
        let val = table_inv[i];
        let diff = val-prev;
        let index = Math.floor(val)
        for (let j = prev ; j < index ; j++) {
            
            table[Math.floor(j)] = i
        }
        // table[index] = val 
        prev = val;
    }

    let index = Math.floor(level);
    let value = table[index];
    let percentage = (value / (table_inv_len)) * 100;
    console.dir({level,value,index,percentage,table,table_inv});
    
    return {
        value,
        percentage: Math.round(percentage)
    };
}
