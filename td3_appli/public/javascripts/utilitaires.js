function displayItems(items, page, rowsPerPage, tableBody, renderRow, isInTable = true) {
    tableBody.innerHTML = "";
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedItems = items.slice(start, end);

    paginatedItems.forEach(item => {
        let row;
        if (isInTable) { // Créer des lignes de tableau
            row = document.createElement("tr");
            row.classList.add("hover");
        } else { // Créer des balises div de classe offer-card
            row = document.createElement("div");
            row.classList.add("offer-card");
        }

        row.innerHTML = renderRow(item);
        tableBody.appendChild(row);
    });

    // Add event listeners to delete buttons if needed
    document.querySelectorAll('.btn-error').forEach(button => {
        button.addEventListener('click', function() {
            const email = this.getAttribute('data-mail');
            const offreEmploi = this.getAttribute('data-offre-emploi');
            const candidat = this.getAttribute('data-candidat');

            if (email) {
                deleteUser(email, this.closest('tr'), items, pagination, rowsPerPage);
            } else if (offreEmploi && candidat) {
                deleteCandidature(offreEmploi, candidat, this.closest('tr'), items, pagination, rowsPerPage);
            } else {
                console.error('No valid attributes found for deletion');
            }
        });
    });
}

function setupPagination(items, wrapper, rowsPerPage, tableBody, renderRow, isInTable = true) {
    wrapper.innerHTML = "";
    const pageCount = Math.ceil(items.length / rowsPerPage);
    let currentPage = 1;

    const prevButton = document.createElement("button");
    prevButton.innerText = "<<";
    prevButton.classList.add("page-link");
    prevButton.addEventListener("click", function() {
        if (currentPage > 1) {
            currentPage--;
            updatePagination();
        }
    });
    wrapper.appendChild(prevButton);

    const pageIndicator = document.createElement("span");
    pageIndicator.id = "pageIndicator";
    pageIndicator.innerText = `Page ${currentPage}`;
    pageIndicator.classList.add("page-indicator");
    wrapper.appendChild(pageIndicator);

    const nextButton = document.createElement("button");
    nextButton.innerText = ">>";
    nextButton.classList.add("page-link");
    nextButton.addEventListener("click", function() {
        if (currentPage < pageCount) {
            currentPage++;
            updatePagination();
        }
    });
    wrapper.appendChild(nextButton);

    function updatePagination() {
        displayItems(items, currentPage, rowsPerPage, tableBody, renderRow, isInTable);
        pageIndicator.innerText = `Page ${currentPage}`;
    }

    updatePagination();
}

function deleteUser(email, row, items, pagination, rowsPerPage) {
    fetch('/users/deleteuser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mail: email })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            row.remove();
            items = items.filter(item => item.mail !== email);

            alert('L\'utilisateur a bien été supprimé');

            // Optionally, you can refresh the pagination and the item list
            // setupPagination(items, pagination, rowsPerPage, document.getElementById("usersTableBody"), renderUserRow);
        } else {
            alert('Erreur lors de la suppression de l\'utilisateur: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Erreur lors de la suppression de l\'utilisateur.');
    });
}

function deleteCandidature(offreEmploi, candidat, row, items, pagination, rowsPerPage) {
    fetch('/candidature/deletecandidature', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ offreEmploi: offreEmploi, candidat: candidat })
    })
    .then(response => response.text()) // Changed to text to log the actual response
    .then(text => {
        console.log("Response text:", text); // Log the response text
        const data = JSON.parse(text); // Parse the text to JSON
        if (data.success) {
            row.remove();
            items = items.filter(item => item.offreEmploi !== offreEmploi || item.candidat !== candidat);

            alert('La candidature a bien été supprimée');

            // Optionally, you can refresh the pagination and the item list
            // setupPagination(items, pagination, rowsPerPage, document.getElementById("usersTableBody"), renderUserRow);
        } else {
            alert('Erreur lors de la suppression de la candidature.');
        }
    })
    .catch(error => console.error('Error:', error));
}


function renderUserRow(user) {
    return `
        <td>${user.prenom}</td>
        <td>${user.nom}</td>
        <td>${user.mail}</td>
        <td>${user.tel}</td>
        <td>${user.dateCreation}</td>
        <td> <button class="btn btn-primary" onclick="window.location.href = 'http://localhost:3000/users/${user.id}';">Détail utilisateur</button>
        <button class="btn btn-danger" data-mail="${user.mail}">Supprimer</button></td>
    `;
}
function renderOrganisationCard(organisation) {
    return `
        <div class="container-column card-content">
            <div class="cardTitle">
                ${organisation.nom}
            </div>
            <div class="container-row">
                <div>
                    ${organisation.adrSiegeSocial}
                </div>
                <div class="little_blue_card">
                    ${organisation.type}
                </div>
            </div>
        </div>
        <div class="container-column small right">
            <div class="container-row buttons">
                <button class="btn-secondary" onclick="adhereToOrganisation('${organisation.siren}')">Adhérer</button>
                <button class="btn-secondary" onclick="window.location.href = 'http://localhost:3000/DemandeAdherRecruteur/adherenceslist/${organisation.siren}';">Demandes d'adhérences</button>
                <button class="btn-secondary" onclick="window.location.href = 'http://localhost:3000/organisations/${organisation.siren}'">Voir fiche</button>
            </div>
            <div class="top-margin">
                Siren : ${organisation.siren}
            </div>
        </div>
    `;
}

