import express, { Request } from "express";
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

async function getPokemonCards(req: Request) {
	const pokemonCards = await req.db.getPokemonCards();

	for (const pokemonCard of pokemonCards) {
		const amountInCart = cart.ids[pokemonCard.id];

		pokemonCard.amountInCart = amountInCart;
		pokemonCard.isInCart = !!amountInCart;
	}

	return pokemonCards;
}

// App pages
app.get("/", async (req, res) => {
	const pokemonCards = await getPokemonCards(req);

	res.render("home", {
		header: "hello, world",
		pokemonCards,
		cartItems: getCartItems(),
	});
});

app.get("/pokemon-card/:id", async (req, res) => {
	const pokemonCard = await req.db.getPokemonCard(req.params.id);

	res.render("partials/pokemonCard", {
		...pokemonCard,
		isInCart: !!cart.ids[pokemonCard.id],
		amountInCart: cart.ids[pokemonCard.id],
	});
});

app.put("/cart", async (req, res) => {
	const { id, add } = req.body;

	const increment = add === "true" ? 1 : -1;
	const itemQuantity = (cart.ids[id] || 0) + increment;

	if (itemQuantity >= 0) {
		cart.ids[id] = itemQuantity;
	}

	res.setHeader("HX-Trigger", `cart-update-${id}`);
	res.render("partials/nav", { cartItems: getCartItems() });
});

app.listen(3000, () => console.log("Server running on port 3000"));
