import "@melloware/coloris-npm/dist/coloris.css";
import * as Coloris from "@melloware/coloris-npm";

Coloris.init();

Coloris.coloris({
    el: "#coloris",
});

Coloris.close();

const status = document.getElementById("status");
if (status) status.textContent = "done";
