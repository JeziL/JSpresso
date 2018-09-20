const utils = require("scripts/utils");

function renderUI(details) {
  var capCell = {
    views: [
      {
        type: "image",
        props: {
          id: "capIcon"
        },
        layout: function (make) {
          make.size.equalTo($size(60, 60));
          make.top.left.inset(20);
        }
      },
      {
        type: "label",
        props: {
          id: "capName",
          font: $font("Trebuchet MS", 16),
          lines: 2,
          autoFontSize: true
        },
        layout: function (make, view) {
          make.top.inset(5);
          make.left.equalTo($("capIcon").right).offset(20);
          make.height.equalTo(60);
          make.width.equalTo(view.super).multipliedBy(0.6).offset(-105);
        }
      },
      {
        type: "label",
        props: {
          id: "capSummary",
          font: $font(14),
          textColor: $color("lightGray")
        },
        layout: function (make) {
          make.top.equalTo($("capName").bottom).offset(-10);
          make.left.equalTo($("capName").left);
          make.height.equalTo(30);
          make.width.equalTo($("capName").width);
        }
      },
      {
        type: "button",
        props: {
          id: "detailBtn",
          type: $btnType.infoLight
        },
        layout: function (make, view) {
          make.size.equalTo($size(30, 30));
          make.centerY.equalTo(view.super);
          make.right.inset(20);
        },
        events: {
          tapped: function (sender) {
            let cell = sender.super.super;
            let tableView = cell.super;
            let indexPath = tableView.runtimeValue().$indexPathForCell(cell).rawValue();
            pushToDetailView(details[indexPath.row]);
          }
        }
      },
      {
        type: "label",
        props: {
          id: "caffeine",
          align: $align.right,
          font: $font(14),
          textColor: $color("darkGray")
        },
        layout: function (make, view) {
          make.height.equalTo($("detailBtn").height);
          make.centerY.equalTo(view.super);
          make.right.equalTo($("detailBtn").left).offset(-8);
          make.width.equalTo(view.super).multipliedBy(0.4).offset(-60);
        }
      }
    ]
  };
  var capTableView = {
    props: {
      id: "capVC",
      title: "JSpresso"
    },
    views: [
      {
        type: "list",
        props: {
          template: capCell,
          data: utils.detail2DataSource(details),
          rowHeight: 100,
          actions: [
            {
              title: $l10n("STRING_UI_ADD"),
              handler: function (sender, indexPath) {
                pushToAddView(details[indexPath.row]);
              }
            }
          ]
        },
        layout: $layout.fill,
        events: {
          didSelect: function (sender, indexPath) {
            addToHealth(details[indexPath.row], new Date());
          }
        }
      }
    ]
  };

  $ui.render(capTableView);
}

function pushToAddView(cap) {
  let dateTimeCell = {
    views: [
      {
        type: "label",
        props: {
          id: "title",
          textColor: $color("lightGray")
        },
        layout: function (make, view) {
          make.top.left.bottom.inset(15);
          make.width.equalTo(view.super).multipliedBy(0.4).offset(-15);
        }
      },
      {
        type: "label",
        props: {
          id: "value",
          align: $align.right
        },
        layout: function (make, view) {
          make.top.right.bottom.inset(15);
          make.width.equalTo(view.super).multipliedBy(0.6).offset(-15);
        }
      }
    ]
  };
  var addView = {
    props: {
      id: "addVC",
      navButtons: [
        {
          title: $l10n("STRING_UI_RECORD"),
          handler: function (sender) {
            addToHealth(cap, $("date-picker").date);
          }
        }
      ]
    },
    views: [
      {
        type: "list",
        props: {
          template: dateTimeCell,
          data: [
            {
              title: $l10n("STRING_UI_ADDHEADER"),
              rows: [
                {
                  title: { text: $l10n("STRING_UI_ADDDATE") },
                  value: { text: new Date().toLocaleDateString() }
                },
                {
                  title: { text: $l10n("STRING_UI_ADDTIME") },
                  value: { text: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) }
                }
              ]
            }
          ],
          rowHeight: 50,
          footer: {
            type: "label",
            props: {
              height: 15,
              text: $l10n("STRING_UI_ADDFOOTER"),
              textColor: $rgb(110, 110, 110),
              align: $align.center,
              font: $font(13)
            }
          }
        },
        layout: function (make, view) {
          make.left.top.right.equalTo(view.super);
          make.height.equalTo(view.super).multipliedBy(0.6);
        }
      },
      {
        type: "date-picker",
        layout: function (make) {
          make.top.equalTo($("list").bottom);
          make.left.right.bottom.inset(0);
        },
        events: {
          changed: function (sender) {
            var data = $("list").data;
            data[0].rows[0].value.text = sender.date.toLocaleDateString();
            data[0].rows[1].value.text = sender.date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
            $("list").data = data;
          }
        }
      }
    ]
  };

  $ui.push(addView);
}

function pushToDetailView(cap) {
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

function addToHealth(cap, time) {
  var msg = $l10n("STRING_UI_ADDALERTMSG");
  msg = msg.replace(/CAFF/, cap.caffeine_content.toString());
  msg = msg.replace(/TIME/, time.toLocaleString([], {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }));
  $ui.alert({
    title: $l10n("STRING_UI_ADDALERTTITLE"),
    message: msg,
    actions: [
      {
        title: $l10n("STRING_UI_CANCEL"),
        handler: function() {}
      },
      {
        title: $l10n("STRING_UI_OK"),
        handler: function() {
          utils.writeCaff2Health(time, cap.caffeine_content);
        }
      }
    ]
  });
}

function run() {
  let details = utils.loadCapsuleDetail();
  renderUI(details);
}

module.exports = {
  run: run
};