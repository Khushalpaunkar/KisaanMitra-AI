/* =========================================================
   KISAANMITRA AI — GOVERNMENT SCHEMES
   Complete UI/UX Enhanced JavaScript
========================================================= */


/* =========================================================
   SCHEME DATA
========================================================= */

const normalizeCategory = (category) => {
  const raw = String(category || "financial").toLowerCase().trim();

  if (raw.includes("insurance")) return "insurance";
  if (raw.includes("credit") || raw.includes("loan")) return "loan";
  if (raw.includes("equipment") || raw.includes("mechan")) return "equipment";
  if (raw.includes("irrigation") || raw.includes("drip") || raw.includes("sprinkler")) return "irrigation";
  if (raw.includes("seed") || raw.includes("input") || raw.includes("soil")) return "seeds";
  if (raw.includes("livestock") || raw.includes("animal")) return "livestock";
  if (raw.includes("hortic")) return "horticulture";
  if (raw.includes("financial") || raw.includes("support")) return "financial";

  return raw.replace(/\s+/g, "-");
};

const getCardBackgroundImage = (scheme) => {
  const fallback = "/images/schemes/default-scheme.jpg";
  const image = scheme?.image || fallback;

  if (!image || image.trim() === "") {
    return fallback;
  }

  return image;
};

const schemes = Array.isArray(window.kisaanmitraSchemes)
  ? window.kisaanmitraSchemes.map((scheme) => {
      const normalizedCategory = normalizeCategory(scheme.category);
      const normalizedNeeds = (Array.isArray(scheme.matching?.needs) ? scheme.matching.needs : [])
        .map(item => String(item).trim().toLowerCase())
        .flatMap(item => {
          if (item.includes("support") || item.includes("financial")) return ["financial"];
          if (item.includes("insurance")) return ["insurance"];
          if (item.includes("loan") || item.includes("credit")) return ["loan"];
          if (item.includes("equipment") || item.includes("mechan")) return ["equipment"];
          if (item.includes("irrigation") || item.includes("drip") || item.includes("sprinkler")) return ["irrigation"];
          if (item.includes("seed") || item.includes("input") || item.includes("soil")) return ["seeds"];
          if (item.includes("livestock") || item.includes("animal")) return ["livestock"];
          if (item.includes("hortic")) return ["horticulture"];
          return [item];
        });

      return {
        ...scheme,
        id: scheme.id || scheme.slug || scheme._id || String(scheme.name || "scheme"),
        icon: scheme.icon || "🌾",
        government: scheme.government || "Government",
        source: String(scheme.government || "").toLowerCase().includes("maharashtra") ? "maharashtra" : "central",
        status: String(scheme.status || "Available").toLowerCase() === "seasonal" ? "seasonal" : "available",
        category: normalizedCategory,
        description: scheme.description || scheme.overview || "",
        steps: Array.isArray(scheme.steps) ? scheme.steps : (Array.isArray(scheme.applicationSteps) ? scheme.applicationSteps : []),
        officialLink: scheme.officialUrl || scheme.sourceUrl || "#",
        needs: normalizedNeeds.length ? normalizedNeeds : [normalizedCategory],
      };
    })
  : [];


/* =========================================================
   STATE
========================================================= */

let currentSource = "all";
let currentSearch = "";
let currentCategory = "all";
let currentStatus = "all";
let showAllSchemes = false;

let savedSchemes = loadSavedSchemes();

let compareSchemes = [];
let matchedSchemesData = [];
let toastTimeout = null;


/* =========================================================
   DOM
========================================================= */

const schemeGrid =
  document.getElementById("schemeGrid");

const recommendedGrid =
  document.getElementById("recommendedGrid");

const emptyState =
  document.getElementById("emptyState");

const searchInput =
  document.getElementById("schemeSearch");

const categoryFilter =
  document.getElementById("categoryFilter");

const statusFilter =
  document.getElementById("statusFilter");

const savedCount =
  document.getElementById("savedCount");

const viewAllWrap =
  document.getElementById("viewAllWrap");

const viewAllBtn =
  document.getElementById("viewAllBtn");


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  renderSchemes();

  renderRecommendedSchemes();

  updateSavedCount();

  updateCompareUI();

  setupFinder();

  setupNeedCards();

  setupFAQ();

  setupModal();

  setupSourceFilters();

  setupKeyboardAccessibility();

  setupRevealAnimations();

  updateFilterState();

});


/* =========================================================
   LOCAL STORAGE
========================================================= */

function loadSavedSchemes() {

  try {

    const saved =
      JSON.parse(
        localStorage.getItem(
          "kisaanmitra_saved_schemes"
        )
      );

    if (!Array.isArray(saved)) {
      return [];
    }

    return saved.filter(id =>
      schemes.some(scheme =>
        scheme.id === id
      )
    );

  } catch (error) {

    console.warn(
      "Unable to load saved schemes:",
      error
    );

    return [];

  }

}


function persistSavedSchemes() {

  try {

    localStorage.setItem(
      "kisaanmitra_saved_schemes",
      JSON.stringify(savedSchemes)
    );

  } catch (error) {

    console.warn(
      "Unable to save schemes:",
      error
    );

  }

}


