import express, { Request, Response } from "express";
require('dotenv').config();
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

//start server
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
