    const tableBody = document.getElementById('tableRouts');
    const apiKey = 'ed961d1e-7e34-4d51-8455-76106a149d76';
    const apiUrl = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes';
    const urlWithApiKey = `${apiUrl}?api_key=${apiKey}`;
    let routsData;

    let currentPage = 1;
    const rowsPerPage = 5;

    async function loadRouts() {
        const response = await fetch(urlWithApiKey);
        routsData = await response.json();

        tableBody.innerHTML = '';

        displayList(routsData, currentPage, rowsPerPage);
        displayPagination(routsData, rowsPerPage);
    }

    function displayList(data, page, rowsPerPage) {
      const start = (page - 1) * rowsPerPage;
      const end = start + rowsPerPage;
      const paginatedData = data.slice(start, end);

      paginatedData.forEach(route => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${route.name}</td>
          <td>${route.description}</td>
          <td>${route.mainObject}</td>
          <td><button class="btn btn-outline-primary">Выбрать</button></td>
        `;
        tableBody.appendChild(row);
      });
    }

    function displayPagination(data, rowsPerPage) {
      const paginationEl = document.querySelector('.pagination');
      paginationEl.innerHTML = '';
      const pagesCount = Math.ceil(data.length / rowsPerPage);

      for (let i = 1; i <= pagesCount; i++) {
        const liEl = createPaginationBtn(i, data, rowsPerPage);
        paginationEl.appendChild(liEl);
      }
    }

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

    function highlightActivePage() {
      const paginationItems = document.querySelectorAll('.pagination .page-item');
      paginationItems.forEach(item => item.classList.remove('active'));
      const activePaginationItem = document.querySelector(`.pagination .page-item:nth-child(${currentPage})`);
      activePaginationItem.classList.add('active');
    }

    document.getElementById("routsSearch").addEventListener("keyup", function (e) {
        if (e.key === "Enter") {
          let searchText = e.target.value.toLowerCase();
          const filteredData = routsData.filter(item => item.name.toLowerCase().includes(searchText));
          currentPage = 1;
          tableBody.innerHTML = '';
          displayList(filteredData, currentPage, rowsPerPage);
          displayPagination(filteredData, rowsPerPage);
          highlightActivePage();
        }
      });

    loadRouts();