import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

import clientPromise from "../../lib/mongodb";
import Joi from "joi";

const deviceIdSchema = Joi.string().alphanum().max(16).required();
const Device: NextApiHandler = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	const id = req.query.id;
	if (!id) {
		res.status(400).json({ error: "id is required", status: 400 });
		return;
	}
    // Validate id
    const { error } = deviceIdSchema.validate(id);
    if (error) {
        res.status(400).json({ error: error.message, status: 400 });
        return;
    }
    
	const client = await clientPromise;
	const coll = client.db("rfms").collection("devices");
	const doc = await coll.findOne({ deviceId: id });
	if (!doc) {
		res.status(404).json({ error: "device not found", status: 404 });
		return;
	}

	res.status(200).json({
		status: "ok",
		data: doc,
	});
};
export default Device;
