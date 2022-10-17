
// dark mode, load before other things so page doesn't flash white
let theme = window.localStorage.getItem("theme") || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light");
if (theme == "dark") {
    enableDarkTheme()
}

function enableDarkTheme() {
    let link = document.createElement("link");
    link.id = "dark-theme";
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = "https://unpkg.com/bulmaswatch/darkly/bulmaswatch.min.css";

    let head = document.getElementsByTagName("head")[0];
    head.insertBefore(link, document.getElementById("override-styles"));

    document.getElementById("theme-icon").classList.remove("fa-sun")
    document.getElementById("theme-icon").classList.add("fa-moon")

    document.body.className = "dark";
}

// dark mode button
document.getElementById("theme-button").addEventListener("click", e => {

    if (document.getElementById("dark-theme")) {

        document.getElementById("dark-theme").remove();
        document.body.classList.remove("dark");
        document.getElementById("theme-icon").classList.remove("fa-moon");
        document.getElementById("theme-icon").classList.add("fa-sun");

        window.localStorage.setItem("theme", "light")
    } else {
        window.localStorage.setItem("theme", "dark")
        enableDarkTheme();
    }
});