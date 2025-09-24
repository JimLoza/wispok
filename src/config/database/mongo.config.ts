import { connect } from "mongoose";
import { envs } from '../envs.config';

async function dbConnect(): Promise<void> {
    try {
        const DB_URI = <string>envs.database.uri;
        await connect(DB_URI);
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1);
    }
}

export default dbConnect;
