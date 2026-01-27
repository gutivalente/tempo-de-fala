const bg = document.querySelector('#bg');
const hourInputOverall = document.querySelector('#hour-input-overall');
const minInputOverall = document.querySelector('#min-input-overall');
const minInput = document.querySelector('#min-input');
const secSpan = document.querySelector('#sec-span');
const bar = document.querySelector('#bar');
const message = document.querySelector('#message');
const resetBtn = document.querySelector('#reset-btn');

let hoursLeft = 0;
let minsLeft = 0;
let timerOverallIsSet = false;
let min = 0;
let sec = 0;
let totalSec = 0;

// garante 2 dígitos no campo
[hourInputOverall, minInputOverall, minInput].forEach(input => {
  input.addEventListener('keydown', e => {
    if (e.target.value.length > 2) {
      e.target.value = e.target.value.substr(-2, 2);
    } else if (e.target.value.length < 2) {
      e.target.value = e.target.value.toString().padStart(2, '0');
    }
  });
});

// dá play quando aperta enter ou espaço
document.addEventListener('keydown', e => {
  if (!timerOverallIsSet) {
    const currentTime = new Date();
    hoursLeft = hourInputOverall.value - currentTime.getHours();
    minsLeft = minInputOverall.value - currentTime.getMinutes();

    if (minsLeft < 0) {
      minsLeft = minsLeft + 60;
      hoursLeft = hoursLeft - 1;
    }
  }

  if ((e.code === 'Enter' || e.code === 'Space') && !minInput.disabled && minInput.value >= 1) {
    hourOverall = +document.querySelector('#hour-input-overall').value;
    minOverall = +document.querySelector('#min-input-overall').value;

    min = +document.querySelector('#min-input').value - 1;
    sec = 59;
    hourInputOverall.value = digits(hoursLeft);
    minInputOverall.value = digits(minsLeft);
    totalSec = getTotalSecs();
    timerDecrease();
    timerOverallDecrease();
    hourInputOverall.disabled = 'true';
    minInputOverall.disabled = 'true';
    timerOverallIsSet = true;
    minInput.disabled = 'true';
    resetBtn.classList.add('visible');
  }
});

// foca no campo ao clicar em qualquer lugar
document.addEventListener('click', e => {
  if (timerOverallIsSet) {
    minInput.focus();
  }
});

// reseta o tempo
function resetTimer() {
  min = 0;
  sec = 0;
  totalSec = getTotalSecs();
  minInput.disabled = false;
  resetBtn.classList.remove('visible');
  minInput.value = '';
  bg.className = '';
  message.innerHTML = '&nbsp;';
  secSpan.innerHTML = '00';
  bar.classList.add('no-transition');
  bar.style.width = '100%';
  setTimeout(() => {
    bar.classList.remove('no-transition');
  }, 0);
}

// retorna o total de segundos
function getTotalSecs() {
  return sec + (min * 60);
}

// retorna número em string de 2 caracteres
function digits(time) {
  return String(time).padStart(2, '0');
}

// faz o marcador funcionar como um temporizador
function timerDecrease() {
  var intervalDecrease = setInterval(() => {

    minInput.value = digits(min);
    secSpan.innerHTML = digits(sec);

    const currentTotal = getTotalSecs();
    bar.style.width = (100 * (currentTotal - 1) / totalSec) + '%';

    if (currentTotal <= totalSec / 2) {
      if (currentTotal <= 30) {
        message.innerHTML = 'PRA CONCLUIR';
        bg.classList.add('almost');
      } else {
        message.innerHTML = 'METADE';
        bg.classList.add('half');
      }
    }

    sec--;
    if (sec < 0) {
      min--;
      if (min < 0) {
        clearInterval(intervalDecrease);
        timerIncrease();
      } else {
        sec = 59;
      }
    }

  }, 1000);

  resetBtn.addEventListener('click', e => {
    clearInterval(intervalDecrease);
    resetTimer();
  })
}

// faz o marcador de cima funcionar como um temporizador
function timerOverallDecrease() {
  minsLeft--;
  var intervalOverallDecrease = setInterval(() => {

    hourInputOverall.value = digits(hoursLeft);
    minInputOverall.value = digits(minsLeft);

    minsLeft--;
    if (minsLeft < 0) {
      hoursLeft--;
      if (hoursLeft < 0) {
        clearInterval(intervalOverallDecrease);
      } else {
        minsLeft = 59;
      }
    }
  }, 61000);
}

// faz o marcador funcionar como um cronômetro
function timerIncrease() {
  min = 0;
  sec = 1;

  var intervalIncrease = setInterval(() => {

    minInput.value = digits(min);
    secSpan.innerHTML = digits(sec);

    message.innerHTML = 'CONCLUA';
    bg.classList.add('over');

    const currentTotal = getTotalSecs();

    if (bg.classList.contains('finish')) {
      bg.classList.remove('finish')
    }
    if (currentTotal % 30 === 0) {
      bg.classList.add('finish')
    }

    sec++;
    if (sec > 59) {
      min++;
      sec = 0;
    }

  }, 1000);

  resetBtn.addEventListener('click', e => {
    clearInterval(intervalIncrease);
    resetTimer();
  })
}
