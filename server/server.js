const express = require("express");
const path = require("path");
const db = require("./config/connection");
const routes = require("./routes");
const { ApolloServer } = require("apollo-server-express");

const { typeDefs, resolvers } = require("./schema/index");
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
});
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

app.use(routes);

const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`🌍 GraphQL listening on http://localhost:${PORT}`);
      console.log("app running on http://localhost:3000");
    });
  });
};

startApolloServer(typeDefs, resolvers);
