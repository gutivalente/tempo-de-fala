const bg = document.querySelector('#bg');
const minInput = document.querySelector('#minInput');
const secSpan = document.querySelector('#sec-span');
const bar = document.querySelector('#bar');
const message = document.querySelector('#message');
const resetBtn = document.querySelector('#reset-btn');

let min = 0;
let sec = 0;
let totalSec = 0;

// garante 2 dígitos no campo
minInput.addEventListener('keydown', e => {
  if (e.target.value.length > 2) {
    e.target.value = e.target.value.substr(-2, 2);
  } else if (e.target.value.length < 2) {
    e.target.value = e.target.value.toString().padStart(2, '0');
  }
});

// dá play quando aperta enter ou espaço
document.addEventListener('keydown', e => {
  if ((e.keyCode === 13 || e.keyCode === 32) && !minInput.disabled && minInput.value >= 1) {
    min = +document.querySelector('#minInput').value - 1;
    sec = 59;
    totalSec = getTotalSecs();
    timerDecrease();
    minInput.disabled = 'true';
    resetBtn.classList.add('visible');
  }
});

// foca no campo ao clicar em qualquer lugar
document.addEventListener('click', e => {
  minInput.focus();
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
