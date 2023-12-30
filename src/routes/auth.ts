import express from "express";
import bcrypt from "bcryptjs";

export const authRouter = express.Router();

authRouter.get("/signup", async (req, res) => {
	res.render("signup", {});
});

authRouter.get("/signin", async (req, res) => {
	res.render("signin", {});
});

authRouter.post("/signin", async (req, res) => {
	const { email, password } = req.body;
	const user = await req.db.getUser(email);

	if (!user) {
		return res.status(401).render("partials/errorAlert", {
			display: "",
			alertId: "incorrect-credentials-error",
			errorMessage: "Incorrect email or password",
		});
	}

	const isAuthenticated = await bcrypt.compare(password, user.passwordHash);

	if (!isAuthenticated) {
		return res.status(401).render("partials/errorAlert", {
			display: "",
			alertId: "incorrect-credentials-error",
			errorMessage: "Incorrect email or password",
		});
	}

	const session = await req.db.createUserSession(user.id);
	res.cookie("sessionId", session.sessionId, {
		httpOnly: true,
		secure: true,
		expires: new Date(session.expiresAt),
	});

	res.setHeader("HX-Redirect", "/");
	res.status(200).json({ success: true });
});

authRouter.get("/signout", async (req, res) => {
	const { sessionId } = req.cookies;

	await req.db.deleteSession(sessionId);
	// Clear the sessionId cookie by resetting it with
	// an expires value in the past
	res.cookie("sessionId", "", {
		httpOnly: true,
		secure: true,
		expires: new Date(0),
	});

	res.setHeader("HX-Redirect", "/");
	res.status(200).json({ success: true });
});

authRouter.post("/signup", async (req, res) => {
	const { email, password } = req.body;

	// We shouldn't need this since we're already validating on the client but just in case
	if (!email || !password) {
		return res.status(400).render("partials/errorAlert", {
			display: "",
			alertId: "missing-credentials-error",
			errorMessage: "Missing Email or Password",
		});
	}

	const userAlreadyExists = !!(await req.db.getUser(email));

	if (userAlreadyExists) {
		return res.status(400).render("partials/errorAlert", {
			display: "",
			alertId: "email-used-error",
			errorMessage: "Email is already in use",
		});
	}

	const session = await req.db.createUserAndSession(email, password);

	// signup failed
	if (!session) {
		return res.status(500).render("partials/errorAlert", {
			display: "",
			alertId: "signup-failed-error",
			errorMessage:
				"Apologies, something went wrong with the signup. Please try again.",
		});
	}

	if (session.sessionId) {
		// Make sure to set the httpOnly and secure properties to true
		// especially for production. Not doing so leaves you open to
		// potential Session Hijacking attacks
		res.cookie("sessionId", session.sessionId, {
			httpOnly: true,
			secure: true,
			expires: new Date(session.expiresAt),
		});
	}

	res.setHeader("HX-Redirect", "/");
	res.status(200).json({ success: true });
});
