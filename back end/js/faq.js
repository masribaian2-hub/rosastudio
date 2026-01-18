const items = document.querySelectorAll("details");

items.forEach((item) => {
    item.addEventListener("toggle", (event) => {
        if (item.open) {
            items.forEach((otherItem) => {
                if (otherItem !== item) {
                    otherItem.removeAttribute("open");
                }
            });
        }
    });
});