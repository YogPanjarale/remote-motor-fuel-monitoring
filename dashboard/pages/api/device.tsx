import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const device:NextApiHandler = (req:NextApiRequest,res:NextApiResponse)=>{
    const id = req.query.id;
    if (!id){res.status(400).json({error:"id is required",status:400});return;}
    res.status(200).json({
        status: 'success',
        message:`Hello ${id}`
    })
}
export default device;