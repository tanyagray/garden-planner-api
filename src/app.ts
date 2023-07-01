import logger from "loglevel";
import { loadEnv } from "./env";
import { startServer } from "./start";

logger.setLevel("info");

loadEnv();
startServer();