/* =========================================================
   RENDER ALL SCHEMES
========================================================= */

function renderSchemes() {

  if (!schemeGrid) return;

  const filtered =
    getFilteredSchemes();

  schemeGrid.innerHTML = "";

  if (!filtered.length) {

    if (emptyState) {
      emptyState.style.display = "block";
    }

    return;

  }

  if (emptyState) {
    emptyState.style.display = "none";
  }

  const visibleSchemes =
    showAllSchemes ? filtered : filtered.slice(0, 6);

  const fragment =
    document.createDocumentFragment();

  visibleSchemes.forEach(scheme => {

    const wrapper =
      document.createElement("div");

    wrapper.innerHTML =
      createSchemeCard(scheme);

    fragment.appendChild(
      wrapper.firstElementChild
    );

  });

  schemeGrid.appendChild(fragment);

  if (viewAllWrap) {
    viewAllWrap.style.display = "flex";
    if (viewAllBtn) {
      viewAllBtn.textContent = "View All Schemes →";
    }
  }

  animateNewCards();

}


/* =========================================================
   FILTER
========================================================= */

function getFilteredSchemes() {

  return schemes.filter(scheme => {

    const search =
      currentSearch.toLowerCase();

    const searchableText = [

      scheme.title,
      scheme.subtitle,
      scheme.category,
      scheme.government,
      scheme.description,
      scheme.benefit

    ]
      .join(" ")
      .toLowerCase();


    const searchMatch =
      !search ||
      searchableText.includes(search);


    const categoryMatch =
      currentCategory === "all" ||
      scheme.category === currentCategory;


    const statusMatch =
      currentStatus === "all" ||
      scheme.status === currentStatus;


    const sourceMatch =
      currentSource === "all" ||
      scheme.source === currentSource;


    return (
      searchMatch &&
      categoryMatch &&
      statusMatch &&
      sourceMatch
    );

  });

}


/* =========================================================
   RECOMMENDED
========================================================= */

function renderRecommendedSchemes(need = null) {

  if (!recommendedGrid) return;

  let recommended = schemes;


  if (need) {

    recommended =
      schemes.filter(scheme =>
        scheme.needs.includes(need)
      );

  }


  recommended =
    recommended.slice(0, 3);


  recommendedGrid.innerHTML = "";


  if (!recommended.length) {

    recommendedGrid.innerHTML = `
      <div class="recommendation-empty">
        <i class="fa-solid fa-circle-info"></i>
        <p>या गरजेसाठी सध्या संबंधित योजना सापडली नाही.</p>
      </div>
    `;

    return;

  }


  recommended.forEach(scheme => {

    recommendedGrid.insertAdjacentHTML(
      "beforeend",
      createSchemeCard(
        scheme,
        Boolean(need)
      )
    );

  });

  animateNewCards();

}


/* =========================================================
   CARD
========================================================= */

function createSchemeCard(
  scheme,
  recommended = false
) {

  const isSaved =
    savedSchemes.includes(scheme.id);

  const isCompared =
    compareSchemes.includes(scheme.id);


  const statusText =
    scheme.status === "seasonal"
      ? "Seasonal"
      : "Currently Available";


  const sourceText =
    scheme.source === "maharashtra"
      ? "Maharashtra"
      : "Central";


  const categoryName =
    getCategoryName(
      scheme.category
    );

  const cardBackground = getCardBackgroundImage(scheme);


  return `

    <article
      class="scheme-card ${recommended ? "recommended-card" : ""}"
      data-scheme-id="${scheme.id}"
      style="background-image: url('${cardBackground}');"
    >

      <div class="scheme-card-overlay"></div>

      <div class="scheme-card-content">

        <div class="scheme-card-top">

          <div class="scheme-icon">
            ${scheme.icon}
          </div>

          <div class="scheme-card-actions-top">

            <span class="scheme-source-badge">
              <i class="fa-solid fa-building-columns"></i>
              ${sourceText}
            </span>

            <button
              type="button"
              class="save-btn ${isSaved ? "saved" : ""}"
              onclick="toggleSave('${scheme.id}')"
              aria-label="${isSaved ? "Remove saved scheme" : "Save scheme"}"
              title="${isSaved ? "Remove from saved" : "Save scheme"}"
            >

              <i class="fa-${isSaved ? "solid" : "regular"} fa-bookmark"></i>

            </button>

          </div>

        </div>


        <div class="scheme-card-meta">

          <span class="scheme-status ${scheme.status}">
            <span class="status-dot"></span>
            ${statusText}
          </span>

          <span class="scheme-category">
            ${categoryName}
          </span>

        </div>


        <h3>
          ${scheme.title || scheme.name}
        </h3>


        <p class="scheme-subtitle">
          ${scheme.subtitle || scheme.government || "Government scheme"}
        </p>


        <div class="scheme-benefit">

          <span>
            <i class="fa-solid fa-hand-holding-heart"></i>
            Benefit / Support
          </span>

          <strong>
            ${scheme.benefit}
          </strong>

        </div>


        ${
          recommended
            ? `

              <div class="scheme-match">

                <i class="fa-solid fa-circle-check"></i>

                <div>
                  <strong>KisaanMitra Suggests</strong>
                  <span>
                    Relevant based on your selected need
                  </span>
                </div>

              </div>

            `
            : ""
        }


        <div class="scheme-card-actions">

          <button
            type="button"
            class="details-btn"
            onclick="openSchemeModal('${scheme.id}')"
          >
            View Details
            <i class="fa-solid fa-arrow-right"></i>
          </button>


          <button
            type="button"
            class="compare-btn ${isCompared ? "active" : ""}"
            onclick="toggleCompare('${scheme.id}')"
            aria-label="Compare scheme"
            title="${isCompared ? "Remove from comparison" : "Add to comparison"}"
          >
            <i class="fa-solid fa-scale-balanced"></i>
          </button>

        </div>

      </div>

    </article>

  `;

}


