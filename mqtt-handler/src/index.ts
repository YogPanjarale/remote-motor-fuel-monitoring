require("dotenv").config();
import { Point } from "@influxdata/influxdb-client";
import writeApi from "./influx_api";
import { mqtt_client as mqtt } from "./mqtt_client";
import { JSONDocv1 } from "./type";

mqtt.on("connect", () => {
    console.log("[MQTT] connected");
	mqtt.subscribe("rfms/#");
});

mqtt.on("message", (topic, message) => {
	if (topic.indexOf("rfms/") === 0) {
		const [deviceId, tag] = topic.substring(5).split("/");
		if (tag == "json") {
			const data = JSON.parse(message.toString());
			if (data && data.version == "1.0") {
				let d: JSONDocv1 = data;
				let point = new Point("rfms")
					.tag("deviceId", deviceId)
					.intField("temp1", d.temp1)
					.intField("temp2", d.temp2)
					.intField("temp3", d.temp3)
					.intField("temp4", d.temp4)
					.intField("rpm", d.rpm)
					.intField("lube_oil_pressure", d.lube_oil_pressure)
					.booleanField("water_presence", d.water_presence)
					.floatField(
						"water_flow_volume_rate_pulse",
						d.water_flow_volume_rate_pulse
					)
					.floatField("fuel_sensor_level", d.fuel_sensor_level)
					.intField("engine_switch", d.engine_switch)
					.intField("engine_status", d.engine_status)
					.timestamp(new Date());
				writeApi.writePoint(point);
			}
		}
	}
});
