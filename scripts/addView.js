const utils = require("scripts/utils");

function init(cap) {
  let dateTimeCell = {
    views: [
      {
        type: "label",
        props: {
          id: "title",
          textColor: $color("lightGray")
        },
        layout: (make, view) => {
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
        layout: (make, view) => {
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
          handler: (sender) => {
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
        layout: (make, view) => {
          make.left.top.right.equalTo(view.super);
          make.height.equalTo(view.super).multipliedBy(0.6);
        }
      },
      {
        type: "date-picker",
        layout: (make) => {
          make.top.equalTo($("list").bottom);
          make.left.right.bottom.inset(0);
        },
        events: {
          changed: (sender) => {
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

module.exports = {
  init: init,
  addToHealth: addToHealth
};
