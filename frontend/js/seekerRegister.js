import API from './api.js';

const api = new API('http://localhost:5000');

const registerForm = document.forms.registerForm;
const email = registerForm.email;
const fname = registerForm.firstName;
const lname = registerForm.lastName;
const pwd = registerForm.pwd;
const confirmPwd = registerForm.confirmPwd;
const phoneNo = registerForm.phoneNo;
const vCode = registerForm.vCode;
const sendCode = registerForm.sendCode;
const regBtn = registerForm.regBtn;

var emailPattern = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
var namePattern = /^[A-Z]{1}[a-zA-Z]+/;
var pwdPattern = /^[a-zA-Z0-9~!@#$%^&*()_+`\-={}:";'<>?,.\/]{8,16}$/;
var phonePattern = /(04)[0-9]{8}$/;


// 提交前，确保所需信息不为空
regBtn.onclick = (event) => {
    event.preventDefault();

    if (checkEmail() && checkFirstName() && checkLastName() && checkPassword()
        && checkConfirmPassword() && checkPhoneNum()) {

        api.post('auth/seekerRegister', {
            body: JSON.stringify({
                "first_name": fname.value,
                "last_name": lname.value,
                "email": email.value,
                "password": pwd.value,
                "phone_number": phoneNo.value,
            }),
            headers: {
                "Content-Type": "application/json"
            },
        })
        .then(data => {
            window.location.assign('login.html');
        })
        .catch(err => {
            const warning = document.getElementById('checkSubmit');
            warning.style.display = 'block'; 
            warning.textContent = err;
        })
    }
}


// 邮箱的检查
email.onblur = checkEmail;
email.onfocus = () => {
    document.getElementById('checkEmail').style.display = 'none';
}

// 名的检查
fname.onblur = checkFirstName;
fname.onfocus = () => {
    document.getElementById('checkFirstName').style.display = 'none';
}

// 姓氏的检查
lname.onblur = checkLastName;
lname.onfocus = () => {
    document.getElementById('checkLastName').style.display = 'none';
}

// 密码的检查
pwd.onblur = checkPassword;
pwd.onfocus = () => {
    document.getElementById('checkPwd').style.display = 'none';
}

// 确认密码
confirmPwd.onblur = checkConfirmPassword;
confirmPwd.onfocus = () => {
    document.getElementById('checkConfirmPwd').style.display = 'none';
}

// 电话号码的检查
phoneNo.onblur = checkPhoneNum;
phoneNo.onfocus = () => {
    document.getElementById('checkPhoneNo').style.display = 'none';
}



function checkEmail() {
    const res = emailPattern.test(email.value);
    const warning = document.getElementById('checkEmail');
    if (email.value === '') {
        warning.style.display = 'block';
        warning.textContent = 'Please input Your Email Address';
    } else {
        if (!res) {
            warning.style.display = 'block';
            warning.textContent = 'Invalid input: Please enter a correct Email Address';
        } else {
            return true;
        }
    }
    return false;
}

function checkFirstName() {
    const res = namePattern.test(fname.value);
    const warning = document.getElementById('checkFirstName');
    if (fname.value === '') {
        warning.style.display = 'block';
        warning.textContent = 'Please input Your First Name';
    } else {
        if (!res) {
            warning.style.display = 'block';
            warning.textContent = 'Invalid input: First Name should start with Capital letter and contains only letters.';
        } else{
            return true;
        }
    }
    return false;
}

function checkLastName() {
    const res = namePattern.test(lname.value);
    const warning = document.getElementById('checkLastName');
    if (lname.value === '') {
        warning.style.display = 'block';
        warning.textContent = 'Please input Your Last Name';
    } else {
        if (!res) {
            warning.style.display = 'block';
            warning.textContent = 'Invalid input: Last Name should start with Capital letter and contains only letters.';
        } else {
            return true;
        }
    }
    return false;
}

function checkPassword() {
    const checkLower = /[a-z]/g;
    const checkUpper = /[A-Z]/g;
    const checkNo = /[0-9]/g;
    const checkSpecial = /[!@#$%^&*()_+`\-={}:";'<>?,.\/]/g;
    
    const res = pwdPattern.test(pwd.value);
    const warning = document.getElementById('checkPwd');

    if (pwd.value === '' || !res) {
        warning.style.display = 'block';
        warning.textContent = 'Please input a password with length between 8 and 16, it should contain at least one letter, one Capital letter, one special character and one number.';
    } else {
        if (!pwd.value.match(checkSpecial)) {
            warning.style.display = 'block';
            warning.textContent = 'The password should contain a Special Character';
        }
        else if (!pwd.value.match(checkNo)) {
            warning.style.display = 'block';
            warning.textContent = 'The password should contain a Number';
        }
        else if (!pwd.value.match(checkUpper)) {
            warning.style.display = 'block';
            warning.textContent = 'The password should contain a Capital letter';
        }
        else if (!pwd.value.match(checkLower)) {
            warning.style.display = 'block';
            warning.textContent = 'The password should contain a letter';
        } else {
            return true;
        }
    }
    return false;
}

function checkConfirmPassword() {
    const warning = document.getElementById('checkConfirmPwd');
    if (confirmPwd.value === '') {
        warning.style.display = 'block';
        warning.textContent = 'Please input Your password again';
    } else {
        if (confirmPwd.value !== pwd.value) {
            warning.style.display = 'block';
            warning.textContent = 'Invalid input: The two passwords entered are inconsistent';
        } else {
            return true;
        }
    }
    return false;
}

function checkPhoneNum() {
    const res = phonePattern.test(phoneNo.value);
    const warning = document.getElementById('checkPhoneNo');
    
    if (phoneNo.value === '') {
        warning.style.display = 'block';
        warning.textContent = 'Please input Your phone number';
    } else {
        if (!res) {
            warning.style.display = 'block';
            warning.textContent = 'The phone format should be: 04xxxxxxxx';
        } else {
            return true;
        }
    }
    return false;
}