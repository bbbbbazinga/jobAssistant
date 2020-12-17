import API from './api.js';

const api = new API('http://localhost:5000');

const loginForm = document.forms.loginForm;
const email = loginForm.email;
const pwd = loginForm.pwd;
const loginBtn = loginForm.loginBtn;

var emailPattern = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;


// 登录按钮
loginBtn.onclick = (event) => {
    event.preventDefault();
    const check = [email.value, pwd.value];
    const nullIndex = check.indexOf('');
    var warning;

    if (nullIndex === -1) {
        api.post('auth/login', {
            body: JSON.stringify({
                "email": email.value,
                "password": pwd.value,
            }),
            headers: {
                "Content-Type": "application/json"
            },
        })
            .then(data => {
                // 登录成功，给localStorage一个token和role，用于后续操作
                // console.log(data);
                localStorage.setItem('token', data['token']);
                localStorage.setItem('role', data['role']);
                localStorage.setItem('email', data['email']);
                // 这里data['role']的数据类型是int
                window.location.assign('index.html');

            })
            .catch(err => {
                warning = document.getElementById('checkSubmit');
                warning.style.display = 'block';
                warning.textContent = err;
            })
    } else {
        if (nullIndex === 0) {
            warning = document.getElementById('checkEmail');
            warning.textContent = 'Please input Your Email Address';
        } else {
            warning = document.getElementById('checkPwd');
            warning.textContent = 'Please input Your Password';
        }
        warning.style.display = 'block';
    }
}


// 邮箱的检查
email.onblur = () => {
    const res = emailPattern.test(email.value);
    const warning = document.getElementById('checkEmail');
    if (email.value === '') {
        warning.style.display = 'block';
        warning.textContent = 'Please input Your Email Address';
    } else {
        if (!res) {
            warning.style.display = 'block';
            warning.textContent = 'Invalid input: Please enter a correct Email Address';
        }
    }
}

email.onfocus = () => {
    document.getElementById('checkEmail').style.display = 'none';
    document.getElementById('checkSubmit').style.display = 'none';
}

// 密码的检查
pwd.onblur = () => {
    const warning = document.getElementById('checkPwd');
    if (pwd.value === '') {
        warning.style.display = 'block';
        warning.textContent = 'Please input Your Password';
    }
    // 无需判断密码正确性，只要有输入即可。
}

pwd.onfocus = () => {
    document.getElementById('checkPwd').style.display = 'none';
    document.getElementById('checkSubmit').style.display = 'none';
}