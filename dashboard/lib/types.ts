export interface DeviceDoc {
    _id: string
    deviceId: string
    last_seen: string
    json: Json
    ping: string
    switch: string
  }
  export interface ErrorResponse {
    error: string
    status: number
  }
  
  
  export interface Json {
    engineStatus: string
    engineRunningTime: number
    engineRpm: number
    engineTemp1: number
    engineTemp2: number
    engineTemp3: number
    engineTempVaccum: number
    engineLubeOilPressure: number
    waterPresence: boolean
    waterFlowRate: number
    fuelSensor: number
  }
  