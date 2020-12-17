import API from './api.js';
import { fileToDataUrl } from './getImage.js';

const api = new API('http://localhost:5000');

const token = localStorage.getItem('token');
console.log(token);
// 这里role的数据类型是string
const role = localStorage.getItem('role');


const answers = document.querySelectorAll('.answer');
const inputText = document.querySelectorAll('input[type=text]');
const inputTextarea = document.querySelectorAll('textarea');
const inputSelect = document.querySelectorAll('.choice');
const portraitBtn = document.querySelector('input[type="file"]');
const portrait = document.getElementById('portrait');

const editBtn = document.querySelector('.edit');
const submitBtn = document.querySelector('.submit');

const appBtn = document.getElementById('application');
const logoutBtn = document.getElementById('logout');

// 点击按钮跳转到对应页面
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



var [aFname, aGender, aTele, aExpectWorkState, aExpectSalary, 
    aLname, aBirth, aEmail, aSkills,
    aSchool, aEeDur, aWam, aMajor, aEeLevel,
    aPeName, aPeDur, aPeNum, aPeRole, aPeDesc,
    aWeComp, aWeDur, aWePos, aWeDesc,
    aIntro] = answers;

var [iFname, iGender, iTele, iExpectSalary, 
    iLname, iBirth, iEmail, iSkills,
    iSchool, iWam, iMajor,
    iPeName, iPeNum, iPeRole, 
    iWeComp, iWePos] = inputText;

var [iPeDesc, iWeDesc, iIntro] = inputTextarea;

var [iExpectWorkState, iEeDur, iEeLevel, iPeDur, iWeDur] = inputSelect;


// 首次调用，初始化页面
updateProfile();


function updateProfile() {
    const url = `seeker/seekerPage?token=${token}`;
    api.get(url, {
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then(data => {
        // console.log(data);
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
    
        [iFname.value, iLname.value, iGender.value, iBirth.value, iTele.value, iEmail.value, iExpectWorkState.value, iSkills.value, iExpectSalary.value] = [getText(first_name), getText(last_name), getText(gender), getText(birth), getText(tele), getText(email), getText(expect_state), getText(skill), getText(salary)];
        [iSchool.value, iMajor.value, iEeDur.value, iEeLevel.value, iWam.value] = [getText(school), getText(major), getText(EDur), getText(ELevel), getText(wam)];
        [iPeName.value, iPeRole.value, iPeDur.value, iPeDesc.value, iPeNum.value] =  [getText(PName), getText(PRole), getText(PDur), getText(PDes), getText(PNum)];
        [iWeComp.value, iWePos.value, iWeDur.value, iWeDesc.value] = [getText(WCom), getText(WPos), getText(WDur), getText(WDes)];
        iIntro.value = getText(intro);

        if (src !== null && src !== '') {
            // console.log(src)
            // console.log(typeof(src))
            portrait.src = `data:image/png;base64, ${src}`;
        }
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
    for(let i = 0; i < inputSelect.length; i++) {
        inputSelect[i].style.display = 'block';
    }
    portraitBtn.style.display = 'block';
}

// submit按钮操作
submitBtn.onclick = (event) => {
    event.preventDefault();
    editBtn.style.display = 'block';
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
    portraitBtn.style.display = 'none';

    const required = {};
    const [BI, EE, PE, WE] = [{}, {}, {}, {}];
    const BIKey = ['first_name', 'last_name', 'gender', 'birth', 'tele', 'email', 'expect_state', 'skill', 'salary'];
    const BIValue = [iFname.value, iLname.value, iGender.value, iBirth.value, iTele.value, iEmail.value, iExpectWorkState.value, iSkills.value, iExpectSalary.value];
    const EEKey = ['school', 'major', 'EDur', 'ELevel', 'wam'];
    const EEValue = [iSchool.value, iMajor.value, iEeDur.value, iEeLevel.value, iWam.value];
    const PEKey = ['PName', 'PRole', 'PDur', 'PDes', 'PNum'];
    const PEValue = [iPeName.value, iPeRole.value, iPeDur.value, iPeDesc.value, iPeNum.value];
    const WEKey = ['WCom', 'WPos', 'WDur', 'WDes'];
    const WEValue = [iWeComp.value, iWePos.value, iWeDur.value, iWeDesc.value];

    helper(BI, BIKey, BIValue);
    helper(EE, EEKey, EEValue);
    helper(PE, PEKey, PEValue);
    helper(WE, WEKey, WEValue);

    required['BI'] = BI;
    required['EE'] = EE;
    required['PE'] = PE;
    required['WE'] = WE;
    if (iIntro.value !== '') {
        required['Intro'] = iIntro.value;
    }
    if (portraitBtn.value !== '') {
        fileToDataUrl(portraitBtn.files[0])
        .then(data => {
            const imgSrc = data.replace(/^data:image\/\w+;base64,/, '');
            BI['src'] = imgSrc;
            // console.log(imgSrc);
        })
        .then(() => {
            // console.log(required);
            const url = `seeker/seekerPage?token=${token}`;
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
            .catch(err => alert(err))
        })
    } else {
        const url = `seeker/seekerPage?token=${token}`;
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
    }

    // helper函数分别给BI,EE,PE,WE进行赋值
    function helper(obj, key, val) {
        for(let i = 0; i < key.length; i++) {
            if (val[i] !== '') {
                obj[key[i]] = val[i];
            }
        }
    }
}


// 选择文件按钮操作，显示所选择的人像
portraitBtn.onchange = () => {
    fileToDataUrl(portraitBtn.files[0])
        .then(data => {
            portrait.src = data;
        })
        .catch(err => console.log(err))
}
