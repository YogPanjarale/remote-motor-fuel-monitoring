export interface Engine { 
    temperature1?:number;
    temperature2?:number;
    temperature3?:number;
    temperature4vacuum?:number;
    rpm?:number;
    cell:"on"|"off";
    runnning:boolean;
}

export interface Device {
    id: string;
    engine : Engine;
    water:number;
    fuel_volume:number;
}
export interface MqttEvent { 
    topic: string;
    payload: string;
}
export interface TemperatureEvent {
    id: string;
    no: number;
    value: number;
}