/* =========================================================
   SAVE
========================================================= */

function toggleSave(id) {

  const scheme =
    schemes.find(
      item => item.id === id
    );

  if (!scheme) return;


  const wasSaved =
    savedSchemes.includes(id);


  if (wasSaved) {

    savedSchemes =
      savedSchemes.filter(
        item => item !== id
      );

    showToast(
      "योजना saved list मधून remove केली"
    );

  } else {

    savedSchemes.push(id);

    showToast(
      "योजना saved list मध्ये add केली ✓"
    );

  }


  persistSavedSchemes();

  updateSavedCount();

  renderSchemes();

  renderRecommendedSchemes();

  pulseSavedCount();

}


/* =========================================================
   SAVED COUNT
========================================================= */

function updateSavedCount() {

  if (!savedCount) return;

  savedCount.textContent =
    savedSchemes.length;

}


function pulseSavedCount() {

  if (!savedCount) return;

  savedCount.classList.remove(
    "count-pulse"
  );

  void savedCount.offsetWidth;

  savedCount.classList.add(
    "count-pulse"
  );

}


/* =========================================================
   COMPARE
========================================================= */

function toggleCompare(id) {

  const scheme =
    schemes.find(
      item => item.id === id
    );

  if (!scheme) return;


  if (compareSchemes.includes(id)) {

    compareSchemes =
      compareSchemes.filter(
        item => item !== id
      );

    showToast(
      "योजना comparison मधून remove केली"
    );

  } else {

    if (compareSchemes.length >= 3) {

      showToast(
        "Maximum 3 schemes compare करू शकता"
      );

      return;

    }


    compareSchemes.push(id);

    showToast(
      "योजना comparison मध्ये add केली ✓"
    );

  }


  renderSchemes();

  renderRecommendedSchemes();

  updateCompareUI();

}


/* =========================================================
   COMPARE UI
========================================================= */

function updateCompareUI() {

  const empty =
    document.getElementById(
      "compareEmpty"
    );

  const table =
    document.getElementById(
      "compareTableWrap"
    );


  if (!empty || !table) {
    return;
  }


  if (!compareSchemes.length) {

    empty.style.display =
      "block";

    table.style.display =
      "none";

    return;

  }


  empty.style.display =
    "none";

  table.style.display =
    "block";


  const selected =
    compareSchemes
      .map(id =>
        schemes.find(
          scheme =>
            scheme.id === id
        )
      )
      .filter(Boolean);


  for (
    let i = 1;
    i <= 3;
    i++
  ) {

    const scheme =
      selected[i - 1];


    const name =
      document.getElementById(
        `compareName${i}`
      );

    const category =
      document.getElementById(
        `compareCategory${i}`
      );

    const government =
      document.getElementById(
        `compareGov${i}`
      );

    const benefit =
      document.getElementById(
        `compareBenefit${i}`
      );

    const eligibility =
      document.getElementById(
        `compareEligibility${i}`
      );

    const docs =
      document.getElementById(
        `compareDocs${i}`
      );


    if (name) {
      name.textContent =
        scheme
          ? scheme.title
          : "—";
    }


    if (category) {
      category.textContent =
        scheme
          ? getCategoryName(
              scheme.category
            )
          : "—";
    }


    if (government) {
      government.textContent =
        scheme
          ? scheme.government
          : "—";
    }


    if (benefit) {
      benefit.textContent =
        scheme
          ? scheme.benefit
          : "—";
    }


    if (eligibility) {
      eligibility.textContent =
        scheme
          ? `${scheme.eligibility.length} key conditions`
          : "—";
    }


    if (docs) {
      docs.textContent =
        scheme
          ? `${scheme.documents.length} document types`
          : "—";
    }

  }

}


/* =========================================================
   SEARCH
========================================================= */

if (searchInput) {

  searchInput.addEventListener(
    "input",
    event => {

      currentSearch =
        event.target.value.trim();

      renderSchemes();

      updateFilterState();

    }
  );

}


/* =========================================================
   CATEGORY FILTER
========================================================= */

if (categoryFilter) {

  categoryFilter.addEventListener(
    "change",
    event => {

      currentCategory =
        event.target.value;

      renderSchemes();

      updateFilterState();

    }
  );

}


/* =========================================================
   STATUS FILTER
========================================================= */

if (statusFilter) {

  statusFilter.addEventListener(
    "change",
    event => {

      currentStatus =
        event.target.value;
      showAllSchemes = false;

      renderSchemes();

      updateFilterState();

    }
  );

}

