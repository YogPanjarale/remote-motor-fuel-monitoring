export interface DeviceDoc {
    _id: string
    deviceId: string
    last_seen: string
    json: Json
    ping: string
    switch: "reset" | "off" | "on"
    calibration_table: CalibrationTable
  }
  export interface ApiResponse {
    error?: string
    status: number
    message?: string
    data?: DeviceDoc
  }
  
  export interface CalibrationTable {
    min: number
    max: number
    step: number
    table:{
      [key:string]: number
    }
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
  