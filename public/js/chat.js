/* =========================================================
   KISAANMITRA AI — CHAT JAVASCRIPT
========================================================= */

(function () {
  "use strict";


  /* =======================================================
     ELEMENTS
  ======================================================= */

  const sidebar = document.getElementById("sidebar");
  const sidebarBackdrop = document.getElementById("sidebarBackdrop");

  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const closeSidebarBtn = document.getElementById("closeSidebarBtn");

  const newChatBtn = document.getElementById("newChatBtn");
  const mobileNewChatBtn = document.getElementById("mobileNewChatBtn");

  const languageBtn = document.getElementById("languageBtn");
  const languageMenu = document.getElementById("languageMenu");

  const settingsBtn = document.getElementById("settingsBtn");
  const moreOptionsBtn = document.getElementById("moreOptionsBtn");

  const chatBody = document.getElementById("chatBody");
  const welcomeScreen = document.getElementById("welcomeScreen");
  const messagesList = document.getElementById("messagesList");
  const typingIndicator = document.getElementById("typingIndicator");

  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const sendBtn = document.getElementById("sendBtn");

  const attachBtn = document.getElementById("attachBtn");
  const imageInput = document.getElementById("imageInput");

  const imagePreviewStrip =
    document.getElementById("imagePreviewStrip");

  const previewImage =
    document.getElementById("previewImage");

  const removeImageBtn =
    document.getElementById("removeImageBtn");

  const micBtn = document.getElementById("micBtn");

  const voiceOverlay =
    document.getElementById("voiceOverlay");

  const stopRecordingBtn =
    document.getElementById("stopRecordingBtn");

  const suggestionCards =
    document.querySelectorAll(".suggestion-card");

  const userMessageTemplate =
    document.getElementById("userMessageTemplate");

  const aiMessageTemplate =
    document.getElementById("aiMessageTemplate");


  /* =======================================================
     STATE
  ======================================================= */

  let selectedImageDataUrl = null;

  let isRecording = false;

  let isAiResponding = false;

  let currentConversationId = null;


  /* =======================================================
     BOOTSTRAP TOOLTIPS
  ======================================================= */

  if (typeof bootstrap !== "undefined") {

    document
      .querySelectorAll('[data-bs-toggle="tooltip"]')
      .forEach((element) => {

        new bootstrap.Tooltip(element);

      });

  }


  /* =======================================================
     SIDEBAR
  ======================================================= */

  function openSidebar() {

    if (!sidebar || !sidebarBackdrop) return;

    sidebar.classList.add("open");

    sidebarBackdrop.classList.add("show");

    document.body.style.overflow = "hidden";

  }


  function closeSidebar() {

    if (!sidebar || !sidebarBackdrop) return;

    sidebar.classList.remove("open");

    sidebarBackdrop.classList.remove("show");

    document.body.style.overflow = "";

  }


  hamburgerBtn &&
    hamburgerBtn.addEventListener("click", openSidebar);


  closeSidebarBtn &&
    closeSidebarBtn.addEventListener("click", closeSidebar);


  sidebarBackdrop &&
    sidebarBackdrop.addEventListener("click", closeSidebar);


  /* =======================================================
     NEW CHAT
  ======================================================= */

  function startNewChat() {

    currentConversationId = null;

    if (messagesList) {
      messagesList.innerHTML = "";
    }

    if (typingIndicator) {
      typingIndicator.classList.add("d-none");
    }

    if (welcomeScreen) {
      welcomeScreen.classList.remove("d-none");
    }

    clearSelectedImage();

    if (chatInput) {

      chatInput.value = "";

      autoResizeInput();

      chatInput.focus();

    }

    updateSendState();

    document
      .querySelectorAll(".history-item")
      .forEach((item) => {

        item.classList.remove("active");

      });

    closeSidebar();

  }


  newChatBtn &&
    newChatBtn.addEventListener("click", startNewChat);


  mobileNewChatBtn &&
    mobileNewChatBtn.addEventListener("click", startNewChat);


  /* =======================================================
     LANGUAGE MENU
  ======================================================= */

  if (languageBtn && languageMenu) {

    const dropdownWrapper =
      languageBtn.closest(".header-dropdown-wrapper");


    languageBtn.addEventListener("click", (event) => {

      event.stopPropagation();

      dropdownWrapper &&
        dropdownWrapper.classList.toggle("open");

    });


    languageMenu.addEventListener("click", (event) => {

      const option =
        event.target.closest(".language-option");

      if (!option) return;

      const language =
        option.dataset.language;

      document
        .querySelectorAll(".language-option")
        .forEach((item) => {

          item.classList.remove("active");

        });

      option.classList.add("active");


      /*
        Current backend language support is not changed here.
        This only manages the polished UI selection.
      */

      const selectedText =
        option.querySelector("span:nth-child(2)")?.textContent;

      if (selectedText) {

        const buttonText =
          languageBtn.querySelector("span");

        if (buttonText) {

          buttonText.textContent = selectedText;

        }

      }


      dropdownWrapper &&
        dropdownWrapper.classList.remove("open");

    });


    document.addEventListener("click", (event) => {

      if (
        dropdownWrapper &&
        !dropdownWrapper.contains(event.target)
      ) {

        dropdownWrapper.classList.remove("open");

      }

    });

  }


  /* =======================================================
     SETTINGS BUTTON
  ======================================================= */

  if (settingsBtn) {

    settingsBtn.addEventListener("click", () => {

      /*
        Settings UI placeholder.
        Backend settings can be connected later.
      */

      window.alert(
        "KisaanMitra Settings\n\nSettings options लवकरच उपलब्ध होतील."
      );

    });

  }


  /* =======================================================
     MORE OPTIONS
  ======================================================= */

  if (moreOptionsBtn) {

    moreOptionsBtn.addEventListener("click", () => {

      /*
        Simple useful action:
        Scroll to latest message.
      */

      scrollToBottom();

    });

  }


  /* =======================================================
     INPUT AUTO RESIZE
  ======================================================= */

  function autoResizeInput() {

    if (!chatInput) return;

    chatInput.style.height = "auto";

    chatInput.style.height =
      Math.min(chatInput.scrollHeight, 140) + "px";

  }


  chatInput &&
    chatInput.addEventListener("input", () => {

      autoResizeInput();

      updateSendState();

    });


  /* =======================================================
     SEND BUTTON STATE
  ======================================================= */

  function updateSendState() {

    if (!sendBtn || !chatInput) return;

    const hasText =
      chatInput.value.trim().length > 0;

    const hasImage =
      !!selectedImageDataUrl;

    sendBtn.disabled =
      !(hasText || hasImage) ||
      isAiResponding;

  }


  /* =======================================================
     ENTER TO SEND
  ======================================================= */

  chatInput &&
    chatInput.addEventListener("keydown", (event) => {

      if (
        event.key === "Enter" &&
        !event.shiftKey
      ) {

        event.preventDefault();

        if (!sendBtn.disabled) {

          chatForm.requestSubmit();

        }

      }

    });


  /* =======================================================
     SUGGESTION CARDS
  ======================================================= */

  suggestionCards.forEach((card) => {

    card.addEventListener("click", () => {

      const text =
        card.getAttribute("data-text") || "";

      if (!chatInput) return;

      chatInput.value = text;

      autoResizeInput();

      updateSendState();

      chatInput.focus();

    });

  });


  /* =======================================================
     IMAGE ATTACHMENT
  ======================================================= */

  attachBtn &&
    attachBtn.addEventListener("click", () => {

      if (isAiResponding) return;

      imageInput && imageInput.click();

    });


  imageInput &&
    imageInput.addEventListener("change", () => {

      const file =
        imageInput.files &&
        imageInput.files[0];

      if (!file) return;


      if (!file.type.startsWith("image/")) {

        window.alert(
          "कृपया image file निवडा."
        );

        clearSelectedImage();

        return;

      }


      const maxSize =
        5 * 1024 * 1024;

      if (file.size > maxSize) {

        window.alert(
          "Image size 5MB पेक्षा कमी असावी."
        );

        clearSelectedImage();

        return;

      }


      const reader =
        new FileReader();


      reader.onload = (event) => {

        selectedImageDataUrl =
          event.target.result;


        if (previewImage) {

          previewImage.src =
            selectedImageDataUrl;

        }


        if (imagePreviewStrip) {

          imagePreviewStrip.classList.remove(
            "d-none"
          );

        }


        updateSendState();

      };


      reader.onerror = () => {

        window.alert(
          "Image load करता आली नाही."
        );

        clearSelectedImage();

      };


      reader.readAsDataURL(file);

    });


  /* =======================================================
     CLEAR IMAGE
  ======================================================= */

  function clearSelectedImage() {

    selectedImageDataUrl = null;

    if (previewImage) {

      previewImage.src = "";

    }

    if (imagePreviewStrip) {

      imagePreviewStrip.classList.add(
        "d-none"
      );

    }

    if (imageInput) {

      imageInput.value = "";

    }

  }


  removeImageBtn &&
    removeImageBtn.addEventListener(
      "click",
      () => {

        clearSelectedImage();

        updateSendState();

      }
    );


  /* =======================================================
     VOICE UI
  ======================================================= */

  micBtn &&
    micBtn.addEventListener("click", () => {

      if (isAiResponding) return;

      isRecording = true;

      micBtn.classList.add("recording");

      voiceOverlay &&
        voiceOverlay.classList.remove("d-none");

    });


  function stopRecording() {

    isRecording = false;

    micBtn &&
      micBtn.classList.remove("recording");

    voiceOverlay &&
      voiceOverlay.classList.add("d-none");

  }


  stopRecordingBtn &&
    stopRecordingBtn.addEventListener(
      "click",
      stopRecording
    );


  /* =======================================================
     ESC KEY
  ======================================================= */

  document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

      stopRecording();

      const wrapper =
        languageBtn?.closest(
          ".header-dropdown-wrapper"
        );

      wrapper &&
        wrapper.classList.remove("open");

      closeSidebar();

    }

  });


  /* =======================================================
     FORMAT TIME
  ======================================================= */

  function formatTime(date) {

    return date.toLocaleTimeString(
      "mr-IN",
      {
        hour: "2-digit",
        minute: "2-digit"
      }
    );

  }


  /* =======================================================
     SCROLL
  ======================================================= */

  function scrollToBottom() {

    if (!chatBody) return;

    requestAnimationFrame(() => {

      chatBody.scrollTo({
        top: chatBody.scrollHeight,
        behavior: "smooth"
      });

    });

  }


  /* =======================================================
     RENDER USER MESSAGE
  ======================================================= */

  function renderUserMessage(
    text,
    imageDataUrl
  ) {

    if (!userMessageTemplate || !messagesList) {
      return;
    }


    const node =
      userMessageTemplate.content.cloneNode(true);


    const bubble =
      node.querySelector(".user-bubble");

    const textEl =
      node.querySelector(".message-text");

    const timeEl =
      node.querySelector(".message-time");


    /* Image */

    if (imageDataUrl && bubble) {

      const img =
        document.createElement("img");

      img.src = imageDataUrl;

      img.alt =
        "अपलोड केलेली प्रतिमा";

      img.style.cssText = `
        max-width:100%;
        max-height:320px;
        border-radius:12px;
        margin-bottom:8px;
        display:block;
        object-fit:cover;
      `;

      bubble.insertBefore(
        img,
        textEl
      );

    }


    /* Text */

    if (text && textEl) {

      textEl.textContent = text;

    } else if (textEl) {

      textEl.remove();

    }


    /* Time */

    if (timeEl) {

      timeEl.textContent =
        formatTime(new Date());

    }


    messagesList.appendChild(node);

  }


  /* =======================================================
     RENDER AI MESSAGE
  ======================================================= */

  function renderAiMessage(html) {

    if (!aiMessageTemplate || !messagesList) {
      return;
    }


    const node =
      aiMessageTemplate.content.cloneNode(true);


    const textEl =
      node.querySelector(".message-text");

    const timeEl =
      node.querySelector(".message-time");


    if (textEl) {

      textEl.innerHTML = html;

    }


    if (timeEl) {

      timeEl.textContent =
        formatTime(new Date());

    }


    messagesList.appendChild(node);

  }


  /* =======================================================
     MARKDOWN RENDERER
  ======================================================= */

  function renderMarkdown(text) {

    const answer = text || "";


    if (
      typeof marked !== "undefined" &&
      typeof DOMPurify !== "undefined"
    ) {

      try {

        const html =
          marked.parse(answer, {
            breaks: true,
            gfm: true
          });


        return DOMPurify.sanitize(html, {
          USE_PROFILES: {
            html: true
          }
        });

      } catch (error) {

        console.error(
          "Markdown rendering error:",
          error
        );

      }

    }


    return `<p>${escapeHtml(answer)}</p>`;

  }


  /* =======================================================
     ESCAPE HTML
  ======================================================= */

  function escapeHtml(text) {

    const div =
      document.createElement("div");

    div.textContent =
      text || "";

    return div.innerHTML;

  }


  /* =======================================================
     TYPING
  ======================================================= */

  function showTyping() {

    if (!typingIndicator) return;

    typingIndicator.classList.remove(
      "d-none"
    );

    scrollToBottom();

  }


  function hideTyping() {

    if (!typingIndicator) return;

    typingIndicator.classList.add(
      "d-none"
    );

  }


  /* =======================================================
     CONVERSATION TITLE
  ======================================================= */

  function formatConversationTitle(message) {

    const title =
      (message || "")
        .replace(/\s+/g, " ")
        .trim();


    return title.length > 42
      ? `${title.slice(0, 42)}...`
      : title || "नवीन संवाद";

  }


  /* =======================================================
     LOAD CONVERSATIONS
  ======================================================= */

  async function loadConversations() {

    try {

      const response =
        await fetch("/chat/conversations");


      const data =
        await response.json();


      if (
        !response.ok ||
        !data.success
      ) {

        renderEmptyHistory();

        return;

      }


      renderConversations(
        data.conversations || []
      );

    } catch (error) {

      console.error(
        "❌ Conversations Load Error:",
        error
      );

    }

  }


  /* =======================================================
     EMPTY HISTORY
  ======================================================= */

  function renderEmptyHistory() {

    const historyList =
      document.getElementById(
        "historyList"
      );

    if (!historyList) return;

    historyList.innerHTML = `
      <li class="history-empty">
        <i class="bi bi-chat"></i>
        <span>अजून कोणताही संवाद नाही</span>
      </li>
    `;

  }


  /* =======================================================
     RENDER CONVERSATIONS
  ======================================================= */

  function renderConversations(
    conversations
  ) {

    const historyList =
      document.getElementById(
        "historyList"
      );


    if (!historyList) return;


    historyList.innerHTML = "";


    if (
      !conversations ||
      conversations.length === 0
    ) {

      renderEmptyHistory();

      return;

    }


    conversations.forEach(
      (conversation) => {

        const li =
          document.createElement("li");


        li.className =
          "history-item";


        if (
          conversation._id ===
          currentConversationId
        ) {

          li.classList.add("active");

        }


        li.dataset.conversationId =
          conversation._id;


        const title =
          formatConversationTitle(
            conversation.firstMessage
          );


        /*
          Build DOM manually instead of injecting
          conversation text into innerHTML.
        */

        const icon =
          document.createElement("i");

        icon.className =
          "bi bi-chat-left-text";


        const titleSpan =
          document.createElement("span");

        titleSpan.textContent =
          title;


        const deleteBtn =
          document.createElement("button");

        deleteBtn.type =
          "button";

        deleteBtn.className =
          "history-delete-btn";

        deleteBtn.setAttribute(
          "aria-label",
          "संवाद हटवा"
        );

        deleteBtn.title =
          "संवाद हटवा";


        const deleteIcon =
          document.createElement("i");

        deleteIcon.className =
          "bi bi-trash3";


        deleteBtn.appendChild(
          deleteIcon
        );


        li.appendChild(icon);

        li.appendChild(titleSpan);

        li.appendChild(deleteBtn);


        /* Delete */

        deleteBtn.addEventListener(
          "click",
          (event) => {

            event.stopPropagation();

            deleteConversation(
              conversation._id,
              li
            );

          }
        );


        /* Open */

        li.addEventListener(
          "click",
          () => {

            document
              .querySelectorAll(
                ".history-item"
              )
              .forEach((item) => {

                item.classList.remove(
                  "active"
                );

              });


            li.classList.add("active");


            loadConversation(
              conversation._id
            );


            closeSidebar();

          }
        );


        historyList.appendChild(li);

      }
    );

  }


  /* =======================================================
     DELETE CONVERSATION
  ======================================================= */

  async function deleteConversation(
    conversationId,
    historyItem
  ) {

    const confirmed =
      window.confirm(
        "हा संवाद आणि त्यातील सर्व संदेश हटवायचे आहेत का?"
      );


    if (!confirmed) return;


    try {

      const response =
        await fetch(
          `/chat/history/${conversationId}`,
          {
            method: "DELETE"
          }
        );


      const data =
        await response.json();


      if (
        !response.ok ||
        !data.success
      ) {

        throw new Error(
          data.message ||
          "Failed to delete conversation"
        );

      }


      if (historyItem) {

        historyItem.remove();

      }


      if (
        currentConversationId ===
        conversationId
      ) {

        startNewChat();

      }


      loadConversations();

    } catch (error) {

      console.error(
        "❌ Conversation Delete Error:",
        error
      );


      window.alert(
        "संवाद हटवता आला नाही. कृपया पुन्हा प्रयत्न करा."
      );

    }

  }


  /* =======================================================
     LOAD SINGLE CONVERSATION
  ======================================================= */

  async function loadConversation(
    conversationId
  ) {

    try {

      const response =
        await fetch(
          `/chat/history/${conversationId}`
        );


      const data =
        await response.json();


      if (
        !response.ok ||
        !data.success
      ) {

        throw new Error(
          data.message ||
          "Failed to load conversation"
        );

      }


      currentConversationId =
        conversationId;


      if (messagesList) {

        messagesList.innerHTML = "";

      }


      if (welcomeScreen) {

        welcomeScreen.classList.add(
          "d-none"
        );

      }


      const messages =
        Array.isArray(data.messages)
          ? data.messages
          : [];


      messages.forEach((chat) => {

        if (chat.role === "user") {

          renderUserMessage(
            chat.message,
            null
          );

        }


        if (
          chat.role === "assistant"
        ) {

          const html =
            renderMarkdown(
              chat.message || ""
            );


          renderAiMessage(html);

        }

      });


      scrollToBottom();

    } catch (error) {

      console.error(
        "❌ Conversation Load Error:",
        error
      );

      window.alert(
        "संवाद load करता आला नाही. कृपया पुन्हा प्रयत्न करा."
      );

    }

  }


  /* =======================================================
     SEND MESSAGE
  ======================================================= */

  chatForm &&
    chatForm.addEventListener(
      "submit",
      async (event) => {

        event.preventDefault();


        const text =
          chatInput
            ? chatInput.value.trim()
            : "";


        const imageDataUrl =
          selectedImageDataUrl;


        if (
          !text &&
          !imageDataUrl
        ) {

          return;

        }


        if (isAiResponding) {

          return;

        }


        /* Hide welcome */

        if (welcomeScreen) {

          welcomeScreen.classList.add(
            "d-none"
          );

        }


        /* Render user */

        renderUserMessage(
          text,
          imageDataUrl
        );


        /* Reset input */

        if (chatInput) {

          chatInput.value = "";

          autoResizeInput();

        }


        clearSelectedImage();

        updateSendState();

        scrollToBottom();


        /* AI state */

        isAiResponding = true;

        updateSendState();

        showTyping();


        try {

          const response =
            await fetch(
              "/chat/message",
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json"
                },

                body: JSON.stringify({

                  message: text,

                  conversationId:
                    currentConversationId

                })

              }
            );


          const data =
            await response.json();


          hideTyping();


          if (
            !response.ok ||
            !data.success
          ) {

            throw new Error(
              data.message ||
              "AI response failed"
            );

          }


          /* Update conversation */

          currentConversationId =
            data.conversationId;


          /* AI answer */

          const answer =
            data.answer || "";


          const html =
            renderMarkdown(answer);


          renderAiMessage(html);


          /* Refresh sidebar */

          loadConversations();


        } catch (error) {

          console.error(
            "❌ Chat Error:",
            error
          );


          hideTyping();


          renderAiMessage(`
            <div class="info-block warn">
              <div class="info-block-title">
                ⚠️ क्षमस्व
              </div>
              आत्ता AI response मिळवताना समस्या आली.
              कृपया पुन्हा प्रयत्न करा.
            </div>
          `);

        } finally {

          isAiResponding = false;

          updateSendState();

          scrollToBottom();

        }

      }
    );


  /* =======================================================
     INITIALIZATION
  ======================================================= */

  autoResizeInput();

  updateSendState();

  loadConversations();


})();