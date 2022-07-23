import express from "express";
import { db } from "../firebase";
// A function to get the routes.
// That way all the route definitions are in one place which I like.
// This is the only thing that's exported

export function getProductRoutes() {
  const router = express.Router();

  router.get("/", getAll);
  router.get("/:productId", getById);

  return router;
}

async function getAll(req, res) {
  return db
    .ref("products")
    .once("value", (data) => data.val())
    .then((products) => res.send(products))
    .catch((e) => res.send(e));
}

async function getById(req, res) {
  return db
    .ref(`products/${req.params.productId}`)
    .once("value", (data) => data.val())
    .then((product) => res.send(product))
    .catch((e) => res.send(e));
}
