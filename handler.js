"use strict";

// serverless invoke local --function tvshow
// serverless invoke local --function random

const mongo = require("mongodb");
const { MongoClient } = mongo;

let cachedDb = null;

async function connectToDatabase(mongoUrl) {
  if (cachedDb) {
    return cachedDb;
  }

  const client = await MongoClient.connect(mongoUrl);

  const db = await client.db("series");

  cachedDb = db;
  return db;
}

module.exports.tvShow = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const MONGO_LOGIN = process.env.MONGO_LOGIN;
  const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
  const MONGO_URL = process.env.MONGO_URL;

  const MONGODB_URI = `mongodb+srv://${MONGO_LOGIN}:${MONGO_PASSWORD}@${MONGO_URL}/?retryWrites=true&w=majority`;

  const db = await connectToDatabase(MONGODB_URI);

  const result = await db
    .collection("tvShow")
    .find({})
    .map((item) => {
      return {
        id: item._id,
        title: item.title,
        enable: item.enable,
        type: item.type
      };
    })
    .toArray();

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "https://watch-roulette.netlify.app",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(result),
  };
};

module.exports.random = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const MONGO_LOGIN = process.env.MONGO_LOGIN;
  const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
  const MONGO_URL = process.env.MONGO_URL;

  const MONGODB_URI = `mongodb+srv://${MONGO_LOGIN}:${MONGO_PASSWORD}@${MONGO_URL}/?retryWrites=true&w=majority`;

  const { id } = event.pathParameters;

  const db = await connectToDatabase(MONGODB_URI);

  const result = await db
    .collection("episode")
    .aggregate([
      {
        $match: {
          tvShow: Number(id),
        },
      },
      {
        $sample: {
          size: 1,
        },
      },
    ])
    .map((item) => {
      return {
        id: item._id,
        tvShow: item.tvShow,
        title: item.title,
      };
    })
    .toArray();

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "https://watch-roulette.netlify.app",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(result),
  };
};
