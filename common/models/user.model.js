let mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserModel = function (mongoose) {
  let UserSchema = new Schema(
    {
      name: {
        type: String,
      },
      email: {
        type: String,
      },
      password: {
        type: String,
      },
    },

    {
      timestamps: {
        createdAt: "_created",
        updatedAt: "_updated",
      },
      collection: "users",
    }
  );

  mongoose.model("user", UserSchema);
  return mongoose;
};

module.exports = UserModel;
