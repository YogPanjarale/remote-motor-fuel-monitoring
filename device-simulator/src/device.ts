// import { AsyncMqttClient } from "async-mqtt";
import { AsyncMqttClient } from "async-mqtt";
import { randomUUID } from "crypto";
import random from "random";
import config from "./config";
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
    public fuelFilled :number=0;
    public fuelDrained :number=0;
    public lastFuelSensor:number=0;
	constructor(public mqtt: AsyncMqttClient, id?: string) {
		this.id = id || randomUUID();
		const toSubscribe = ["switch","drainFuel","fillFuel"];
		// mqtt.subscribe(`dev-sim/${this.id}/switch`);
		toSubscribe.forEach((topic) => {
			mqtt.subscribe(`dev-sim/${this.id}/${topic}`);
		});
		this.fuelSensor = random.int(100, 1024);
		this.lastFuelSensor=this.fuelSensor;
		// this.fuelFill(1024);
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
        if (this.fuelSensor-this.lastFuelSensor >4){
            this.fuelFilled+=this.fuelSensor-this.lastFuelSensor;
            this.publish("fuelFilled",this.fuelFilled);
        }
        else if (this.fuelSensor-this.lastFuelSensor < -4){
            this.fuelDrained+=this.lastFuelSensor-this.fuelSensor;
            this.publish("fuelDrained",this.fuelDrained);
        }

        this.lastFuelSensor=this.fuelSensor;
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

	async fuelFill(no: number) {
		console.log(`${this.id} fuel fill ${no}`);
		await this.publish("fuelFilled",no.toString())
		this.fuelSensor = clamp(this.fuelSensor + no, 0, 1024);
	}
    async fuelDrain(no:number){
        await this.publish("fuelDrained",no.toString())
		console.log(`${this.id} fuel drain ${no}`);
        this.fuelSensor = clamp(this.fuelSensor - no, 0, 1024);
    }
	async publish(key: string, value: any) {
		console.log("key: ",key);
		
		await this.mqtt.publish(
			`dev-sim/${this.id}/${key}`,
			key=="json"?JSON.stringify(value):value
		);
	}
	async publishAll() {
		Promise.all([
			this.publish("json", this.makeJSON()),
		]).then(() => {
			console.log("published");
		});
	}
	makeJSON(){
		const {engineStatus,engineRunningTime,engineRpm,engineTemp1,engineTemp2,engineTemp3,engineTempVaccum,engineLubeOilPressure,waterPresence,waterFlowRate,fuelSensor} = config.mqtt.topics
		// const _switch = "switch";
		return {
			[engineStatus]: this.engineStatus,
			[engineRunningTime]: this.engineRunningTime,
			[engineRpm]: this.engineRpm,
			[engineTemp1]: this.engineTemp1,
			[engineTemp2]: this.engineTemp2,
			[engineTemp3]: this.engineTemp3,
			[engineTempVaccum]: this.engineTempVaccum,
			[engineLubeOilPressure]: this.engineLubeOilPressure,
			[waterPresence]: this.waterPresence,
			[waterFlowRate]: this.waterFlowRate,
			[fuelSensor]: this.fuelSensor,
			switch: this.switch,
		}
	}
}
export { Device };
