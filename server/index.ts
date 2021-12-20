import path from "path";
import express from "express";
import compression from "compression";
import morgan from "morgan";
import { createServer } from "http";
import { createRequestHandler } from "@remix-run/express";
import { Server } from "socket.io";
import jwt, { JsonWebTokenError } from "jsonwebtoken";




const MODE = process.env.NODE_ENV;
const BUILD_DIR = path.join(process.cwd(), "server/build");
const port = process.env.PORT || 4000;

const app = express();
const httpServer = createServer(app)
const io = new Server(httpServer)
httpServer.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
io.use((socket, next) => {
  const { token } = socket.handshake.auth
  console.log(token)
  const decode_token = jwt.verify(token, process.env.SESSION_SECRET || '')
  if (decode_token) {
    console.log(decode_token, "decode_token")
    next()
  } else {
    next(new Error("unauthorized"))
  }
})
io.on('connection', async (socket) => {

  console.log('connected')
})

app.use(compression());

// You may want to be more aggressive with this caching
app.use(express.static("public", { maxAge: "1h" }));

// Remix fingerprints its assets so we can cache forever
app.use(express.static("public/build", { immutable: true, maxAge: "1y" }));

app.use(morgan("tiny"));
app.all(
  "*",
  MODE === "production"
    ? createRequestHandler({ build: require("./build") })
    : (req, res, next) => {
      purgeRequireCache();
      let build = require("./build");
      return createRequestHandler({ build, mode: MODE })(req, res, next);
    }
);


////////////////////////////////////////////////////////////////////////////////
function purgeRequireCache() {
  // purge require cache on requests for "server side HMR" this won't let
  // you have in-memory objects between requests in development,
  // alternatively you can set up nodemon/pm2-dev to restart the server on
  // file changes, we prefer the DX of this though, so we've included it
  // for you by default
  for (let key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      delete require.cache[key];
    }
  }
}
