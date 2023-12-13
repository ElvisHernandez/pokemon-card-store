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
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
	req.db = db;
	next();
});

type Cart = {
	ids: { [key: string]: number };
	totalPrice: number;
};

const cart: Cart = {
	ids: {},
	totalPrice: 0,
};

function getCartItems() {
	const cartItems = Object.values(cart.ids).reduce(
		(acc, cardAmount) => acc + cardAmount,
		0,
	);

	return cartItems;
}

// App pages
app.get("/", async (req, res) => {
	const pokemonCards = await req.db.getPokemonCards();

	res.render("home", {
		header: "hello, world",
		pokemonCards,
		cartItems: getCartItems(),
	});
});

app.put("/cart", async (req, res) => {
	const { id } = req.body;
	cart.ids[id] = (cart.ids[id] || 0) + 1;

	res.render("partials/nav", { cartItems: getCartItems() });
});

app.listen(3000, () => console.log("Server running on port 3000"));
