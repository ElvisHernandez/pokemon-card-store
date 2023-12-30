import { NextFunction, Request, Response } from "express";

export const isAuthenticated = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { sessionId } = req.cookies;

	if (!sessionId) {
		return res.status(401).send("<p>Unauthorized</p>");
	}

	const sessionAndUser = await req.db.getSessionAndUser(sessionId);
	const sessionIsExpired = +new Date(sessionAndUser.expiresAt) < Date.now();

	if (sessionIsExpired) {
		await req.db.deleteSession(sessionId);
		// Clear the sessionId cookie by resetting it with
		// an expires value in the past
		res.cookie("sessionId", "", {
			httpOnly: true,
			secure: true,
			expires: new Date(0),
		});
		return res.status(401).send("<p>Unauthorized</p>");
	}

	// if the sessionId is valid then attach the user email to the request
	req.user = {
		email: sessionAndUser.email,
	};

	next();
};
