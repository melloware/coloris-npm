import * as Coloris from "@melloware/coloris-npm";

Coloris.init();

Coloris.coloris({
    el: "#coloris",
});

Coloris.close();

document.getElementById("status").textContent = "done";
