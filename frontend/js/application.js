import API from './api.js';
import { pdfFileToDataUrl } from './getPDF.js';

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

const email = localStorage.getItem('email');
// console.log(email);

const applicationsContainer = document.querySelector('.applications-container');

applicationsContainer.addEventListener('click', (event) => {
    if (event.target.className === 'each-application-title') {
        event.preventDefault();
        const jtype = event.target.parentNode.querySelector('.each-application-job-type').textContent;
        const title = event.target.textContent;
        const employerEmail = event.target.parentNode.querySelector('.each-application-employer-email').textContent;
        localStorage.setItem('job_jtype', jtype);
        localStorage.setItem('job_title', title);
        localStorage.setItem('job_email', employerEmail);
        window.location.assign('jobDetails.html');
    }
    if (event.target.className === 'each-application-accept') {
        event.preventDefault();
        const jobId = event.target.parentNode.parentNode.querySelector('.each-app-job-id').textContent;
        console.log(jobId)
        const warning = event.target.parentNode.parentNode.querySelector('.each-application-warning');
        putResponse('accept', jobId, email, warning);
    }
    if (event.target.className === 'each-application-decline') {
        event.preventDefault();
        const jobId = event.target.parentNode.parentNode.querySelector('.each-app-job-id').textContent;
        const warning = event.target.parentNode.parentNode.querySelector('.each-application-warning');
        putResponse('decline', jobId, email, warning);
    }
    if (event.target.className === 'each-application-add-file') {
        event.preventDefault();
        const showSendFile = event.target.parentNode.parentNode.querySelector('.each-application-send-file');
        const judge = ['none', ''];
        showSendFile.style.display = judge.includes(showSendFile.style.display)? 'flex': 'none';
    }
    if (event.target.className === 'choose-file-btn') {
        event.preventDefault();
        const inputFile = event.target.parentNode.parentNode.querySelector('input[type=file]');
        inputFile.click();
    }
    if (event.target.className === 'send-file-btn') {
        doSendFile(event);
    }
})



api.get(`apply/myApplication?email=${email}`, {
    headers: {
        "Content-Type": "application/json"
    }
})
.then(data => {
    const applications = data['applications'];
    applications.map(application => {
        showApplication(application);
    })
})
.catch(err => {
    alert(err);
})

