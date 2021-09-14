export interface Engine
{
    temp1 :number;        // Engine Temperature 1
    temp2 :number;        // Engine Temperature 2
    temp3 :number;        // Engine Temperature 3
    temp4_vacuum :number; // Engine Vacuum Pump Temperature 4
    rpm :number;
    running_hours :number;
    lube_oil_pressure :number;
};
export interface Fuel
{
    fuel_volume:number;            //- Measurement of exact volume in real time
    fuel_percentage:number;        //- Measurement of fuel level in real time
    fuel_filling_quantity:number;  //Volume of fuel filled in the tank
    fuel_draining_quantity:number; // Volume of fuel drained from the tank
    communication_error:boolean;   // Fuel level sensor connection tampering / no communication of LLS data
};
/*
struct water with propertites :
Water presence in pump - Identify and monitor water flow during the pump ON period 
No water flow / Dry run - No water flowing in the pump body
Water flow - Continuous measurement of water flow 
Water flow volume - Total run hours for a duration or user selected period
*/
export interface Water
{
    water_presence :number;    //- Identify and monitor water flow during the pump ON period
    dry_run :number;           //- No water flowing in the pump body
    water_flow :number;        //- Continuous measurement of water flow
    water_flow_volume :number; //- Total run hours for a duration or user selected period
};
/*
Control 
emote Engine ON - Turn on the engine remotely
Remote Engine OFF - Turn off the engine remotely
Self Engine OFF, dry run > user defined time - Turning off the engine 
when fuel pump is running dry.
Self Engine OFF, low fuel - Turning off the engine 
when fuel is running low.
Self Engine OFF, Engine operated more than a limit - Turning off the engine 
when it runs more that a certain time limit.
Self Engine OFF, Engine temp critical high - Turning off the engine 
when engine running with a high temperature.
*/
export class Control
{
    engine_on :number;
    engine_off :number;
    dry_run_time :number = 10;
    low_fuel_percent :number = 10;
    engine_critical_temp :number = 200;
    isDryRun(water: Water):boolean { return water.dry_run==1; }
    isLowFuel(fuel: Fuel) :boolean{ return fuel.fuel_percentage < this.low_fuel_percent; }
    isOperatedMoreThanLimit(engine:Engine):boolean
    {
        return engine.running_hours > this.dry_run_time;
    }
    isEngineTempCriticalHigh(engine:Engine):boolean
    {
        return engine.temp1 > this.engine_critical_temp;
    }
    shouldEngineBeOn(water:Water, fuel:Fuel, engine:Engine):boolean
    {
        return this.isDryRun(water) && this.isLowFuel(fuel) && this.isOperatedMoreThanLimit(engine);
    }
};