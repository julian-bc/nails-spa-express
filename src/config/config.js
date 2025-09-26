import dotenv from "dotenv";
dotenv.config();

const {
  PORT,
  DATABASE_URL,
  SALT_ROUNDS,
  TOKEN_SECRET,
  NODE_ENV
} = process.env

export default {
  port: PORT || 3000,
  databaseUrl: DATABASE_URL,
  salt: Number(SALT_ROUNDS),
  tokenSecret: TOKEN_SECRET,
  nodeEnv: NODE_ENV,
}
