let mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const UserModel = require("../models/user.model");
const ProfileModel = require("../models/profile.model");

const MongoDB = function () {
  try {
    const db_Host = env.MONGODB_HOST;
    const db_Name = env.MONGODB_DBNAME;

    const mongoDbUrl = "mongodb://" + db_Host + "/" + db_Name;

    mongoose = UserModel(mongoose);
    mongoose = ProfileModel(mongoose);
    mongoose
      .connect(mongoDbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
      .then((result) => {
        console.log(`database connection successful ..${mongoDbUrl}`);
      });
  } catch (e) {
    throw e;
  }

  function model(name) {
    try {
      return mongoose.model(name);
    } catch (e) {
      throw e;
    }
  }

  return {
    model,
  };
};

module.exports = MongoDB;
