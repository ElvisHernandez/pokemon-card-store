import { Database, open } from "sqlite";
import sqlite3 from "sqlite3";
import path from "path";
import bcrypt from "bcryptjs";
import { v4 as uuidV4 } from "uuid";

type User = {
	id: number;
	email: string;
	passwordHash: string;
	createdAt: Date;
	updatedAt: Date;
};

const formatter = new Intl.NumberFormat("en-us", {
	style: "currency",
	currency: "usd",
});

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

	async getPokemonCard(pokemonCardId: string) {
		const db = await this.dbPromise;

		const pokemonCard = await db.get(
			"select * from PokemonCard where id = ?;",
			pokemonCardId,
		);
		pokemonCard.price = formatter.format(pokemonCard.price);

		return pokemonCard;
	}

	async getPokemonCards() {
		const db = await this.dbPromise;

		const pokemonCards = (await db.all("select * from PokemonCard;")).map(
			(card) => ({
				...card,
				price: formatter.format(card.price),
			}),
		);

		return pokemonCards;
	}

	async getUser(email: string): Promise<User> {
		const db = await this.dbPromise;

		const user = await db.get("select * from User where email = ?;", email);

		return user;
	}

	async getSessionAndUser(sessionId: string) {
		const db = await this.dbPromise;

		const userAndSession = await db.get(
			"select * from User join Session on User.id = Session.userId where Session.sessionId = ?;",
			sessionId,
		);

		return userAndSession;
	}

	async createUserSession(userId: number): Promise<{
		sessionId: string;
		expiresAt: string;
	}> {
		const db = await this.dbPromise;

		// UTC date 30 days from now
		const expiresAt = new Date(
			Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
		).toISOString();

		const createdAt = new Date().toISOString();

		const session = await db.get(
			"insert into Session (sessionId, expiresAt, createdAt, updatedAt, userId) values (?,?,?,?,?) returning *;",
			[uuidV4(), expiresAt, createdAt, createdAt, userId],
		);

		return session;
	}

	async createUserAndSession(email: string, password: string) {
		const db = await this.dbPromise;

		let session: { sessionId: string; expiresAt: string } | undefined;

		try {
			await db.exec("BEGIN TRANSACTION");

			const passwordHash = await bcrypt.hash(password, 10);
			const createdAt = new Date().toISOString();

			const user = await db.get(
				"insert into User (email, passwordHash, createdAt, updatedAt) values (?,?,?,?) returning *;",
				[email, passwordHash, createdAt, createdAt],
			);

			session = await this.createUserSession(user.id);

			await db.exec("COMMIT");
		} catch (e) {
			await db.exec("ROLLBACK");
			console.error(`There was an error creating user ${email}`);
		}

		return session;
	}

	async deleteSession(sessionId: string) {
		const db = await this.dbPromise;

		const res = await db.run(
			"delete from Session where sessionId = ?;",
			sessionId,
		);

		return res;
	}

	static getInstance() {
		if (!Db.instance) {
			Db.instance = new Db();
		}

		return Db.instance;
	}
}
