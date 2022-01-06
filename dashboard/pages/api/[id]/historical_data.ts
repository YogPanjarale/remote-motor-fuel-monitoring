// nextjs api route

import Joi from "joi";
import { NextApiHandler } from "next";
import { queryApi, query as q } from "$lib/influx_api";
const deviceIdSchema = Joi.string().alphanum().max(16).required();
import clientPromise from "$lib/mongodb";
import { WithId, Document } from "mongodb";

const APIhandler: NextApiHandler = async (req, res) => {
	const id = req.query.id;
	const startTime = req.query.startTime;
	const endTime = req.query.endTime;
	const { error } = deviceIdSchema.validate(id);
	if (error) {
		res.status(400).json({ error: error.message, status: 400 });
		return;
	}
	// const client = await clientPromise;
	// const coll = client.db("rfms").collection("devices");
	// const doc: WithId<Document> = await coll.findOne({ deviceId: id });
	// if (!doc) {
	// 	res.status(404).json({ error: "device not found", status: 404 });
	// 	return;
	// }
	let queryBuilder = (field: string,func:string) => `
    from(bucket: "rfms")
  |> range(start: ${startTime}, stop: ${endTime})
  |> filter(fn: (r) => r["_measurement"] == "rfms")
  |> filter(fn: (r) => r["_field"] == "${field}")
  |> ${func}()
  |> yield(name: "${func} of ${field}")
    `;
	let data = {
		deviceId: id,
		timestamp_start: startTime,
		timestamp_end: endTime,
		engine: {
			engineTemp1: {
				min: 20,
				max: 170,
			},
			engineTemp2: {
				min: 20,
				max: 170,
			},
			engineTemp3: {
				min: 20,
				max: 170,
			},
			engineTemp4: {
				min: 20,
				max: 170,
			},
			engineRunningHours: "TODO", //TODO time it ran in start and end period
			lubeOilPressure: {
				min: 0,
				max: 100,
			},
			engineRpm: {
				min: 0,
				max: 16000,
			},
		},
		fuelLevel: {
			//in liters
			min: 0,
			max: 243,
		},
		fuelConsumption: "TODO", //TODO in liters
		waterFlowVolumeRate: {
			// L/hour
			min: 50, // minimum for an the hour
			max: 100, // minimum for an the hour
		},
		waterFlowVolume: 1000, // L
		waterPresentForNoOfHours: "TODO", //TODO hours
	};
	const minMaxFeilds = [
		"temp1",
		"temp2",
		"temp3",
		"temp4",
		"lube_oil_pressure",
		"rpm",
		"fuel_sensor_level",
		"water_flow_volume_rate_pulse",
	];
    const qb =async (k,f)=>(await q(queryBuilder(k,f)))[0]._value; 
	Promise.all([
        async()=>data.engine.engineRpm.min =await qb("rpm","min") ,
        async()=> data.engine.engineRpm.max = await qb("rpm","max"),
        async()=> data.engine.engineTemp1.min = await qb("temp1","min"),
        async()=> data.engine.engineTemp1.max = await qb("temp1","max"),
        async()=> data.engine.engineTemp2.min = await qb("temp2","min"),
        async()=> data.engine.engineTemp2.max =  await qb("temp2","max"),
        async()=> data.engine.engineTemp3.min = await qb("temp3","min"),
        async()=> data.engine.engineTemp3.max = await qb("temp3","max"),
        async()=> data.engine.engineTemp4.min =   await qb("temp4","min"),
        async()=> data.engine.engineTemp4.max = await qb("temp4","max"),
        async()=> data.engine.lubeOilPressure.min = await qb("lube_oil_pressure","min"),
        async()=> data.engine.lubeOilPressure.max = await qb("lube_oil_pressure","max"),
        // data.engine.engineRunningHours = await q(queryBuilder("engine_running_hours","sum")),
        async()=>data.fuelLevel.min = await qb("fuel_sensor_level","min"),
        async()=>data.fuelLevel.max = await qb("fuel_sensor_level","max"),
        async()=>data.waterFlowVolumeRate.min = await qb("water_flow_volume_rate_pulse","min"),
        async()=>data.waterFlowVolumeRate.max = await qb("water_flow_volume_rate_pulse","max"),
        // data.waterFlowVolume = await q(queryBuilder("water_flow_volume","sum")),
        // data.waterPresentForNoOfHours = await q(queryBuilder("water_present_for_no_of_hours","sum")),

    ]).then(() => {
		res.json({
			status: "ok",
			data: data,
		});
	});

	// res.json({
	// 	status: "ok",
	// 	data: {
	// 		deviceId: id,
	// 		timestamp: doc.timestamp,
	// 		engine: {
	// 			engineTemp1: doc.temp1,
	// 			engineTemp2: doc.temp2,
	// 			engineTemp3: doc.temp3,
	// 			engineTemp4: doc.temp4,
	// 			lubeOilPressure: doc.lube_oil_pressure,
	// 			engineRpm: doc.rpm, // rpm <1800
	// 		},
	// 		fuelLevel: doc.fuel_sensor_level, //TODO:implement conversion ;current volume in liters
	// 		waterFlowing: doc.water_presence,
	// 		engineRunningHours: "TODO!", //time it since started
	// 		waterFlowVolumeRate: doc.water_flow_volume_rate_pulse, //TODO:implement conversion ;L/hour
	// 	},
	// });
};
export default APIhandler;
