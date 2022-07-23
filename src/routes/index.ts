import { Router } from "express";
import { getProductRoutes } from "./products";
import { getUserRoutes } from "./users";
import { getAdminRoutes } from "./admin";

export function getRoutes() {
  // create a router for all the routes of our app
  const router = Router();

  router.use("/admin", getAdminRoutes());
  router.use("/products", getProductRoutes());
  router.use("/users", getUserRoutes());

  return router;
}
