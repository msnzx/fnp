// Global state
let currentUser = null;

// Initialize the application
function init() {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
        try {
            // Decode the token to get user info
            const payload = JSON.parse(atob(token.split('.')[1]));
            currentUser = {
                id: payload.userId,
                username: payload.username
            };
            
            // Show main content
            document.getElementById('auth-section').classList.add('hidden');
            document.getElementById('vehicles-section').classList.remove('hidden');
            document.getElementById('fuel-logs-section').classList.remove('hidden');
            
            // Initialize modules
            if (typeof fetchVehicles === 'function') fetchVehicles();
            if (typeof updateVehicleSelect === 'function') updateVehicleSelect();
        } catch (error) {
            console.error('Error initializing application:', error);
            logout();
        }
    }
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    currentUser = null;
    window.location.reload();
}

// Add logout button to the page
function addLogoutButton() {
    const header = document.createElement('header');
    header.innerHTML = `
        <div class="header-content">
            <h1>Car Fuel Tracker</h1>
            <button onclick="logout()" class="logout-btn">Logout</button>
        </div>
    `;
    document.body.insertBefore(header, document.body.firstChild);
}

// Add styles for the header
const headerStyles = document.createElement('style');
headerStyles.textContent = `
    header {
        background-color: var(--primary-color);
        color: white;
        padding: 1rem;
        margin-bottom: 2rem;
    }
    
    .header-content {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .logout-btn {
        background-color: var(--danger-color);
    }
    
    .logout-btn:hover {
        background-color: #c0392b;
    }
`;
document.head.appendChild(headerStyles);

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    init();
    addLogoutButton();
}); 