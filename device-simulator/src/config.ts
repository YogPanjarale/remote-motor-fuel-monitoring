const topic_root = 'device-simulator/test1';
const config = {
    mqtt:{
        url: "mqtt://do1.yogpanjarale.com:1883",
        port: 1883,
        user: "dev-sim1",
        password: "Pleaseno",
        username: "dev-sim1",
        topics:{
            "root": topic_root,
            "engineRpm": `${topic_root}/engine-rpm`,
            "engineTemp1": `${topic_root}/engine-temp-1`,
            "engineTemp2": `${topic_root}/engine-temp-2`,
            "engineTemp3": `${topic_root}/engine-temp-3`,
            "engineTempVaccum": `${topic_root}/engine-temp-vaccum`,
            "engineLubeOilPressure": `${topic_root}/engine-lube-oil-pressure`,
            "waterPresence": `${topic_root}/water-presence`,
            "waterFlowRate": `${topic_root}/water-flow-rate`,
            "fuelSensor": `${topic_root}/fuel-sensor`,
            "engineStatus": `${topic_root}/engine-status`,
        }
    }
}
export default config;