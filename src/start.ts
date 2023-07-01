import express from "express";
import "express-async-errors";
import logger from "loglevel";
import { AddressInfo } from "net";
import { getRoutes } from "./routes";
import { env } from "./env";

function startServer() {
  const app = express();

  // enable json request body parsing
  app.use(express.json());

  // I mount my entire app to the /api route (or you could just do "/" if you want)
  app.use("/api", getRoutes());

  // add the generic error handler just in case errors are missed by middleware
  app.use(errorMiddleware);

  // I prefer dealing with promises. It makes testing easier, among other things.
  // So this block of code allows me to start the express app and resolve the
  // promise with the express server
  return new Promise((resolve) => {
    const server = app.listen(env.PORT, () => {
      logger.info(
        `Listening on port ${(server.address() as AddressInfo).port}`
      );
      // this block of code turns `server.close` into a promise API
      const originalClose = server.close.bind(server);

      /*server.close = () => {
        return new Promise((resolveClose) => {
          originalClose(resolveClose);
        });
      };*/

      // this ensures that we properly close the server when the program exists
      // setupCloseOnExit(server);

      // resolve the whole promise with the express server
      resolve(server);
    });
  });
}

// here's our generic error handler for situations where we didn't handle
// errors properly
function errorMiddleware(error, req, res, next) {
  if (res.headersSent) {
    next(error);
  } else {
    logger.error(error);
    res.status(500);
    res.json({
      message: error.message,
      // we only add a `stack` property in non-production environments
      ...(env.NODE_ENV === "production" ? null : { stack: error.stack }),
    });
  }
}

// ensures we close the server in the event of an error.
/*function setupCloseOnExit(server) {
  // thank you stack overflow
  // https://stackoverflow.com/a/14032965/971592
  async function exitHandler(options = {}) {
    await server
      .close()
      .then(() => {
        logger.info("Server successfully closed");
      })
      .catch((e) => {
        logger.warn("Something went wrong closing the server", e.stack);
      });
    if (options.exit) process.exit();
  }
  // do something when app is closing
  process.on("exit", exitHandler);
  // catches ctrl+c event
  process.on("SIGINT", exitHandler.bind(null, { exit: true }));
  // catches "kill pid" (for example: nodemon restart)
  process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
  process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));
  // catches uncaught exceptions
  process.on("uncaughtException", exitHandler.bind(null, { exit: true }));
}*/
export { startServer };
