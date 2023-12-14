# Welcome to PokeShop!

Buy the rarest Pokemon cards around!

![PokeShop](./static/pokeshop.gif)

## Technologies Used

-   NodeJS (v18)
-   Typescript
-   ExpressJS
-   Handlebars + HTMX
-   Tailwind CSS + Daisy UI
-   SQLite3
-   ESLint + Prettier

## How to run

-   Need Node v18
-   Need SQLite3 - Tested with version 3.31.1

Run the following commands at the root of this project after cloning

```bash
npm run initdb # creates SQLite database and seeds it with pokemon cards
npm install
```

In one terminal run the command

```bash
npm run static # compiles Tailwind CSS and Daisy UI
```

In another run the command

```bash
npm run start:dev # Starts node server
```

## Blog Article

[Intro to HTMX for Javascript Devs](https://authenticdevelopment.net/blog/2/intro-to-htmx-for-javascript-devs)

Is a blog article where I describe what HTMX is and how to use it to go from the state of this repo in the `master` branch to the state in the `implement-cart-and-pokemon-card-counters` branch.
