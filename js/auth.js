const API_URL = 'http://localhost:4000/api';

// DOM Elements
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const authSection = document.getElementById('auth-section');
const vehiclesSection = document.getElementById('vehicles-section');
const fuelLogsSection = document.getElementById('fuel-logs-section');

// Event Listeners
loginForm.addEventListener('submit', handleLogin);
registerForm.addEventListener('submit', handleRegister);

// Functions
async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            showMainContent();
        } else {
            alert(data.error || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Registration successful! Please login.');
            document.getElementById('register-form').reset();
        } else {
            alert(data.error || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('An error occurred during registration');
    }
}

function showMainContent() {
    authSection.classList.add('hidden');
    vehiclesSection.classList.remove('hidden');
    fuelLogsSection.classList.remove('hidden');
}

// Check if user is already logged in
function checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
        showMainContent();
    }
}

// Initialize
checkAuth(); 