import API from './api.js';
import { pdfFileToDataUrl } from './getPDF.js';

const api = new API('http://localhost:5000');

const profileBtn = document.getElementById('profile');
const postBtn = document.getElementById('post');
const postedBtn = document.getElementById('posted');
const logoutBtn = document.getElementById('logout');

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
    window.location.assign('jobPosted.html');
}

logoutBtn.onclick = (event) => {
    event.preventDefault();
    // 清除所有localStorage中的信息
    localStorage.clear();
    window.location.assign('login.html');
}


const email = localStorage.getItem('applicant-email');
const jobId = localStorage.getItem('current-job-id');

const backBtn = document.querySelector('.back');
const answers = document.querySelectorAll('.answer');
const portrait = document.getElementById('portrait');

var [aFname, aGender, aTele, aExpectWorkState, aExpectSalary, 
    aLname, aBirth, aEmail, aSkills,
    aSchool, aEeDur, aWam, aMajor, aEeLevel,
    aPeName, aPeDur, aPeNum, aPeRole, aPeDesc,
    aWeComp, aWeDur, aWePos, aWeDesc,
    aIntro] = answers;

backBtn.onclick = (event) => {
    event.preventDefault();
    window.location.assign('jobPosted.html');
}



api.get(`apply/applicantInformation?email=${email}`, {
    headers: {
        "Content-Type": "application/json",
    }
})
.then(data => {
    console.log(data);
    const { BI, EE, PE, WE, Intro } = data;
    const { first_name, last_name, gender, birth, tele, email, src, expect_state, skill, salary } = BI;
    const { school, major, EDur, ELevel, wam } = EE;
    const { PName, PRole, PDur, PDes, PNum } = PE;
    const { WCom, WPos, WDur, WDes } = WE;
    const intro = Intro;
    
    [aFname.textContent, aLname.textContent, aGender.textContent, aBirth.textContent, aTele.textContent, aEmail.textContent, aExpectWorkState.textContent, aSkills.textContent, aExpectSalary.textContent] = [getText(first_name), getText(last_name), getText(gender), getText(birth), getText(tele), getText(email), getText(expect_state), getText(skill), getText(salary)];
    [aSchool.textContent, aMajor.textContent, aEeDur.textContent, aEeLevel.textContent, aWam.textContent] = [getText(school), getText(major), getText(EDur), getText(ELevel), getText(wam)];
    [aPeName.textContent, aPeRole.textContent, aPeDur.textContent, aPeDesc.textContent, aPeNum.textContent] =  [getText(PName), getText(PRole), getText(PDur), getText(PDes), getText(PNum)];
    [aWeComp.textContent, aWePos.textContent, aWeDur.textContent, aWeDesc.textContent] = [getText(WCom), getText(WPos), getText(WDur), getText(WDes)];
    aIntro.textContent = getText(intro);
    if (src !== null && src !== '') {
        portrait.src = `data:image/png;base64, ${src}`;
    }


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

const acceptBtn = document.querySelector('.accept');
const declineBtn = document.querySelector('.decline');
const interviewBtn = document.querySelector('.interview');
const additionalBtn = document.querySelector('.additional');

const sendOfferInfo = document.querySelector('.send-offer-info');
const interviewInfo = document.querySelector('.interview-info');
const sendInterview = document.querySelector('.send-interview-time');
const additionalInfo = document.querySelector('.additional-info');
const sendAdditional = document.querySelector('.send-additional-info');


acceptBtn.onclick = (event) => {
    event.preventDefault();
    const judge = ['none', ''];
    sendOfferInfo.style.display = judge.includes(sendOfferInfo.style.display)? 'flex': 'none';
    interviewInfo.style.display = 'none';
    additionalInfo.style.display = 'none';
}

interviewBtn.onclick = (event) => {
    event.preventDefault();
    const judge = ['none', ''];
    interviewInfo.style.display = judge.includes(interviewInfo.style.display)? 'flex': 'none';
    sendOfferInfo.style.display = 'none';
    additionalInfo.style.display = 'none';
}

additionalBtn.onclick = (event) => {
    event.preventDefault();
    const judge = ['none', ''];
    additionalInfo.style.display = judge.includes(additionalInfo.style.display)? 'flex': 'none';
    sendOfferInfo.style.display = 'none';
    interviewInfo.style.display = 'none';
}

// 发送面试邀请
sendInterview.onclick = (event) => {
    event.preventDefault();
    const date = event.target.parentNode.querySelector('input').value;
    const warning = event.target.parentNode.querySelector('.warning');
    warning.style.display = 'block';
    if (date === '') {
        warning.textContent = 'Please select an interview time.'
    } else {
        api.put(`job/sendInterview?job_id=${jobId}&email=${email}`, {
            body: JSON.stringify({
                "date": date,
            }),
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then((data) => {
            warning.textContent = 'Send Successfully';
        })
        .catch(err => {
            warning.textContent = err;
        })
    }
}

// 发送 需要的 额外信息
sendAdditional.onclick = (event) => {
    event.preventDefault();
    const text = event.target.parentNode.querySelector('textarea').value;
    const warning = event.target.parentNode.querySelector('.warning');
    warning.style.display = 'block';
    if (text === '') {
        warning.textContent = 'Please input something.'
    } else {
        api.put(`job/eachJob?job_id=${jobId}&email=${email}`, {
            body: JSON.stringify({
                "additional_input": text,
            }),
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then((data) => {
            warning.textContent = 'Send Successfully';
        })
        .catch(err => {
            warning.textContent = err;
        })
    }
}

// 拒绝简历
declineBtn.onclick = (event) => {
    event.preventDefault();
    const confirmDecline = confirm('Are you sure to decline this seeker?');
    if (confirmDecline) {
        api.put(`job/sendDecline?job_id=${jobId}&email=${email}`, {
            body: JSON.stringify({
                "decline": "decline",
            }),
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(() => {
            alert("You've declined this seeker.");
        })
        .catch(err => {
            alert(err);
        })
    }
}


const sendFileName = document.querySelector('.send-file-name');
const chooseFileBtn = document.querySelector('.choose-offer-btn');
const sendOfferBtn = document.querySelector('.send-offer-btn');
const inputFile = document.querySelector('input[type=file]');
const sendOfferWarning = document.querySelector('.send-offer-warning');


// 选择offer文件
chooseFileBtn.onclick = (event) => {
    event.preventDefault();
    inputFile.click();
}

// 当选择文件后，将文件名字赋予给sendFileName
inputFile.onchange = () => {
    if (inputFile.files.length === 0) {
        sendFileName.textContent = 'None';
    } else {
        const file = inputFile.files[0];
        if (file.type !== 'application/pdf') {
            sendOfferWarning.style.display = 'block';
            sendOfferWarning.textContent = 'Provided file is not a pdf.';
        } else {
            sendFileName.textContent = file.name;
            sendOfferWarning.style.display = 'none';
        }
    }
}

// 发送offer文件
sendOfferBtn.onclick = (event) => {
    event.preventDefault();
    const file = inputFile.files[0];
    if (sendFileName.textContent === 'None') {
        sendOfferWarning.style.display = 'block';
        sendOfferWarning.textContent = 'Please select a pdf file to send.';
    } else {
        if (file.type !== 'application/pdf') {
            sendOfferWarning.style.display = 'block';
            sendOfferWarning.textContent = 'Provided file is not a pdf.';
        } else {
            sendOfferWarning.style.display = 'none';
            pdfFileToDataUrl(file)
            .then(data => {
                const offerSrc = data.replace(/^data:application\/\w+;base64,/, '');
                const offerName = file.name;
                api.put(`job/sendOffer?job_id=${jobId}&email=${email}`, {
                    body: JSON.stringify({
                        "offer": offerSrc,
                        "offer_name": offerName,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    }
                })
                .then(data => {
                    sendOfferWarning.style.display = 'block';
                    sendOfferWarning.textContent = data['message'];
                })
                .catch(err => {
                    alert(err);
                })
            })
        }
    }
}
