import "./style.css";

interface MessageErreur {
    vide?: string;
    pattern?: string;
    type?: string;
    min?: string;
    max?: string;
}

interface ErreursJSON {
    [cle: string]: MessageErreur;
}

let objMessages: ErreursJSON;
let etapeActuelle = 1;

const formulaire = document.querySelector<HTMLFormElement>("#formDon")!;

const etape1 = document.querySelector<HTMLElement>("#etape1")!;
const etape2 = document.querySelector<HTMLElement>("#etape2")!;
const etape3 = document.querySelector<HTMLElement>("#etape3")!;
const etape4 = document.querySelector<HTMLElement>("#etape4")!;

const etapes = [etape1, etape2, etape3, etape4];
// Je vais chercher les messages d'erreur dans le fichier JSON
fetch("/objJSONMessages.json")
    .then(function (reponse) {
        return reponse.json();
    })
    .then(function (messages: ErreursJSON) {
        objMessages = messages;
        initialiser();
    });

// Boutons et la navigation du formulaire
function initialiser(): void {
    formulaire.noValidate = true;
    afficherEtape(1);

    document.querySelector("#suivant1")?.addEventListener("click", function () {
        if (validerEtape1()) {
            afficherEtape(2);
        }
    });

    document.querySelector("#precedent2")?.addEventListener("click", function () {
        afficherEtape(1);
    });

    document.querySelector("#suivant2")?.addEventListener("click", function () {
        if (validerEtape(etape2)) {
            afficherEtape(3);
        }
    });

    document.querySelector("#precedent3")?.addEventListener("click", function () {
        afficherEtape(2);
    });

    document.querySelector("#suivant3")?.addEventListener("click", function () {
        if (validerEtape(etape3)) {
            afficherEtape(4);
        }
    });

    document.querySelector("#precedent4")?.addEventListener("click", function () {
        afficherEtape(3);
    });

    // Vérification formulaire quand on clique sur Valider
    formulaire.addEventListener("submit", function (evenement) {
        if (!validerEtape4()) {
            evenement.preventDefault();
        }
    });

    initialiserNavigationEtapes();
}

// On affiche seulement une étape
function afficherEtape(numero: number): void {
    for (let i = 0; i < etapes.length; i++) {
        etapes[i].classList.add("hidden");
    }

    etapes[numero - 1].classList.remove("hidden");

    etapeActuelle = numero;

    modifierCouleurEtapes();
}

function modifierCouleurEtapes(): void {

    // On récupère tous les liens des étapes    
    const liens =
        document.querySelectorAll<HTMLAnchorElement>(".js-etape");

    // Affiche chaque étape une par une
    for (let i = 0; i < liens.length; i++) {
        const numero = Number(liens[i].dataset.etape);

        // On enlève les anciennes couleurs
        liens[i].classList.remove(
            "bg-red-600",
            "text-white",
            "bg-red-200",
            "text-red-700",
            "bg-gray-300",
            "text-gray-500"
        );

        liens[i].removeAttribute("aria-current");

        if (numero === etapeActuelle) {
            liens[i].classList.add(
                "bg-red-600",
                "text-white"
            );

            liens[i].setAttribute("aria-current", "step");
        } else if (numero < etapeActuelle) {
            liens[i].classList.add(
                "bg-red-200",
                "text-red-700"
            );
        } else {
            liens[i].classList.add(
                "bg-gray-300",
                "text-gray-500"
            );
        }
    }
    modifierCouleurLignes();
}
// Changement de couleur des numéros des étapes
function modifierCouleurLignes(): void {
    const navigations =
        document.querySelectorAll<HTMLElement>(
            'nav[aria-label="Étapes du formulaire de don"]'
        );

    for (let i = 0; i < navigations.length; i++) {
        const lignes =
            navigations[i].querySelectorAll<HTMLElement>(".js-ligne");

        for (let j = 0; j < lignes.length; j++) {
            lignes[j].classList.remove(
                "bg-red-200",
                "bg-gray-300"
            );

            if (j + 1 < etapeActuelle) {
                lignes[j].classList.add("bg-red-200");
            } else {
                lignes[j].classList.add("bg-gray-300");
            }
        }
    }
}

// On vérifie tous les champs obligatoires d'une étape
function validerEtape(etape: HTMLElement): boolean {
    const champs =
        etape.querySelectorAll<HTMLInputElement | HTMLSelectElement>(
            "input[required], select[required]"
        );

    let valide = true;

    for (let i = 0; i < champs.length; i++) {
        if (!validerChamp(champs[i])) {
            valide = false;
        }
    }
    return valide;
}

