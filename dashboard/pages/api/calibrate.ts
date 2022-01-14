import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

type CalibrateRequest = {
	fuelLevel: number[];
	sensorReading: number[];
};

const handler: NextApiHandler = (req: NextApiRequest, res: NextApiResponse) => {
	const { fuelLevel, sensorReading } = req.body as CalibrateRequest;
    let x = [...sensorReading];
	let y= [...fuelLevel];
    /**
     * Sensor Reading
     */
    let rx = Array(Math.max(...x)).fill(0);
    /**
     * Fuel Level
     */
    let ry = Array(Math.max(...x)).fill(0); 

    for (let i = 0; i < x.length; i++) {
        let m = x[i];
        let next_m = i<x.length?x[i+1]:x[i];
        for (let j = m ; j < next_m; j++) {
            let diff = next_m - m;
            let ratio = (j - m) / diff;
            let y_val = y[i] + (y[i+1] - y[i]) * ratio;
            ry[j] = y_val;
            rx[j] = j;
        }
    }
    
	res.status(200).json({
		message: "Calibration successful",
		data: ry

	});
};

export default handler;

// Utils
function range(start?: number, end?: number, step: number = 1): number[] {
	if (start === undefined) {
		start = 0;
	}
	if (end === undefined) {
		end = start;
		start = 0;
	}
	let arr = [];
	for (let i = start; i <= end; i += step) {
		arr.push(i);
	}
	return arr;
}
