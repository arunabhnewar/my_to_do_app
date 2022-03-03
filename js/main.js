(function () {

    // Selecting the required id elements
    const taskForm = document.getElementById('task_form');
    const date = document.getElementById('date');
    const tableBody = document.getElementById('table_body');



    // Get today date
    const today = new Date().toISOString().slice(0, 10);
    date.value = today;



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
            formData.status = "Incomplete";
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
                        console.log(lists);
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
                        console.log(lists);
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
                            if (list.status == "Incomplete") {
                                list.status = "Complete";
                                td.innerHTML = "Complete";
                            }
                            else {
                                list.status = "Incomplete";
                                td.innerHTML = "Incomplete";
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