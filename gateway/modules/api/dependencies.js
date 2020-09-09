const _ = require("lodash");

const DefaultController = require("./controllers");
const UserController = require("./controllers/UserController");
const ProfileController = require("./controllers/ProfileController");

const RabbitMQ = require("./../utils/RabbitMQ");
const MongoDB = require("./../utils/MongoDB");
const Validator = require("./../utils/Validator");

const UserRecord = require("./db/UserRecord");
const ProfileRecord = require("./db/ProfileRecord");

env = process.env;
const exchange = env.RABBIT_MQ_EXCHANGE_NAME;
const host = env.RABBIT_MQ_HOST;
const password = env.RABBIT_MQ_PASSWORD;
const user = env.RABBIT_MQ_USER;
const queueName = env.RABBIT_MQ_QUEUE_NAME;
const pattern = env.RABBIT_MQ_PATTERN;

const APIDependencies = async function (diProvider) {
  let rmq = RabbitMQ();
  rmq.init(
    "amqp://" + user + ":" + password + "@" + host,
    exchange,
    queueName,
    pattern,
    rmq.routes
  );

  diProvider.constant("RabbitMQ", rmq);
  diProvider.service("MongoDB", MongoDB);
  diProvider.service("Validator", Validator, "MongoDB");

  diProvider.service("UserRecord", UserRecord, "MongoDB");
  diProvider.service("ProfileRecord", ProfileRecord, "MongoDB");

  diProvider.service("DefaultController", DefaultController);
  diProvider.service(
    "UserController",
    UserController,
    "Validator",
    "RabbitMQ",
    "UserRecord"
  );
  diProvider.service(
    "ProfileController",
    ProfileController,
    "Validator",
    "RabbitMQ",
    "ProfileRecord"
  );
};

module.exports = APIDependencies;
