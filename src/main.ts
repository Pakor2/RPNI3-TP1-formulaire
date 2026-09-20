import "./style.css";

let etapeActuelle = 1;

const etape1 = document.querySelector<HTMLElement>("#etape1")!;
const etape2 = document.querySelector<HTMLElement>("#etape2")!;
const etape3 = document.querySelector<HTMLElement>("#etape3")!;
const etape4 = document.querySelector<HTMLElement>("#etape4")!;
const etapes = [etape1, etape2, etape3, etape4];

function afficherEtape(numero: number): void {
    for (let i = 0; i < etapes.length; i++) {
        etapes[i].classList.add("hidden");
    }

    etapes[numero - 1].classList.remove("hidden");
    etapeActuelle = numero;
}

document.querySelector("#suivant1")?.addEventListener("click", function () {
    afficherEtape(2);
});

document.querySelector("#precedent2")?.addEventListener("click", function () {
    afficherEtape(1);
});

document.querySelector("#suivant2")?.addEventListener("click", function () {
    afficherEtape(3);
});

document.querySelector("#precedent3")?.addEventListener("click", function () {
    afficherEtape(2);
});

document.querySelector("#suivant3")?.addEventListener("click", function () {
    afficherEtape(4);
});

document.querySelector("#precedent4")?.addEventListener("click", function () {
    afficherEtape(3);
});

const liensEtapes = document.querySelectorAll<HTMLAnchorElement>(
    'nav a[href^="#etape"]'
);

for (let i = 0; i < liensEtapes.length; i++) {
    liensEtapes[i].addEventListener("click", function (evenement) {
        evenement.preventDefault();

        const href = liensEtapes[i].getAttribute("href");

        if (href === "#etape1") afficherEtape(1);
        if (href === "#etape2") afficherEtape(2);
        if (href === "#etape3") afficherEtape(3);
        if (href === "#etape4") afficherEtape(4);
    });
}

afficherEtape(1);