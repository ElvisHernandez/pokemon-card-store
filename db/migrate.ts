import { open } from "sqlite";
import sqlite3 from "sqlite3";
import path from "path";

(async () => {
	const db = await open({
		filename: path.resolve(__dirname, "./db.sqlite3"),
		driver: sqlite3.Database,
	});

	await db.migrate({
		table: "migrations",
		migrationsPath: path.resolve(__dirname, "./migrations"),
		force: true,
	});

	await db.close();
})();
