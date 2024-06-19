function search(list, fields, searchValue) { // utilisée pour searchbar
    // fields : liste de fields contenus dans la card (ex : nom, prenom,...) = ceux d'un item (ex : d'un utilisateur). 

    // Si searchbar vide : renvoie la liste initiale
    if (searchValue.trim() === '') { // .trim retire les espaces et retours à la ligne...
        return list;
    }

    const filteredList = [];
    fields.forEach(field => { // field = 'nom'
        filteredList.push(...list.filter(item => { // la méthode filter renvoie une sous liste des items remplissant la condition
            // conversion du field en lowercase (et string si pas déjà le cas)
            const fieldValue = typeof item[field] === 'string' ? item[field].toLowerCase() : String(item[field]).toLowerCase();
            return fieldValue.startsWith(searchValue.toLowerCase()); // renvoie booléen (1 si remplit condition startswith)
        }));
    });

    // Set = une liste mais avec qu'un seul exemplaire de chaque élément
    return Array.from(new Set(filteredList)); // convertir le tableau en set, puis re en tableau pour garder qu'un exemplaire des cards
}





function filterBySalary(list, min, max) {
    const minSalary = Number(min.value) ?? null;
    const maxSalary = Number(max.value) ?? null;

    return list
        // ne garder que les salaires >= min
        .filter(item => {
            if (minSalary) {
                return item.salaireMin >= minSalary;
            }
            return item;
        })
        // ne garder que les salaires <= max
        .filter(item => {
            if (maxSalary) {
                return item.salaireMax <= maxSalary;
            }
            return item;
        });
}

function orderById(list, idField = 'id') {
    return list.sort((a, b) => {
        if (a[idField] < b[idField]) {
            return -1;
        } else if (a[idField] > b[idField]) {
            return 1;
        }
        return 0;
        // -1, 1, 0 : sorties demandées par la méthode sort
    });
}



function orderByDate(list) {
    return list.sort((a, b) => {
        const dateASplit = a.dateValidite.split('/'); // à la base : date = jj/mm/aaaa
        const dateBSplit = b.dateValidite.split('/');

        // recréer les dates dans l'ordre aaaa mm jj
        const dateA = new Date(Number(dateASplit[2]), Number(dateASplit[1]), Number(dateASplit[0]));
        const dateB = new Date(Number(dateBSplit[2]), Number(dateBSplit[1]), Number(dateBSplit[0]));

        if (dateA < dateB) {
            return -1;
        } else if (dateA > dateB) {
            return 1;
        }
        return 0;
    });
}

function renderList(list, id, createCard) { // id = id du div qui contient la liste (le div est vide au départ)
    const listContainer = document.getElementById(id); // = le div
    listContainer.innerHTML = ''; // suppression du contenu du div

    list.forEach(item => { // ajout des cards de la liste dans le div
        listContainer.appendChild(createCard(item));
    });
}
