(function () {

    // Selecting the required id elements
    const taskForm = document.getElementById('task_form');
    const date = document.getElementById('date');
    const tableBody = document.getElementById('table_body');
    const searchField = document.getElementById('search');
    const filterField = document.getElementById('search_filter');
    const sortField = document.getElementById('search_sort');
    const dateField = document.getElementById('search_date');

    // Get today date
    const today = new Date().toISOString().slice(0, 10);
    date.value = today;


    // Search function implement
    searchField.addEventListener('input', function (e) {
        tableBody.innerHTML = '';
        filterField.selectedIndex = 0;
        sortField.selectedIndex = 0;
        dateField.value = '';

        const searchValue = this.value.toLowerCase();
        let index = 0;
        const lists = getFromLocalStorage();
        lists.forEach((list) => {
            if (list.name.toLowerCase().includes(searchValue)) {
                ++index;
                showDataOnUI(list, index);
            }
        })
    })


    // Filter function implement
    filterField.addEventListener('change', function (e) {
        tableBody.innerHTML = '';
        searchField.value = '';
        sortField.selectedIndex = 0;
        dateField.value = '';

        const filterValue = this.value;
        let lists = getFromLocalStorage();

        switch (filterValue) {
            case "all":
                lists.forEach((list, index) => {
                    showDataOnUI(list, index + 1);
                })
                break;

            case "complete":
                let completeI = 0;
                lists.forEach((list) => {
                    if (list.status === "complete") {
                        ++completeI;
                        showDataOnUI(list, completeI);
                    }
                })
                break;

            case "incomplete":
                let incompleteI = 0;
                lists.forEach((list) => {
                    if (list.status === "incomplete") {
                        ++incompleteI;
                        showDataOnUI(list, incompleteI);
                    }
                })
                break;

            case "today":
                let todayI = 0;
                lists.forEach((list) => {
                    if (list.date === today) {
                        ++todayI;
                        showDataOnUI(list, todayI);
                    }
                })
                break;

            case "high_priority":
                let highI = 0;
                lists.forEach((list) => {
                    if (list.priority === "high") {
                        ++highI;
                        showDataOnUI(list, highI);
                    }
                })
                break;

            case "medium_priority":
                let mediumI = 0;
                lists.forEach((list) => {
                    if (list.priority === "medium") {
                        ++mediumI;
                        showDataOnUI(list, mediumI);
                    }
                })
                break;

            case "low_priority":
                let lowI = 0;
                lists.forEach((list) => {
                    if (list.priority === "low") {
                        ++lowI;
                        showDataOnUI(list, lowI);
                    }
                })
                break;
        }
    })


    // Sort function implement
    sortField.addEventListener('change', function (e) {
        tableBody.innerHTML = '';
        searchField.value = '';
        filterField.selectedIndex = 0;
        dateField.value = '';

        const sortValue = this.value;
        let lists = getFromLocalStorage();

        if (sortValue === 'newest') {
            lists.sort((a, b) => {
                if (new Date(a.date) > new Date(b.date)) {
                    return -1;
                }
                else if (new Date(a.date) < new Date(b.date)) {
                    return 1;
                }
                else {
                    return 0;
                }
            })
        }
        else {
            lists.sort((a, b) => {
                if (new Date(a.date) > new Date(b.date)) {
                    return 1;
                }
                else if (new Date(a.date) < new Date(b.date)) {
                    return -1;
                }
                else {
                    return 0;
                }
            })
        }
        lists.forEach((list, index) => {
            showDataOnUI(list, index + 1)
        })
    })


    // Date function implement
    dateField.addEventListener('change', function (e) {
        tableBody.innerHTML = '';
        searchField.value = '';
        filterField.selectedIndex = 0;
        sortField.selectedIndex = 0;

        const dateValue = this.value;
        let dateIndex = 0;
        let lists = getFromLocalStorage();

        lists.filter((list) => {
            if (list.date === dateValue) {
                ++dateIndex;
                showDataOnUI(list, dateIndex)
            }
        })

    })


    // Add a submit event
    taskForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const inputsData = [...this.elements];

        let formData = {};
        let isValid = true;

        inputsData.forEach(element => {
            if (element.type !== 'submit') {
                if (element.value == '') {
                    alert("Please fill up this fields with valid value.");
                    isValid = false;
                    return;
                }
                formData[element.name] = element.value;
            }
        })
        if (isValid) {
            formData.status = "incomplete";
            formData.id = uuidv4();
            const lists = getFromLocalStorage();
            showDataOnUI(formData, lists.length + 1);
            lists.push(formData);
            setFromLocalStorage(lists);
        }
        this.reset();
    })


    // Showing the tasks list on UI
    function showDataOnUI({ id, name, priority, status, date }, index) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td id="number">${index}</td>
        <td id="name">${name}</td>
        <td id="priority">${priority}</td>
        <td id="status">${status}</td>
        <td id="date">${date}</td>
        <td id="action">
        <button id="edit">
        <i class="fas fa-pen-square"></i>
        </button>
        <button id="check">
        <i class="fas fa-check-circle"></i>
        </button>
        <button id="delete">
        <i class="fas fa-trash"></i>
        </button>
        </td>
        `
        tr.dataset.id = id;
        tableBody.appendChild(tr);
    }


    // Get data from local storage
    function getFromLocalStorage() {
        let lists = [];
        const data = localStorage.getItem('lists');
        if (data) {
            lists = JSON.parse(data);
        }
        return lists;
    }


    // Set data from local storage
    function setFromLocalStorage(lists) {
        localStorage.setItem('lists', JSON.stringify(lists));
    }


    // Task list event
    tableBody.addEventListener('click', function (e) {

        // Edit button event
        if (e.target.id == "edit") {
            const tr = e.target.parentElement.parentElement;
            const id = tr.dataset.id;
            const tds = tr.children;

            // 
            let nameTd;
            let newNameInput;
            let priorityTd;
            let newPrioritySelect;
            let dateTd;
            let newDateInput;
            let actionTd;
            let eventButtons;


            [...tds].forEach(td => {

                if (td.id === "name") {
                    nameTd = td;
                    const prevName = td.textContent;
                    td.innerText = '';
                    newNameInput = document.createElement("input");
                    newNameInput.type = 'text';
                    newNameInput.value = prevName;
                    td.appendChild(newNameInput);

                }
                else if (td.id === "priority") {
                    priorityTd = td;
                    const prevPriority = td.textContent;
                    td.innerText = '';
                    newPrioritySelect = document.createElement("select");
                    newPrioritySelect.innerHTML = `
                    <option disabled>Select</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                    `;

                    if (prevPriority === "high") {
                        newPrioritySelect.selectedIndex = 1;
                    } else if (prevPriority === "medium") {
                        newPrioritySelect.selectedIndex = 2;
                    } else if (prevPriority === "low") {
                        newPrioritySelect.selectedIndex = 3;
                    }
                    td.appendChild(newPrioritySelect);
                }
                else if (td.id === "date") {
                    dateTd = td;
                    const prevDate = td.textContent;
                    td.innerText = '';
                    newDateInput = document.createElement("input");
                    newDateInput.type = 'date';
                    newDateInput.value = prevDate;
                    td.appendChild(newDateInput);

                }
                else if (td.id === "action") {
                    actionTd = td;
                    eventButtons = td.innerHTML;
                    td.innerHTML = '';
                    const saveBtn = document.createElement("button");
                    saveBtn.innerHTML = '<i class="fas fa-file-upload"></i>';

                    saveBtn.addEventListener('click', function () {
                        // Name button
                        const newName = newNameInput.value;
                        nameTd.innerHTML = newName;

                        // Priority button
                        const newPriority = newPrioritySelect.value;
                        priorityTd.innerHTML = newPriority;

                        // Date button
                        const newDate = newDateInput.value;
                        dateTd.innerHTML = newDate;

                        // Action button
                        actionTd.innerHTML = eventButtons;

                        // Save modified task info on local storage
                        let lists = getFromLocalStorage();
                        lists = lists.filter(list => {
                            if (list.id === id) {
                                list.name = newName;
                                list.priority = newPriority;
                                list.date = newDate;
                                return list;
                            }
                            else {
                                return list;
                            }
                        })
                        setFromLocalStorage(lists);
                    })
                    td.appendChild(saveBtn);
                }
            })
        }


        // Check button event
        else if (e.target.id == "check") {
            const tr = e.target.parentElement.parentElement;
            const id = tr.dataset.id;
            const tds = tr.children;
            let lists = getFromLocalStorage();

            [...tds].forEach(td => {
                if (td.id === "status") {
                    lists.filter(list => {
                        if (list.id === id) {
                            if (list.status == "incomplete") {
                                list.status = "complete";
                                td.innerHTML = "complete";
                            }
                            else {
                                list.status = "incomplete";
                                td.innerHTML = "incomplete";
                            }
                        }
                    })
                }
            })
            setFromLocalStorage(lists);
        }


        // Delete button event
        else if (e.target.id == "delete") {
            const tr = e.target.parentElement.parentElement;
            const id = tr.dataset.id;
            tr.remove();
            let lists = getFromLocalStorage();
            lists = lists.filter((list) => {
                if (list.id !== id) {
                    return list;
                }
            })
            setFromLocalStorage(lists);
            loading();
        }
    })



    // Get tasks on load
    window.onload = loading();

    function loading() {
        tableBody.innerHTML = '';
        const lists = getFromLocalStorage();
        lists.forEach((list, index) => {
            showDataOnUI(list, index + 1)
        })
    }


})()