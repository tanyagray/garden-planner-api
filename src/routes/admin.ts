import express from "express";
import { auth } from "../firebase";
import { scrapeKingsSeedsProductList } from "../data-scrapers/kings-seeds/product-list";
// A function to get the routes.
// That way all the route definitions are in one place which I like.
// This is the only thing that's exported

export function getAdminRoutes() {
  const router = express.Router();

  router.get("/users", getAllUsers);
  router.post("/users/:userId/claims", setUserClaims);

  router.get("/kings-seeds/products", getKingsSeedsProductList);

  return router;
}

async function getAllUsers(req, res) {
  return auth
    .listUsers(1000)
    .then((listUsersResult) => res.send(listUsersResult.users))
    .catch((e) => res.send(e));
}

async function setUserClaims(req, res) {
  const { userId } = req.params;
  const { claims } = req.body;
  return auth
    .setCustomUserClaims(userId, claims)
    .then(() => auth.getUser(userId))
    .then((userRecord) => res.send(userRecord.toJSON()))
    .catch((e) => res.send(e));
}

async function getKingsSeedsProductList(req, res) {
  return scrapeKingsSeedsProductList(1)
    .then((products) => res.send(products))
    .catch((e) => res.send(e));
}
