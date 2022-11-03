
// dark mode, load before other things so page doesn't flash white
let theme = window.localStorage.getItem("theme") || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light");
setTheme(theme);

function setTheme(theme) {
    let style = document.getElementById("theme");
    style.href = `assets/css/${theme}/${theme}.css`;
    style.dataset.theme = theme;

    document.getElementById("theme-icon").className = "fas";
    document.getElementById("theme-icon").classList.add(
                                    theme == "light" ? "fa-sun" : "fa-moon");
}

// theme changer button
document.getElementById("theme-button").addEventListener("click", e => {
    let style = document.getElementById("theme");

    if (style.dataset.theme == "dark") {

        window.localStorage.setItem("theme", "light");
        setTheme("light");
    } else {
        window.localStorage.setItem("theme", "dark");
        setTheme("dark");
    }
});