function showApplication(application) {
    const eachApp = document.createElement('div');
    eachApp.className = 'each-application';
    applicationsContainer.appendChild(eachApp);

    // 每个job的id，不显示出来，但为了后续与后端沟通，需要用到。
    const eachAppJobId = document.createElement('div');
    eachAppJobId.className = 'each-app-job-id';
    eachAppJobId.style.display = 'none';
    eachApp.appendChild(eachAppJobId);


    const eachAppTitle = document.createElement('div');
    eachAppTitle.className = 'each-application-title';

    // Row1用来存放companyName和jobType
    const eachAppRow1 = document.createElement('div');
    eachAppRow1.className = 'each-application-row';
    // Row2用来存放employer email和application time
    const eachAppRow2 = document.createElement('div');
    eachAppRow2.className = 'each-application-row';
    // Row3用来存放status
    const eachAppRow3 = document.createElement('div');
    eachAppRow3.className = 'each-application-row';

    const eachAppAdditionalInfo = document.createElement('div');
    eachAppAdditionalInfo.className = 'each-application-additional-info';

    const eachAppMyOffer = document.createElement('a');
    eachAppMyOffer.className = 'each-application-my-offer';

    const eachAppWarning = document.createElement('div');
    eachAppWarning.className = 'each-application-warning';

    const eachAppBtn = document.createElement('div');
    eachAppBtn.className = 'each-application-btn';

    const eachAppSendFile = document.createElement('div');
    eachAppSendFile.className = 'each-application-send-file';

    eachApp.appendChild(eachAppTitle);
    eachApp.appendChild(eachAppRow1);
    eachApp.appendChild(eachAppRow2);
    eachApp.appendChild(eachAppRow3);
    eachApp.appendChild(eachAppAdditionalInfo);
    eachApp.appendChild(eachAppMyOffer);
    eachApp.appendChild(eachAppWarning);
    eachApp.appendChild(eachAppBtn);
    eachApp.appendChild(eachAppSendFile);
    
    const eachAppCompanyName = document.createElement('div');
    eachAppCompanyName.className = 'each-application-company-name';
    const eachAppJobType = document.createElement('div');
    eachAppJobType.className = 'each-application-job-type';
    eachAppRow1.appendChild(eachAppCompanyName);
    eachAppRow1.appendChild(eachAppJobType);

    const eachAppEmployerEmail = document.createElement('div');
    eachAppEmployerEmail.className = 'each-application-employer-email';
    const eachAppTime = document.createElement('div');
    eachAppTime.className = 'each-application-time';
    eachAppRow2.appendChild(eachAppEmployerEmail);
    eachAppRow2.appendChild(eachAppTime);

    const eachAppStatus = document.createElement('div');
    eachAppStatus.className = 'each-application-status';
    eachAppRow3.appendChild(eachAppStatus);

    const eachAppAccept = document.createElement('button');
    eachAppAccept.className = 'each-application-accept';
    const eachAppDecline = document.createElement('button');
    eachAppDecline.className = 'each-application-decline';
    const eachAppAddFile = document.createElement('button');
    eachAppAddFile.className = 'each-application-add-file';
    eachAppBtn.appendChild(eachAppDecline);
    eachAppBtn.appendChild(eachAppAccept);
    eachAppBtn.appendChild(eachAppAddFile);

    const { company_name, jtype, title, employer_email, app_time, additional_input, status, job_id, offer_name, offer } = application;
    eachAppJobId.textContent = job_id;
    eachAppTitle.textContent = title;
    eachAppCompanyName.textContent = company_name;
    eachAppJobType.textContent = jtype;
    eachAppTime.textContent = app_time;
    eachAppEmployerEmail.textContent = employer_email;
    eachAppStatus.textContent = status;
    eachAppAdditionalInfo.textContent = additional_input === null? 'None': additional_input;

    if (offer_name === null) {
        eachAppMyOffer.textContent = 'None';
    } else {
        eachAppMyOffer.href = `data:application/pdf;base64, ${offer}`;
        eachAppMyOffer.download = offer_name;
        eachAppMyOffer.textContent = offer_name;
    }

    eachAppAccept.textContent = 'Accept';
    eachAppDecline.textContent = 'Decline';
    eachAppAddFile.textContent = 'Add File';

    // Send File Part
    const sendFileInfoContainer = document.createElement('div');
    sendFileInfoContainer.className = 'send-file-info-content';
    const sendFileInput = document.createElement('input');
    sendFileInput.setAttribute('type', 'file');
    const sendFileWarning = document.createElement('div');
    sendFileWarning.className = 'send-file-warning';

    eachAppSendFile.appendChild(sendFileInfoContainer);
    eachAppSendFile.appendChild(sendFileInput);
    eachAppSendFile.appendChild(sendFileWarning);

    const sendFileName = document.createElement('div');
    sendFileName.className = 'send-file-name';
    const chooseFileBtn = document.createElement('button');
    chooseFileBtn.className = 'choose-file-btn';
    const sendFileBtn = document.createElement('button');
    sendFileBtn.className = 'send-file-btn';
    sendFileInfoContainer.appendChild(sendFileName);
    sendFileInfoContainer.appendChild(chooseFileBtn);
    sendFileInfoContainer.appendChild(sendFileBtn);

    sendFileName.textContent = 'None';
    chooseFileBtn.textContent = 'Choose a file';
    sendFileBtn.textContent = 'Send';

    sendFileInput.onchange = () => {
        if (sendFileInput.files.length === 0) {
            sendFileName.textContent = 'None';
        } else {
            const file = sendFileInput.files[0];
            if (file.type !== 'application/pdf') {
                sendFileWarning.style.display = 'block';
                sendFileWarning.textContent = 'Provided file is not a pdf.';
            } else {
                sendFileName.textContent = file.name;
                sendFileWarning.style.display = 'none';
            }
        }
    }

}


function putResponse(text, jobId, email, warning) {
    api.put(`apply/sendResponse?job_id=${jobId}&email=${email}`, {
        body: JSON.stringify({
            "response": text,
        }),
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then(() => {
        warning.style.display = 'block';
        warning.textContent = text.toUpperCase();
    })
    .catch(err => {
        warning.style.display = 'block';
        warning.textContent = err;
    })
}

function doSendFile(event) {
    event.preventDefault();
    const inputFile = event.target.parentNode.parentNode.querySelector('input[type=file]')
    const sendFileName = event.target.parentNode.querySelector('.send-file-name');
    const sendFileWarning = event.target.parentNode.parentNode.querySelector('.send-file-warning');
    const jobId = event.target.parentNode.parentNode.parentNode.querySelector('.each-app-job-id').textContent;
    const file = inputFile.files[0];
    if (sendFileName.textContent === 'None') {
        sendFileWarning.style.display = 'block';
        sendFileWarning.textContent = 'Please select a pdf file to send.';
    } else {
        if (file.type !== 'application/pdf') {
            sendFileWarning.style.display = 'block';
            sendFileWarning.textContent = 'Provided file is not a pdf.';
        } else {
            sendFileWarning.style.display = 'none';
            pdfFileToDataUrl(file)
            .then(data => {
                const fileSrc = data.replace(/^data:application\/\w+;base64,/, '');
                const fileName = file.name;
                api.put(`apply/myApplication?job_id=${jobId}&email=${email}`, {
                    body: JSON.stringify({
                        "additional": fileSrc,
                        "additional_name": fileName,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    }
                })
                .then(data => {
                    sendFileWarning.style.display = 'block';
                    sendFileWarning.textContent = data['message'];
                })
                .catch(err => {
                    alert(err);
                })
            })
        }
    }
}