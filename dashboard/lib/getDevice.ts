import { ApiResponse, DeviceDoc } from "./types";

const dummy = {
	_id: "61ae1297048b05f0b53d179e",
	deviceId: "61646974690a",
	last_seen: new Date("2021-12-06T14:20:30.252Z" ),
	json: {
		engineStatus: "running",
		engineRunningTime: 55,
		engineRpm: 1020,
		engineTemp1: 157,
		engineTemp2: 162,
		engineTemp3: 148,
		engineTempVaccum: 150,
		engineLubeOilPressure: 59,
		waterPresence: true,
		waterFlowRate: 193,
		fuelSensor: 100,
	},
	ping: "1",
	switch: "on",
};
const getDevice = async (id: string):Promise<ApiResponse> => {
    const res = await fetch(`/api/device?id=${id}`);
    return res.json();
};
export default getDevice;
