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

  const userMessageTemplate =
    document.getElementById("userMessageTemplate");

  const aiMessageTemplate =
    document.getElementById("aiMessageTemplate");


  /* ---------- State ---------- */

  let selectedImageDataUrl = null;
  let isRecording = false;
  let isAiResponding = false;

  // Current selected conversation
  let currentConversationId = null;


  /* ---------- Tooltips ---------- */

  document
    .querySelectorAll('[data-bs-toggle="tooltip"]')
    .forEach((el) => {
      new bootstrap.Tooltip(el);
    });


  /* ---------- Sidebar ---------- */

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

  hamburgerBtn &&
    hamburgerBtn.addEventListener("click", openSidebar);

  closeSidebarBtn &&
    closeSidebarBtn.addEventListener("click", closeSidebar);

  sidebarBackdrop &&
    sidebarBackdrop.addEventListener("click", closeSidebar);


  /* ---------- New Chat ---------- */

  function startNewChat() {

    // जुनी conversation सोडून नवीन conversation
    currentConversationId = null;

    messagesList.innerHTML = "";

    typingIndicator.classList.add("d-none");

    welcomeScreen.classList.remove("d-none");

    clearSelectedImage();

    chatInput.value = "";

    autoResizeInput();

    updateSendState();

    // Remove active history item
    document
      .querySelectorAll(".history-item")
      .forEach((item) => {
        item.classList.remove("active");
      });

    closeSidebar();

    chatInput.focus();
  }


  [newChatBtn, mobileNewChatBtn, headerNewChatBtn]
    .forEach((btn) => {
      btn &&
        btn.addEventListener("click", startNewChat);
    });


  /* ---------- Textarea Auto Resize ---------- */

  function autoResizeInput() {

    chatInput.style.height = "auto";

    chatInput.style.height =
      Math.min(chatInput.scrollHeight, 140) + "px";
  }


  chatInput.addEventListener("input", () => {

    autoResizeInput();

    updateSendState();

  });


  function updateSendState() {

    const hasText =
      chatInput.value.trim().length > 0;

    const hasImage =
      !!selectedImageDataUrl;

    sendBtn.disabled =
      !(hasText || hasImage) ||
      isAiResponding;
  }


  /* ---------- Enter to Send ---------- */

  chatInput.addEventListener("keydown", (e) => {

    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {

      e.preventDefault();

      if (!sendBtn.disabled) {

        chatForm.requestSubmit();

      }
    }

  });


  /* ---------- Suggestion Cards ---------- */

  suggestionCards.forEach((card) => {

    card.addEventListener("click", () => {

      chatInput.value =
        card.getAttribute("data-text") || "";

      autoResizeInput();

      updateSendState();

      chatInput.focus();

    });

  });


  /* ---------- Image Attachment ---------- */

  attachBtn.addEventListener("click", () => {

    imageInput.click();

  });


  imageInput.addEventListener("change", () => {

    const file =
      imageInput.files &&
      imageInput.files[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onload = (e) => {

      selectedImageDataUrl =
        e.target.result;

      previewImage.src =
        selectedImageDataUrl;

      imagePreviewStrip.classList.remove(
        "d-none"
      );

      updateSendState();

    };

    reader.readAsDataURL(file);

  });


  function clearSelectedImage() {

    selectedImageDataUrl = null;

    previewImage.src = "";

    imagePreviewStrip.classList.add(
      "d-none"
    );

    imageInput.value = "";

  }


  removeImageBtn.addEventListener(
    "click",
    () => {

      clearSelectedImage();

      updateSendState();

    }
  );


  /* ---------- Voice UI ---------- */

  micBtn.addEventListener("click", () => {

    isRecording = true;

    micBtn.classList.add("recording");

    voiceOverlay.classList.remove(
      "d-none"
    );

  });


  function stopRecording() {

    isRecording = false;

    micBtn.classList.remove(
      "recording"
    );

    voiceOverlay.classList.add(
      "d-none"
    );

  }


  stopRecordingBtn.addEventListener(
    "click",
    stopRecording
  );


  /* ---------- Time Formatting ---------- */

  function formatTime(date) {

    return date.toLocaleTimeString(
      "mr-IN",
      {
        hour: "2-digit",
        minute: "2-digit"
      }
    );

  }


  /* ---------- Scroll ---------- */

  function scrollToBottom() {

    chatBody.scrollTo({

      top: chatBody.scrollHeight,

      behavior: "smooth"

    });

  }


  /* ---------- Render User Message ---------- */

  function renderUserMessage(
    text,
    imageDataUrl
  ) {

    const node =
      userMessageTemplate.content.cloneNode(
        true
      );

    const bubble =
      node.querySelector(
        ".user-bubble"
      );

    const textEl =
      node.querySelector(
        ".message-text"
      );

    const timeEl =
      node.querySelector(
        ".message-time"
      );


    if (imageDataUrl) {

      const img =
        document.createElement("img");

      img.src =
        imageDataUrl;

      img.alt =
        "अपलोड केलेली प्रतिमा";

      img.style.cssText =
        "max-width:100%;border-radius:12px;margin-bottom:8px;display:block;";

      bubble.insertBefore(
        img,
        textEl
      );

    }


    if (text) {

      textEl.textContent = text;

    } else {

      textEl.remove();

    }


    timeEl.textContent =
      formatTime(new Date());


    messagesList.appendChild(node);

  }


  /* ---------- Render AI Message ---------- */

  function renderAiMessage(html) {

    const node =
      aiMessageTemplate.content.cloneNode(
        true
      );

    const textEl =
      node.querySelector(
        ".message-text"
      );

    const timeEl =
      node.querySelector(
        ".message-time"
      );


    textEl.innerHTML = html;

    timeEl.textContent =
      formatTime(new Date());


    messagesList.appendChild(node);

  }


  /* ---------- Typing Indicator ---------- */

  function showTyping() {

    typingIndicator.classList.remove(
      "d-none"
    );

    scrollToBottom();

  }


  function hideTyping() {

    typingIndicator.classList.add(
      "d-none"
    );

  }


  /* =========================================================
     CONVERSATION HISTORY
     ========================================================= */


  /* ---------- Escape HTML ---------- */

  function escapeHtml(text) {

    const div =
      document.createElement("div");

    div.textContent =
      text || "";

    return div.innerHTML;

  }


  function formatConversationTitle(message) {

    const title =
      (message || "")
        .replace(/\s+/g, " ")
        .trim();

    return title.length > 40
      ? `${title.slice(0, 40)}...`
      : title || "नवीन संवाद";

  }


  /* ---------- Load Conversations ---------- */

  async function loadConversations() {

    try {

      const response =
        await fetch(
          "/chat/conversations"
        );

      const data =
        await response.json();


      if (
        !response.ok ||
        !data.success
      ) {

        console.log(
          "No conversations available"
        );

        return;

      }


      renderConversations(
        data.conversations
      );


    } catch (error) {

      console.error(
        "❌ Conversations Load Error:",
        error
      );

    }

  }


  /* ---------- Render Conversations ---------- */

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

      historyList.innerHTML = `
        <li class="history-empty">
          <i class="bi bi-chat"></i>
          <span>अजून कोणताही संवाद नाही</span>
        </li>
      `;

      return;

    }


    conversations.forEach(
      (conversation) => {

        const li =
          document.createElement("li");


        li.className =
          "history-item";

        if (
          conversation._id === currentConversationId
        ) {
          li.classList.add("active");
        }


        li.dataset.conversationId =
          conversation._id;


        const title =
          formatConversationTitle(
            conversation.firstMessage
          );


        li.innerHTML = `
          <i class="bi bi-chat-left-text"></i>
          <span>${escapeHtml(title)}</span>
          <button
            type="button"
            class="history-delete-btn"
            aria-label="संवाद हटवा"
            title="संवाद हटवा"
          >
            <i class="bi bi-trash3"></i>
          </button>
        `;


        li
          .querySelector(".history-delete-btn")
          .addEventListener(
            "click",
            (event) => {
              event.stopPropagation();
              deleteConversation(conversation._id, li);
            }
          );


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


            li.classList.add(
              "active"
            );


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


  async function deleteConversation(
    conversationId,
    historyItem
  ) {

    if (
      !window.confirm(
        "हा संवाद आणि त्यातील सर्व संदेश हटवायचे आहेत का?"
      )
    ) return;


    try {

      const response =
        await fetch(
          `/chat/history/${conversationId}`,
          { method: "DELETE" }
        );

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
          "Failed to delete conversation"
        );
      }

      historyItem.remove();

      if (currentConversationId === conversationId) {
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


  /* ---------- Load Selected Conversation ---------- */

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

        console.error(
          "Failed to load conversation"
        );

        return;

      }


      // Set current conversation
      currentConversationId =
        conversationId;


      // Clear current UI
      messagesList.innerHTML = "";


      welcomeScreen.classList.add(
        "d-none"
      );


      data.messages.forEach(
        (chat) => {

          /* ---------- User ---------- */

          if (
            chat.role === "user"
          ) {

            renderUserMessage(
              chat.message,
              null
            );

          }


          /* ---------- Assistant ---------- */

          if (
            chat.role === "assistant"
          ) {

            const answer =
              chat.message || "";


            if (
              typeof marked !==
                "undefined" &&
              typeof DOMPurify !==
                "undefined"
            ) {

              const html =
                marked.parse(
                  answer
                );


              const safeHtml =
                DOMPurify.sanitize(
                  html
                );


              renderAiMessage(
                safeHtml
              );

            } else {

              renderAiMessage(
                `<p>${escapeHtml(
                  answer
                )}</p>`
              );

            }

          }

        }
      );


      scrollToBottom();


    } catch (error) {

      console.error(
        "❌ Conversation Load Error:",
        error
      );

    }

  }


  /* =========================================================
     FORM SUBMIT
     ========================================================= */

  chatForm.addEventListener(
    "submit",
    async (e) => {

      e.preventDefault();


      const text =
        chatInput.value.trim();

      const imageDataUrl =
        selectedImageDataUrl;


      if (
        !text &&
        !imageDataUrl
      ) return;


      if (isAiResponding) return;


      welcomeScreen.classList.add(
        "d-none"
      );


      renderUserMessage(
        text,
        imageDataUrl
      );


      chatInput.value = "";

      autoResizeInput();

      clearSelectedImage();

      updateSendState();

      scrollToBottom();


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


        /* ---------- Save Conversation ID ---------- */

        currentConversationId =
          data.conversationId;


        /* ---------- Render AI Response ---------- */

        const answer =
          data.answer || "";


        if (
          typeof marked !==
            "undefined" &&
          typeof DOMPurify !==
            "undefined"
        ) {

          const html =
            marked.parse(
              answer
            );


          const safeHtml =
            DOMPurify.sanitize(
              html
            );


          renderAiMessage(
            safeHtml
          );

        } else {

          console.warn(
            "⚠️ Markdown or security library not loaded"
          );


          renderAiMessage(
            `<p>${escapeHtml(
              answer
            )}</p>`
          );

        }


        /*
         * New conversation may have been created.
         * Refresh sidebar so the new conversation
         * appears automatically.
         */

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


  /* =========================================================
     LOAD OLD CHAT HISTORY
     ========================================================= */

  async function loadChatHistory() {

    try {

      const response =
        await fetch(
          "/chat/history"
        );


      const data =
        await response.json();


      if (
        !response.ok ||
        !data.success
      ) {

        console.log(
          "No chat history available"
        );

        return;

      }


      /*
       * IMPORTANT:
       * We no longer render all history here.
       *
       * Sidebar conversations will handle
       * individual conversation loading.
       *
       * Therefore this function is kept only
       * for backward compatibility.
       */


      if (
        !data.messages ||
        data.messages.length === 0
      ) {

        return;

      }


      /*
       * Do NOT render all messages here.
       *
       * Otherwise different conversations
       * would get mixed together.
       */


    } catch (error) {

      console.error(
        "❌ History Load Error:",
        error
      );

    }

  }


  /* =========================================================
     INIT
     ========================================================= */

  autoResizeInput();

  updateSendState();

  loadChatHistory();

  loadConversations();

})();