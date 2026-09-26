document.addEventListener("DOMContentLoaded", () => {
  const schemes = Array.isArray(window.allGovernmentSchemes)
    ? window.allGovernmentSchemes
    : [];

  const grid = document.getElementById("schemeGrid");
  const detailsModal = document.getElementById("schemeDetailsModal");
  const modalCloseButton = document.getElementById("schemeDetailsClose");
  const countElement = document.getElementById("schemeCount");
  const resultsText = document.getElementById("resultsText");
  const emptyState = document.getElementById("emptyState");

  const searchInput = document.getElementById("schemeSearch");
  const clearSearchBtn = document.getElementById("clearSearch");

  const categoryFilter = document.getElementById("categoryFilter");
  const typeFilter = document.getElementById("schemeTypeFilter");
  const statusFilter = document.getElementById("statusFilter");

  const clearFiltersBtn = document.getElementById("clearFilters");
  const emptyClearBtn = document.getElementById("emptyClearBtn");

  if (!grid) {
    console.error("schemeGrid element not found.");
    return;
  }

  console.log("All Government Schemes:", schemes);
  console.log("Total schemes received:", schemes.length);


  // =========================================================
  // ESCAPE HTML
  // =========================================================

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }


  function safeExternalUrl(value) {
    if (!value) return "#";

    try {
      const url = new URL(String(value), window.location.origin);
      return ["http:", "https:"].includes(url.protocol) ? url.href : "#";
    } catch {
      return "#";
    }
  }


  function fillDetailList(elementId, values) {
    const list = document.getElementById(elementId);
    if (!list) return;

    const items = Array.isArray(values) ? values : [];
    list.innerHTML = items.length
      ? items.map((item) => `<li>${escapeHTML(item)}</li>`).join("")
      : "<li class=\"scheme-detail-empty\">Not specified in scheme data.</li>";
  }


  function openSchemeDetails(scheme) {
    if (!detailsModal || !scheme) return;

    const subtitle = scheme.subtitle || "";
    const government = [scheme.government, scheme.state]
      .filter(Boolean)
      .join(" · ");

    document.getElementById("schemeDetailsTitle").textContent = scheme.title || scheme.name || "Government Scheme";
    document.getElementById("schemeDetailsSubtitle").textContent = subtitle;
    document.getElementById("schemeDetailsSubtitle").hidden = !subtitle;
    document.getElementById("schemeDetailsGovernment").textContent = government;
    document.getElementById("schemeDetailsCategory").textContent = scheme.category || "Scheme";
    document.getElementById("schemeDetailsStatus").textContent = scheme.status || "Status not specified";
    document.getElementById("schemeDetailsBenefit").textContent = scheme.benefit || "Not specified in scheme data.";
    document.getElementById("schemeDetailsOverview").textContent = scheme.overview || "Not specified in scheme data.";

    fillDetailList("schemeDetailsEligibility", scheme.eligibility);
    fillDetailList("schemeDetailsDocuments", scheme.documents);
    fillDetailList("schemeDetailsSteps", scheme.applicationSteps);

    document.getElementById("schemeDetailsOfficialLink").href = safeExternalUrl(scheme.officialUrl);
    document.getElementById("schemeDetailsApplyLink").href = safeExternalUrl(scheme.applyUrl || scheme.officialUrl);

    detailsModal.classList.add("active");
    detailsModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    modalCloseButton?.focus();
  }


  function closeSchemeDetails() {
    if (!detailsModal) return;

    detailsModal.classList.remove("active");
    detailsModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }


  grid.addEventListener("click", (event) => {
    const trigger = event.target.closest(".details-btn[data-scheme-id]");
    if (!trigger) return;

    const schemeId = trigger.dataset.schemeId;
    const scheme = schemes.find(
      (item) => String(item._id || item.slug || "") === schemeId
    );

    openSchemeDetails(scheme);
  });

  modalCloseButton?.addEventListener("click", closeSchemeDetails);
  detailsModal?.addEventListener("click", (event) => {
    if (event.target.matches("[data-close-scheme-modal]")) {
      closeSchemeDetails();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && detailsModal?.classList.contains("active")) {
      closeSchemeDetails();
    }
  });


  // =========================================================
  // CATEGORY NORMALIZATION
  // =========================================================

  function normalizeCategory(category) {
    const value = String(category || "")
      .toLowerCase()
      .trim();

    if (
      value.includes("financial") ||
      value.includes("income") ||
      value.includes("support")
    ) {
      return "income";
    }

    if (value.includes("insurance")) {
      return "insurance";
    }

    if (
      value.includes("credit") ||
      value.includes("loan")
    ) {
      return "credit";
    }

    if (
      value.includes("equipment") ||
      value.includes("mechan")
    ) {
      return "equipment";
    }

    if (value.includes("irrigation")) {
      return "irrigation";
    }

    if (value.includes("horticulture")) {
      return "horticulture";
    }

    if (
      value.includes("livestock") ||
      value.includes("animal")
    ) {
      return "livestock";
    }

    return "other";
  }


  // =========================================================
  // CATEGORY ICON
  // =========================================================

  function getCategoryIcon(category) {
    const normalized = normalizeCategory(category);

    const icons = {
      income: "fa-hand-holding-dollar",
      insurance: "fa-shield-halved",
      credit: "fa-credit-card",
      equipment: "fa-tractor",
      irrigation: "fa-droplet",
      horticulture: "fa-leaf",
      livestock: "fa-cow",
      other: "fa-seedling",
    };

    return icons[normalized] || "fa-seedling";
  }


  // =========================================================
  // GOVERNMENT TYPE
  // =========================================================

  function getGovernmentType(scheme) {
    const government = String(
      scheme.government || ""
    ).toLowerCase();

    if (
      government.includes("maharashtra") ||
      government.includes("state government")
    ) {
      return "maharashtra";
    }

    return "central";
  }


  // =========================================================
  // STATUS
  // =========================================================

  function normalizeStatus(status) {
    const value = String(status || "Available")
      .toLowerCase()
      .trim();

    if (value === "seasonal") {
      return "seasonal";
    }

    if (
      value === "limited" ||
      value === "closed"
    ) {
      return "closed";
    }

    return "active";
  }


  function getStatusLabel(status) {
    const normalized = normalizeStatus(status);

    if (normalized === "seasonal") {
      return "Seasonal";
    }

    if (normalized === "closed") {
      return "Limited";
    }

    return "Available";
  }


  // =========================================================
  // CREATE SCHEME CARD
  // =========================================================

  function createSchemeCard(scheme) {

    const title =
      scheme.title ||
      scheme.name ||
      "Government Scheme";

    const subtitle =
      scheme.subtitle ||
      "";

    const benefit =
      scheme.benefit ||
      "Government support available for eligible farmers.";

    const government =
      scheme.government ||
      "Government";

    const category =
      scheme.category ||
      "Agricultural Support";

    const status =
      normalizeStatus(scheme.status);

    const statusLabel =
      getStatusLabel(scheme.status);

    const icon =
      scheme.icon ||
      getCategoryIcon(category);

    const officialUrl =
      scheme.officialUrl ||
      scheme.sourceUrl ||
      "#";

    const applyUrl =
      scheme.applyUrl ||
      officialUrl;

    const source =
      getGovernmentType(scheme) === "maharashtra"
        ? "Maharashtra Government"
        : "Central Government";


    return `
      <article
        class="scheme-card"
        data-category="${escapeHTML(
          normalizeCategory(category)
        )}"
        data-type="${escapeHTML(
          getGovernmentType(scheme)
        )}"
        data-status="${escapeHTML(status)}"
      >

        <!-- CARD TOP -->

        <div class="scheme-card-top">

          <div class="scheme-icon">
            <i class="fa-solid ${escapeHTML(icon)}"></i>
          </div>

          <div class="scheme-card-actions-top">

            <button
              type="button"
              class="save-btn"
              aria-label="Save scheme"
              title="Save scheme"
            >
              <i class="fa-regular fa-bookmark"></i>
            </button>

          </div>

        </div>


        <!-- META -->

        <div class="scheme-card-meta">

          <span class="scheme-status">

            <span class="status-dot"></span>

            ${escapeHTML(statusLabel)}

          </span>

          <span class="scheme-category">

            ${escapeHTML(category)}

          </span>

          <span class="scheme-source-badge">

            ${escapeHTML(source)}

          </span>

        </div>


        <!-- TITLE -->

        <h3>
          ${escapeHTML(title)}
        </h3>


        <!-- SUBTITLE -->

        ${
          subtitle
            ? `
              <p class="scheme-subtitle">
                ${escapeHTML(subtitle)}
              </p>
            `
            : ""
        }


        <!-- GOVERNMENT -->

        <div class="scheme-match">

          <i class="fa-solid fa-landmark"></i>

          <span>
            ${escapeHTML(government)}
          </span>

        </div>


        <!-- BENEFIT -->

        <div class="scheme-benefit">

          <span>
            KEY BENEFIT
          </span>

          <strong>
            ${escapeHTML(benefit)}
          </strong>

        </div>


        <!-- ACTIONS -->

        <div class="scheme-card-actions">

          <button
            type="button"
            class="details-btn"
            data-scheme-id="${escapeHTML(String(scheme._id || scheme.slug || ""))}"
            aria-label="View details for ${escapeHTML(title)}"
          >

            <i class="fa-solid fa-circle-info"></i>

            View Details

          </button>


          <a
            href="${escapeHTML(safeExternalUrl(applyUrl))}"
            target="_blank"
            rel="noopener noreferrer"
            class="compare-btn"
            title="Apply Now"
            aria-label="Apply Now"
          >

            <i class="fa-solid fa-arrow-up-right-from-square"></i>

          </a>

        </div>

      </article>
    `;
  }


  // =========================================================
  // RENDER
  // =========================================================

  function renderSchemes(list) {

    grid.innerHTML = "";

    if (!Array.isArray(list) || !list.length) {

      grid.style.display = "none";

      if (emptyState) {
        emptyState.style.display = "block";
      }

      if (countElement) {
        countElement.textContent = "0";
      }

      if (resultsText) {
        resultsText.textContent =
          "No government schemes match your search or filters.";
      }

      return;
    }


    grid.style.display = "grid";

    if (emptyState) {
      emptyState.style.display = "none";
    }


    grid.innerHTML = list
      .map(createSchemeCard)
      .join("");


    if (countElement) {
      countElement.textContent = list.length;
    }


    if (resultsText) {

      resultsText.textContent =
        `Showing ${list.length} government scheme${
          list.length === 1 ? "" : "s"
        } for farmers.`;

    }


    // Small reveal animation

    const cards =
      grid.querySelectorAll(".scheme-card");

    cards.forEach((card, index) => {

      card.style.opacity = "0";
      card.style.transform = "translateY(18px)";

      setTimeout(() => {

        card.style.transition =
          "opacity 0.45s ease, transform 0.45s ease";

        card.style.opacity = "1";
        card.style.transform = "translateY(0)";

      }, index * 60);

    });
  }


  // =========================================================
  // FILTER
  // =========================================================

  function filterSchemes() {

    const search =
      String(searchInput?.value || "")
        .toLowerCase()
        .trim();

    const selectedCategory =
      String(categoryFilter?.value || "")
        .toLowerCase();

    const selectedType =
      String(typeFilter?.value || "")
        .toLowerCase();

    const selectedStatus =
      String(statusFilter?.value || "")
        .toLowerCase();


    const filtered =
      schemes.filter((scheme) => {

        // SEARCH

        const searchableText = [

          scheme.name,
          scheme.title,
          scheme.subtitle,
          scheme.benefit,
          scheme.overview,
          scheme.category,
          scheme.government,

          ...(Array.isArray(scheme.tags)
            ? scheme.tags
            : []),

        ]
          .join(" ")
          .toLowerCase();


        const matchesSearch =
          !search ||
          searchableText.includes(search);


        // CATEGORY

        const matchesCategory =
          !selectedCategory ||
          normalizeCategory(
            scheme.category
          ) === selectedCategory;


        // GOVERNMENT TYPE

        const matchesType =
          !selectedType ||
          getGovernmentType(
            scheme
          ) === selectedType;


        // STATUS

        const matchesStatus =
          !selectedStatus ||
          normalizeStatus(
            scheme.status
          ) === selectedStatus;


        return (
          matchesSearch &&
          matchesCategory &&
          matchesType &&
          matchesStatus
        );
      });


    renderSchemes(filtered);
  }


  // =========================================================
  // SEARCH
  // =========================================================

  if (searchInput) {

    searchInput.addEventListener(
      "input",
      filterSchemes
    );

  }


  // =========================================================
  // CLEAR SEARCH BUTTON
  // =========================================================

  if (clearSearchBtn) {

    clearSearchBtn.addEventListener(
      "click",
      () => {

        if (searchInput) {
          searchInput.value = "";
        }

        filterSchemes();

      }
    );

  }


  // =========================================================
  // FILTER EVENTS
  // =========================================================

  if (categoryFilter) {

    categoryFilter.addEventListener(
      "change",
      filterSchemes
    );

  }


  if (typeFilter) {

    typeFilter.addEventListener(
      "change",
      filterSchemes
    );

  }


  if (statusFilter) {

    statusFilter.addEventListener(
      "change",
      filterSchemes
    );

  }


  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  function clearFilters() {

    if (searchInput) {
      searchInput.value = "";
    }

    if (categoryFilter) {
      categoryFilter.value = "";
    }

    if (typeFilter) {
      typeFilter.value = "";
    }

    if (statusFilter) {
      statusFilter.value = "";
    }

    filterSchemes();
  }


  if (clearFiltersBtn) {

    clearFiltersBtn.addEventListener(
      "click",
      clearFilters
    );

  }


  if (emptyClearBtn) {

    emptyClearBtn.addEventListener(
      "click",
      clearFilters
    );

  }


  // =========================================================
  // INITIAL RENDER
  // =========================================================

  renderSchemes(schemes);
});