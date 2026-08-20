/* =========================================================
   KisaanMitra AI — Chat UI Interactions
   Vanilla JS, no frameworks
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Element refs ---------- */
  const sidebar = document.getElementById("sidebar");
  const sidebarBackdrop = document.getElementById("sidebarBackdrop");
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const closeSidebarBtn = document.getElementById("closeSidebarBtn");

  const newChatBtn = document.getElementById("newChatBtn");
  const mobileNewChatBtn = document.getElementById("mobileNewChatBtn");
  const headerNewChatBtn = document.getElementById("headerNewChatBtn");

  const chatBody = document.getElementById("chatBody");
  const welcomeScreen = document.getElementById("welcomeScreen");
  const messagesList = document.getElementById("messagesList");
  const typingIndicator = document.getElementById("typingIndicator");

  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const sendBtn = document.getElementById("sendBtn");

  const attachBtn = document.getElementById("attachBtn");
  const imageInput = document.getElementById("imageInput");
  const imagePreviewStrip = document.getElementById("imagePreviewStrip");
  const previewImage = document.getElementById("previewImage");
  const removeImageBtn = document.getElementById("removeImageBtn");

  const micBtn = document.getElementById("micBtn");
  const voiceOverlay = document.getElementById("voiceOverlay");
  const stopRecordingBtn = document.getElementById("stopRecordingBtn");

  const suggestionCards = document.querySelectorAll(".suggestion-card");

  const userMessageTemplate = document.getElementById("userMessageTemplate");
  const aiMessageTemplate = document.getElementById("aiMessageTemplate");

  let selectedImageDataUrl = null;
  let isRecording = false;
  let isAiResponding = false;

  /* ---------- Tooltips ---------- */
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => {
    new bootstrap.Tooltip(el);
  });

  /* ---------- Sidebar (mobile off-canvas) ---------- */
  function openSidebar() {
    sidebar.classList.add("open");
    sidebarBackdrop.classList.add("show");
    document.body.style.overflow = "hidden";
  }
  function closeSidebar() {
    sidebar.classList.remove("open");
    sidebarBackdrop.classList.remove("show");
    document.body.style.overflow = "";
  }
  hamburgerBtn && hamburgerBtn.addEventListener("click", openSidebar);
  closeSidebarBtn && closeSidebarBtn.addEventListener("click", closeSidebar);
  sidebarBackdrop && sidebarBackdrop.addEventListener("click", closeSidebar);

  /* ---------- New chat ---------- */
  function startNewChat() {
    messagesList.innerHTML = "";
    typingIndicator.classList.add("d-none");
    welcomeScreen.classList.remove("d-none");
    clearSelectedImage();
    chatInput.value = "";
    autoResizeInput();
    updateSendState();
    closeSidebar();
    chatInput.focus();
  }
  [newChatBtn, mobileNewChatBtn, headerNewChatBtn].forEach((btn) => {
    btn && btn.addEventListener("click", startNewChat);
  });

  /* ---------- History item selection (visual only) ---------- */
  document.querySelectorAll(".history-item").forEach((item) => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".history-item").forEach((i) => i.classList.remove("active"));
      item.classList.add("active");
      closeSidebar();
    });
  });

  /* ---------- Textarea auto-resize ---------- */
  function autoResizeInput() {
    chatInput.style.height = "auto";
    chatInput.style.height = Math.min(chatInput.scrollHeight, 140) + "px";
  }
  chatInput.addEventListener("input", () => {
    autoResizeInput();
    updateSendState();
  });

  function updateSendState() {
    const hasText = chatInput.value.trim().length > 0;
    const hasImage = !!selectedImageDataUrl;
    sendBtn.disabled = !(hasText || hasImage) || isAiResponding;
  }

  /* ---------- Enter to send, Shift+Enter for newline ---------- */
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!sendBtn.disabled) {
        chatForm.requestSubmit();
      }
    }
  });

  /* ---------- Suggestion cards ---------- */
  suggestionCards.forEach((card) => {
    card.addEventListener("click", () => {
      chatInput.value = card.getAttribute("data-text") || "";
      autoResizeInput();
      updateSendState();
      chatInput.focus();
    });
  });

  /* ---------- Image attachment ---------- */
  attachBtn.addEventListener("click", () => imageInput.click());

  imageInput.addEventListener("change", () => {
    const file = imageInput.files && imageInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      selectedImageDataUrl = e.target.result;
      previewImage.src = selectedImageDataUrl;
      imagePreviewStrip.classList.remove("d-none");
      updateSendState();
    };
    reader.readAsDataURL(file);
  });

  function clearSelectedImage() {
    selectedImageDataUrl = null;
    previewImage.src = "";
    imagePreviewStrip.classList.add("d-none");
    imageInput.value = "";
  }
  removeImageBtn.addEventListener("click", () => {
    clearSelectedImage();
    updateSendState();
  });

  /* ---------- Voice / microphone UI ---------- */
  micBtn.addEventListener("click", () => {
    isRecording = true;
    micBtn.classList.add("recording");
    voiceOverlay.classList.remove("d-none");
  });

  function stopRecording() {
    isRecording = false;
    micBtn.classList.remove("recording");
    voiceOverlay.classList.add("d-none");
  }
  stopRecordingBtn.addEventListener("click", stopRecording);

  /* ---------- Time formatting ---------- */
  function formatTime(date) {
    return date.toLocaleTimeString("mr-IN", { hour: "2-digit", minute: "2-digit" });
  }

  /* ---------- Scroll to bottom ---------- */
  function scrollToBottom() {
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
  }

  /* ---------- Render user message ---------- */
  function renderUserMessage(text, imageDataUrl) {
    const node = userMessageTemplate.content.cloneNode(true);
    const bubble = node.querySelector(".user-bubble");
    const textEl = node.querySelector(".message-text");
    const timeEl = node.querySelector(".message-time");

    if (imageDataUrl) {
      const img = document.createElement("img");
      img.src = imageDataUrl;
      img.alt = "अपलोड केलेली प्रतिमा";
      img.style.cssText = "max-width:100%;border-radius:12px;margin-bottom:8px;display:block;";
      bubble.insertBefore(img, textEl);
    }

    if (text) {
      textEl.textContent = text;
    } else {
      textEl.remove();
    }
    timeEl.textContent = formatTime(new Date());
    messagesList.appendChild(node);
  }

  /* ---------- Render AI message (supports simple structured content) ---------- */
  function renderAiMessage(html) {
    const node = aiMessageTemplate.content.cloneNode(true);
    const textEl = node.querySelector(".message-text");
    const timeEl = node.querySelector(".message-time");
    textEl.innerHTML = html;
    timeEl.textContent = formatTime(new Date());
    messagesList.appendChild(node);
  }

  /* ---------- Demo AI reply generator ---------- */
  function buildDemoReply(userText) {
    const lower = (userText || "").toLowerCase();

    if (userText && (userText.indexOf("रोग") !== -1 || lower.indexOf("disease") !== -1)) {
      return `
        <p>तुमच्या पिकावरील डाग हे बुरशीजन्य रोगाचे लक्षण असू शकते.</p>
        <div class="info-block">
          <div class="info-block-title">🌱 संभाव्य कारण</div>
          जास्त आर्द्रता आणि हवेच्या कमी खेळत्यामुळे बुरशीची वाढ होते.
        </div>
        <div class="info-block">
          <div class="info-block-title">🐛 लक्षणे</div>
          पानांवर तपकिरी/काळे डाग, पाने पिवळी पडणे.
        </div>
        <div class="info-block">
          <div class="info-block-title">💡 उपाय</div>
          योग्य बुरशीनाशक फवारणी करा आणि शेतात पाणी साचू देऊ नका.
        </div>
        <div class="info-block warn">
          <div class="info-block-title">⚠️ काळजी</div>
          फवारणीपूर्वी स्थानिक कृषी अधिकाऱ्यांचा सल्ला घ्या.
        </div>
      `;
    }

    if (userText && (userText.indexOf("खत") !== -1)) {
      return `
        <p>पिकाच्या वाढीच्या टप्प्यानुसार खताची निवड बदलते. साधारण मार्गदर्शक तत्त्वे:</p>
        <ul>
          <li>लागवडीच्या वेळी: सेंद्रिय खत + DAP</li>
          <li>वाढीच्या टप्प्यात: युरिया विभागून द्या</li>
          <li>फुलोरा/फळधारणेच्या वेळी: पोटॅशयुक्त खत</li>
        </ul>
        <div class="info-block">
          <div class="info-block-title">💡 सूचना</div>
          मातीचे परीक्षण करून योग्य प्रमाण ठरवणे उत्तम.
        </div>
      `;
    }

    if (userText && (userText.indexOf("हवामान") !== -1)) {
      return `<p>तुमच्या भागातील आजचे हवामान अंशतः ढगाळ असून तापमान साधारण २७°C ते ३३°C दरम्यान राहील. पुढील ४८ तासांत हलक्या पावसाची शक्यता आहे — फवारणी टाळा.</p>`;
    }

    if (userText && (userText.indexOf("योजना") !== -1)) {
      return `
        <p>तुमच्यासाठी काही उपयुक्त सरकारी योजना:</p>
        <ul>
          <li>PM किसान सन्मान निधी योजना</li>
          <li>प्रधानमंत्री पीक विमा योजना</li>
          <li>किसान क्रेडिट कार्ड</li>
        </ul>
      `;
    }

    if (userText && (userText.indexOf("बाजारभाव") !== -1)) {
      return `<p>आजचा अंदाजे बाजारभाव: कापूस — ₹७,२००/क्विंटल, सोयाबीन — ₹४,८५०/क्विंटल. अचूक भावासाठी जवळच्या बाजार समितीशी संपर्क साधा.</p>`;
    }

    if (userText && (userText.indexOf("पाणी") !== -1)) {
      return `<p>पिकाच्या प्रकारानुसार पाण्याची गरज बदलते. साधारणपणे मातीतील ओलावा तपासून, गरज असेल तेव्हाच सिंचन करा — जास्त पाणी मुळांसाठी हानिकारक ठरू शकते.</p>`;
    }

    return `<p>धन्यवाद तुमच्या प्रश्नासाठी! मी याबाबत अधिक माहिती गोळा करत आहे. कृपया तुमचा प्रश्न थोडा अधिक तपशीलवार सांगू शकाल का?</p>`;
  }

  /* ---------- Typing indicator ---------- */
  function showTyping() {
    typingIndicator.classList.remove("d-none");
    scrollToBottom();
  }
  function hideTyping() {
    typingIndicator.classList.add("d-none");
  }

  /* ---------- Form submit ---------- */
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    const imageDataUrl = selectedImageDataUrl;

    if (!text && !imageDataUrl) return;
    if (isAiResponding) return;

    welcomeScreen.classList.add("d-none");

    renderUserMessage(text, imageDataUrl);

    chatInput.value = "";
    autoResizeInput();
    clearSelectedImage();
    updateSendState();
    scrollToBottom();

    isAiResponding = true;
    updateSendState();
    showTyping();

    const thinkDelay = 900 + Math.random() * 700;
    setTimeout(() => {
      hideTyping();
      renderAiMessage(buildDemoReply(text));
      isAiResponding = false;
      updateSendState();
      scrollToBottom();
    }, thinkDelay);
  });

  /* ---------- Init ---------- */
  autoResizeInput();
  updateSendState();
})();
