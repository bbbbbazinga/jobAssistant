import API from './api.js';
import { feed } from './topAndBottom.js';

const api = new API('http://localhost:5000');

const token = localStorage.getItem('token');

const start = document.getElementById('start');

start.addEventListener('click', function () {
    if (token) {
        feed('search/searchJob');
    } else {
        window.location.assign('login.html');
    }
});
