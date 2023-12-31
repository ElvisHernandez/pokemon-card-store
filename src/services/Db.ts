import { Database, open } from "sqlite";
import sqlite3 from "sqlite3";
import path from "path";

export class Db {
	private static instance: Db;
	private dbPromise: Promise<Database<sqlite3.Database, sqlite3.Statement>>;

	private constructor() {
		this.dbPromise = open({
			filename: path.resolve(__dirname, "../../db/db.sqlite3"),
			driver: sqlite3.Database,
		});
	}

	async getUsers() {
		const db = await this.dbPromise;
		return db.get("select * from User;");
	}

	async getPokemonCards() {
		const db = await this.dbPromise;

		const formatter = new Intl.NumberFormat("en-us", {
			style: "currency",
			currency: "usd",
		});

		const pokemonCards = (await db.all("select * from PokemonCard;")).map(
			(card) => ({
				...card,
				price: formatter.format(card.price),
			}),
		);

		return pokemonCards;
	}

	static getInstance() {
		if (!Db.instance) {
			Db.instance = new Db();
		}

		return Db.instance;
	}
}
