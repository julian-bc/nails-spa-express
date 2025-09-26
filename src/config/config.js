import dotenv from "dotenv";
dotenv.config();

const {
  PORT,
  USER_DB,
  PASS_DB,
  SERVER_DB,
  SALT_ROUNDS,
  TOKEN_SECRET,
  NODE_ENV
} = process.env

export default {
  port: PORT || 3000,
  databaseUrl: `mongodb+srv://${USER_DB}:${PASS_DB}@${SERVER_DB}/?retryWrites=true&w=majority&appName=nailsSpa`,
  salt: Number(SALT_ROUNDS),
  tokenSecret: TOKEN_SECRET,
  nodeEnv: NODE_ENV,
}
