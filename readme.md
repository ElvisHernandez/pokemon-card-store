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
