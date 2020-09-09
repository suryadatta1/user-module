let mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileModel = function (mongoose) {
  let ProfileSchema = new Schema(
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },

      bio: {
        type: String,
      },
      dateOfBirth: {
        type: Date,
      },
      gender: {
        type: String,
      },
      phone: {
        type: Number,
      },
    },
    {
      timestamps: {
        createdAt: "_created",
        updatedAt: "_updated",
      },
      collection: "profiles",
    }
  );

  mongoose.model("profile", ProfileSchema);
  return mongoose;
};

module.exports = ProfileModel;