// On vérifie un champ du formulaire
function validerChamp(
    champ: HTMLInputElement | HTMLSelectElement
): boolean {

    const nom = champ.name;

    const idErreur =
        "#erreur" +
        nom.charAt(0).toUpperCase() +
        nom.slice(1);

    const erreur =
        document.querySelector<HTMLElement>(idErreur);

    if (champ.value.trim() === "") {
        afficherErreur(
            champ,
            erreur,
            objMessages[nom]?.vide
        );
        return false;
    }

    if (
        champ instanceof HTMLInputElement &&
        champ.validity.typeMismatch
    ) {
        afficherErreur(
            champ,
            erreur,
            objMessages[nom]?.type
        );
        return false;
    }

    if (
        champ instanceof HTMLInputElement &&
        champ.validity.patternMismatch
    ) {
        afficherErreur(
            champ,
            erreur,
            objMessages[nom]?.pattern
        );
        return false;
    }
    cacherErreur(champ, erreur);
    return true;
}

// On affiche un message d'erreur
function afficherErreur(
    champ: HTMLInputElement | HTMLSelectElement,
    erreur: HTMLElement | null,
    message?: string
): void {

    if (erreur) {
        erreur.textContent = message || "Ce champ est invalide.";
        erreur.classList.remove("hidden");
    }
    champ.setAttribute("aria-invalid", "true");
}
// On cache un message d'erreur
function cacherErreur(
    champ: HTMLInputElement | HTMLSelectElement,
    erreur: HTMLElement | null
): void {

    if (erreur) {
        erreur.textContent = "";
        erreur.classList.add("hidden");
    }
    champ.removeAttribute("aria-invalid");
}
// On vérifie les choix de la première étape
function validerEtape1(): boolean {
    let valide = true;

    const typeDon =
        document.querySelector<HTMLInputElement>(
            'input[name="typeDon"]:checked'
        );

    const montant =
        document.querySelector<HTMLInputElement>(
            'input[name="montant"]:checked'
        );

    const autreDon =
        document.querySelector<HTMLInputElement>("#autreDon")!;

    const erreurTypeDon =
        document.querySelector<HTMLElement>("#erreurTypeDon");

    const erreurMontant =
        document.querySelector<HTMLElement>("#erreurMontant");

    if (!typeDon) {
        if (erreurTypeDon) {
            erreurTypeDon.textContent =
                objMessages.typeDon?.vide || "";

            erreurTypeDon.classList.remove("hidden");
        }
        valide = false;
    } else {
        if (erreurTypeDon) {
            erreurTypeDon.textContent = "";
            erreurTypeDon.classList.add("hidden");
        }
    }

    if (!montant && autreDon.value.trim() === "") {
        if (erreurMontant) {
            erreurMontant.textContent =
                objMessages.montant?.vide || "";

            erreurMontant.classList.remove("hidden");
        }
        valide = false;
    } else if (autreDon.value.trim() !== "") {
        const valeur = Number(autreDon.value);

        if (valeur < 10) {
            if (erreurMontant) {
                erreurMontant.textContent =
                    objMessages.montant?.min || "";

                erreurMontant.classList.remove("hidden");
            }
            valide = false;
        } else if (valeur > 50000) {
            if (erreurMontant) {
                erreurMontant.textContent =
                    objMessages.montant?.max || "";

                erreurMontant.classList.remove("hidden");
            }
            valide = false;
        } else {
            if (erreurMontant) {
                erreurMontant.textContent = "";
                erreurMontant.classList.add("hidden");
            }
        }
    } else {
        if (erreurMontant) {
            erreurMontant.textContent = "";
            erreurMontant.classList.add("hidden");
        }
    }
    return valide;
}

// On vérifie les champs et le paiement de l'étape 4
function validerEtape4(): boolean {
    let valide = true;

    const paiement =
        document.querySelector<HTMLInputElement>(
            'input[name="paiement"]:checked'
        );

    const erreurPaiement =
        document.querySelector<HTMLElement>("#erreurPaiement");

    if (!paiement) {
        if (erreurPaiement) {
            erreurPaiement.textContent =
                objMessages.paiement?.vide || "";

            erreurPaiement.classList.remove("hidden");
        }
        valide = false;
    } else {
        if (erreurPaiement) {
            erreurPaiement.textContent = "";
            erreurPaiement.classList.add("hidden");
        }
    }

    if (!validerEtape(etape4)) {
        valide = false;
    }
    return valide;
}

// On active les liens pour revenir aux étapes précédentes
function initialiserNavigationEtapes(): void {
    const liens =
        document.querySelectorAll<HTMLAnchorElement>(".js-etape");

    for (let i = 0; i < liens.length; i++) {
        liens[i].addEventListener("click", function (evenement) {
            evenement.preventDefault();
            const numero =
                Number(liens[i].dataset.etape);
            if (numero <= etapeActuelle) {
                afficherEtape(numero);
            }
        });
    }
}