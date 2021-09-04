import { Schema, model } from 'mongoose';
import {Device,Engine} from '../types/device';

const engineSchema = new Schema<Engine>({
    temperature1: Number,
    temperature2: Number,
    temperature3: Number,
    rpm: Number,
    runnning:Boolean,
    cell: {type: String, required: true},
});

const deviceSchema = new Schema<Device>({
    id: { type: String, required: true },
    engine:{
        type: engineSchema,
        required: true
    }
});

export const DeviceModel = model<Device>('Device', deviceSchema);
