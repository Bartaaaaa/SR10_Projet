function search(list, fields, searchValue, createCard, id) {
    const listContainer = document.getElementById(id);
    listContainer.innerHTML = '';

    if (searchValue.trim() === '') {
        list.forEach(item => {
            listContainer.appendChild(createCard(item));
        });
        return;
    }

    const filteredList = [];
    fields.forEach(field => {
        filteredList.push(...list.filter(item => {
            const fieldValue = typeof item[field] === 'string' ? item[field].toLowerCase() : String(item[field]).toLowerCase();
            return fieldValue.startsWith(searchValue.toLowerCase());
        }));
    });

    const uniqueFilteredList = Array.from(new Set(filteredList));

    uniqueFilteredList.forEach(item => {
        listContainer.appendChild(createCard(item));
    });
}
