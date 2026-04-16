// alert("テスト");

/* popup
リモートでこれをコンソールに入れて、状態をリセット
localStorage.removeItem("jmPopupRegistered")
=========================== */
document.addEventListener("DOMContentLoaded", function () {
  const popup = document.getElementById("jm-popup");
  if (!popup) return;

  const teaser = document.getElementById("jm-popup-teaser");
  const teaserBtn = teaser ? teaser.querySelector(".jm-popup-teaser__btn") : null;
  const teaserLabel = document.getElementById("jm-popupTeaserLabel");

  const step1 = document.getElementById("jm-popupStep1");
  const step2 = document.getElementById("jm-popupStep2");
  const yesBtn = document.getElementById("jm-popupYes");
  const noBtn = document.getElementById("jm-popupNo");

  const form = document.getElementById("jm-popupForm");
  const success = document.getElementById("jm-popupSuccess");
  const successFlag = document.getElementById("jm-popupFormSuccessFlag");
  const afterSuccessBtn = document.getElementById("jm-popupAfterSuccess");
  const overlay = popup.querySelector(".jm-popup__overlay");
  const closeBtn = popup.querySelector(".jm-popup__close");

  const discountCodeBtn = document.getElementById("jm-discountCode");
  const copyMessage = document.getElementById("jm-popupCopyMessage");

  const teaserDefaultLabel = teaser?.dataset.defaultLabel || "Get 15% OFF";
  const teaserRegisteredLabel = teaser?.dataset.registeredLabel || "Your code: DISCOUNT15";

  const registeredKey = "jmPopupRegistered";
  const successSeenKey = "jmPopupSuccessSeen";

  const isHomeOnly = popup.dataset.homeOnly === "true";
  const isHome = popup.dataset.isHome === "true";
  const liquidSuccess = successFlag && successFlag.dataset.success === "true";

  let scrollY = 0;

  function isRegistered() {
    return localStorage.getItem(registeredKey) === "true";
  }

  function markRegistered() {
    localStorage.setItem(registeredKey, "true");
  }

  function isSuccessSeen() {
    return sessionStorage.getItem(successSeenKey) === "true";
  }

  function markSuccessSeen() {
    sessionStorage.setItem(successSeenKey, "true");
  }

  function clearSuccessSeen() {
    sessionStorage.removeItem(successSeenKey);
  }

  function lockScroll() {
    scrollY = window.scrollY;
    document.body.classList.add("jm-popup-open");
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
  }

  function unlockScroll() {
    const wasLocked = document.body.classList.contains("jm-popup-open");

    document.body.classList.remove("jm-popup-open");
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";

    if (wasLocked) {
      window.scrollTo(0, scrollY);
    }
  }

  function openPopup() {
    popup.classList.add("is-active");
    popup.setAttribute("aria-hidden", "false");
    lockScroll();
  }

  function closePopup() {
    popup.classList.remove("is-active");
    popup.setAttribute("aria-hidden", "true");
    unlockScroll();
  }

  function setTeaserDefaultState() {
    if (!teaserLabel) return;
    teaserLabel.textContent = teaserDefaultLabel;
  }

  function setTeaserRegisteredState() {
    if (!teaserLabel) return;
    teaserLabel.textContent = teaserRegisteredLabel;
  }

  function showTeaser() {
    if (!teaser) return;

    if (isRegistered()) {
      setTeaserRegisteredState();
    } else {
      setTeaserDefaultState();
    }

    teaser.classList.add("is-active");
  }

  function hideTeaser() {
    if (!teaser) return;
    teaser.classList.remove("is-active");
  }

  function showStep1() {
    if (step1) step1.style.display = "block";
    if (step2) step2.style.display = "none";

    popup.classList.add("is-step1");
    popup.classList.remove("is-step2", "is-success");

    if (form) form.style.display = "none";
    if (success) success.style.display = "none";
  }

  function showStep2() {
    if (step1) step1.style.display = "none";
    if (step2) step2.style.display = "block";

    popup.classList.remove("is-step1", "is-success");
    popup.classList.add("is-step2");

    if (form) form.style.display = "flex";
    if (success) success.style.display = "none";
  }

  function showSuccessView() {
    if (step1) step1.style.display = "none";
    if (step2) step2.style.display = "block";

    popup.classList.remove("is-step1");
    popup.classList.add("is-step2", "is-success");

    if (form) form.style.display = "none";
    if (success) success.style.display = "block";
  }

  function resetPopupView() {
    showStep1();
  }

  const registered = isRegistered();
  const successSeen = isSuccessSeen();

  // 初回成功時
  if (liquidSuccess && !registered && !successSeen) {
    markRegistered();
    markSuccessSeen();
    showTeaser();
    openPopup();
    showSuccessView();
  } else if (registered) {
    showTeaser();
  } else {
    clearSuccessSeen();
    showTeaser();

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
  }

  // teaserクリック
  if (teaserBtn) {
    teaserBtn.addEventListener("click", function () {
      if (isRegistered()) {
        showSuccessView();
      } else {
        resetPopupView();
      }
      openPopup();
    });
  }

  // product / cart の Get 15% OFF ボタン
  document.addEventListener("click", function (e) {
    const btn = e.target.closest(".jm-open-popup-btn");
    if (!btn) return;

    if (teaserBtn) {
      teaserBtn.click();
    } else {
      if (isRegistered()) {
        showSuccessView();
      } else {
        resetPopupView();
      }
      openPopup();
    }
  });

  if (yesBtn) {
    yesBtn.addEventListener("click", showStep2);
  }

  if (noBtn) {
    noBtn.addEventListener("click", function () {
      closePopup();
      resetPopupView();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      closePopup();
      resetPopupView();
    });
  }

  if (afterSuccessBtn) {
    afterSuccessBtn.addEventListener("click", function () {
      closePopup();
    });
  }

  if (overlay) {
    overlay.addEventListener("click", function () {
      closePopup();
    });
  }

  // クーポンコピー
  if (discountCodeBtn) {
    discountCodeBtn.addEventListener("click", async function () {
      const code = discountCodeBtn.dataset.code || discountCodeBtn.textContent.trim();

      try {
        await navigator.clipboard.writeText(code);

        if (copyMessage) {
          copyMessage.style.display = "block";
          setTimeout(() => {
            copyMessage.style.display = "none";
          }, 1500);
        }
      } catch (error) {
        console.error("Copy failed", error);
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
