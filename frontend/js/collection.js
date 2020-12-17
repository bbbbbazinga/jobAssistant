import API from './api.js';

const api = new API('http://localhost:5000');

const profileBtn = document.getElementById('profile');
const appBtn = document.getElementById('application');
const logoutBtn = document.getElementById('logout');

// 点击按钮跳转到对应页面
profileBtn.onclick = (event) => {
    event.preventDefault();
    window.location.assign('seekerPage.html');
}

appBtn.onclick = (event) => {
    event.preventDefault();
    window.location.assign('application.html');
}

logoutBtn.onclick = (event) => {
    event.preventDefault();
    // 清除所有localStorage中的信息
    localStorage.clear();
    window.location.assign('login.html');
}