if (viewAllBtn) {
  viewAllBtn.addEventListener("click", () => {
    showAllSchemes = !showAllSchemes;
    renderSchemes();
  });
}


/* =========================================================
   SOURCE FILTER
========================================================= */

function setupSourceFilters() {

  const sourceButtons =
    document.querySelectorAll(
      "[data-source]"
    );


  sourceButtons.forEach(button => {

    button.addEventListener(
      "click",
      () => {

        sourceButtons.forEach(item =>
          item.classList.remove(
            "active"
          )
        );


        button.classList.add(
          "active"
        );


        currentSource =
          button.dataset.source ||
          "all";


        renderSchemes();

      }
    );

  });

}


/* =========================================================
   FILTER STATE
========================================================= */

function updateFilterState() {

  const hasFilters =
    Boolean(
      currentSearch ||
      currentCategory !== "all" ||
      currentStatus !== "all" ||
      currentSource !== "all"
    );


  const clearButton =
    document.querySelector(
      ".clear-filters-btn"
    );


  if (clearButton) {

    clearButton.classList.toggle(
      "visible",
      hasFilters
    );

  }

}


/* =========================================================
   NEED CARDS
========================================================= */

function setupNeedCards() {

  const cards =
    document.querySelectorAll(
      ".need-card"
    );


  cards.forEach(card => {

    card.addEventListener(
      "click",
      () => {

        cards.forEach(item =>
          item.classList.remove(
            "selected"
          )
        );


        card.classList.add(
          "selected"
        );


        const need =
          card.dataset.need;


        renderRecommendedSchemes(
          need
        );


        const summary =
          document.getElementById(
            "recommendationSummary"
          );


        if (summary) {

          summary.textContent =
            `तुमच्या ${getCategoryName(
              need
            )} गरजेनुसार संबंधित योजना दाखवत आहोत.`;

        }


        document
          .getElementById(
            "recommendedSection"
          )
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

      }
    );

  });

}


/* =========================================================
   FINDER
========================================================= */

function setupFinder() {

  document
    .querySelectorAll(
      ".finder-next"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const nextStep =
            Number(
              button.dataset.next
            );


          if (
            !validateStep(
              nextStep - 1
            )
          ) {

            return;

          }


          showFinderStep(
            nextStep
          );

        }
      );

    });


  document
    .querySelectorAll(
      ".finder-back"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          showFinderStep(
            Number(
              button.dataset.back
            )
          );

        }
      );

    });


  const analyzeBtn =
    document.getElementById(
      "analyzeBtn"
    );


  if (analyzeBtn) {

    analyzeBtn.addEventListener(
      "click",
      startAnalysis
    );

  }

}


/* =========================================================
   FINDER VALIDATION
========================================================= */

function validateStep(step) {

  if (step === 1) {

    const state =
      document.getElementById(
        "state"
      )?.value;

    const district =
      document.getElementById(
        "district"
      )?.value.trim();


    if (!state || !district) {

      showToast(
        "कृपया State आणि District भरा"
      );

      return false;

    }

  }


  if (step === 2) {

    const area =
      document.getElementById(
        "landArea"
      )?.value;

    const crop =
      document.getElementById(
        "crop"
      )?.value.trim();


    if (!area || !crop) {

      showToast(
        "कृपया Land Area आणि Main Crop भरा"
      );

      return false;

    }

  }


  return true;

}


/* =========================================================
   SHOW FINDER STEP
========================================================= */

function showFinderStep(step) {

  const steps =
    document.querySelectorAll(
      ".finder-step"
    );


  steps.forEach(item => {

    item.classList.remove(
      "active"
    );


    if (
      Number(
        item.dataset.step
      ) === step
    ) {

      item.classList.add(
        "active"
      );

    }

  });


  const stepNumber =
    document.getElementById(
      "stepNumber"
    );


  if (stepNumber) {

    stepNumber.textContent =
      step;

  }


  const stepIndicators =
    document.querySelectorAll(
      ".step-number"
    );


  stepIndicators.forEach(
    (indicator, index) => {

      indicator.classList.toggle(
        "active",
        index + 1 === step
      );

      indicator.classList.toggle(
        "completed",
        index + 1 < step
      );

    }
  );

}


/* =========================================================
   ANALYSIS
========================================================= */

