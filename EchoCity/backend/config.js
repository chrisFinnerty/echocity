"use strict";
import { config } from 'dotenv';
config();

const SECRET_KEY = process.env.SECRET_KEY;

const PORT = process.env.PORT;

// Use dev database, testing database, or via env var, production database
function getDatabaseUri() {
    return (process.env.NODE_ENV === "test")
        ? "echocity_test"
        : process.env.DATABASE_URL || "echocity";
  }

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === 'test' ? 1 : 13;

export {
    SECRET_KEY,
    PORT,
    BCRYPT_WORK_FACTOR,
    getDatabaseUri,
  };
  