import { Db } from "./src/services/Db";

declare global {
	namespace Express {
		// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
		export interface Request {
			db: Db;
		}
	}
}
