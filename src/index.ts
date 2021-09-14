import express, { Request, Response } from "express";
import {connect} from "mongoose";
require('dotenv').config();
import client from './mqtt'
import events from './events'
import './devices/engine';
import { DeviceModel } from "./models/device";
import { Engine } from "./types/device";
(async () => await connect(process.env.MONGO_URL||""))();
const apiKey = process.env.API_KEY || "thiswon'tworkinprod";
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
    if (req.body.apiKey !== apiKey) {
        res.status(403).json({error: "apiKey is not valid",message:"api key required to create device"});
    }
    if (req.params.id) {
        const device = await DeviceModel.findOne({id:req.params.id});
        if (device) {
            return res.json({status:"success",device,message:"device already exists"});
        } else {
            const engine :Engine = {cell:'off',temperature1:0,temperature2:0,temperature3:0,rpm:0,runnning:false};
            const newDevice = new DeviceModel({id:req.params.id,engine:engine});
            await newDevice.save();
            return res.json({status:"success",newDevice,message:"device created successfully"});
        }
    }
    return res.json({error:"no id"});
})
app.get('/devices/:id',async (req,res)=>{
    if (req.params.id) {
        const device = await DeviceModel.findOne({id:req.params.id});
        if (device) {
            return res.json({status:"success",device,message:"device found"});
        } else {
            return res.json({status:"error",error:"device not found"});
        }
    }
    return res.json({error:"no id"});
})
app.get('/devices/:id/engine/start',(req,res)=>{
    events.emit('engine:start',req.params.id);
    res.json({status:"success",message:"engine started"});
})
app.get('/devices/:id/engine/stop',(req,res)=>{
    events.emit('engine:stop',req.params.id);
    res.json({status:"success",message:"engine stopped"});
})
app.get('/devices/:id/engine/status',async (req:Request,res:Response)=>{
    const device = await DeviceModel.findOne({id:req.params.id});
    if (device) {
        return res.json({status:"success",device,message:"device found"});
    } else {
        return res.json({status:"error",error:"device not found"});
    }
});
//start server
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
