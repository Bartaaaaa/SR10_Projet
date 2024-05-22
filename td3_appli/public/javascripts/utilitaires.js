function displayItems(items, page, rowsPerPage, tableBody, renderRow) {
    tableBody.innerHTML = "";
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedItems = items.slice(start, end);

    paginatedItems.forEach(item => {
        const row = document.createElement("tr");
        row.classList.add("hover");
        row.innerHTML = renderRow(item);
        tableBody.appendChild(row);
    });

    // Add event listeners to delete buttons if needed
    document.querySelectorAll('.btn-error').forEach(button => {
        button.addEventListener('click', function() {
            const email = this.getAttribute('data-mail');
            deleteUser(email, this.closest('tr'), items, pagination, rowsPerPage);
        });
    });
}

function setupPagination(items, wrapper, rowsPerPage, tableBody, renderRow) {
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
        displayItems(items, currentPage, rowsPerPage, tableBody, renderRow);
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
        body: JSON.stringify({ email: email })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            row.remove();
            items = items.filter(item => item.mail !== email);

            alert('L utilisateur a bien été supprimé');

            // Optionally, you can refresh the pagination and the item list
           // setupPagination(items, pagination, rowsPerPage, document.getElementById("usersTableBody"), renderUserRow);
        } else {
            alert('Erreur lors de la suppression de l\'utilisateur.');
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
        <td><button class="btn btn-error" data-mail="${user.mail}">Supprimer</button></td>
    `;
}

function renderOrganisationRow(organisation) {
    return `
        <td>${organisation.siren}</td>
        <td>${organisation.nom}</td>
        <td>${organisation.adrSiegeSocial}</td>
        <td>${organisation.type}</td>
    `;
}