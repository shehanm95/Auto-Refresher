
let timer;
let countdown;
let isPaused = false;

function getRandomInterval(min, max) {
    let minutes = Math.floor(Math.random() * (max - min + 1) + min) * 60000;
    let secs = Math.floor(getRandomNumber());
    return minutes + secs;
}

function startTimer(url, minTime, maxTime) {
    if (timer) clearInterval(timer);
    if (countdown) clearInterval(countdown);

    let nextInterval = getRandomInterval(minTime, maxTime);
    updateCountdown(nextInterval);
    window.open(url, '_blank');

    timer = setInterval(function () {
        if (!isPaused) {
             location.reload();
            nextInterval = getRandomInterval(minTime, maxTime);
            updateCountdown(nextInterval);
        }
    }, nextInterval);
}
function getRandomNumber() {
    return Math.floor(Math.random() * (55 - 3 + 1)) + 3;
}

function updateCountdown(interval) {
    let timeLeft = interval / 1000;
    timeLeft += getRandomNumber();
    document.getElementById('countdown').innerText = formatTime(timeLeft);
    document.getElementById('countdown').style.border = "none";

    countdown = setInterval(() => {
        if (!isPaused) {
            timeLeft--;
            document.getElementById('countdown').innerText = formatTime(timeLeft);
            if (timeLeft <= 0) location.reload();
        }
    }, 1000);
}

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = seconds % 60;
    return `${minutes} min ${secs} sec`;
}

function saveSettings() {
    const url = document.getElementById('urlInput').value;
    const minTime = parseInt(document.getElementById('minTime').value) || 1;
    const maxTime = parseInt(document.getElementById('maxTime').value) || 5;
    localStorage.setItem('savedUrl', url);
    localStorage.setItem('minTime', minTime);
    localStorage.setItem('maxTime', maxTime);
    startTimer(url, minTime, maxTime);
}

function togglePause() {
    isPaused = !isPaused;
    document.getElementById('pauseButton').innerText = isPaused ? 'Resume' : 'Pause';
    if (isPaused) {
        clearInterval(timer);
        clearInterval(countdown);
        document.getElementById('countdown').innerText = 'Paused';
        document.getElementById('countdown').style.border = "2px solid red";
    } else {
        saveSettings();
    }
}

function searchGoogle() {
    const query = document.getElementById('Search').value;
    window.open(`https://www.google.com/search?q=${query}`, '_blank');
}

function searchYouTube() {
    const query = document.getElementById('Search').value;
    window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
}

function saveQuickLink() {
    const title = document.getElementById('quickLinkTitle').value;
    const url = document.getElementById('quickLink').value;
    if (title && url) {
        let links = JSON.parse(localStorage.getItem('quickLinks')) || [];
        links.push({ title, url });
        localStorage.setItem('quickLinks', JSON.stringify(links));
        displayQuickLinks();
    }
}

function displayQuickLinks() {
    const links = JSON.parse(localStorage.getItem('quickLinks')) || [];
    const container = document.getElementById('quickLinksContainer');
    container.innerHTML = '';
    links.forEach((link, index) => {
        const div = document.createElement('div');
        div.style.marginBottom = '5px';

        const a = document.createElement('a');
        a.href = link.url;
        a.target = '_blank';
        a.innerText = link.title;

        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = 'Delete';
        deleteBtn.style.marginLeft = '10px';
        deleteBtn.onclick = function () {
            if (confirm('Are you sure you want to delete this link?')) {
                links.splice(index, 1);
                localStorage.setItem('quickLinks', JSON.stringify(links));
                displayQuickLinks();
            }
        };

        div.appendChild(a);
        div.appendChild(deleteBtn);
        container.appendChild(div);
    });
}

window.onload = function () {
    const savedUrl = localStorage.getItem('savedUrl') || 'https://www.google.com';
    const minTime = parseInt(localStorage.getItem('minTime')) || 1;
    const maxTime = parseInt(localStorage.getItem('maxTime')) || 5;
    document.getElementById('urlInput').value = savedUrl;
    document.getElementById('minTime').value = minTime;
    document.getElementById('maxTime').value = maxTime;
    displayQuickLinks();
    startTimer(savedUrl, minTime, maxTime);
};
