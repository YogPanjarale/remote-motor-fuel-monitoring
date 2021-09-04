import express, { Request, Response } from "express";
import {connect} from "mongoose";
require('dotenv').config();
import client from './mqtt'
import events from './events'
import './devices/id/engine';
import { DeviceModel } from "./models/device";
import { Engine } from "./types/device";
(async () => await connect(process.env.MONGO_URL||""))();
//make express app
const app = express();
//use json
app.use(express.json());
//set port
const port = process.env.PORT || 3000;
//set routes
app.get("/", (_req: Request, res: Response) => {
	res.json("Hello World!");

});
//ping mqtt
app.get("/ping", (_req: Request, res: Response) => {
    client.publish("ping", "pong");
    events.emit("ping");
    res.json("pong");
});
app.get('/devices/:id/create',async (req,res)=>{
    if (req.params.id) {
        const device = await DeviceModel.findOne({id:req.params.id});
        if (device) {
            return res.json(device);
        } else {
            const engine :Engine = {cell:'off',temperature1:0,temperature2:0,temperature3:0,rpm:0,runnning:false};
            const newDevice = new DeviceModel({id:req.params.id,engine:engine});
            await newDevice.save();
            return res.json(newDevice);
        }
    }
    return res.json({error:"no id"});
})
app.get('/devices/:id/engine/start',(req,res)=>{
    events.emit('engine:start',req.params.id);
    res.json("Ok");
})
app.get('/devices/:id/engine/stop',(req,res)=>{
    events.emit('engine:stop',req.params.id);
    res.json("Ok");
})
app.get('/devices/:id/engine/status',(req:Request,res:Response)=>{
    res.json(events.emit('engine:status',req.params.id));
});
//start server
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
