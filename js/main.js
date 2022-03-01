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
        inputsData.forEach(element => {
            if (element.type !== 'submit') {
                formData[element.name] = element.value;
            }
        })
        formData.status = "Incomplete";
        showDataOnUI(formData);
        this.reset();
    })


    // Showing the tasks list on UI
    function showDataOnUI(task) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td>2</td>
        <td>${task.name}</td>
        <td>${task.priority}</td>
        <td>${task.status}</td>
        <td>${task.date}</td>
        <td>
        <button class="edit">
        <i class="fas fa-pen-square"></i>
        </button>
        <button class="complete">
        <i class="fas fa-check-circle"></i>
        </button>
        <button class="delete">
        <i class="fas fa-trash"></i>
        </button>
        </td>
        `
        tableBody.appendChild(tr)
    }


})()