async function startAnalysis() {
  const state = document.getElementById("state")?.value.trim() || "";
  const district = document.getElementById("district")?.value.trim() || "";
  const taluka = document.getElementById("taluka")?.value.trim() || "";
  const village = document.getElementById("village")?.value.trim() || "";

  const landArea = document.getElementById("landArea")?.value || "";
  const landType = document.getElementById("landType")?.value || "";

  const crop = document.getElementById("crop")?.value.trim() || "";
  const irrigation = document.getElementById("irrigation")?.value || "";

  const selectedNeed = document.querySelector(
    'input[name="supportNeed"]:checked'
  );

  const supportNeed = selectedNeed?.value || "";

  // -----------------------------
  // Basic Validation
  // -----------------------------

  if (!state || !district) {
    showToast("Please enter your state and district.");
    return;
  }

  if (!landArea || Number(landArea) <= 0 || !crop) {
    showToast("Please enter land area and crop.");
    return;
  }

  if (!supportNeed) {
    showToast("Please select what type of support you need.");
    return;
  }

  // -----------------------------
  // Farmer Profile
  // -----------------------------

  const farmerData = {
    state,
    district,
    taluka,
    village,

    landArea: Number(landArea),
    landType,

    crop,
    irrigation,

    supportNeed,
  };

  console.log("Sending farmer data:", farmerData);

  // -----------------------------
  // Show Analysis Loader
  // -----------------------------

  const loader = document.getElementById("analysisLoader");
  const progressBar = document.getElementById("analysisProgressBar");
  const analysisText = document.getElementById("analysisText");

  if (loader) {
    loader.classList.add("active");
  }

  if (progressBar) {
    progressBar.style.width = "10%";
  }

  if (analysisText) {
    analysisText.textContent = "Analyzing your farmer profile...";
  }

  // -----------------------------
  // Small Loading Animation
  // -----------------------------

  let progress = 10;

  const progressInterval = setInterval(() => {
    if (progress < 85) {
      progress += 10;

      if (progressBar) {
        progressBar.style.width = `${progress}%`;
      }
    }
  }, 300);

  // -----------------------------
  // Send Data to Backend
  // -----------------------------

  try {
    const response = await fetch("/findschemes/analyze", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(farmerData),
    });

    const data = await response.json();

    clearInterval(progressInterval);

    console.log("Backend response:", data);

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Unable to find matching government schemes."
      );
    }

    // -----------------------------
    // Analysis Complete
    // -----------------------------

    if (progressBar) {
      progressBar.style.width = "100%";
    }

    if (analysisText) {
      analysisText.textContent =
        "Matching government schemes for you ✓";
    }

    // -----------------------------
    // Display Results
    // -----------------------------

    setTimeout(() => {
      if (loader) {
        loader.classList.remove("active");
      }

      // Show result step
      document
        .querySelectorAll(".finder-step")
        .forEach((step) => {
          step.style.display = "";
        });

      showFinderStep(3);

      // Render backend results
      renderMatchedSchemes(data.results || []);

      // Result count
      const count = document.getElementById("recommendationCount");

      if (count) {
        count.textContent = `${data.totalResults || 0} Schemes`;
      }

      // Summary
      const summary = document.getElementById(
        "recommendationSummary"
      );

      if (summary) {
        if (data.totalResults > 0) {
          summary.textContent =
            `Based on your ${crop} farming profile and ${getCategoryName(
              supportNeed
            )} requirement, we found ${
              data.totalResults
            } relevant government schemes.`;
        } else {
          summary.textContent =
            "No highly matching schemes were found based on the information provided.";
        }
      }

      // Scroll to recommendations
      const recommendationSection =
        document.getElementById("recommendedSection");

      if (recommendationSection) {
        recommendationSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      if (data.totalResults > 0) {
        showToast("Relevant government schemes found ✓");
      } else {
        showToast("No highly matching schemes found.");
      }
    }, 700);
  } catch (error) {
    clearInterval(progressInterval);

    console.error("Find Schemes Error:", error);

    if (loader) {
      loader.classList.remove("active");
    }

    document
      .querySelectorAll(".finder-step")
      .forEach((step) => {
        step.style.display = "";
      });

    showFinderStep(3);

    showToast(
      error.message ||
        "Scheme matching failed. Please try again."
    );
  }
}



function renderMatchedSchemes(results) {
  const grid = document.getElementById("recommendedGrid");
  const section = document.getElementById("recommendedSection");

  if (!grid) {
    console.error("recommendedGrid element not found.");
    return;
  }

  // -------------------------------------------------
  // Sort by highest match score
  // -------------------------------------------------

  const topMatchedSchemes = Array.isArray(results)
    ? results
        .slice()
        .sort((a, b) => {
          const scoreA = Number(
            a.matchPercentage || a.score || 0
          );

          const scoreB = Number(
            b.matchPercentage || b.score || 0
          );

          return scoreB - scoreA;
        })
        .slice(0, 6)
    : [];

  // Store ONLY displayed schemes
  // for View Details modal
  matchedSchemesData = topMatchedSchemes;

  // Clear previous results
  grid.innerHTML = "";

  // -------------------------------------------------
  // No results
  // -------------------------------------------------

  if (!topMatchedSchemes.length) {
    grid.innerHTML = `
      <div class="no-schemes-found">

        <div class="no-schemes-icon">
          <i class="fa-solid fa-seedling"></i>
        </div>

        <h3>No Matching Schemes Found</h3>

        <p>
          No government scheme closely matches your
          farming profile and selected requirement.
        </p>

      </div>
    `;

    if (section) {
      section.style.display = "block";
    }

    return;
  }

  // -------------------------------------------------
  // Render TOP 6 matched schemes
  // -------------------------------------------------

  topMatchedSchemes.forEach((scheme) => {
    const card = createMatchedSchemeCard(scheme);

    grid.insertAdjacentHTML(
      "beforeend",
      card
    );
  });

  // -------------------------------------------------
  // Show section
  // -------------------------------------------------

  if (section) {
    section.style.display = "block";
  }

  // -------------------------------------------------
  // Animation
  // -------------------------------------------------

  animateNewCards();

  console.log(
    `Showing top ${topMatchedSchemes.length} schemes out of ${results.length} matched schemes.`
  );
}



