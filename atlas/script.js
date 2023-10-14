const timers = JSON.parse(localStorage.getItem('timers')) || [];

window.onload = function() {
    timers.forEach(timer => {
        displayTimer(timer);
        if (timer.isRunning) {
            const timerDiv = document.querySelector(`.timer[data-name="${timer.name}"]`);
            const startBtn = timerDiv.querySelector('button');
            startBtn.click();
        }
    });
}

function addTimer() {
    if (timers.length >= 5) {
        alert('You can only add up to 5 timers.');
        return;
    }
    const timerName = document.getElementById('timerName').value || 'Unnamed Timer';
    const timer = {
        name: timerName,
        total: 0,
        splits: {},
        interval: null,
        isRunning: false
    };
    timers.push(timer);
    displayTimer(timer);
    saveToLocalStorage();
    document.getElementById('timerName').value = '';
}

function displayTimer(timer) {
    const timerDiv = document.createElement('div');
    timerDiv.className = 'timer';
    timerDiv.setAttribute('data-name', timer.name);

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'timer-name';
    nameInput.value = timer.name;
    nameInput.readOnly = true;
    timerDiv.appendChild(nameInput);

    const editIcon = document.createElement('span');
    editIcon.style.cursor = 'pointer';
    editIcon.onclick = function() {
        nameInput.readOnly = !nameInput.readOnly;
        if (!nameInput.readOnly) {
            nameInput.focus();
        }
    };
    timerDiv.appendChild(editIcon);

    const displayDiv = document.createElement('div');
    displayDiv.className = 'timer-display';
    timerDiv.appendChild(displayDiv);

    const startBtn = document.createElement('button');
    startBtn.textContent = timer.isRunning ? 'Stop' : 'Start';
    startBtn.onclick = function() {
        if (timer.isRunning) {
            clearInterval(timer.interval);
            startBtn.textContent = 'Start';
            timer.isRunning = false;
        } else {
            timer.interval = setInterval(function() {
                timer.total++;
                const today = new Date().toDateString();
                timer.splits[today] = (timer.splits[today] || 0) + 1;
                updateDisplay(timerDiv, timer);
                saveToLocalStorage();
            }, 1000);
            startBtn.textContent = 'Stop';
            timer.isRunning = true;
        }
        saveToLocalStorage();
    };
    timerDiv.appendChild(startBtn);

    const splitDiv = document.createElement('div');
    splitDiv.className = 'split';
    timerDiv.appendChild(splitDiv);

    document.getElementById('timers').appendChild(timerDiv);
    updateDisplay(timerDiv, timer);

    if (timer.isRunning) {
        startBtn.click();
    }

    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reset';
    resetBtn.onclick = function() {
        timer.total = 0;
        timer.splits = {};
        updateDisplay(timerDiv, timer);
        saveToLocalStorage();
    };
    timerDiv.appendChild(resetBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = function() {
        clearInterval(timer.interval);
        const index = timers.indexOf(timer);
        if (index > -1) {
            timers.splice(index, 1);
        }
        timerDiv.remove();
        saveToLocalStorage();
    };
    timerDiv.appendChild(deleteBtn);

    const randomColor = getRandomNordColor();
    timerDiv.style.backgroundColor = randomColor;

    timer.color = timer.color || getRandomNordColor();
    timerDiv.style.backgroundColor = timer.color;
}

function updateDisplay(timerDiv, timer) {
    const totalSeconds = timer.total;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const displayDiv = timerDiv.querySelector('.timer-display');
    displayDiv.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    const splitDiv = timerDiv.querySelector('.split');
    splitDiv.innerHTML = '';
    for (const day in timer.splits) {
        splitDiv.innerHTML += `${day}: ${timer.splits[day]} seconds<br>`;
    }
}

function saveToLocalStorage() {
    timers.forEach(timer => {
        delete timer.interval;
    });
    localStorage.setItem('timers', JSON.stringify(timers));
}

const nordColors = [
    "#BF616A", "#D08770", "#EBCB8B", "#A3BE8C", "#B48EAD"
];

function getRandomNordColor() {
    const randomIndex = Math.floor(Math.random() * nordColors.length);
    return nordColors[randomIndex];
}

document.getElementById('addTimer').onclick = function() {
    if (timers.length >= 5) {
        alert('You can only add up to 5 timers.');
        return;
    }
    addTimer();
};
