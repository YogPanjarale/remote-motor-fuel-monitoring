import config from "./config";
import { messageHandler } from "./messageHandler";
import { asyncClient, client } from "./mqtt-client";
const branch = config.branch;
const devices = ["001"]

async function main() {
    await asyncClient.publish(`devices/${branch}/status`,'online');
    asyncClient.subscribe(`devices/${branch}/#`)
}
setInterval(() => {
    devices.forEach(async (device) => {
        await asyncClient.publish(`devices/${branch}/${device}/update`, "1")
    })
}, 5000);
client.on("message", messageHandler);
main();