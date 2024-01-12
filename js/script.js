const tableBody = document.getElementById('tableRouts');
const guidesTableBody = document.getElementById('tableTourGuides');
const apiKey = 'ed961d1e-7e34-4d51-8455-76106a149d76';
const apiUrl = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes';
const urlWithApiKey = `${apiUrl}?api_key=${apiKey}`;
let routsData;
let guidesData;
let selectedRouteId;

let currentPage = 1;
const rowsPerPage = 5;

//отображение списка гидов
function displayGuidesList(data, page, rowsPerPage) {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = data.slice(start, end);

    paginatedData.forEach(guide => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td><img src="img/avatar.png" class="avatar-img"></td>
          <td>${guide.name}</td>
          <td>${guide.language}</td>
          <td>${guide.workExperience}</td>
          <td>${guide.pricePerHour}</td>
          <td><button class="btn btn-outline-secondary">Выбрать</button></td>`;
        guidesTableBody.appendChild(row);
    });
}

//отображение списка гидов
async function loadGuides(routeId) {
    try {
        const response = await fetch(
            'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/' +
          `${routeId}/guides?api_key=${apiKey}`
        );
        guidesData = await response.json();
        guidesTableBody.innerHTML = '';
        displayGuidesList(guidesData, 1, 99999);
    } catch (error) {
        console.error('Произошла ошибка при загрузке данных гидов:', error);
        const alertContainer = document.getElementById("alert-container");
        const divEl = document.createElement('div');
        divEl.classList.add('alert');
        divEl.classList.add('alert-danger');
        divEl.textContent = 'Произошла ошибка при загрузке данных гидов';
        setTimeout(function() {
            divEl.remove();
        }, 10000);
        alertContainer.appendChild(divEl);
    }
}

//отображение списка маршрутов
function displayList(data, page, rowsPerPage) {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = data.slice(start, end);

    paginatedData.forEach(route => {
        const row = document.createElement('tr');
        if (route.id === selectedRouteId) {
            row.classList.add('selected');
        } else {
            row.classList.remove('selected');
        }
        row.innerHTML = `
          <td>${route.name}</td>
          <td>${route.description}</td>
          <td>${route.mainObject}</td>
          <td><button class="btn btn-outline-secondary" onclick="selectedRoute
          (${route.id}, '${route.name}')">Выбрать</button></td>`;
        tableBody.appendChild(row);
    });
}

//отображение списка селектов
function displaySelect(dataArr) {
    const selectEl = document.getElementById("routsSelect");
    let uniqueValues = [];
    const filteredData = dataArr.filter(items => 
        items.mainObject.includes(" - ") || items.mainObject.includes(" – ") 
      || items.mainObject.includes("- "));
    filteredData.forEach(item => {
        const splitedValues = item["mainObject"]
            .split(" - ");
        const secondSplitedValues = [].concat(...splitedValues
            .map(str => str.split(" – ")));
        const thirdSplitedValues = [].concat(...secondSplitedValues
            .map(str => str.split("- ")));
        thirdSplitedValues.forEach(value => {
            if (!uniqueValues.includes(value)) {
                uniqueValues.push(value);
            }
        });
    });
      
    uniqueValues.forEach(value => {
        const newSelectOptionEl = document.createElement('option');
        newSelectOptionEl.textContent = value;
        newSelectOptionEl.value = value;
        selectEl.appendChild(newSelectOptionEl);
    });
}

//подсветка активной страницы пагинации
function highlightActivePage() {
    const paginationItems = document.querySelectorAll('.pagination .page-item');
    paginationItems.forEach(item => item.classList.remove('active'));
    const activePaginationItem = document.querySelector(`.pagination 
    .page-item:nth-child(${currentPage})`);
    activePaginationItem.classList.add('active');
}

//функция воздания кнопки пагинации
function createPaginationBtn(page, data, rowsPerPage) {
    const liEl = document.createElement('li');
    liEl.classList.add('page-item');
    const aEl = document.createElement('a');
    aEl.classList.add('page-link');
    aEl.textContent = page;
    aEl.href = '#';
    liEl.appendChild(aEl);

    liEl.addEventListener('click', () => {
        event.preventDefault();
        currentPage = page;
        tableBody.innerHTML = '';
        displayList(data, currentPage, rowsPerPage);
        highlightActivePage();
    });

    return liEl;
}

