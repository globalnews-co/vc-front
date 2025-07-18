import dotenv from "dotenv";
dotenv.config();

const DB_SERVER = process.env.DB_SERVER;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DATABASE = process.env.DB_DATABASE;
const DB_PORT = parseInt(process.env.DB_PORT);
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE);
const IMG_STORAGE = process.env.IMG_STORAGE;
const IMG_STORAGE_URL = process.env.IMG_STORAGE_URL;
const IMG_NAME = process.env.IMG_NAME;
const TOKEN_SECRET = process.env.TOKEN_SECRET;
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL

export{
  DB_SERVER,
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE,
  DB_PORT,
  BATCH_SIZE,
  IMG_STORAGE,
  IMG_STORAGE_URL,
  IMG_NAME,
  TOKEN_SECRET,
  NEXT_PUBLIC_API_URL
};

