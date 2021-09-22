import { DeviceModel } from '../models/device';
import event from '../events';
import { TemperatureEvent } from 'src/types/device';
import getVolume from 'src/calibration-table';
// import {De}
function publish(topic:string,payload:string) {
    event.emit('mqtt.publish',{topic,payload});
}
event.on('engine:start',async(id:string)=>{
    publish(`devices/${id}/cell`,'1');
    const device = await DeviceModel.findOne({id:id});
    if(device){
        device.engine.cell="on"
        device.save();
    }
    console.log(`engine:on:${id}`,device?.engine.cell);
});
event.on('engine:stop',async (id:string)=>{
    publish(`devices/${id}/cell`,'0');
    const device = await DeviceModel.findOne({id:id});
    if (device){
        device.engine.cell="off"
        device.save();
    }
    console.log(`engine:off:${id}`,device?.engine.cell);
});
event.on('engine:temp',async (data:TemperatureEvent) => {
    const device = await DeviceModel.findOne({id:data.id});
    if (device){
        switch (data.no) {
            case 1:
                device.engine.temperature1=data.value
                break;
            case 2:
                device.engine.temperature2=data.value
                break;
            case 3:
                device.engine.temperature3=data.value
                break;
            default:
                break;
        }
        device.save();
    }
    console.log(`engine:temp:${data.id}`);
})
event.on('engine:rpm',async (data:{id:string,value:number}) => {
    const device = await DeviceModel.findOne({id:data.id});
    if (device){
        device.engine.rpm=data.value
        device.save();
    }
    console.log(`engine:rpm:${data.id}`);
});
event.on('engine:water',async (data:{id:string,value:number}) => {
    const device = await DeviceModel.findOne({id:data.id});
    if (device){
        device.water=data.value
        device.save();
    }
    console.log(`engine:water:${data.id}`);
});
event.on('engine:fuel',async (data:{id:string,value:number}) => {
    const device = await DeviceModel.findOne({id:data.id});
    if (device){
        device.fuel_volume=getVolume(data.value)
        device.save();
    }
    console.log(`engine:fuel:${data.id}`);
});
