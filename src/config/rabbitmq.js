const amqp = require('amqplib');

let channel;
const QUEUE_NAME = 'indexQueue';

const connectQueue = async () => {
  const connection = await amqp.connect('amqp://localhost');
  channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_NAME);
};

const sendToQueue = async (message) => {
  channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)));
};

const consumeQueue = async (onMessage) => {
  channel.consume(QUEUE_NAME, (msg) => {
    if (msg !== null) {
      const data = JSON.parse(msg.content.toString());
      onMessage(data);
      channel.ack(msg);
    }
  });
};

module.exports = { connectQueue, sendToQueue, consumeQueue };
