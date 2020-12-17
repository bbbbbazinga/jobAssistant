import { feed } from './topAndBottom.js';
import API from './api.js';

const api = new API('http://localhost:5000');

const postJobs = document.getElementById('postJobs');
const foundNo = document.getElementById('foundNo');
const token = localStorage.getItem('token');
let posted = '';
let ids = '';
let length = 0;
// console.log(token);

const renderPosts = (posted, length) => {
    posted = localStorage.getItem('posted');
    ids = localStorage.getItem('ids');
    // console.log(posted);
    let everyWord;
    let everyID;
    if (posted) {
        length = posted.split('。').length;
        // console.log(length);
        everyWord = posted.split('。');
        everyID = ids.split(',');
        postJobs.innerHTML = '';
    };
    if (length != 0) {
        foundNo.innerHTML = length / 11 + ' jobs found';

        for (let i = 0; i < length / 11; i++) {
            // 每一个job的信息
            const eachJob = document.createElement('div');
            eachJob.setAttribute('class', 'each_job');
            eachJob.setAttribute('id', everyID[i]);

            const positionName = document.createElement('h2');
            positionName.setAttribute('class', 'Jobtitle BTN');
            positionName.innerHTML = everyWord[i * 11 + 0];
            eachJob.appendChild(positionName);
            const collect = document.createElement('div');
            collect.setAttribute('class', 'collectIcon');
            eachJob.appendChild(collect);
            const postDate = document.createElement('p');
            postDate.setAttribute('class', 'bar');
            postDate.innerHTML = everyWord[i * 11 + 1];
            eachJob.appendChild(postDate);

            const companyName = document.createElement('p');
            companyName.setAttribute('class', 'cmpName');
            companyName.innerHTML = everyWord[i * 11 + 2];
            eachJob.appendChild(companyName);
            const location = document.createElement('p');
            location.setAttribute('class', 'location');
            location.innerHTML = everyWord[i * 11 + 3];
            eachJob.appendChild(location);
            const salaryRange = document.createElement('p');
            salaryRange.setAttribute('class', 'salaryRange');
            salaryRange.innerHTML = everyWord[i * 11 + 4] + ' AUD ~ ' + everyWord[i * 11 + 5] + ' AUD';
            eachJob.appendChild(salaryRange);
            // ul里面放requirements
            const ul = document.createElement('ul');
            const skill = document.createElement('li');
            skill.setAttribute('class', 'adv');
            skill.innerHTML = everyWord[i * 11 + 6];
            ul.appendChild(skill);

            const experience = document.createElement('li');
            experience.setAttribute('class', 'adv');
            experience.innerHTML = everyWord[i * 11 + 7];
            ul.appendChild(experience);

            const description = document.createElement('li');
            description.setAttribute('class', 'adv');
            description.innerHTML = everyWord[i * 11 + 8];
            ul.appendChild(description);

            const deadline = document.createElement('li');
            deadline.setAttribute('class', 'adv');
            deadline.innerHTML = 'Application will be available before ' + everyWord[i * 11 + 9];
            ul.appendChild(deadline);

            eachJob.appendChild(ul);
            // 岗位职责
            const responsibility = document.createElement('p');
            responsibility.setAttribute('class', 'responsibility');
            responsibility.innerHTML = 'Responsibility: ' + everyWord[i * 11 + 10];
            eachJob.appendChild(responsibility);

            postJobs.appendChild(eachJob);

            positionName.addEventListener('click', function () {
                const clickID = everyID[i];
                if (localStorage.getItem('clickID')) {
                    localStorage.removeItem('clickID');
                };
                localStorage.setItem('clickID', clickID);
                window.location.assign('positionInformation.html');
            });
        }
    }
}

renderPosts(posted, length);


const go = document.getElementById('Go');
const eType = document.getElementById('seleJ');
const location = document.getElementById('seleL');
const minS = document.getElementById('seleP');
const maxS = document.getElementById('seleT');
const listed = document.getElementById('listed');

let eVal = 'all', lVal = 'Aus', minVal = '0', maxVal = '200000';
// let eIndex, lIndex, minIndex, maxIndex, liIndex;

eType.addEventListener('change', function () {
    eVal = eType.value;
});
location.addEventListener('change', function () {
    lVal = location.value;
});
minS.addEventListener('change', function () {
    minVal = minS.value;
});
maxS.addEventListener('change', function () {
    maxVal = maxS.value;
});

const queryFunction = () => {
    localStorage.removeItem('query');
    let query = 'search/searchJob?';
    if (eVal !== 'all') {
        query += 'etype=' + eVal + '&';
    };
    if (lVal !== 'Aus') {
        query += 'work_state=' + lVal + '&';
    };

    query += 'min_salary=' + minVal;
    query += '&max_salary=' + maxVal;
    console.log(query);
    localStorage.setItem('query', query);
    feed(query);
};

// 点击事件之后，select的值恢复默认
go.addEventListener('click', function () {
    queryFunction();
    // window.location.reload();
    // console.log(posted);
    // renderPosts(posted, length);
});

listed.addEventListener('change', function () {
    let q = localStorage.getItem('query');
    if (q == 'null' && listed.value !== '') {
        // queryFunction();
        q = 'search/searchJob?min_salary=0&max_salary=200000';
        q += '&sorted_by=' + listed.value;
    } else if (q != 'null' && listed.value !== '') {
        if (q.indexOf('sorted_by') != -1) {
            let queryArray = q.split('&');
            queryArray.pop();
            let a = 'sorted_by=' + listed.value;
            queryArray.push(a);
            q = queryArray.join('&');
            // console.log(newQ);
        } else {
            q += '&sorted_by=' + listed.value;
        };
    };

    console.log(q);
    feed(q);
    localStorage.setItem('query', q);

});