function createMatchedSchemeCard(scheme) {
  const schemeId = scheme._id || scheme.id || "";

  const title =
    scheme.title ||
    scheme.name ||
    "Government Scheme";

  const government =
    scheme.government ||
    "Government of India";

  const benefit =
    scheme.benefit ||
    "Government support available for eligible farmers.";

  const category =
    scheme.category ||
    "Agricultural Support";

  const score =
    Number(scheme.matchPercentage || scheme.score || 0);

  const reasons = Array.isArray(scheme.reasons)
    ? scheme.reasons
    : [];

  const reasonHTML = reasons.length
    ? reasons
        .slice(0, 3)
        .map(
          (reason) => `
            <span class="match-reason">
              <i class="fa-solid fa-check"></i>
              ${escapeHTML(reason)}
            </span>
          `
        )
        .join("")
    : `
        <span class="match-reason">
          <i class="fa-solid fa-check"></i>
          Profile matched
        </span>
      `;

  return `
    <article class="matched-scheme-card">

      <div class="matched-card-top">

        <div class="scheme-category">
          ${escapeHTML(category)}
        </div>

        <div class="match-score">
          <i class="fa-solid fa-circle-check"></i>
          ${score}% Match
        </div>

      </div>

      <div class="matched-card-body">

        <h3 class="matched-scheme-title">
          ${escapeHTML(title)}
        </h3>

        <p class="matched-government">
          <i class="fa-solid fa-building-columns"></i>
          ${escapeHTML(government)}
        </p>

        <p class="matched-benefit">
          ${escapeHTML(benefit)}
        </p>

        <div class="match-reasons">
          ${reasonHTML}
        </div>

      </div>

      <div class="matched-card-footer">

        <button
          type="button"
          class="matched-details-btn"
          onclick="openMatchedSchemeModal('${escapeHTML(String(schemeId))}')"
        >
          <i class="fa-solid fa-circle-info"></i>
          View Details
        </button>

        ${
          scheme.officialUrl
            ? `
              <a
                href="${escapeHTML(scheme.officialUrl)}"
                target="_blank"
                rel="noopener noreferrer"
                class="matched-official-btn"
              >
                Official Website
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
              </a>
            `
            : ""
        }

      </div>

    </article>
  `;
}




function openMatchedSchemeModal(id) {

  const scheme = matchedSchemesData.find(
    item =>
      String(item._id || item.id || item.slug) === String(id)
  );

  if (!scheme) {
    console.error("Matched scheme not found:", id);
    showToast("Scheme details not found.");
    return;
  }

  const modal =
    document.getElementById("schemeModal");

  if (!modal) {
    console.error("schemeModal not found.");
    return;
  }

  // -----------------------------
  // Basic Details
  // -----------------------------

  setText(
    "modalIcon",
    scheme.icon || "🌾"
  );

  setText(
    "modalCategory",
    getCategoryName(
      normalizeCategory(scheme.category)
    )
  );

  setText(
    "modalTitle",
    scheme.title || scheme.name || "Government Scheme"
  );

  setText(
    "modalGovernment",
    scheme.government || "Government"
  );

  setText(
    "modalBenefit",
    scheme.benefit || "Government support available."
  );

  setText(
    "modalDescription",
    scheme.overview ||
    scheme.description ||
    "Details about this government scheme."
  );


  // -----------------------------
  // Eligibility
  // -----------------------------

  const eligibility =
    document.getElementById("modalEligibility");

  if (eligibility) {

    const items = Array.isArray(scheme.eligibility)
      ? scheme.eligibility
      : [];

    eligibility.innerHTML =
      items.length
        ? items.map(item => `
            <li>
              <i class="fa-solid fa-check"></i>
              <span>${escapeHTML(item)}</span>
            </li>
          `).join("")
        : `
            <li>
              <i class="fa-solid fa-check"></i>
              <span>Check eligibility on the official government portal.</span>
            </li>
          `;
  }


  // -----------------------------
  // Documents
  // -----------------------------

  const documents =
    document.getElementById("modalDocuments");

  if (documents) {

    const items = Array.isArray(scheme.documents)
      ? scheme.documents
      : [];

    documents.innerHTML =
      items.length
        ? items.map(item => `
            <li>
              <i class="fa-solid fa-file-lines"></i>
              <span>${escapeHTML(item)}</span>
            </li>
          `).join("")
        : `
            <li>
              <i class="fa-solid fa-file-lines"></i>
              <span>Check the official portal for required documents.</span>
            </li>
          `;
  }


  // -----------------------------
  // Application Steps
  // -----------------------------

  const steps =
    document.getElementById("modalSteps");

  if (steps) {

    const items = Array.isArray(scheme.applicationSteps)
      ? scheme.applicationSteps
      : Array.isArray(scheme.steps)
        ? scheme.steps
        : [];

    steps.innerHTML =
      items.length
        ? items.map((step, index) => `
            <div class="application-step">

              <span class="application-step-number">
                ${index + 1}
              </span>

              <div>
                <strong>
                  ${escapeHTML(step)}
                </strong>

                <p>
                  Follow the applicable official process.
                </p>
              </div>

            </div>
          `).join("")
        : `
            <div class="application-step">

              <span class="application-step-number">
                1
              </span>

              <div>
                <strong>
                  Visit the official government portal
                </strong>

                <p>
                  Check the latest application process and eligibility.
                </p>
              </div>

            </div>
          `;
  }


  // -----------------------------
  // Official Website
  // -----------------------------

  const officialLink =
    document.getElementById("modalOfficialLink");

  const officialUrl =
    scheme.officialUrl ||
    scheme.sourceUrl ||
    "#";

  if (officialLink) {

    officialLink.href = officialUrl;

    officialLink.target = "_blank";

    officialLink.rel =
      "noopener noreferrer";

  }


  // -----------------------------
  // Open Modal
  // -----------------------------

  modal.classList.add("active");

  modal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add(
    "modal-open"
  );

  document.body.style.overflow = "hidden";
}



