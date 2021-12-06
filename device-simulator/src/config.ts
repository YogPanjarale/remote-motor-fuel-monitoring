// const topic_root = 'device-simulator/test1';
const config = {
	mqtt: {
		url: "mqtt://do1.yogpanjarale.com:1883",
		port: 1883,
		user: "dev-sim1",
		password: "Pleaseno",
		username: "dev-sim1",
		topics: {
			engineStatus: "es",
			engineRunningTime: "ert",
			engineRpm: "erp",
			engineTemp1: "et1",
			engineTemp2: "et2",
			engineTemp3: "et3",
			engineTempVaccum: "etv",
			engineLubeOilPressure: "elop",
			waterPresence: "wp",
			waterFlowRate: "wfr",
			fuelSensor: "fs",
		},
	},
};
export default config;
