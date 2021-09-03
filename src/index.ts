import express, { Request, Response } from "express";
require('dotenv').config();
import client from './mqtt'
import events from './events'
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
    res.json("pong");
});
app.get('devices/:id/engine/on',(req,_res)=>{
    events.emit('engine:on',req.params.id);
})
app.get('devices/:id/engine/off',(req,_res)=>{
    events.emit('engine:off',req.params.id);
})
//start server
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
