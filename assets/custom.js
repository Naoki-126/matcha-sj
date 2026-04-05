// alert("テスト");

/* popup
=========================== */
document.addEventListener("DOMContentLoaded", function () {
  const popup = document.getElementById("jm-popup");
  if (!popup) return;

  const teaser = document.getElementById("jm-popup-teaser");
  const teaserBtn = teaser ? teaser.querySelector(".jm-popup-teaser__btn") : null;

  const step1 = document.getElementById("jm-popupStep1");
  const step2 = document.getElementById("jm-popupStep2");
  const yesBtn = document.getElementById("jm-popupYes");
  const noBtn = document.getElementById("jm-popupNo");

  const form = document.getElementById("jm-popupForm");
  const success = document.getElementById("jm-popupSuccess");
  const afterSuccessBtn = document.getElementById("jm-popupAfterSuccess");
  const overlay = popup.querySelector(".jm-popup__overlay");
  const closeBtn = popup.querySelector(".jm-popup__close");

  const registeredKey = "jmPopupRegistered";

  const isHomeOnly = popup.dataset.homeOnly === "true";
  const isHome = popup.dataset.isHome === "true";
  const isSuccess = popup.dataset.success === "true";

  function isRegistered() {
    return localStorage.getItem(registeredKey) === "true";
  }

  function markRegistered() {
    localStorage.setItem(registeredKey, "true");
  }

  function openPopup() {
    if (isRegistered() && !isSuccess) return;
    popup.classList.add("is-active");
    popup.setAttribute("aria-hidden", "false");
  }

  function closePopup() {
    popup.classList.remove("is-active");
    popup.setAttribute("aria-hidden", "true");
  }

  function showTeaser() {
    if (!teaser || isRegistered()) return;
    teaser.classList.add("is-active");
  }

  function hideTeaser() {
    if (!teaser) return;
    teaser.classList.remove("is-active");
  }

  function showStep1() {
    if (step1) {
      step1.style.display = "block";
      step1.classList.add("is-active");
    }
    if (step2) {
      step2.style.display = "none";
      step2.classList.remove("is-active");
    }
    if (form) {
      form.style.display = "none";
    }
    if (success) {
      success.style.display = "none";
    }
  }

  function showStep2() {
    if (step1) {
      step1.style.display = "none";
      step1.classList.remove("is-active");
    }
    if (step2) {
      step2.style.display = "block";
      step2.classList.add("is-active");
    }
    if (form) {
      form.style.display = "flex";
    }
    if (success) {
      success.style.display = "none";
    }
  }

  function showSuccessView() {
    if (step1) {
      step1.style.display = "none";
      step1.classList.remove("is-active");
    }
    if (step2) {
      step2.style.display = "block";
      step2.classList.add("is-active");
    }
    if (form) {
      form.style.display = "none";
    }
    if (success) {
      success.style.display = "block";
    }
  }

  function resetPopupView() {
    showStep1();
  }

  // 成功時だけ登録済みにする
  if (isSuccess) {
    markRegistered();
    hideTeaser();
    openPopup();
    showSuccessView();
    return;
  }

  // すでに登録済みなら何も出さない
  if (isRegistered()) {
    closePopup();
    hideTeaser();
    return;
  }

  // 未登録なら teaser は表示
  showTeaser();

  // popup自動表示
  const allowAutoOpen = !isHomeOnly || isHome;

  if (allowAutoOpen) {
    const delay = parseInt(popup.dataset.delay || 2, 10) * 1000;

    setTimeout(function () {
      if (!isRegistered()) {
        resetPopupView();
        openPopup();
      }
    }, delay);
  }

  // teaserクリックで popup 表示
  if (teaserBtn) {
    teaserBtn.addEventListener("click", function () {
      resetPopupView();
      openPopup();
    });
  }

  // YesでSTEP2へ
  if (yesBtn) {
    yesBtn.addEventListener("click", function () {
      showStep2();
    });
  }

  // Noで閉じる
  if (noBtn) {
    noBtn.addEventListener("click", function () {
      closePopup();
      resetPopupView();
    });
  }

  // ×で閉じる
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      closePopup();
      resetPopupView();
    });
  }

  // 成功後の閉じる
  if (afterSuccessBtn) {
    afterSuccessBtn.addEventListener("click", function () {
      closePopup();
    });
  }

  // overlayクリックで閉じる
  if (overlay) {
    overlay.addEventListener("click", function () {
      closePopup();
      if (!isSuccess) {
        resetPopupView();
      }
    });
  }
});

