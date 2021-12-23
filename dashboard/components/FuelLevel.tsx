import { CalibrationTable } from "../lib/types";

const FuelLevel = ({ level, calibration_table }:{level:number,calibration_table:CalibrationTable}) => {
    const {value,percentage} = getFuelLiters(level,calibration_table);
	return (
		<h1 className="text-lg font-semibold text-gray-800 bg-red-400 w-min whitespace-nowrap p-1 rounded-md">
			Fuel level: {value} liters ({percentage}%)  {percentage < 20 ?<span className="bg-white">Low Fuel!!</span>  :"" }
		</h1>
	);
};
export default FuelLevel;
function getFuelLiters(level: number, calibration_table: CalibrationTable) {
    
    // array of size 500
    let table = Array(500).fill(0);
    let min = calibration_table.min;
    let max = calibration_table.max;
    let step = calibration_table.step;
    let table_raw = calibration_table.table;
    let prev = 0;
    for (let i = min ; i <= max ; i+=step) {
        for (let j = i ; j <= i+step ; j++) {
            let diff = j-i;
            let val = table_raw[i];
            let diffval = val-prev;

            table[j] = table_raw[i] + diffval*diff/step;
        }
        prev = table_raw[i] || prev;
    }
    let index = Math.floor((level - min) / step);
    let value = table[index];
    let percentage = (value / max) * 100;
    console.dir({level,value,index,percentage,table});
    
    return {
        value,
        percentage: Math.round(percentage)
    };
}
