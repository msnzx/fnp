const API_URL = 'http://localhost:4000/api';

// DOM Elements
const fuelLogsList = document.getElementById('fuel-logs-list');
const addFuelLogBtn = document.getElementById('add-fuel-log-btn');
const fuelLogModal = document.getElementById('fuel-log-modal');
const fuelLogForm = document.getElementById('fuel-log-form');
const fuelLogModalTitle = document.getElementById('fuel-log-modal-title');
const fuelLogVehicleSelect = document.getElementById('fuel-log-vehicle');

// State
let fuelLogs = [];
let editingFuelLogId = null;

// Event Listeners
addFuelLogBtn.addEventListener('click', () => showFuelLogModal());
fuelLogForm.addEventListener('submit', handleFuelLogSubmit);
document.querySelector('#fuel-log-modal .close').addEventListener('click', () => hideFuelLogModal());

// Functions
async function fetchFuelLogs(vehicleId) {
    try {
        const response = await fetch(`${API_URL}/fuel-logs/vehicle/${vehicleId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            fuelLogs = await response.json();
            renderFuelLogs();
        } else {
            throw new Error('Failed to fetch fuel logs');
        }
    } catch (error) {
        console.error('Error fetching fuel logs:', error);
        alert('Failed to load fuel logs');
    }
}

function renderFuelLogs() {
    fuelLogsList.innerHTML = '';
    fuelLogs.forEach(log => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${new Date(log.date).toLocaleDateString()}</h3>
            <p>Amount: ${log.amount} liters</p>
            <p>Price per liter: $${log.price}</p>
            <p>Total: $${(log.amount * log.price).toFixed(2)}</p>
            <p>Odometer: ${log.odometer} km</p>
            ${log.notes ? `<p>Notes: ${log.notes}</p>` : ''}
            <div class="card-actions">
                <button onclick="editFuelLog('${log._id}')">Edit</button>
                <button onclick="deleteFuelLog('${log._id}')">Delete</button>
            </div>
        `;
        fuelLogsList.appendChild(card);
    });
}

async function updateVehicleSelect() {
    try {
        const response = await fetch(`${API_URL}/vehicles`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const vehicles = await response.json();
            fuelLogVehicleSelect.innerHTML = vehicles.map(vehicle => 
                `<option value="${vehicle._id}">${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})</option>`
            ).join('');
        }
    } catch (error) {
        console.error('Error fetching vehicles for select:', error);
    }
}

function showFuelLogModal(log = null) {
    editingFuelLogId = log ? log._id : null;
    fuelLogModalTitle.textContent = log ? 'Edit Fuel Log' : 'Add Fuel Log';
    
    if (log) {
        document.getElementById('fuel-log-vehicle').value = log.vehicleId;
        document.getElementById('fuel-log-date').value = log.date.split('T')[0];
        document.getElementById('fuel-log-amount').value = log.amount;
        document.getElementById('fuel-log-price').value = log.price;
        document.getElementById('fuel-log-odometer').value = log.odometer;
        document.getElementById('fuel-log-notes').value = log.notes || '';
    } else {
        fuelLogForm.reset();
    }
    
    updateVehicleSelect();
    fuelLogModal.classList.remove('hidden');
}

function hideFuelLogModal() {
    fuelLogModal.classList.add('hidden');
    editingFuelLogId = null;
    fuelLogForm.reset();
}

async function handleFuelLogSubmit(e) {
    e.preventDefault();
    
    const fuelLogData = {
        vehicleId: document.getElementById('fuel-log-vehicle').value,
        date: document.getElementById('fuel-log-date').value,
        amount: parseFloat(document.getElementById('fuel-log-amount').value),
        price: parseFloat(document.getElementById('fuel-log-price').value),
        odometer: parseInt(document.getElementById('fuel-log-odometer').value),
        notes: document.getElementById('fuel-log-notes').value
    };

    try {
        const url = editingFuelLogId 
            ? `${API_URL}/fuel-logs/${editingFuelLogId}`
            : `${API_URL}/fuel-logs`;
        
        const response = await fetch(url, {
            method: editingFuelLogId ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(fuelLogData)
        });

        if (response.ok) {
            hideFuelLogModal();
            fetchFuelLogs(fuelLogData.vehicleId);
        } else {
            throw new Error('Failed to save fuel log');
        }
    } catch (error) {
        console.error('Error saving fuel log:', error);
        alert('Failed to save fuel log');
    }
}

async function deleteFuelLog(id) {
    if (!confirm('Are you sure you want to delete this fuel log?')) return;

    try {
        const response = await fetch(`${API_URL}/fuel-logs/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const vehicleId = document.getElementById('fuel-log-vehicle').value;
            fetchFuelLogs(vehicleId);
        } else {
            throw new Error('Failed to delete fuel log');
        }
    } catch (error) {
        console.error('Error deleting fuel log:', error);
        alert('Failed to delete fuel log');
    }
}

function editFuelLog(id) {
    const log = fuelLogs.find(l => l._id === id);
    if (log) {
        showFuelLogModal(log);
    }
}

// Initialize
if (localStorage.getItem('token')) {
    updateVehicleSelect();
} 