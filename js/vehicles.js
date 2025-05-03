const API_URL = 'http://localhost:4000/api';

// DOM Elements
const vehiclesList = document.getElementById('vehicles-list');
const addVehicleBtn = document.getElementById('add-vehicle-btn');
const vehicleModal = document.getElementById('vehicle-modal');
const vehicleForm = document.getElementById('vehicle-form');
const vehicleModalTitle = document.getElementById('vehicle-modal-title');

// State
let vehicles = [];
let editingVehicleId = null;

// Event Listeners
addVehicleBtn.addEventListener('click', () => showVehicleModal());
vehicleForm.addEventListener('submit', handleVehicleSubmit);
document.querySelector('#vehicle-modal .close').addEventListener('click', () => hideVehicleModal());

// Functions
async function fetchVehicles() {
    try {
        const response = await fetch(`${API_URL}/vehicles`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            vehicles = await response.json();
            renderVehicles();
        } else {
            throw new Error('Failed to fetch vehicles');
        }
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        alert('Failed to load vehicles');
    }
}

function renderVehicles() {
    vehiclesList.innerHTML = '';
    vehicles.forEach(vehicle => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${vehicle.make} ${vehicle.model}</h3>
            <p>Year: ${vehicle.year}</p>
            <p>License Plate: ${vehicle.licensePlate}</p>
            <div class="card-actions">
                <button onclick="editVehicle('${vehicle._id}')">Edit</button>
                <button onclick="deleteVehicle('${vehicle._id}')">Delete</button>
            </div>
        `;
        vehiclesList.appendChild(card);
    });
}

function showVehicleModal(vehicle = null) {
    editingVehicleId = vehicle ? vehicle._id : null;
    vehicleModalTitle.textContent = vehicle ? 'Edit Vehicle' : 'Add Vehicle';
    
    if (vehicle) {
        document.getElementById('vehicle-make').value = vehicle.make;
        document.getElementById('vehicle-model').value = vehicle.model;
        document.getElementById('vehicle-year').value = vehicle.year;
        document.getElementById('vehicle-license').value = vehicle.licensePlate;
    } else {
        vehicleForm.reset();
    }
    
    vehicleModal.classList.remove('hidden');
}

function hideVehicleModal() {
    vehicleModal.classList.add('hidden');
    editingVehicleId = null;
    vehicleForm.reset();
}

async function handleVehicleSubmit(e) {
    e.preventDefault();
    
    const vehicleData = {
        make: document.getElementById('vehicle-make').value,
        model: document.getElementById('vehicle-model').value,
        year: document.getElementById('vehicle-year').value,
        licensePlate: document.getElementById('vehicle-license').value
    };

    try {
        const url = editingVehicleId 
            ? `${API_URL}/vehicles/${editingVehicleId}`
            : `${API_URL}/vehicles`;
        
        const response = await fetch(url, {
            method: editingVehicleId ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(vehicleData)
        });

        if (response.ok) {
            hideVehicleModal();
            fetchVehicles();
        } else {
            throw new Error('Failed to save vehicle');
        }
    } catch (error) {
        console.error('Error saving vehicle:', error);
        alert('Failed to save vehicle');
    }
}

async function deleteVehicle(id) {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;

    try {
        const response = await fetch(`${API_URL}/vehicles/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            fetchVehicles();
        } else {
            throw new Error('Failed to delete vehicle');
        }
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        alert('Failed to delete vehicle');
    }
}

function editVehicle(id) {
    const vehicle = vehicles.find(v => v._id === id);
    if (vehicle) {
        showVehicleModal(vehicle);
    }
}

// Initialize
if (localStorage.getItem('token')) {
    fetchVehicles();
} 