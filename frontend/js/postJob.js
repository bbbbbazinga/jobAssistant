import API from './api.js';

const api = new API('http://localhost:5000');

const email = localStorage.getItem('email');

const profileBtn = document.getElementById('profile');
const postedBtn = document.getElementById('posted');
const logoutBtn = document.getElementById('logout');

// 点击按钮跳转到对应页面
profileBtn.onclick = (event) => {
    event.preventDefault();
    window.location.assign('employerPage.html');
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

const postForm = document.forms.postForm;
const cname = postForm.cname;
const compScale = postForm.compScale;
const jobType = postForm.jobType;
const jobTitle = postForm.jobTitle;
const jobResp = postForm.jobResp;
const skill = postForm.skill;
const exp = postForm.exp;
const workState = postForm.workState;
const workLoc = postForm.loc;
const minSalary = postForm.minSalary;
const maxSalary = postForm.maxSalary;
const eType = postForm.eType;
const jobDes = postForm.jobDes;
const ddl = postForm.ddl;
const submitBtn = postForm.submit;

// submit按钮的操作 未完成
submitBtn.onclick = (event) => {
    event.preventDefault();
    
    const check = [
        cname.value, compScale.value, jobType.value, jobTitle.value, jobResp.value, skill.value, exp.value, 
        workState.value, workLoc.value, minSalary.value, maxSalary.value, eType.value, jobDes.value, ddl.value
    ];
    console.log(check);
    if (check.indexOf('') === -1) {
        const url = `job/postJob?email=${email}`;
        api.post(url, {
            body: JSON.stringify({
                // 需要做些更改
                "company_name": cname.value,
                "company_scale": compScale.value,
                "jtype": jobType.value,
                "title": jobTitle.value,
                "responsibility": jobResp.value,
                "skill": skill.value,
                "experience": exp.value,
                "work_state": workState.value,
                "work_location": workLoc.value,
                "min_salary": minSalary.value,
                "max_salary": maxSalary.value,
                "etype": eType.value,
                "description": jobDes.value,
                "deadline": ddl.value
            }),
            headers: {
                "Content-Type": "application/json"
            },
        })
        .then(() => {
            // 成功post了之后，跳转至jobPosted页面
            window.location.assign('jobPosted.html');
        })
        .catch(err => {
            // 将错误的信息显示到warning中
            const warning = document.querySelector('.warning');
            warning.style.display = 'block';
            warning.textContent = err;
        })
    } else {
        const warning = document.querySelector('.warning');
        warning.style.display = 'block';
        warning.textContent = 'Please fill all the information.';
    }
}