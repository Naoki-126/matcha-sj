// alert("テスト");

/* popup
=========================== */
document.addEventListener("DOMContentLoaded", function () {
  const popup = document.getElementById("jm-popup");
  if (!popup) return;

  const teaser = document.getElementById("jm-popup-teaser");
  const teaserBtn = teaser ? teaser.querySelector(".jm-popup-teaser__btn") : null;

  const form = document.getElementById("jm-popupForm");
  const success = document.getElementById("jm-popupSuccess");
  const overlay = popup.querySelector(".jm-popup__overlay");
  const closeBtns = popup.querySelectorAll(".jm-popup__close, #jm-popupAfterSuccess");

  const registeredKey = "jmPopupRegistered";
  const shownKey = "jmPopupAutoShown";

  const isHomeOnly = popup.dataset.homeOnly === "true";
  const isHome = popup.dataset.isHome === "true";

  function isRegistered() {
    return localStorage.getItem(registeredKey) === "true";
  }

  function hasAutoShown() {
    return localStorage.getItem(shownKey) === "true";
  }

  function markAutoShown() {
    localStorage.setItem(shownKey, "true");
  }

  function openPopup() {
    if (isRegistered()) return;
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

  // 登録済みなら何も出さない
  if (isRegistered()) {
    closePopup();
    hideTeaser();
    return;
  }

  // 未登録なら teaser は全ページで表示
  showTeaser();

  // popup自動表示はトップページのみ
  const allowAutoOpen = !isHomeOnly || isHome;

  if (allowAutoOpen && !hasAutoShown()) {
    const delay = parseInt(popup.dataset.delay || 2, 10) * 1000;

    setTimeout(function () {
      if (!isRegistered()) {
        openPopup();
        markAutoShown();
      }
    }, delay);
  }

  // teaserクリックで popup 表示
  if (teaserBtn) {
    teaserBtn.addEventListener("click", function () {
      openPopup();
    });
  }

  // 閉じる
  closeBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      closePopup();

      if (success) {
        success.style.display = "none";
      }

      if (form) {
        form.style.display = "flex";
      }
    });
  });

  // overlayクリックで閉じる
  if (overlay) {
    overlay.addEventListener("click", function () {
      closePopup();

      if (success) {
        success.style.display = "none";
      }

      if (form) {
        form.style.display = "flex";
      }
    });
  }

  // フォーム送信
  if (form) {
    form.addEventListener("submit", function () {
      localStorage.setItem(registeredKey, "true");
      hideTeaser();
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
