// import { AsyncMqttClient } from "async-mqtt";
import { AsyncMqttClient } from "async-mqtt";
import { randomUUID } from "crypto";
import random from "random";
import { clamp } from "./utils";
class Device {
	public id: string;
	public switch: "on" | "off" | "reset" = "off"; //cannot on after off until reset
	public engineRpm: number = 0;
	public engineTemp1: number = 0;
	public engineTemp2: number = 0;
	public engineTemp3: number = 0;
	public engineTempVaccum: number = 0;
	public engineLubeOilPressure: number = 0;
	public waterPresence: boolean = false;
	public waterFlowRate: number = 0;
	public fuelSensor: number = 0;
	public engineStatus: "running" | "stopped" = "stopped";
	public engineRunningTime: number = 0;

	constructor(public mqtt: AsyncMqttClient, id?: string) {
		this.id = id || randomUUID();
		mqtt.subscribe(`dev-sim/${this.id}/switch`);
		this.fuelFill(1024);
		mqtt.on("message", (topic, message) => {
			if (topic === `dev-sim/${this.id}/switch`) {
				switch (message.toString()) {
					case "on":
						this.switch = "on";
						break;
					case "off":
						this.switch = "off";
						break;
					case "reset":
						this.switch = "reset";
						break;
					default:
						break;
				}
				console.log(
					`${this.id} incomming ${message.toString()} ;switched to ${
						this.switch
					}`
				);
			}
			else if (topic === `dev-sim/${this.id}/fillFuel`) {
				this.fuelFill(Number(message.toString()));
			}
            else if (topic === `dev-sim/${this.id}/drainFuel`) {
                this.fuelDrain(Number(message.toString()));
            }

		});
	}
	loop() {
		// console.log(this);
		switch (this.switch) {
			case "on":
				this.engineStatus = "running";
				this.engineRpm +=
					this.engineRpm < 1000
						? random.int(50, 150)
						: random.int(-20, 20);
				this.engineTemp1 +=
					this.engineTemp1 < 150 ? random.int(15) : random.int(-2, 2);
				this.engineTemp2 +=
					this.engineTemp2 < 150 ? random.int(15) : random.int(-2, 2);
				this.engineTemp3 +=
					this.engineTemp3 < 150 ? random.int(15) : random.int(-2, 2);
				this.engineTempVaccum +=
					this.engineTempVaccum < 150
						? random.int(10)
						: random.int(-2, 2);
				this.engineLubeOilPressure +=
					this.engineLubeOilPressure < 60
						? random.int(5)
						: random.int(-1, 1);
				this.waterPresence =
					random.int(0, 10) == 9
						? !this.waterPresence
						: this.waterPresence;
				this.waterFlowRate +=
					this.waterFlowRate < 200
						? random.int(0, 10)
						: random.int(-1, 1);
                if (random.int(100)>50){
                    this.fuelSensor  -=1;
                }
					// random.int(-1, 0) == 0 ? random.int(0, 1) : 0;
				this.engineRunningTime += 1;
				if (this.fuelPercentage < 10) {
					this.stop("low fuel");
				}
				this.publishAll();
				break;
			case "off":
				this.engineRpm -= this.engineRpm > 25 ? random.int(10, 25) : 0;
				this.engineTemp1 -= this.engineTemp1 > 25 ? random.int(15) : 0;
				this.engineTemp2 -= this.engineTemp2 > 25 ? random.int(15) : 0;
				this.engineTemp3 -= this.engineTemp3 > 25 ? random.int(15) : 0;
				this.engineTempVaccum -=
					this.engineTempVaccum > 0 ? random.int(10) : 0;
				this.engineLubeOilPressure -=
					this.engineLubeOilPressure > 0 ? random.int(5) : 0;
				this.waterPresence =
					random.int(0, 100) == 99
						? !this.waterPresence
						: this.waterPresence;
				this.waterFlowRate -=
					this.waterFlowRate > 0 ? random.int(0, 10) : 0;
				// this.engineRunningTime -= 1;
				this.publishAll();
				break;
			default:
				break;
		}
		this.ping();
	}
    fuelMonitor(){

    }
	get fuelPercentage() {
		return (this.fuelSensor * 1024) / 100;
	}

	stop(message: string) {
		this.engineStatus = "stopped";
		this.engineRunningTime = 0;
		this.switch = "off";
		this.publish("message", message);
		this.publishAll();
	}

	ping() {
		this.publish("ping", "1");
	}

	fuelFill(no: number) {
		this.fuelSensor = clamp(this.fuelSensor + no, 0, 1024);
		this.publish("fuelFill",no)
	}
    fuelDrain(no:number){
        this.fuelSensor = clamp(this.fuelSensor - no, 0, 1024);
        this.publish("fuelDrain",no)
    }
	async publish(key: string, value: any) {
        if (key=="json"){
            console.log(`${this.id} ${key} ${value["fuelSensor"]}`);
        }
        // console.log(`${this.id} ${key} ${value}`);
        
		// if (key===""){
		//     this.mqtt.publish(`dev-sim/${this.id}/`, JSON.stringify(this));
		// }
		await this.mqtt.publish(
			`dev-sim/${this.id}/${key}`,
			JSON.stringify(value)
		);
		// console.log(`${this.id} published ${key} : ${value}`);
	}
	async publishAll() {
        
		Promise.all([
			this.publish("json", {
				engineStatus: this.engineStatus,
				engineRunningTime: this.engineRunningTime,
				engineRpm: this.engineRpm,
				engineTemp1: this.engineTemp1,
				engineTemp2: this.engineTemp2,
				engineTemp3: this.engineTemp3,
				engineTempVaccum: this.engineTempVaccum,
				engineLubeOilPressure: this.engineLubeOilPressure,
				waterPresence: this.waterPresence,
				waterFlowRate: this.waterFlowRate,
				fuelSensor: this.fuelSensor,
				switch: this.switch,
			}),
			// this.publish("switch", this.switch),
			// this.publish("engineRpm", this.engineRpm),
			// this.publish("engineTemp1", this.engineTemp1),
			// this.publish("engineTemp2", this.engineTemp2),
			// this.publish("engineTemp3", this.engineTemp3),
			// this.publish("engineTempVaccum", this.engineTempVaccum),
			// this.publish("engineLubeOilPressure", this.engineLubeOilPressure),
			// this.publish("waterPresence", this.waterPresence),
			// this.publish("waterFlowRate", this.waterFlowRate),
			// this.publish("fuelSensor", this.fuelSensor),
			// this.publish("engineStatus", this.engineStatus),
			// this.publish("engineRunningTime", this.engineRunningTime),
		]).then(() => {
			console.log("published");
		});
	}
}
export { Device };
