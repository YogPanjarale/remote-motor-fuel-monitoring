import client from '../../../mqtt';

import event from '../../../events';

event.on('engine:on',(id:string)=>{
    client.publish(`devices/${id}/cell`,'1');
});
event.on('engine:off',(id:string)=>{
    client.publish(`devices/${id}/cell`,'0');
});