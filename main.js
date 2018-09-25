const app = require("scripts/app");
const sparkle = require("scripts/sparkle");

await sparkle.checkForUpdates();

app.run();
