export interface DeviceDoc {
	_id: string;
	deviceId: string;
	last_seen: string;
	json: Json;
	ping: string;
	switch: "reset" | "off" | "on";
	calibration_table: CalibrationTable;
}
export interface ApiResponse {
	error?: string;
	status: number;
	message?: string;
	data?: DeviceDoc;
}

export interface CalibrationTable {
	min: number;
	max: number;
	step: number;
	table: {
		[key: string]: number;
	};
}

export interface Json {
	engineStatus: string;
	engineRunningTime: number;
	engineRpm: number;
	engineTemp1: number;
	engineTemp2: number;
	engineTemp3: number;
	engineTempVaccum: number;
	engineLubeOilPressure: number;
	waterPresence: boolean;
	waterFlowRate: number;
	fuelSensor: number;
}

const d = {
	deviceId: "0x0001",
	engine_status: 1,
	engine_switch: 1,
	fuel_sensor_level: 92.92108916620504,
	lube_oil_pressure: 56,
	rpm: 361,
	temp1: 32,
	temp2: 34,
	temp3: 32,
	temp4: 35,
	version: "1.0",
	water_flow_volume_rate_pulse: 3.7,
	water_presence: false,
};