function renderAdherenceCard(adherence) {
    return `
        <div class="card-content">
            <div class="container-column">
                <div class="container-row">
                    <div>
                        Organisation Siren : ${adherence.organisation}
                    </div>
                    <div>
                        ID recruteur : ${adherence.recruteur}
                    </div>
                    <div>
                        Etat : ${adherence.etat}
                    </div>
                </div>
            </div>

        </div>
        <div class="container-column">
            <div class="buttons">
            <button class="btn-secondary accept-btn" data-organisation="${adherence.organisation}" data-recruteur="${adherence.recruteur}" data-etat="validee">Accepter</button>
            <button class="btn-danger reject-btn" data-organisation="${adherence.organisation}" data-recruteur="${adherence.recruteur}" data-etat="refusee">Refuser</button>
            </div>
        </div>
    `;
}

function renderOffreEmploiCard(offre) {
    return `
    <div class="card-content">
        <div class="cardTitle">
            ${offre.intitule}
        </div>
        <div class="container-row">
            <div>
                ${offre.organisation_nom}
            </div>
            <div>
                ${offre.lieuMission}
            </div>
            <div>
                Valide jusqu'au ${offre.dateValidite}
            </div>
        </div>

        <div class="container-row">
            <div class="little_blue_card">
                ${offre.remuneration}
            </div>
            <div class="little_blue_card">
                ${offre.rythme}
            </div>
            <div>
                Statut : ${offre.etatOffre}
            </div>
        </div>
    </div>
    <div class="buttons">
        <button class="btn-secondary" onclick="handleOfferDetailsClick('${offre.offre_id}')">Voir détails / Candidater</button>
    </div>
`;
}

function renderFichePosteCard(fiche) {
    let card = `
        <div class="container-column card-content">
            <div id="orga" class="cardTitle">
                ${fiche.organisation_nom} (${fiche.organisation_siren}) - ${fiche.statutPoste_nom}, ${fiche.metier_nom}
            </div>
            <div class="container-row">
                <div class="little_blue_card">
                    ${fiche.lieuMission}
                </div>
                <div class="little_blue_card">
                    ${fiche.salaireMin}€ - ${fiche.salaireMax}€ brut/an
                </div>
                <div class="little_blue_card">
                    ${fiche.rythme}
                </div>
            </div>
            <div class="container-row">
                Responsable hiérarchique : ${fiche.responsableHierarchique}
            </div>
            <div class="container-row">
                Description : ${fiche.description}
            </div>

        </div>
        <div class="container-column right small">
            <div class="buttons bottom-margin">`;

        if (fiche.isRecruteur) {
            card += `
                <button id="createOfferButton" type="button" class="btn-secondary" onclick="createNewOffer('${fiche.fichePoste_id}')">Nouvelle offre</button>
            `;
        }

        card += `
                <button class="btn-secondary">Modifier</button>
                <button class="btn-danger">Supprimer</button>
            </div>

            <div >
                ID Fiche : ${fiche.fichePoste_id}
            </div>
            <div>
                Etat : ${fiche.fichePoste_etat}
            </div>
        </div>
    `;
    return card;
}

function renderUserCard(user) {
    return `
        <div class="card-content">
            <div class="cardTitle">
                ${user.prenom} ${user.nom}
            </div>
            <div class="container-row">
                <div class="little_blue_card">
                    ${user.mail}
                </div>
                <div class="little_blue_card">
                    ${user.tel}
                </div>
                <div>
                    Créé le ${user.dateCreation}
                </div>
            </div>
        </div>
        <div class="container-column right small">
            <div class="buttons">
                <button class="btn btn-secondary" onclick="window.location.href = 'http://localhost:3000/users/${user.id}';">Détails utilisateur</button>
            </div>
        </div>
    `;
}