/* =========================================================
   FINISH ANALYSIS
========================================================= */

function finishAnalysis(need) {

  const loader =
    document.getElementById(
      "analysisLoader"
    );


  if (loader) {

    loader.classList.remove(
      "active"
    );

  }


  document
    .querySelectorAll(
      ".finder-step"
    )
    .forEach(
      step =>
        step.style.display =
          ""
    );


  showFinderStep(3);


  renderRecommendedSchemes(
    need
  );


  const summary =
    document.getElementById(
      "recommendationSummary"
    );


  if (summary) {

    summary.textContent =
      `तुमच्या ${getCategoryName(
        need
      )} गरजेनुसार संबंधित योजना दाखवत आहोत.`;

  }


  const recommendationSection =
    document.getElementById(
      "recommendedSection"
    );


  if (recommendationSection) {

    setTimeout(() => {

      recommendationSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }, 200);

  }


  showToast(
    "तुमच्यासाठी संबंधित योजना शोधल्या ✓"
  );

}


/* =========================================================
   CATEGORY NAMES
========================================================= */

function getCategoryName(
  category
) {

  const names = {

    financial: "आर्थिक मदत",

    insurance: "पीक विमा",

    loan: "कर्ज",

    equipment: "शेती उपकरणे",

    irrigation: "सिंचन",

    seeds: "बियाणे / Inputs",

    livestock: "पशुपालन",

    horticulture: "फळबाग"

  };


  return (
    names[category] ||
    "शेती"
  );

}


/* =========================================================
   MODAL
========================================================= */

function setupModal() {

  const close =
    document.getElementById(
      "modalClose"
    );


  const overlay =
    document.getElementById(
      "modalOverlay"
    );


  close?.addEventListener(
    "click",
    closeSchemeModal
  );


  overlay?.addEventListener(
    "click",
    closeSchemeModal
  );


  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape"
      ) {

        closeSchemeModal();

      }

    }
  );

}


function openSchemeModal(id) {

  const scheme =
    schemes.find(
      item =>
        item.id === id
    );


  if (!scheme) return;


  const modal =
    document.getElementById(
      "schemeModal"
    );


  if (!modal) return;


  setText(
    "modalIcon",
    scheme.icon
  );


  setText(
    "modalCategory",
    getCategoryName(
      scheme.category
    )
  );


  setText(
    "modalTitle",
    scheme.title
  );


  setText(
    "modalGovernment",
    scheme.government
  );


  setText(
    "modalBenefit",
    scheme.benefit
  );


  setText(
    "modalDescription",
    scheme.description
  );


  const eligibility =
    document.getElementById(
      "modalEligibility"
    );


  if (eligibility) {

    eligibility.innerHTML =
      scheme.eligibility
        .map(
          item => `
            <li>
              <i class="fa-solid fa-check"></i>
              <span>${escapeHTML(item)}</span>
            </li>
          `
        )
        .join("");

  }


  const documents =
    document.getElementById(
      "modalDocuments"
    );


  if (documents) {

    documents.innerHTML =
      scheme.documents
        .map(
          item => `
            <li>
              <i class="fa-solid fa-file-lines"></i>
              <span>${escapeHTML(item)}</span>
            </li>
          `
        )
        .join("");

  }


  const steps =
    document.getElementById(
      "modalSteps"
    );


  if (steps) {

    steps.innerHTML =
      scheme.steps
        .map(
          (step, index) => `

            <div class="application-step">

              <span class="application-step-number">
                ${index + 1}
              </span>

              <div>

                <strong>
                  ${escapeHTML(step)}
                </strong>

                <p>
                  Follow the applicable official process.
                </p>

              </div>

            </div>

          `
        )
        .join("");

  }


  const officialLink =
    document.getElementById(
      "modalOfficialLink"
    );


  if (officialLink) {

    officialLink.href =
      scheme.officialLink;

    officialLink.target =
      "_blank";

    officialLink.rel =
      "noopener noreferrer";

  }


  const saveModalButton =
    document.getElementById(
      "modalSaveBtn"
    );


  if (saveModalButton) {

    saveModalButton.onclick =
      () =>
        toggleSave(
          scheme.id
        );

  }


  modal.classList.add(
    "active"
  );


  modal.setAttribute(
    "aria-hidden",
    "false"
  );


  document.body.classList.add(
    "modal-open"
  );


  document.body.style.overflow =
    "hidden";

}


