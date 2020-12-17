import API from './api.js';

const api = new API('http://localhost:5000');

const registerForm = document.forms.registerForm;
const coEmail = registerForm.coEmail;
const fname = registerForm.firstName;
const lname = registerForm.lastName;
const pwd = registerForm.pwd;
const confirmPwd = registerForm.confirmPwd;
const phoneNo = registerForm.phoneNo;
const coName = registerForm.coName;
const ABN = registerForm.ABN;
const postCode = registerForm.postCode;
const vCode = registerForm.vCode;
const sendCode = registerForm.sendCode;
const regBtn = registerForm.regBtn;

var emailPattern = /^([a-zA-Z0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
var namePattern = /^[A-Z]{1}[a-zA-Z]+/;
var pwdPattern = /^[a-zA-Z0-9~!@#$%^&*()_+`\-={}:";'<>?,.\/]{8,16}$/;
var phonePattern = /(04)[0-9]{8}$/;
// 简单判断公司名称，邮编和ABN
var coNamePattern = /^[a-zA-Z0-9 ]{2,}$/
var ABNPattern = /^[0-9]{11}$/;
var postCodePattern = /^[0-9]{4}$/;


// 提交前，确保所需信息不为空
regBtn.onclick = (event) => {
    event.preventDefault();

    if (checkEmail() && checkFirstName() && checkLastName() && checkPassword()
        && checkConfirmPassword() && checkPhoneNum() && checkCompanyName()
        && checkABN && checkPostCode()) {

        api.post('auth/employerRegister', {
            body: JSON.stringify({
                "first_name": fname.value,
                "last_name": lname.value,
                "coEmail": coEmail.value,
                "password": pwd.value,
                "phoneNo": phoneNo.value,
                "coName": coName.value,
                "ABN": ABN.value,
                "post_code": postCode.value
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
coEmail.onblur = checkEmail;
coEmail.onfocus = () => {
    document.getElementById('checkCompanyEmail').style.display = 'none';
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
// 检查公司名称
coName.onblur = checkCompanyName;
coName.onfocus = () => {
    document.getElementById('checkCompanyName').style.display = 'none';
}

//检查ABN
ABN.onblur = checkABN;
ABN.onfocus = () => {
    document.getElementById('checkABN').style.display = 'none';
}

//检查公司邮编
postCode.onblur = checkPostCode;
postCode.onfocus = () => {
    document.getElementById('checkPostCode').style.display = 'none';
}



function checkEmail() {
    const res = emailPattern.test(coEmail.value);
    const warning = document.getElementById('checkCompanyEmail');
    if (coEmail.value === '') {
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

function checkCompanyName() {
    const res = coNamePattern.test(coName.value);
    const warning = document.getElementById('checkCompanyName');
    
    if (coName.value === '') {
        warning.style.display = 'block';
        warning.textContent = 'Please input Company Name';
    } else {
        if (!res) {
            warning.style.display = 'block';
            warning.textContent = 'Invalid input: Please enter correct Company Name';
        } else {
            return true;
        }
    }
    return false;
}

function checkABN() {
    const res = ABNPattern.test(ABN.value);
    const warning = document.getElementById('checkABN');
    if (ABN.value === '') {
        warning.style.display = 'block';
        warning.textContent = 'Please input 11-digits ABN number';
    } else {
        if (!res) {
            warning.style.display = 'block';
            warning.textContent = 'Invalid input: Please enter correct 11-digits ABN number';
        } else {
            return true;
        }
    }
    return false;
}

function checkPostCode() {
    const res =postCodePattern.test(postCode.value);
    const warning = document.getElementById('checkPostCode');
    
    if (postCode.value === '') {
        warning.style.display = 'block';
        warning.textContent = 'Please input Company Post Code number';
    } else {
        if (!res) {
            warning.style.display = 'block';
            warning.textContent = 'Invalid input: Please enter correct Post Code number';
        } else {
            return true;
        }
    }
    return false;
}



