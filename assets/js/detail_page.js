function setIntense(cap) {
    let intense = cap.intensity;
    var intenseIcon = document.getElementById("intense_icon");
    var children = intenseIcon.children;
    for (let i = 0; i < intense; i++) {
        children[i].style.display = "inline";
    }
}

function setCupSize(cap) {
    let cupSize = cap.cup_sizes;
    var cupIcon = document.getElementById("cup_icon");
    var children = cupIcon.children;
    for (let i = 0; i < 4; i++) {
        if (cupSize & (0x8 >> i)) {
            children[i].style.display = "inline";
        }
    }
}

function setTextContents(cap) {
    if (cap.name_l10n != cap.name) {
        document.getElementById("l10n_name").innerHTML = ` · ${cap.name_l10n}`;
    }
    let keys = ["name", "series", "description", "origin", "roasting", "aromatic_profile"];
    for (let i = 0; i < keys.length; i++) {
        document.getElementById(keys[i]).innerHTML = cap[keys[i]];
    }
}