//отображение пагинации
function displayPagination(data, rowsPerPage) {
    const paginationEl = document.querySelector('.pagination');
    paginationEl.innerHTML = '';
    const pagesCount = Math.ceil(data.length / rowsPerPage);

    for (let i = 1; i <= pagesCount; i++) {
        const liEl = createPaginationBtn(i, data, rowsPerPage);
        paginationEl.appendChild(liEl);
    }
}

//функционал поисковика
document.getElementById("routsSearch").addEventListener("keyup", function (e) {
    let searchText = e.target.value.toLowerCase();
    if (document.getElementById("routsSelect").value === 'Не выбрано') {
        const filteredData = routsData.filter(item => 
            item.name.toLowerCase().includes(searchText));
        currentPage = 1;
        tableBody.innerHTML = '';
        displayList(filteredData, currentPage, rowsPerPage);
        displayPagination(filteredData, rowsPerPage);
        highlightActivePage();
    } else {
        const selectedFilteredData = routsData.filter(item => 
            item.mainObject.includes(document
                .getElementById("routsSelect").value));
        const filteredData = selectedFilteredData.filter(item => 
            item.name.toLowerCase().includes(searchText));
        currentPage = 1;
        tableBody.innerHTML = '';
        displayList(filteredData, currentPage, rowsPerPage);
        displayPagination(filteredData, rowsPerPage);
        highlightActivePage();
    }
});

//функционал селекта
document.getElementById("routsSelect").addEventListener("change", function (e) {
    let selectedValue = e.target.value;
    const filteredSearchData = routsData.filter(item => 
        item.name.toLowerCase().includes(document
            .getElementById("routsSearch").value.toLowerCase()));
    if (selectedValue != 'Не выбрано') {
        const filteredData = filteredSearchData.filter(item => 
            item.mainObject.includes(selectedValue));
        currentPage = 1;
        tableBody.innerHTML = '';
        displayList(filteredData, currentPage, rowsPerPage);
        displayPagination(filteredData, rowsPerPage);
    } else {
        currentPage = 1;
        tableBody.innerHTML = '';
        displayList(filteredSearchData, currentPage, rowsPerPage);
        displayPagination(filteredSearchData, rowsPerPage);
    }

});

//функция вызывающаяся при нажатии на кнопку "выбрать" возле маршрута
function selectedRoute(routeId, routeName) {
    const tourGuideTable = document.querySelector('.tourGuide');
    const label = document.getElementById("guidesLabel");
    label.textContent = "Гиды по маршруту " + routeName;
    tourGuideTable.classList.remove('d-none');
    loadGuides(routeId);
    selectedRouteId = routeId;

    let searchText = document.getElementById("routsSearch")
        .value.toLowerCase();
    if (document.getElementById("routsSelect").value === 'Не выбрано') {
        const filteredData = routsData.filter(item => 
            item.name.toLowerCase().includes(searchText));
        tableBody.innerHTML = '';
        displayList(filteredData, currentPage, rowsPerPage);
        displayPagination(filteredData, rowsPerPage);
        highlightActivePage();
    } else {
        const selectedFilteredData = routsData.filter(item => 
            item.mainObject.includes(document
                .getElementById("routsSelect").value));
        const filteredData = selectedFilteredData.filter(item => 
            item.name.toLowerCase().includes(searchText));
        tableBody.innerHTML = '';
        displayList(filteredData, currentPage, rowsPerPage);
        displayPagination(filteredData, rowsPerPage);
        highlightActivePage();
    }
}

//подгрузка маршрутов
async function loadRouts() {
    try {
        const response = await fetch(urlWithApiKey);
        routsData = await response.json();

        tableBody.innerHTML = '';

        displayList(routsData, currentPage, rowsPerPage);
        displayPagination(routsData, rowsPerPage);
        displaySelect(routsData);
    } catch (error) {
        console.error('Произошла ошибка при загрузке данных маршрутов:', error);
        const alertContainer = document.getElementById("alert-container");
        const divEl = document.createElement('div');
        divEl.classList.add('alert');
        divEl.classList.add('alert-danger');
        divEl.textContent = 'Произошла ошибка при загрузке данных маршрутов';
        setTimeout(function() {
            divEl.remove();
        }, 10000);
        alertContainer.appendChild(divEl);
    }
}

loadRouts();