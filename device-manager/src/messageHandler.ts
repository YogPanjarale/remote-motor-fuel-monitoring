export const messageHandler = function (topic: string, message: string | Buffer) {
    console.log(`[Incomming message] : ${topic} , ${message.toString()}`);
};
