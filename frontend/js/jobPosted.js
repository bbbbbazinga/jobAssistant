import API from './api.js';

const api = new API('http://localhost:5000');

const email = localStorage.getItem('email');

const profileBtn = document.getElementById('profile');
const postBtn = document.getElementById('post');
const postedBtn = document.getElementById('posted');
const logoutBtn = document.getElementById('logout');


const subTitle = document.querySelector('.subTitle');
const jobContainer = document.querySelector('.job-container');
const singleJob = document.querySelector('.single-job');

// 点击按钮跳转到对应页面
profileBtn.onclick = (event) => {
    event.preventDefault();
    window.location.assign('employerPage.html');
}

postBtn.onclick = (event) => {
    event.preventDefault();
    window.location.assign('postJob.html');
}

postedBtn.onclick = (event) => {
    event.preventDefault();
    singleJob.style.display = 'none';
    subTitle.style.display = 'block';
    jobContainer.style.display = 'flex';
    updateJobPosted();
    submitEffect();
}

logoutBtn.onclick = (event) => {
    event.preventDefault();
    // 清除所有localStorage中的信息
    localStorage.clear();
    window.location.assign('login.html');
}


// 给jobContainer加监听
jobContainer.addEventListener('click', (event) => {
    if (event.target.className === 'job-title') {
        // 隐藏所有job的信息，只显示所点击的job具体信息
        subTitle.style.display = 'none';
        jobContainer.style.display = 'none';
        singleJob.style.display = 'flex';
        showDetailJob(event);
    }
    if (event.target.className === 'applicants-btn') {
        showApplicantsOrNot(event);
    }
    if (event.target.className === 'each-applicant-view') {
        doView(event);
    }
    if (event.target.className === 'select-applicants-btn') {
        showInviteOrNot(event);
    }
    if (event.target.className === 'send-top-x-btn') {
        doSend(event);
    }
})



// 初始化jobPosted页面，获取所有job信息并显示
updateJobPosted();