function renderOffreEmploiCard(offre) {
    return `
        <div class="card-content">
            <div class="cardTitle">
                ${offre.intitule}
            </div>
            <div class="container-row">
                <div>
                    ${offre.organisation_nom}
                </div>
                <div>
                    ${offre.lieuMission}
                </div>
                <div>
                    Valide jusqu'au ${offre.dateValidite}
                </div>
            </div>

            <div class="container-row">
                <div class="little_blue_card">
                    ${offre.remuneration}
                </div>
                <div class="little_blue_card">
                    ${offre.rythme}
                </div>
                <div>
                    Statut : ${offre.etatOffre}
                </div>
            </div>
        </div>
        <div class="buttons">
            <button class="btn-secondary" onclick="window.location.href = 'http://localhost:3000/detailsoffre/${offre.offre_id}'">Voir détails / Candidater</button>
        </div>
    `;
}

function renderFichePosteCard(fiche) {
    let card = `
        <div class="container-column card-content">
            <div id="orga" class="cardTitle">
                ${fiche.organisation_nom} (${fiche.organisation_siren}) - ${fiche.statutPoste_nom}, ${fiche.metier_nom}
            </div>
            <div class="container-row">
                <div class="little_blue_card">
                    ${fiche.lieuMission}
                </div>
                <div class="little_blue_card">
                    ${fiche.salaireMin}€ - ${fiche.salaireMax}€ brut/an
                </div>
                <div class="little_blue_card">
                    ${fiche.rythme}
                </div>
            </div>
            <div class="container-row">
                Responsable hiérarchique : ${fiche.responsableHierarchique}
            </div>
            <div class="container-row">
                Description : ${fiche.description}
            </div>

        </div>
        <div class="container-column right small">
            <div class="buttons bottom-margin">`;

        if (fiche.isRecruteur) {
            card += `
                <button id="createOfferButton" type="button" class="btn-secondary" onclick="createNewOffer('${fiche.fichePoste_id}')">Nouvelle offre</button>
            `;
        }

        card += `
                <button class="btn-secondary">Modifier</button>
                <button class="btn-danger">Supprimer</button>
            </div>

            <div >
                ID Fiche : ${fiche.fichePoste_id}
            </div>
            <div>
                Etat : ${fiche.fichePoste_etat}
            </div>
        </div>
    `;
    return card;
}

function renderUserCard(user) {
    return `
        <div class="card-content">
            <div class="cardTitle">
                ${user.prenom} ${user.nom}
            </div>
            <div class="container-row">
                <div class="little_blue_card">
                    ${user.mail}
                </div>
                <div class="little_blue_card">
                    ${user.tel}
                </div>
                <div>
                    Créé le ${user.dateCreation}
                </div>
            </div>
        </div>
        <div class="container-column right small">
            <div class="buttons">
                <button class="btn btn-secondary" onclick="window.location.href = 'http://localhost:3000/users/${user.id}';">Détails utilisateur</button>
            </div>
        </div>
    `;
}

function renderCandidatureCard(candidature) {
    let card = `
        <div class="card-content">
            <div class="container-row">
                <div>
                    ${candidature.offreEmploi}
                </div>
                <div>
                    ${candidature.candidat}
                </div>
                <div>
                    ${candidature.date}
                </div>
                <div>
                    ${candidature.etat}
                </div>
            </div>
            <div class="container-row">`
        candidature.piecesChemAcces.forEach((file, index) => {
            card += `
                <div class="buttons">
                    <button class="btn-secondary">
                        <a href="/files/download/${file.fileName}">
                            Télécharger Pièce ${index + 1}
                        </a>
                    </button>
                </div>`;
        });

        card += `
            </div>
        </div>
        <div class="right-column">
            <div class="buttons">
                <button class="btn-danger"
                        data-offre-emploi="${candidature.offreEmploi}"
                        data-candidat="${candidature.candidat}">
                    Supprimer
                </button>
            </div>
        </div>
    `;
    return card;
}


function renderCandidatureRow(candidature) {
    const downloadLinks = candidature.piecesChemAcces.map((file, index) => {
        return `<a href="${file.filePath}" download class="btn btn-download">Télécharger Pièce ${index + 1}</a><br>`;
    }).join('');

    return `
        <tr>
            <td>${candidature.offreEmploi}</td>
            <td>${candidature.candidat}</td>
            <td>${candidature.date}</td>
            <td>${downloadLinks}</td>
            <td>${candidature.etat}</td>
            <td><button class="btn btn-error" data-offre-emploi="${candidature.offreEmploi}" data-candidat="${candidature.candidat}">Supprimer</button></td>
        </tr>
    `;
}

function renderAdherenceRow(adherence) {
    return `
        <tr>
            <td>${adherence.organisation}</td>
            <td>${adherence.recruteur}</td>
            <td>${adherence.etat}</td>
            <td>
                <button class="accept-btn" data-organisation="${adherence.organisation}" data-recruteur="${adherence.recruteur}">Accepter</button>
                <button class="reject-btn" data-organisation="${adherence.organisation}" data-recruteur="${adherence.recruteur}">Refuser</button>
            </td>
        </tr>
    `;
}
