import { Database, open } from "sqlite";
import sqlite3 from "sqlite3";
import path from "path";

export class Db {
	private static instance: Db;
	private dbPromise: Promise<Database<sqlite3.Database, sqlite3.Statement>>;

	private constructor() {
		this.dbPromise = open({
			filename: path.resolve(__dirname, "../../db/db.sqlite"),
			driver: sqlite3.Database,
		});
	}

	async getUsers() {
		const db = await this.dbPromise;
		return db.get("select * from User;");
	}

	static getInstance() {
		if (!Db.instance) {
			Db.instance = new Db();
		}

		return Db.instance;
	}
}
