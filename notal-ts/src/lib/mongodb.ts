import { Db, MongoClient, MongoClientOptions } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = "Notal";

let cachedClient = <null | MongoClient>null;
let cachedDb = <null | Db>null;

export async function connectToDatabase() {
  if (!MONGODB_URI || !MONGODB_DB) {
    throw new Error(
      "Define/Check the MONGODB_URI or MONGODB_DB environmental variable"
    );
  }

  if (cachedClient && cachedDb) {
    return {
      client: cachedClient,
      db: cachedDb,
    };
  }

  const opts = <MongoClientOptions>{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  let client = new MongoClient(MONGODB_URI, opts);
  await client.connect();
  let db = client.db(MONGODB_DB);

  cachedClient = client;
  cachedDb = db;

  return {
    client: cachedClient,
    db: cachedDb,
  };
}
