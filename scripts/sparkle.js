async function getLatestVersion() {
  let resp = await $http.get("https://raw.githubusercontent.com/JeziL/JSpresso/master/config.json");
  if (resp.data) {
    return resp.data.info.version;
  }
  return null;
}

function getCurrentVersion() {
  let config = JSON.parse($file.read("config.json").string);
  return config.info.version;
}

function compareVersion(v1, v2) {
  let v1Parts = v1.split(".").map(Number);
  let v2Parts = v2.split(".").map(Number);
  for (let i = 0; i < Math.min(v1Parts.length, v2Parts.length); i++) {
    if (v1Parts[i] > v2Parts[i]) {
      return 1;
    }
    else if (v1Parts[i] < v2Parts[i]) {
      return -1;
    }
  }
  return 0;
}

async function update() {
  let name = $addin.current.name;
  let resp = await $http.download("https://raw.githubusercontent.com/JeziL/JSpresso/master/.release/JSpresso.box");
  let newVersion = resp.data;
  if (newVersion) {
    $addin.save({
      name: name,
      data: newVersion,
      handler: (success) => {
        if (success) {
          $ui.toast($l10n("STRING_UI_UPDATED"));
        }
        else {
          $ui.error($l10n("STRING_UI_UPDATEFAILED"));
        }
      }
    });
  }
  else {
    $ui.error($l10n("STRING_UI_UPDATEFAILED"));
  }
}

function updateDetected(cV, lV) {
  var msg = $l10n("STRING_UI_UPDATEMSG");
  msg = msg.replace("CURRENT", cV);
  msg = msg.replace("LATEST", lV);
  $ui.alert({
    title: $l10n("STRING_UI_UPDATETITLE"),
    message: msg,
    actions: [
      {
        title: $l10n("STRING_UI_CANCEL"),
        handler: () => {}
      },
      {
        title: $l10n("STRING_UI_OK"),
        handler: update
      }
    ]
  });
}

async function checkForUpdates() {
  let currentVersion = getCurrentVersion();
  let latestVersion = await getLatestVersion();
  if (!latestVersion) {
    return;
  }
  if (compareVersion(latestVersion, currentVersion) > 0) {
    updateDetected(currentVersion, latestVersion);
  }
}

module.exports = {
  checkForUpdates: checkForUpdates
};