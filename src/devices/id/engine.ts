import event from '../../events';

function publish(topic:string,payload:string) {
    event.emit('mqtt.publish',{topic,payload});
}
event.on('engine:start',(id:string)=>{
    publish(`devices/${id}/cell`,'1');
    console.log(`engine:on:${id}`);
});
event.on('engine:stop',(id:string)=>{
    publish(`devices/${id}/cell`,'0');
    console.log(`engine:off:${id}`);
});