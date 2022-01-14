import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const handler:NextApiHandler = (req:NextApiRequest,res:NextApiResponse) => {
    const {
        fuelLevel,
        sensorReading,
    } = req.body;

    res.status(200).json({
        message: "Hello Worldly " + __dirname,
    });
}

export default handler;