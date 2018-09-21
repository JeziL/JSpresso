const utils = require("scripts/utils");
const detailView = require("scripts/detailView");
const addView = require("scripts/addView");

function init(details) {
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
            detailView.init(details[indexPath.row]);
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
                addView.init(details[indexPath.row]);
              }
            }
          ]
        },
        layout: $layout.fill,
        events: {
          didSelect: function (sender, indexPath) {
            addView.addToHealth(details[indexPath.row], new Date());
          }
        }
      }
    ]
  };

  $ui.render(capTableView);
}

module.exports = {
  init: init
};