function updateJobPosted() {
    api.get(`job/jobPosted?email=${email}`, {
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(data => {
        // console.log(data);
        const jobs = data['posted'];
        createJobInfo(jobs);
    })
    .catch(err => {
        alert(err);
    })
}


function cleanJobPosted() {
    while (jobContainer.children.length !== 0) {
        const child = jobContainer.children[0];
        child.remove();
    }
}

function createJobInfo(jobs) {

    cleanJobPosted();
    jobs.map(job => {
        // console.log(job);
        // 建立job
        const eachJob = document.createElement('div');
        eachJob.className = 'each-job';
        jobContainer.appendChild(eachJob);

        // 每个job的id，不显示出来，但为了后续与后端沟通，需要用到。
        const eachJobId = document.createElement('div');
        eachJobId.className = 'each-job-id';
        eachJobId.style.display = 'none';
        eachJob.appendChild(eachJobId);

        // 每个job中的每一行
        const jobTitlePostTime = document.createElement('div');
        jobTitlePostTime.className = 'jobTitle-postTime';
        const jobBasicInfo = document.createElement('div');
        jobBasicInfo.className = 'job-basic-info'
        const jobStatus = document.createElement('div');
        jobStatus.className = 'job-status';
        const jobDescription = document.createElement('div');
        jobDescription.className = 'job-description';
        const contactEmail = document.createElement('div');
        contactEmail.className = 'contact-email'
        const ddl = document.createElement('div');
        ddl.className = 'ddl';
        const moreInfoAndApplicant = document.createElement('div');
        moreInfoAndApplicant.className = 'more-info-and-applicants-btn';
        const applicantsContainer = document.createElement('div');
        applicantsContainer.className = 'applicants-container';
        const inviteContainer = document.createElement('div');
        inviteContainer.className = 'invite-container';

        eachJob.appendChild(jobTitlePostTime);
        eachJob.appendChild(jobBasicInfo);
        eachJob.appendChild(jobStatus);
        eachJob.appendChild(jobDescription);
        eachJob.appendChild(contactEmail);
        eachJob.appendChild(ddl);
        eachJob.appendChild(moreInfoAndApplicant);
        eachJob.appendChild(applicantsContainer);
        eachJob.appendChild(inviteContainer);

        // jobTitle-postTime 中的每一个元素
        const jobTitle = document.createElement('div');
        jobTitle.className = 'job-title';
        const postTime = document.createElement('div');
        postTime.className = 'post-time';

        jobTitlePostTime.appendChild(jobTitle);
        jobTitlePostTime.appendChild(postTime);

        // job-basic-info 中的每一个元素
        const companyNameScale = document.createElement('div');
        companyNameScale.className = 'company-name-scale';
        const jobType = document.createElement('div');
        jobType.className = 'job-type';
        const workPlace = document.createElement('div');
        workPlace.className = 'work-place';
        const salaryRange = document.createElement('div');
        salaryRange.className = 'salary-range';

        jobBasicInfo.appendChild(companyNameScale);
        jobBasicInfo.appendChild(jobType);
        jobBasicInfo.appendChild(workPlace);
        jobBasicInfo.appendChild(salaryRange);

        // more-info-and-applicants-btn中的两个按钮
        const applicantBtn = document.createElement('button');
        applicantBtn.className = 'applicants-btn';
        const selectApplicantsBtn = document.createElement('button');
        selectApplicantsBtn.className = 'select-applicants-btn';
        // moreInfoAndApplicant.appendChild(moreInfoBtn);
        moreInfoAndApplicant.appendChild(applicantBtn);
        moreInfoAndApplicant.appendChild(selectApplicantsBtn);

        // 填充applicants-container
        // console.log(job);
        const applicants = job['applicant'];
        createApplicantsInfo(applicantsContainer, applicants);
        createInviteTopXInfo(inviteContainer);

        const jobId = job['job_id'];
        const title = job['title'];
        const pTime = job['post_time'];
        const cName = job['company_name'];
        const cScale = job['company_scale'];
        const jType = job['jtype'];
        const wState = job['work_state'];
        const wLoc = job['work_location'];
        const minSalary = job['min_salary'];
        const maxSalary = job['max_salary'];
        const jstatus = job['status'];
        const desc = job['description'];
        const deadline = job['deadline'];

        eachJobId.textContent = jobId;
        jobTitle.textContent = title;
        postTime.textContent = pTime;
        companyNameScale.textContent = `Company Name: ${cName}`;
        jobType.textContent = `Job Type: ${jType}`;
        workPlace.textContent = `Work Location: ${wLoc}`;
        salaryRange.textContent = `Salary Range: ${minSalary}AUD ~ $${maxSalary}AUD`;
        jobStatus.textContent = jstatus === 'active'? 'Open': 'Closed';
        jobDescription.textContent = desc;
        contactEmail.textContent = email;
        ddl.textContent = deadline;
        applicantBtn.textContent = 'Applicants';
        selectApplicantsBtn.textContent = 'Invite Top X';
        }
    )
}


function createApplicantsInfo(applicantsContainer, applicants) {
    if (applicants === null) {
        const noApplicantInfo = document.createElement('div');
        noApplicantInfo.className = 'no-applicant-info';
        applicantsContainer.appendChild(noApplicantInfo);
        noApplicantInfo.textContent = 'No applicants yet.';
    } else {
        applicants.map(applicant => {
            // console.log(applicant)
            const eachApplicant = document.createElement('div');
            eachApplicant.className = 'each-applicant';
            applicantsContainer.appendChild(eachApplicant);
        
            const eachApplicantRow1 = document.createElement('div');
            eachApplicantRow1.className = 'each-applicant-row';
            eachApplicant.appendChild(eachApplicantRow1);
            const eachApplicantRow2 = document.createElement('div');
            eachApplicantRow2.className = 'each-applicant-row';
            eachApplicant.appendChild(eachApplicantRow2);
        
            const eachApplicantName = document.createElement('div');
            eachApplicantName.className = 'each-applicant-name';
            const eachApplicantEmail = document.createElement('div');
            eachApplicantEmail.className = 'each-applicant-email';
            const eachApplicantResponse = document.createElement('div');
            eachApplicantResponse.className = 'each-applicant-response';
            eachApplicantRow1.appendChild(eachApplicantName);
            eachApplicantRow1.appendChild(eachApplicantEmail);
            eachApplicantRow1.appendChild(eachApplicantResponse);
            
            const eachApplicantOtherFile = document.createElement('a');
            eachApplicantOtherFile.className = 'each-applicant-other-file';
            const eachApplicantView = document.createElement('button');
            eachApplicantView.className = 'each-applicant-view';
            eachApplicantRow2.appendChild(eachApplicantOtherFile);
            eachApplicantRow2.appendChild(eachApplicantView);

            const { first_name, last_name, email, response, additional, additional_name } = applicant;
            eachApplicantName.textContent = `${first_name} ${last_name}`;
            eachApplicantEmail.textContent = email;
            eachApplicantResponse.textContent = response;
            eachApplicantView.textContent = 'View';
            eachApplicantResponse.textContent = response === null? 'None': response;

            if (additional_name === null) {
                eachApplicantOtherFile.textContent = 'None';
            } else {
                eachApplicantOtherFile.href = `data:application/pdf;base64, ${additional}`;
                eachApplicantOtherFile.download = additional_name;
                eachApplicantOtherFile.textContent = additional_name;
            }

        })
    }
}


function createInviteTopXInfo(inviteContainer) {
    const row1 = document.createElement('div');
    row1.className = 'invite-row';
    const row2 = document.createElement('div');
    row2.className = 'invite-row';
    inviteContainer.appendChild(row1);
    inviteContainer.appendChild(row2);

    const preTopX = document.createElement('span');
    preTopX.className = 'pre-top-x';
    const inputNumber = document.createElement('input');
    inputNumber.setAttribute('type', 'number');
    inputNumber.className = 'top-x';
    const preSelectDate = document.createElement('span');
    preSelectDate.className = 'pre-select-date';
    const selectDate = document.createElement('input');
    selectDate.setAttribute('type', 'date');
    selectDate.className = 'select-date';
    selectDate.style.display = 'inline';
    selectDate.style.width = '20%';
    const sendTopXBtn = document.createElement('button');
    sendTopXBtn.className = 'send-top-x-btn';
    row1.appendChild(preTopX);
    row1.appendChild(inputNumber);
    row2.appendChild(preSelectDate);
    row2.appendChild(selectDate);
    row2.appendChild(sendTopXBtn);

    preTopX.textContent = 'Top X number: ';
    preSelectDate.textContent = 'Select the interview date: '
    sendTopXBtn.textContent = 'Send Interview';
}


// toggle Applicants的信息
function showApplicantsOrNot(event) {
    event.preventDefault();
    const applicantsContainer = event.target.parentNode.parentNode.querySelector('.applicants-container');
    const inviteContainer = event.target.parentNode.parentNode.querySelector('.invite-container');
    // ''是因为第一次渲染后的applicantsContainer.style.display = '';
    const judge = ['none', ''];
    inviteContainer.style.display = 'none';
    applicantsContainer.style.display = judge.includes(applicantsContainer.style.display)? 'flex': 'none';
}

// toggle 是否要invite
function showInviteOrNot(event) {
    event.preventDefault();
    const applicantsContainer = event.target.parentNode.parentNode.querySelector('.applicants-container');
    const inviteContainer = event.target.parentNode.parentNode.querySelector('.invite-container');
    // ''是因为第一次渲染后的applicantsContainer.style.display = '';
    const judge = ['none', ''];
    applicantsContainer.style.display = 'none';
    inviteContainer.style.display = judge.includes(inviteContainer.style.display)? 'flex': 'none';
}


// 查看applicant信息
function doView(event) {
    event.preventDefault();
    const email = event.target.parentNode.parentNode.querySelector('.each-applicant-email').textContent;
    const jobId = event.target.parentNode.parentNode.parentNode.parentNode.querySelector('.each-job-id').textContent;
    localStorage.setItem('applicant-email', email);
    localStorage.setItem('current-job-id', jobId);
    window.location.assign('applicantProfile.html');
}

// 群发面试邀请
function doSend(event) {
    event.preventDefault();
    const number = event.target.parentNode.parentNode.querySelector('.top-x').value;
    const jobId = event.target.parentNode.parentNode.parentNode.querySelector('.each-job-id').textContent;
    const date = event.target.parentNode.querySelector('.select-date').value;
    api.put(`job/sendXInterviews?num=${number}&job_id=${jobId}`, {
        body: JSON.stringify({
            "date": date,
        }),
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then((data) => {
        alert(data['message']);
    })
    .catch(err => {
        alert(err);
    })
}










// 以下是对single Job的操作
var detailJobTitle = document.querySelector('.detail-job-title');
var answers = document.querySelectorAll('.answer');
var inputText = document.querySelectorAll('input[type=text]');
var inputDate = document.querySelectorAll('input[type=date]');
var inputTextarea = document.querySelectorAll('textarea');
var inputSelect = document.querySelectorAll('.choice');
var backBtn = document.querySelector('.back');
var editBtn = document.querySelector('.edit');
var deleteBtn = document.querySelector('.delete');
var submitBtn = document.querySelector('.submit');


var [aCName, aCScale, aJobType, aJobTitle, aWorkState, aWorkLoc, 
    aEType, aSalaryRange, aSkills, aDesc, aResp, aExp, aDDL] = answers; 
var [iCName, iJobTitle, iWorkLoc, iMinSalary, iMaxSalary] = inputText;
var [iDDL] = inputDate;
var [iSkills, iDesc, iResp, iExp] = inputTextarea;
var [iCScale, iJobType, iWorkState, iEType] = inputSelect;

var tempUrl;
var tempJobId;

// 获取此job的url并将内容显示
function showDetailJob(event) {
    event.preventDefault();
    // const jobTitle = event.target.parentNode.parentNode.querySelector('.job-title').textContent;
    // const jobType = event.target.parentNode.parentNode.querySelector('.job-type').textContent.replace(/Job Type: /, '');
    const jobTitle = event.target.textContent;
    const jobType = event.target.parentNode.parentNode.querySelector('.job-type').textContent.replace(/Job Type: /, '');

    const url = `job/eachJob?jtype=${jobType}&title=${jobTitle}&email=${email}`;
    tempUrl = url;
    updateJob(url);
}

// 显示job最新的信息
function updateJob(url) {
    api.get(url, {
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(data => {
        // console.log(data['posted'][0]);
        const detailInfo = data['posted'][0];
        const { company_name, company_scale, deadline, description, etype, experience, jtype, max_salary, min_salary, 
        responsibility, skill, title, work_location, work_state, job_id } = detailInfo;

        tempJobId = job_id;
        
        detailJobTitle.textContent = getText(title);

        [aCName.textContent, aCScale.textContent, aJobType.textContent, aJobTitle.textContent, 
        aWorkState.textContent, aWorkLoc.textContent, aEType.textContent, aSkills.textContent, 
        aExp.textContent, aResp.textContent, aDesc.textContent, aDDL.textContent] = 
        [getText(company_name), getText(company_scale), getText(jtype), getText(title),
        getText(work_state), getText(work_location), getText(etype), getText(skill),
        getText(experience), getText(responsibility), getText(description), getText(deadline)];
        aSalaryRange.textContent = `$${getText(min_salary)} ~ $${getText(max_salary)}`;

        [iCName.value, iCScale.value, iJobType.value, iJobTitle.value, 
        iWorkState.value, iWorkLoc.value, iEType.value, iSkills.value, 
        iExp.value, iResp.value, iDesc.value, iDDL.value] = 
        [getText(company_name), getText(company_scale), getText(jtype), getText(title),
        getText(work_state), getText(work_location), getText(etype), getText(skill),
        getText(experience), getText(responsibility), getText(description), getText(deadline)];
        iMinSalary.value = getText(min_salary);
        iMaxSalary.value = getText(max_salary);
    })
}

function getText(text) {
    if (text === null || text === '') {
        return 'None';
    }
    return text;
}

// 返回按钮
backBtn.onclick = (event) => {
    event.preventDefault();
    singleJob.style.display = 'none';
    subTitle.style.display = 'block';
    jobContainer.style.display = 'flex';
    updateJobPosted();
    submitEffect();
}


// 编辑按钮
editBtn.onclick = (event) => {
    event.preventDefault();
    editBtn.style.display = 'none';
    deleteBtn.style.display = 'none';
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
    for(let i = 0; i < inputSelect.length; i++) {
        inputSelect[i].style.display = 'block';
    }
    for(let i = 0; i < inputDate.length; i++) {
        inputDate[i].style.display = 'block';
    }
    const rangeSalary = document.querySelector('.range-salary');
    rangeSalary.style.display = 'flex';
}


// 删除按钮
deleteBtn.onclick = (event) => {
    event.preventDefault();
    const confirmDelete = confirm('Are you sure to delete this job?');
    if (confirmDelete) {
        api.delete(`job/jobPosted?job_id=${tempJobId}`, {
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(data => {
            // console.log(data);
            singleJob.style.display = 'none';
            subTitle.style.display = 'block';
            jobContainer.style.display = 'flex';
            updateJobPosted();
            submitEffect();
        })
        .catch(err => {
            alert(err);
        })
    }
}



// 提交按钮
submitBtn.onclick = (event) => {
    event.preventDefault();
    submitEffect();

    const required = {};
    const key = [
        'company_name', 'company_scale', 'jtype', 'title', 'responsibility', 'skill', 'experience',
        'work_state', 'work_location', 'min_salary', 'max_salary', 'etype', 'description', 'deadline'];
    const value = [iCName.value, iCScale.value, iJobType.value, iJobTitle.value, 
        iResp.value, iSkills.value, iExp.value, iWorkState.value, iWorkLoc.value, 
        iMinSalary.value, iMaxSalary.value, iEType.value, iDesc.value, iDDL.value];
    for(let i = 0; i < key.length; i++) {
        if (value[i] !== '') {
            required[key[i]] = value[i];
        }
    }
    
    api.put(`job/jobPosted?job_id=${tempJobId}`, {
        body: JSON.stringify(required),
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then(data => {
        // console.log(data);
        updateJob(tempUrl);
    })
    .catch(err => {
        alert(err);
    })
}

function submitEffect() {
    editBtn.style.display = 'block';
    deleteBtn.style.display = 'block';
    submitBtn.style.display = 'none';
    for(let i = 0; i < answers.length; i++) {
        answers[i].style.display = 'block';
    }
    for(let i = 0; i < inputText.length; i++) {
        inputText[i].style.display = 'none';
    }
    for(let i = 0; i < inputTextarea.length; i++) {
        inputTextarea[i].style.display = 'none';
    }
    for(let i = 0; i < inputSelect.length; i++) {
        inputSelect[i].style.display = 'none';
    }
    for(let i = 0; i < inputDate.length; i++) {
        inputDate[i].style.display = 'none';
    }
    const rangeSalary = document.querySelector('.range-salary');
    rangeSalary.style.display = 'none';
}