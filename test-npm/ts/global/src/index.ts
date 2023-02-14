Coloris.init();

Coloris.coloris({
    el: "#coloris",
    a11y: {
        alphaSlider: "",
        clear: "",
        close: "",
        format: "",
        hueSlider: "",
        input: "",
        instruction: "",
        marker: "",
        open: "",
        swatch: "",
    },
    alpha: false,
    clearButton: true,
    clearLabel: "",
    closeButton: true,
    closeLabel: "",
    defaultColor: "",
    focusInput: false,
    forceAlpha: true,
    format: "auto",
    formatToggle: false,
    inline: false,
    margin: 0,
    onChange: (color: string) => {},
    parent: "",
    rtl: false,
    selectInput: false,
    swatches: [""],
    swatchesOnly: false,
    theme: "default",
    themeMode: "auto",
    wrap: false,
});

Coloris.coloris({
    el: "#coloris",
    format: "auto",
});
Coloris.coloris({
    el: "#coloris",
    format: "hex",
});
Coloris.coloris({
    el: "#coloris",
    format: "hsl",
});
Coloris.coloris({
    el: "#coloris",
    format: "mixed",
});
Coloris.coloris({
    el: "#coloris",
    format: "rgb",
});

Coloris.coloris({
    el: "#coloris",
    theme: "default",
});
Coloris.coloris({
    el: "#coloris",
    theme: "large",
});
Coloris.coloris({
    el: "#coloris",
    theme: "pill",
});
Coloris.coloris({
    el: "#coloris",
    theme: "polaroid",
});

Coloris.coloris({
    el: "#coloris",
    themeMode: "auto",
});
Coloris.coloris({
    el: "#coloris",
    themeMode: "dark",
});
Coloris.coloris({
    el: "#coloris",
    themeMode: "light",
});


Coloris.close();

Coloris.close(true);

Coloris.updatePosition();

Coloris.setInstance(".foo", {});

Coloris.setInstance(".foo", {themeMode: "dark", onChange: (color: string) => {}});

Coloris.removeInstance(".foo");

document.getElementById("")?.addEventListener("coloris:pick", e => {
    const color: string = e.detail.color;
});