import * as mqtt from "mqtt";
import { AsyncClient } from "async-mqtt";
import config from "./config";

export const client = mqtt.connect(config.broker, {
    clientId: config.clientId,
    username: config.username,
    password: config.password,
});
export const asyncClient = new AsyncClient(client);
