const { MongoClient } = require('mongodb');
const crypto = require('crypto');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = 'grandRegalDb';
const COLLECTION_NAME = 'users';

class Creds {
  constructor() {
    this.client = new MongoClient(MONGO_URI);
    this.ready = this.client.connect().then(async () => {
      this.db = this.client.db(DB_NAME);
      await this.initSchema(); // Initialize schema validation
      this.collection = this.db.collection(COLLECTION_NAME);
      console.log("MongoDB Connected (native driver)");
    }).catch(err => {
      console.error("MongoDB Connection Error:", err);
    });
  }

  // Initialize collection with schema validation
  async initSchema() {
    const collections = await this.db.listCollections({ name: COLLECTION_NAME }).toArray();
    if (collections.length === 0) {
      await this.db.createCollection(COLLECTION_NAME, {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["username", "pwd", "cookies"],
            properties: {
              username: {
                bsonType: "string",
                description: "must be a string and is required"
              },
              pwd: {
                bsonType: "string",
                description: "must be a string and is required"
              },
              cookies: {
                bsonType: "array",
                items: {
                  bsonType: "string",
                  description: "must be a string"
                },
                description: "must be an array of strings and is required"
              }
            }
          }
        }
      });
      console.log(`Collection "${COLLECTION_NAME}" created with schema validation.`);
    } else {
      console.log(`Collection "${COLLECTION_NAME}" already exists.`);
    }
  }

  // Login and generate a cookie
  async verifyLogin(username, pwd) {
    await this.ready;
    const user = await this.collection.findOne({ username, pwd });
    if (user) {
      const cookie = crypto.randomBytes(20).toString('hex');
      await this.collection.updateOne(
        { _id: user._id },
        { $push: { cookies: cookie } }
      );
      console.log("Login Successful with cookie =", cookie);
      return cookie;
    }
    return false;
  }

  // Verify session cookie
  async verifyRequest(cookie) {
    await this.ready;
    console.log("Verifying Request", cookie);
    const user = await this.collection.findOne({ cookies: cookie.slice(12, ) });
    return !!user;
  }

  // Logout user by removing cookie
  async logout(cookie) {
    await this.ready;
    const user = await this.collection.findOne({ cookies: cookie });
    if (user) {
      await this.collection.updateOne(
        { _id: user._id },
        { $pull: { cookies: cookie } }
      );
      console.log("Logout successful");
      return true;
    }
    return false;
  }

  // Change password after verifying current one
  async changePassword(username, oldPwd, newPwd) {
    await this.ready;
    const result = await this.collection.updateOne(
      { username, pwd: oldPwd },
      { $set: { pwd: newPwd } }
    );
    if (result.modifiedCount > 0) {
      console.log("Password updated");
      return true;
    }
    return false;
  }

  // Set initial credentials or update if already present
  async changeCreds(username = 'admin', pwd = 'Admin@123') {
    await this.ready;
    const user = await this.collection.findOne({});
    if (user) {
      await this.collection.updateOne(
        { _id: user._id },
        { $set: { username, pwd } }
      );
    } else {
      await this.collection.insertOne({ username, pwd, cookies: [] });
    }
    console.log("Credentials changed or created.");
  }
}

module.exports = Creds;
