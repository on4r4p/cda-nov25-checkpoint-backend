import "reflect-metadata";
import { DataSource } from "typeorm";
import { Country } from "../Entities/Country";

export const db = new DataSource({
	type: "sqlite",
	database: "database.sqlite",
	entities: [Country],
	synchronize: true,
	logging: false,
});

export async function clearDB(): Promise<void> {
	if (!db.isInitialized) {
		await db.initialize();
	}

	await db.synchronize(true);
}

async function resetDB(): Promise<void> {
	try {
		await clearDB();
		console.log("Database reset complete.");
	} catch (error) {
		console.error("Database reset failed:", error);
		process.exitCode = 1;
	} finally {
		if (db.isInitialized) {
			await db.destroy();
		}
	}
}

if (require.main === module) {
	void resetDB();
}
