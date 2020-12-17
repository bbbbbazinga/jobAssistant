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

const jobType = localStorage.getItem('job_jtype');
const jobTitle = localStorage.getItem('job_title');
const jobEmail = localStorage.getItem('job_email');
console.log(jobType, jobTitle, jobEmail);

var detailJobTitle = document.querySelector('.detail-job-title');
var answers = document.querySelectorAll('.answer');
var backBtn = document.querySelector('.back');

var [aCName, aCScale, aJobType, aJobTitle, aWorkState, aWorkLoc, 
    aEType, aSalaryRange, aSkills, aExp, aResp, aDesc, aDDL] = answers; 

// 显示job信息
api.get(`job/eachJob?jtype=${jobType}&title=${jobTitle}&email=${jobEmail}`, {
    headers: {
        "Content-Type": "application/json"
    }
})
.then(data => {
    const detailInfo = data['posted'][0];
    const { company_name, company_scale, deadline, description, etype, experience, jtype, max_salary, min_salary, 
    responsibility, skill, title, work_location, work_state } = detailInfo;

    detailJobTitle.textContent = getText(title);

    [aCName.textContent, aCScale.textContent, aJobType.textContent, aJobTitle.textContent, 
        aWorkState.textContent, aWorkLoc.textContent, aEType.textContent, aSkills.textContent, 
        aExp.textContent, aResp.textContent, aDesc.textContent, aDDL.textContent] = 
        [getText(company_name), getText(company_scale), getText(jtype), getText(title),
        getText(work_state), getText(work_location), getText(etype), getText(skill),
        getText(experience), getText(responsibility), getText(description), getText(deadline)];
        aSalaryRange.textContent = `$${getText(min_salary)} ~ $${getText(max_salary)}`;
})
.catch(err => {
    alert(err);
})

function getText(text) {
    if (text === null || text === '') {
        return 'None';
    }
    return text;
}

// 返回按钮
backBtn.onclick = (event) => {
    event.preventDefault();
    window.location.assign('application.html');
}