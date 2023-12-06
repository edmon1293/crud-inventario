document.addEventListener('DOMContentLoaded', function () {
    const addCarButton = document.getElementById('addCarButton');
    addCarButton.addEventListener('click', addOrEditCar);

    const carTableBody = document.querySelector('#carTable tbody');
    let editingCarId = null;

    document.querySelector('#carTable tbody').addEventListener('click', function (event) {
        const target = event.target;

        if (target.tagName === 'BUTTON') {
            const carId = target.dataset.id;

            if (target.textContent === 'Editar') {
                editCar(carId);
            } else if (target.textContent === 'Eliminar') {
                deleteCar(carId);
            }
        }
    });

    getCarList();

    function getCarList() {
        fetch('/car_inventory/server.php')
            .then(response => response.json())
            .then(data => {
                renderCarList(data);
            })
            .catch(error => console.error('Error al obtener la lista de autos:', error));
    }

    function renderCarList(cars) {
        carTableBody.innerHTML = '';

        cars.forEach(car => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${car.marca}</td>
                <td>${car.modelo}</td>
                <td>${car.ano}</td>
                <td>
                    <button class="editButton" data-id="${car.id}">Editar</button>
                    <button class="deleteButton" data-id="${car.id}">Eliminar</button>
                </td>
            `;
            carTableBody.appendChild(row);
        });
    }

    function addOrEditCar() {
        const carMake = document.getElementById('carMake').value;
        const carModel = document.getElementById('carModel').value;
        const carYear = document.getElementById('carYear').value;

        const data = {
            marca: carMake,
            modelo: carModel,
            ano: parseInt(carYear),
        };

        if (editingCarId) {
            fetch(`/car_inventory/server.php?id=${editingCarId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...data, id: editingCarId }),  
            })
                .then(response => response.json())
                .then(result => {
                    console.log(result);
                    editingCarId = null;
                    addCarButton.textContent = "Agregar Auto";
                    getCarList();
                })
                .catch(error => console.error('Error al editar el auto:', error));
        } else {
            fetch('/car_inventory/server.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then(response => response.json())
                .then(result => {
                    console.log(result);
                    getCarList();
                })
                .catch(error => console.error('Error al agregar el auto:', error));
        }
    }

    function deleteCar(id) {
        fetch(`/car_inventory/server.php?id=${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(result => {
                console.log(result);
                getCarList();
            })
            .catch(error => console.error('Error al eliminar el auto:', error));
    }

    function editCar(id) {
        console.log('Función editCar llamada con ID:', id);
        editingCarId = id;
        addCarButton.textContent = "Guardar Cambios";
    }
});

