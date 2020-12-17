import API from './api.js';
// import { renderPosts } from './searchJob.js';
const api = new API('http://localhost:5000');

const token = localStorage.getItem('token');
const role = localStorage.getItem('role');


const home = document.getElementById('home');
const jobs = document.getElementById('jobs');
const JobType = document.getElementById('JobType');
const companies = document.getElementById('companies');
const CompanyType = document.getElementById('CompanyType');
const userInformation = document.getElementById('userInformation');
const emInformation = document.getElementById('emInformation');
const mySetting = document.getElementById('mySetting');
const emSetting = document.getElementById('emSetting');
const mainSearch = document.getElementById('mainSearch');
const mainSearchBTN = document.getElementById('mainSearchBTN');
const loginToLogout = document.getElementById('loginToLogout');
const registerToNone = document.getElementById('registerToNone');
const showMy = document.getElementById('showMy');
const showEm = document.getElementById('showEm');
function toggleFunction(clickTag, showTag, hid1, hid2, hid3) {
    clickTag.addEventListener('click', function () {
        if (showTag.style.display === 'none') {
            showTag.style.display = 'block';
            hid1.style.display = 'none';
            hid2.style.display = 'none';
            hid3.style.display = 'none';
        } else {
            showTag.style.display = 'none';
        }
    })
};

if (token) {
    loginToLogout.innerHTML = 'Logout';
    registerToNone.style.display = 'none';
    if (role == 2) {
        showEm.style.display = 'block';
    } else if (role == 1) {
        showMy.style.display = 'block';
    };
}

home.addEventListener('click', function () {
    window.location.assign('index.html');
    // feed('search/searchJob');
    localStorage.removeItem('posted');
    localStorage.removeItem('ids');
    localStorage.removeItem('query');
});

loginToLogout.addEventListener('click', function () {
    if (loginToLogout.innerHTML === 'Logout') {
        localStorage.clear();
    }
    window.location.assign('login.html');
});

registerToNone.addEventListener('click', function () {
    window.location.assign('seekerRegister.html');
});

toggleFunction(jobs, JobType, CompanyType, mySetting, emSetting);
toggleFunction(companies, CompanyType, JobType, mySetting, emSetting);
toggleFunction(userInformation, mySetting, JobType, CompanyType, emSetting);
toggleFunction(emInformation, emSetting, JobType, CompanyType, mySetting);


const FullTime = document.getElementById('Full-Time');
const PartTime = document.getElementById('Part-Time');
const Casual = document.getElementById('Casual');
const large = document.getElementById('large-scale');
const medium = document.getElementById('medium-scale');
const smallBusiness = document.getElementById('small-business');
const jSelect = document.getElementById('jSelect');


// console.log(hotwordBtn);

export function feed(url) {
    api.get(url, {
        headers: {
            "Content-Type": "application/json"
        },
    }).then(data => {
        const postArray = [];
        const idArray = [];
        for (let i = 0; i < data['posted'].length; i++) {
            const d = data['posted'][i];
            console.log(d);
            // title, posttime, companyname, location, min, max, skill, experience, description, deadline, responsibility
            const eachArray = [d['title'], d['post_time'], d['company_name'], d['work_location'], d['min_salary'], d['max_salary'], d['skill'], d['experience'], d['description'], d['deadline'], d['responsibility']];
            const eachString = eachArray.join('。');
            // console.log(eachString);
            postArray.push(eachString);
            idArray.push(d['job_id']);
        };
        // 把获取的searchjob信息存入localStorage
        const postedString = postArray.join('。');
        localStorage.removeItem('posted');
        localStorage.removeItem('ids');
        localStorage.setItem('posted', postedString);
        localStorage.setItem('ids', idArray.join(','));
        if (window.location.pathname !== '/searchJob.html') {
            window.location.assign('searchJob.html');
        } else {
            console.log('right here');
            window.location.reload();
        };
        // window.location.assign('searchJob.html');
    }).catch(err => {
        console.log(err);
        alert('no related jobs!');
        localStorage.removeItem('posted');
        localStorage.removeItem('ids');
        window.location.reload();
    })
};

function clickToSearch(clickTag, attr, value) {
    clickTag.addEventListener('click', function () {
        let url = 'search/searchJob?';
        url += attr + "=" + value;
        feed(url);
    });
};
clickToSearch(FullTime, 'etype', 'Full-Time');
clickToSearch(PartTime, 'etype', 'Part-Time');
clickToSearch(Casual, 'etype', 'Casual');

clickToSearch(large, 'company_scale', 'Large');
clickToSearch(medium, 'company_scale', 'Medium');
clickToSearch(smallBusiness, 'company_scale', 'Small');


let searchVal = '';
mainSearch.addEventListener('change', function () {
    // console.log('a');
    searchVal = mainSearch.value;
});

mainSearchBTN.addEventListener('click', function () {
    console.log(searchVal)
    let jSele = '';
    if (jSelect.value !== 'Job Type') {
        jSele = jSelect.value;
    }
    let url = '';
    if (searchVal !== '') {
        url = 'search/searchJob?keyword=' + searchVal;
        if (jSelect.value !== 'Job Type') {
            url += '&jtype=' + jSelect.value;
        };
        feed(url);
    } else {
        url = 'search/searchJob';
        if (jSelect.value !== 'Job Type') {
            url += '?jtype=' + jSelect.value;
        };
        feed(url);
    };
});

const myProfile = document.getElementById('myProfile');
const myApplication = document.getElementById('myApplication');
myProfile.addEventListener('click', function () {
    console.log('click');
    window.location.assign('seekerPage.html');
});

myApplication.addEventListener('click', function () {
    window.location.assign('application.html');
});


const emProfile = document.getElementById('emProfile');
const postAJob = document.getElementById('postAJob');
const jobPosted = document.getElementById('jobPosted');
// const applicants = document.getElementById('applicants');
emProfile.addEventListener('click', function () {
    // console.log('click');
    window.location.assign('employerPage.html');
});

postAJob.addEventListener('click', function () {
    window.location.assign('postJob.html');
});

jobPosted.addEventListener('click', function () {
    window.location.assign('jobPosted.html');
});

const aboutus = document.getElementById('aboutus');
const contactus = document.getElementById('contactus');

aboutus.addEventListener('click', function () {
    window.location.assign('aboutUs.html');
});

contactus.addEventListener('click', function () {
    console.log('a');
    window.location.assign('contactUs.html');
});