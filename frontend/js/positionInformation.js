import API from './api.js';

const api = new API('http://localhost:5000');

const token = localStorage.getItem('token');
// 这里role的数据类型是string
const role = localStorage.getItem('role');
const clickID = localStorage.getItem('clickID');

const jobtitle = document.getElementById('jobtitle');
const applyBTN = document.getElementById('applyBTN');
const desc = document.getElementsByClassName('desc');
const container = document.getElementsByClassName('container');
let url = 'search/positionInformation?job_id=' + clickID;

api.get(url, {
    headers: {
        "Content-Type": "application/json"
    },
}).then(data => {
    console.log(data);
    jobtitle.innerHTML = data['title'];
    desc[0].innerHTML = 'Company: ' + data['company_name'];
    desc[1].innerHTML = 'Post date: ' + data['post_time'];
    desc[2].innerHTML = 'Location: ' + data['work_location'];
    desc[3].innerHTML = 'Job Type: ' + data['etype'];
    desc[4].innerHTML = 'Base Salary: $' + data['min_salary'] + ' AUD';

    const heading1 = document.createElement('h2');
    heading1.innerHTML = 'Job Description';
    container[0].appendChild(heading1);

    const ul1 = document.createElement('ul');
    const responsibility = document.createElement('li');
    responsibility.setAttribute('class', 'adv');
    responsibility.innerHTML = data['responsibility'];
    ul1.appendChild(responsibility);
    const description = document.createElement('li');
    description.setAttribute('class', 'adv');
    description.innerHTML = data['description'];
    ul1.appendChild(description);
    container[0].appendChild(ul1);

    const heading2 = document.createElement('h2');
    heading2.innerHTML = 'Candidate Must Haves: ';
    container[1].appendChild(heading2);

    const ul2 = document.createElement('ul');
    const skill = document.createElement('li');
    skill.setAttribute('class', 'adv');
    skill.innerHTML = data['skill'];
    ul2.appendChild(skill);
    const experience = document.createElement('li');
    experience.setAttribute('class', 'adv');
    experience.innerHTML = data['experience'];
    ul2.appendChild(experience);
    container[1].appendChild(ul2);

    const heading3 = document.createElement('h2');
    heading3.innerHTML = 'Deadline: ';
    container[2].appendChild(heading3);

    const ul3 = document.createElement('ul');
    const deadline = document.createElement('li');
    deadline.setAttribute('class', 'adv');
    deadline.innerHTML = 'Application will be available before ' + data['deadline'];
    ul3.appendChild(deadline);
    container[2].appendChild(ul3);
}).catch(err => {
    console.log(err);
});

applyBTN.addEventListener('click', function () {
    if (role === '1') {
        // 此处点击apply发送put请求，申请工作
        const email = localStorage.getItem('email');
        console.log(clickID);
        console.log(email);
        api.put('apply/positionInformation', {
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "job_id": clickID,
                "email": email
            })
        }).then(data => {
            alert('Apply Success!');
            localStorage.removeItem('clickID');
            // window.location.assign('seekerPage.html');
        }).catch(err => {
            console.log(err);
            alert(err);
        });
    } else {
        alert('Cannot apply a job as an employer!');
    };
});