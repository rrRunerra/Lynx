import "dotenv/config";
import { LynxClient } from "./client/client";

export const client = new LynxClient();
client.login();
