import errorHandler from "errorhandler";

import app from "./app";

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
const server = app.listen(8080, () => {
  console.log(
    "  App is running at http://localhost:%d in %s mode",
    8080,
    app.get("env")
  );
  console.log("  Press CTRL-C to stop\n");
});

export default server;
