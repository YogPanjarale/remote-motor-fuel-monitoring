interface Engine { 
    temperature1:number;
    temperature2:number;
    temperature3:number;
    rpm:number;
    cell:"on"|"off";
}

interface Device {
    id: string;
    engine : Engine;
}
interface MqttEvent { 
    topic: string;
    payload: string;
}