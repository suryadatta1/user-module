const RabbitMQ = require("./modules/utils/RabbitMQ")

env = process.env;
const exchange = env.RABBIT_MQ_EXCHANGE_NAME
const host = env.RABBIT_MQ_HOST
const password = env.RABBIT_MQ_PASSWORD
const user = env.RABBIT_MQ_USER
const queueName = env.RABBIT_MQ_QUEUE_NAME
const pattern = env.RABBIT_MQ_PATTERN

rmq = RabbitMQ()

const dependencies = require('./dependencies')();
const modules = require('./modules');

modules.apiRouter(dependencies, rmq);



rmq.init("amqp://" + user + ":" + password + "@" + host, exchange, queueName,pattern, rmq.routes)


console.log("listening on rabbitMQ ... ")

// app.listen(PORT, () => debug(`Listening on ${PORT}!`))

