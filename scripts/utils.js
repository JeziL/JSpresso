function loadCapsuleDetail() {
  var l10n = "en";
  switch ($device.info.language) {
    case "zh-Hans":
      l10n = "zhs";
      break;
    case "zh-Hant":
      l10n = "zht";
      break;
  }
  let caps = JSON.parse($file.read(`assets/capsule_detail/capsules.${l10n}.json`).string);
  caps.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });
  return caps;
}

function filterDataSource(ds, query) {
  query = query.toLowerCase().replace(" ", "");
  var result = new Array;
  for (let i = 0; i < ds.length; i++) {
    let data = ds[i];
    let name = data.capName.text.toLowerCase().replace(" ", "");
    if (name.includes(query)) {
      result.push(data);
    }
  }
  result.sort((a, b) => {
    if (a.capName.text < b.capName.text) return -1;
    if (a.capName.text > b.capName.text) return 1;
    return 0;
  });
  return result;
}

function detail2DataSource(detail) {
  var ds = new Array;
  for (let i = 0; i < detail.length; i++) {
    const cap = detail[i];
    var d = new Object;
    d.capIcon = { data: $file.read(`assets/capsule_img/${cap.icon}`) };
    d.capName = { text: cap.name.toUpperCase() };
    d.capSummary = { text: cap.summary };
    d.caffeine = { text: `${cap.caffeine_content}mg` };
    d.index = i;
    ds.push(d);
  }
  return ds;
}

function generateDetailHTML(cap) {
  var html = $file.read("assets/detail_template.html").string;
  html = html.replace(/\$INTENSITY\$/, $l10n("STRING_HTML_INTENSITY"));
  html = html.replace(/\$CUP_SIZE\$/, $l10n("STRING_HTML_CUPSIZE"));
  html = html.replace(/\$ORIGIN\$/, $l10n("STRING_HTML_ORIGIN"));
  html = html.replace(/\$ROASTING\$/, $l10n("STRING_HTML_ROASTING"));
  html = html.replace(/\$AROMATIC\$/, $l10n("STRING_HTML_AROMATIC"));
  html = html.replace(/\$CAP\$/, JSON.stringify(cap));
  return html;
}

function writeCaff2Health(date, value) {
  if ($objc("HKHealthStore").$isHealthDataAvailable()) {
    let healthStore = $objc("HKHealthStore").$new();
    let cafType = $objc("HKObjectType").$quantityTypeForIdentifier("HKQuantityTypeIdentifierDietaryCaffeine");
    let shareType = NSSet.$setWithObject(cafType);
    let readType = NSSet.$setWithObject(cafType);

    let completionHandler = $block("void, BOOL, NSError *", (success, error) => {
      if (success) {
        let mg = $objc("HKUnit").$unitFromString("mg");
        let quantity = $objc("HKQuantity").$quantityWithUnit_doubleValue(mg, value);
        let calendar = $objc("NSCalendar").$currentCalendar();
        let components = calendar.$components_fromDate(0x7C, date);
        let sampleTime = calendar.$dateFromComponents(components);
        let sample = $objc("HKQuantitySample").$quantitySampleWithType_quantity_startDate_endDate(cafType, quantity, sampleTime, sampleTime);
        let saveHandler = $block("void, BOOL, NSError *", (success, error) => {
          if (success) {
            $ui.toast($l10n("STRING_UI_RECORDED"), 2);
          }
        });
        healthStore.$saveObject_withCompletion(sample, saveHandler);
      }
    });

    healthStore.$requestAuthorizationToShareTypes_readTypes_completion(shareType, readType, completionHandler);
  }
}

module.exports = {
  loadCapsuleDetail: loadCapsuleDetail,
  writeCaff2Health: writeCaff2Health,
  detail2DataSource: detail2DataSource,
  generateDetailHTML: generateDetailHTML,
  filterDataSource: filterDataSource
};
