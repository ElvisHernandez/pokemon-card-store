import express from "express";
import { Db } from "./services/Db";
import hbs from "hbs";
import path from "path";

hbs.registerPartials(path.resolve(__dirname, "./views/partials"));

const app = express();

const db = Db.getInstance();

app.set("view engine", "hbs");
app.set("views", "./src/views");

app.use(express.static(path.resolve(__dirname, "../static")));
app.use((req, res, next) => {
	req.db = db;
	next();
});

// App pages
app.get("/", (req, res) => {
	res.render("home", { header: "hello, world" });
});

app.listen(3000, () => console.log("Server running on port 3000"));
