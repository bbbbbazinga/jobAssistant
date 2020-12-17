import API from './api.js';

const api = new API('http://localhost:5000');

const token = localStorage.getItem('token');
// 这里role的数据类型是string
const role = localStorage.getItem('role');

// console.log(token);

const answers = document.querySelectorAll('.answer');
const inputText = document.querySelectorAll('input[type=text]');
const inputTextarea = document.querySelectorAll('textarea');

const editBtn = document.querySelector('.edit');
const submitBtn = document.querySelector('.submit');

const postBtn = document.getElementById('post');
const postedBtn = document.getElementById('posted');
const logoutBtn = document.getElementById('logout');

// 点击按钮跳转到对应页面
postBtn.onclick = (event) => {
    event.preventDefault();
    window.location.assign('postJob.html');
}

postedBtn.onclick = (event) => {
    event.preventDefault();
    window.location.assign('jobPosted.html');
}

logoutBtn.onclick = (event) => {
    event.preventDefault();
    // 清除所有localStorage中的信息
    localStorage.clear();
    window.location.assign('login.html');
}



var [aFname, aCompName, aTele, aABN, aCompDesc, 
    aLname, aCompType, aEmail, aPostCode] = answers;

var [iFname, iCompName, iTele, iABN, 
    iLname, iCompType, iEmail, iPostCode] = inputText;

var [iCompDesc] = inputTextarea;

// 首次调用，初始化页面
updateProfile();

function updateProfile() {
    const url = `employer/employerPage?token=${token}`;
    api.get(url, {
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then(data => {
        // console.log(data);
    
        const { first_name, last_name, company_name, company_type, tele, email, ABN, post_code, company_des } = data;
    
        [aFname.textContent, aCompName.textContent, aTele.textContent, aABN.textContent, aCompDesc.textContent, 
            aLname.textContent, aCompType.textContent, aEmail.textContent, aPostCode.textContent] = 
            [getText(first_name), getText(company_name), getText(tele), getText(ABN), getText(company_des), 
                getText(last_name), getText(company_type), getText(email), getText(post_code)];
        
        [iFname.value, iCompName.value, iTele.value, iABN.value, iCompDesc.value, 
            iLname.value, iCompType.value, iEmail.value, iPostCode.value] = 
            [getText(first_name), getText(company_name), getText(tele), getText(ABN), getText(company_des), 
                getText(last_name), getText(company_type), getText(email), getText(post_code)];
    
    })
}

function getText(text) {
    if (text === null || text === '') {
        return 'None';
    }
    return text;
}


// edit按钮操作
editBtn.onclick = (event) => {
    event.preventDefault();
    editBtn.style.display = 'none';
    submitBtn.style.display = 'block';
    for(let i = 0; i < answers.length; i++) {
        answers[i].style.display = 'none';
    }
    for(let i = 0; i < inputText.length; i++) {
        inputText[i].style.display = 'block';
    }
    for(let i = 0; i < inputTextarea.length; i++) {
        inputTextarea[i].style.display = 'block';
    }
}

// submit按钮操作
submitBtn.onclick = (event) => {
    event.preventDefault();
    editBtn.style.display = 'block';
    submitBtn.style.display = 'none';

    const required = {};
    const inputTextKey = ['first_name', 'company_name', 'tele', 'ABN', 'last_name', 'company_type', 'email', 'post_code'];
    for(let i = 0; i < answers.length; i++) {
        answers[i].style.display = 'block';
    }
    // 分别判断各个input是否为空，只传递不为空的input给required，required用作body中的payload
    for(let i = 0; i < inputText.length; i++) {
        inputText[i].style.display = 'none';
        requireInput(i);
    }
    // 只有一个textarea，所以可以单独考虑
    for(let i = 0; i < inputTextarea.length; i++) {
        inputTextarea[i].style.display = 'none';
        if (inputTextarea[i].value !== '') {
            required['company_des'] = inputTextarea[i].value;
        }
    }
    
    const url = `employer/employerPage?token=${token}`;
    api.put(url, {
        body: JSON.stringify(required),
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then(() => {
        // 提交成功则更新Profile
        updateProfile();
    })

    function requireInput(i) {
        if (inputText[i].value !== '') {
            required[inputTextKey[i]] = inputText[i].value;
        }
    }
}

