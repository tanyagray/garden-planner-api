import express from "express";
import { db, admin, auth } from "../firebase";
// A function to get the routes.
// That way all the route definitions are in one place which I like.
// This is the only thing that's exported

export function getUserRoutes() {
  const router = express.Router();

  router.get("/:userId", getUser);
  router.get("/:userId/favorites", getFavorites);
  router.get("/:userId/favorites/add/:productId", addFavorite);
  router.get("/:userId/favorites/remove/:productId", removeFavorite);

  return router;
}

async function getUser(req, res) {
  const { userId } = req.params;
  return db
    .ref(`users/${userId}`)
    .once("value", (data) => data.val())
    .then((user) => res.send(user))
    .catch((e) => res.send(e));
}

async function getFavorites(req, res) {
  const { userId } = req.params;
  return db
    .ref(`users/${userId}/favorites`)
    .once("value", (data) => data.val())
    .then((favorites) => res.send(favorites))
    .catch((e) => res.send(e));
}

async function addFavorite(req, res) {
  const { userId, productId } = req.params;
  return db
    .ref(`users/${userId}/favorites/${productId}`)
    .set(true)
    .then(() => res.send({ [productId]: true }))
    .catch((e) => res.send(e));
}

async function removeFavorite(req, res) {
  const { userId, productId } = req.params;
  return db
    .ref(`users/${userId}/favorites/${productId}`)
    .remove()
    .then(() => res.send({ [productId]: false }))
    .catch((e) => res.send(e));
}
