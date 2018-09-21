const utils = require("scripts/utils");
const mainView = require("scripts/mainView");

function run() {
  let details = utils.loadCapsuleDetail();
  mainView.init(details);
}

module.exports = {
  run: run
};
