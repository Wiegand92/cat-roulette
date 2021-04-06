# Cat Roulette

## About

This will be a cat themed chat client to familiarize myself with Socket, as well as working with pg.

## Instructions

If you want to run a copy of this yourself, first create a .env file with your postgres credentials. The database that this looks for is called catroulette (but feel free to change that is server/db.js). There are commands to initialize the database in db.sql, run those either in psql or an app like PostBird.

Then, open the terminal in the root folder, and first run 

  ```npm run start-server```

This starts a server that runs the database interactions and Socket.

And then run

  ```npm run start-dev```

This starts a development server with live-reloading