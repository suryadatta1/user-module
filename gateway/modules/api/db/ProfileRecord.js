let mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const ProfileRecord = function (db) {
  async function  addProfile(profileObj) {
    return new Promise((resolve, reject) => {
        try {
            let newUser = new db.model('profile')(profileObj);
            newUser.save().then((data) => {
                resolve(data);
            }).catch((e) => {
                reject(e);
            });
        } catch (e) {
            reject(e);
        }
    });
}

  async function getProfile(profile_id) {
    return new Promise((resolve, reject) => {
      try {
        db.model("profile")
          .find({ _id: ObjectId(profile_id) })
          .populate("user", ["name", "email"])
          .then((data) => {
            resolve(data);
          })
          .catch((e) => {
            reject(e);
          });
      } catch (e) {
        reject(e);
      }
    });
  }

  async function getProfiles(filter) {
    return new Promise((resolve, reject) => {
      try {
        db.model("profile")
          .find()
          .populate("users", ["name", "email"])
          .then((data) => {
            resolve(data);
          })
          .catch((e) => {
            reject(e);
          });
      } catch (e) {
        reject(e);
      }
    });
  }

  async function deleteProfile(profile_id) {
    return new Promise((resolve, reject) => {
      try {
        db.model("profile")
          .remove({ _id: ObjectId(profile_id) })
          .then((data) => {
            resolve(data);
          })
          .catch((e) => {
            reject(e);
          });
      } catch (e) {
        reject(e);
      }
    });
  }

  async function editProfile(profile_id, profileObj) {
    return new Promise((resolve, reject) => {
      try {
        db.model("profile")
          .update({ _id: ObjectId(profile_id) }, { $set: profileObj })
          .then((data) => {
            resolve(data);
          })
          .catch((e) => {
            reject(e);
          });
      } catch (e) {
        reject(e);
      }
    });
  }

  return {
    getProfile,
    addProfile,
    getProfiles,
    deleteProfile,
    editProfile,
  };
};

module.exports = ProfileRecord;
