// nextjs api route

import Joi from "joi";
import { NextApiHandler } from "next";
import { queryApi } from "$lib/influx_api";
const deviceIdSchema = Joi.string().alphanum().max(16).required();
import  clientPromise from "$lib/mongodb";
import { WithId,Document } from "mongodb";

const APIhandler: NextApiHandler = async (req, res) => {
	const id = req.query.id;
	const { error } = deviceIdSchema.validate(id);
	if (error) {
		res.status(400).json({ error: error.message, status: 400 });
		return;
	}
	const client = await clientPromise;
    const coll = client.db("rfms").collection("devices");
    const doc :WithId<Document> = await coll.findOne({ deviceId: id });
    if (!doc) {
        res.status(404).json({ error: "device not found", status: 404 });
        return;
    }
   

	res.json({
		status: "ok",
		data: {
			deviceId: id,
			timestamp: doc.timestamp,
			engine: {
				engineTemp1: doc.temp1,
				engineTemp2: doc.temp2,
				engineTemp3: doc.temp3,
				engineTemp4: doc.temp4,
				lubeOilPressure: doc.lube_oil_pressure,
				engineRpm: doc.rpm, // rpm <1800
			},
			fuelLevel: doc.fuel_sensor_level, //TODO:implement conversion ;current volume in liters
			waterFlowing: doc.water_presence,
			engineRunningHours: "TODO!", //time it since started
			waterFlowVolumeRate: doc.water_flow_volume_rate_pulse, //TODO:implement conversion ;L/hour 
		},
	});
};
export default APIhandler;
