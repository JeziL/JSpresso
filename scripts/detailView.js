const utils = require("scripts/utils");

function init(cap) {
  var detailView = {
    props: {
      id: "detailVC",
      title: $l10n("STRING_UI_DETAIL")
    },
    views: [
      {
        type: "web",
        props: {
          html: utils.generateDetailHTML(cap),
          showsProgress: false
        },
        layout: $layout.fill
      }
    ]
  };

  $ui.push(detailView);
}

module.exports = {
  init: init
};