/* FAQ
=========================== */
document.addEventListener('DOMContentLoaded', () => {
  const initFAQ = () => {
    const faq = document.getElementById('js-faq');
    if (!faq) return; // ← FAQページ以外ではスキップ

    faq.querySelectorAll('.jm-accordion__a').forEach(content => {
      content.style.maxHeight = '0px';
      content.style.paddingTop = '0';
      content.style.paddingBottom = '0';
    });

    faq.querySelectorAll('.jm-accordion__q').forEach(trigger => {
      const content = trigger.nextElementSibling;

      trigger.addEventListener('click', function () {
        const isActive = trigger.classList.contains('active');

        if (isActive) {
          trigger.classList.remove('active');
          content.style.maxHeight = '0px';
          content.style.paddingTop = '0';
          content.style.paddingBottom = '0';
        } else {
          trigger.classList.add('active');
          content.style.paddingTop = '14px';
          content.style.paddingBottom = '14px';
          content.style.maxHeight = (content.scrollHeight + 30) + 'px';
        }
      });
    });
  };

  // --------------------------------------------------------
  // 初期化呼び出し（ページ存在チェック付き）
  // --------------------------------------------------------
  initFAQ();
});


/* ===========================
# jm-diagnosis
=========================== */
document.addEventListener('DOMContentLoaded', () => {
  const diagnosis = document.querySelector('.jm-diagnosis');
  if (!diagnosis) return;

  const questions = diagnosis.querySelectorAll('[data-question]');
  const results = diagnosis.querySelectorAll('[data-result]');
  const resetBtn = diagnosis.querySelector('[data-action="reset"]');

  const answers = {};

  /* utility
  =========================== */
  const show = (el) => {
    if (!el) return;
    el.classList.add('is-active');
  };

  const disableOptions = (questionEl, selectedBtn) => {
    const buttons = questionEl.querySelectorAll('button');
    buttons.forEach(btn => {
      btn.disabled = true;
      btn.style.cursor = 'default';
      if (btn === selectedBtn) {
        btn.classList.add('is-selected');
        btn.style.opacity = '1';
      } else {
        btn.style.opacity = '.4';
      }
    });
  };

  const getQuestion = (id) =>
    diagnosis.querySelector(`[data-question="${id}"]`);

  const getResult = (id) =>
    diagnosis.querySelector(`[data-result="${id}"]`);

  const resetDiagnosis = () => {
    // answersを空にする
    for (const key in answers) {
      delete answers[key];
    }

    // 質問リセット
    questions.forEach(question => {
      question.classList.remove('is-active');

      const buttons = question.querySelectorAll('button');
      buttons.forEach(btn => {
        btn.disabled = false;
        btn.style.cursor = '';
        btn.style.opacity = '';
        btn.classList.remove('is-selected');
      });
    });

    // 結果リセット
    results.forEach(result => {
      result.classList.remove('is-active');
    });

    // Startボタン復活
    const firstQuestion = getQuestion('q0');
    if (firstQuestion) {
      firstQuestion.classList.add('is-active')
    }

    // 上へ戻す（任意）
    diagnosis.scrollIntoView({ behavior: 'smooth' });
  };

  /* answer handling
  =========================== */
  questions.forEach(question => {
    question.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn || btn.disabled) return;

      const questionId = question.dataset.question;
      const answer = btn.dataset.answer;

      answers[questionId] = answer;

      disableOptions(question, btn);

      /* ---- Branch logic ---- */
      if (questionId === 'q0') {
        show(getQuestion('q1'));
      }

      if (questionId === 'q1') {
        if (answer === 'mix') show(getQuestion('q2'));
        if (answer === 'straight') show(getQuestion('q4'));
        if (answer === 'both') show(getQuestion('q6'));
      }

      if (questionId === 'q2') {
        if (answer === 'yes') {
          show(getResult('organic_matcha'));
        } else {
          show(getQuestion('q3'));
        }
      }

      if (questionId === 'q3') {
        if (answer === 'gentle') {
          show(getResult('ceremonial'));
        } else {
          show(getResult('premium_ceremonial'));
        }
      }

      if (questionId === 'q4') {
        if (answer === 'yes') {
          show(getResult('premium_ceremonial'));
        } else {
          show(getQuestion('q5'));
        }
      }

      if (questionId === 'q5') {
        if (answer === 'stability') {
          show(getResult('ceremonial'));
        } else {
          show(getResult('organic_matcha'));
        }
      }

      if (questionId === 'q6') {
        if (answer === 'daily') {
          show(getResult('ceremonial'));
        } else {
          show(getResult('premium_ceremonial'));
        }
      }

    });
  });

  /* reset
  =========================== */
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      resetDiagnosis();
    });
  }

});
