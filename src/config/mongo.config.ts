import { connect } from "mongoose";
import { envs } from './envs.config';

async function dbConnect(): Promise<void> {
    const DB_URI = <string>envs.database.uri;
    await connect(DB_URI);
}

export default dbConnect;