function closeSchemeModal() {

  const modal =
    document.getElementById(
      "schemeModal"
    );


  if (!modal) return;


  modal.classList.remove(
    "active"
  );


  modal.setAttribute(
    "aria-hidden",
    "true"
  );


  document.body.classList.remove(
    "modal-open"
  );


  document.body.style.overflow =
    "";

}


/* =========================================================
   SAFE TEXT HELPER
========================================================= */

function setText(
  id,
  value
) {

  const element =
    document.getElementById(id);

  if (element) {

    element.textContent =
      value;

  }

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

  return String(value)
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}


/* =========================================================
   FAQ
========================================================= */

function setupFAQ() {

  document
    .querySelectorAll(
      ".faq-question"
    )
    .forEach(question => {

      question.addEventListener(
        "click",
        () => {

          const item =
            question.closest(
              ".faq-item"
            );


          if (!item) return;


          const answer =
            item.querySelector(
              ".faq-answer"
            );


          const isOpen =
            item.classList.contains(
              "open"
            );


          document
            .querySelectorAll(
              ".faq-item"
            )
            .forEach(other => {

              other.classList.remove(
                "open"
              );


              const otherAnswer =
                other.querySelector(
                  ".faq-answer"
                );


              if (otherAnswer) {

                otherAnswer.style.maxHeight =
                  null;

              }

            });


          if (!isOpen && answer) {

            item.classList.add(
              "open"
            );


            answer.style.maxHeight =
              answer.scrollHeight +
              "px";

          }

        }
      );

    });

}


/* =========================================================
   SCROLL HELPERS
========================================================= */

function scrollToFinder() {

  const finder =
    document.getElementById(
      "schemeFinder"
    );


  if (finder) {

    finder.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    return;

  }


  window.location.href =
    "/finderschemen";

}


function scrollToSchemes() {

  document
    .getElementById(
      "allSchemes"
    )
    ?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

}


/* =========================================================
   CLEAR FILTERS
========================================================= */

function clearFilters() {

  currentSearch = "";

  currentCategory =
    "all";

  currentStatus =
    "all";

  currentSource =
    "all";

  showAllSchemes = false;


  if (searchInput) {

    searchInput.value =
      "";

  }


  if (categoryFilter) {

    categoryFilter.value =
      "all";

  }


  if (statusFilter) {

    statusFilter.value =
      "all";

  }


  document
    .querySelectorAll(
      "[data-source]"
    )
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.source ===
          "all"
      );

    });


  renderSchemes();

  updateFilterState();


  showToast(
    "सर्व filters clear केले ✓"
  );

}


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

  const toast =
    document.getElementById(
      "schemeToast"
    );


  const messageElement =
    document.getElementById(
      "toastMessage"
    );


  if (
    !toast ||
    !messageElement
  ) {

    return;

  }


  messageElement.textContent =
    message;


  toast.classList.remove(
    "show"
  );


  void toast.offsetWidth;


  toast.classList.add(
    "show"
  );


  clearTimeout(
    toastTimeout
  );


  toastTimeout =
    setTimeout(
      () => {

        toast.classList.remove(
          "show"
        );

      },
      2800
    );

}


/* =========================================================
   CARD ANIMATION
========================================================= */

function animateNewCards() {

  const cards =
    document.querySelectorAll(
      ".scheme-card, .matched-scheme-card"
    );

  cards.forEach(
    (card, index) => {

      card.style.animationDelay =
        `${Math.min(index * 60, 300)}ms`;

    }
  );

}


/* =========================================================
   SCROLL REVEAL
========================================================= */

function setupRevealAnimations() {

  const elements =
    document.querySelectorAll(
       ".need-card, .scheme-card, .matched-scheme-card, .faq-item, .ai-finder-section"
    );


  if (
    !("IntersectionObserver" in window)
  ) {

    return;

  }


  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (
            entry.isIntersecting
          ) {

            entry.target.classList.add(
              "reveal-visible"
            );

            observer.unobserve(
              entry.target
            );

          }

        });

      },
      {
        threshold: 0.08
      }
    );


  elements.forEach(element => {

    element.classList.add(
      "reveal-ready"
    );

    observer.observe(
      element
    );

  });

}


/* =========================================================
   KEYBOARD ACCESSIBILITY
========================================================= */

function setupKeyboardAccessibility() {

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key !== "Enter" &&
        event.key !== " "
      ) {

        return;

      }


      const activeElement =
        document.activeElement;


      if (
        activeElement?.classList.contains(
          "need-card"
        )
      ) {

        event.preventDefault();

        activeElement.click();

      }

    }
  );

}


/* =========================================================
   GLOBAL FUNCTIONS
========================================================= */

window.openSchemeModal =
  openSchemeModal;

window.openMatchedSchemeModal =
  openMatchedSchemeModal;

window.closeSchemeModal =
  closeSchemeModal;

window.toggleSave =
  toggleSave;

window.toggleCompare =
  toggleCompare;

window.scrollToFinder =
  scrollToFinder;

window.scrollToSchemes =
  scrollToSchemes;

window.clearFilters =
  clearFilters;

window.showToast =
  showToast;