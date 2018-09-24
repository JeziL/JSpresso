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
        layout: (make) => {
          make.size.equalTo($size(44, 44));
          make.top.left.inset(28);
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
        layout: (make, view) => {
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
          textColor: $color("lightGray"),
          lines: 2
        },
        layout: (make) => {
          make.top.equalTo($("capName").bottom).offset(-15);
          make.left.equalTo($("capName").left);
          make.height.equalTo(40);
          make.width.equalTo($("capName").width);
        }
      },
      {
        type: "button",
        props: {
          id: "detailBtn",
          type: $btnType.infoLight
        },
        layout: (make, view) => {
          make.size.equalTo($size(30, 30));
          make.centerY.equalTo(view.super);
          make.right.inset(20);
        },
        events: {
          tapped: (sender) => {
            let cell = sender.super.super;
            let tableView = cell.super;
            let indexPath = tableView.runtimeValue().$indexPathForCell(cell).rawValue();
            detailView.init(details[$("capTableView").object(indexPath).index]);
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
        layout: (make, view) => {
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
          id: "capTableView",
          template: capCell,
          data: utils.detail2DataSource(details),
          rowHeight: 100,
          actions: [
            {
              title: $l10n("STRING_UI_ADD"),
              handler: (sender, indexPath) => {
                addView.init(details[$("capTableView").object(indexPath).index]);
              }
            }
          ],
          header: {
            type: "view",
            props: {
              bgcolor: $color("white"),
              height: 42
            },
            views: [
              {
                type: "input",
                props: {
                  id: "searchInput",
                  type: $kbType.search,
                  placeholder: $l10n("STRING_UI_SEARCH")
                },
                layout: (make, view) => {
                  make.top.left.right.inset(10);
                  make.bottom.equalTo(view.super);
                },
                events: {
                  changed: (sender) => {
                    $("capTableView").data = utils.filterDataSource(utils.detail2DataSource(details), sender.text);
                  }
                }
              }
            ]
          }
        },
        layout: $layout.fill,
        events: {
          didSelect: (sender, indexPath) => {
            addView.addToHealth(details[$("capTableView").object(indexPath).index], new Date());
          },
          didScroll: (sender) => {
            $("searchInput").blur();
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
