import "@melloware/coloris-npm/dist/coloris.css";
import Coloris from "@melloware/coloris-npm";

Coloris.init();

Coloris({
    el: "#coloris",
});

Coloris.close();

const status = document.getElementById("status");
if (status) status.textContent = "done";
