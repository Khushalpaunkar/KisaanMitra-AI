/* =========================================================
   KISAANMITRA AI — GOVERNMENT SCHEMES JS
========================================================= */


/* =========================================================
   DEMO SCHEME DATA
   Later this can come from MongoDB / API
========================================================= */

const schemes = [

  {
    id: "pm-kisan",
    title: "प्रधानमंत्री किसान सन्मान निधी",
    subtitle: "PM-KISAN",
    icon: "🌾",

    category: "financial",
    government: "Central Government",
    source: "central",

    status: "available",

    benefit: "Financial support as per current scheme rules",

    description:
      "Eligible farmer families can receive financial support under the scheme. Final eligibility and benefit should always be verified from the official government portal.",

    eligibility: [
      "Farmer eligibility conditions must be satisfied",
      "Required land and beneficiary records should be available",
      "Details should match official government records"
    ],

    documents: [
      "Aadhaar / identity document",
      "Land or farmer record",
      "Bank account details",
      "Other documents as required by the official portal"
    ],

    steps: [
      "Check your eligibility",
      "Keep required documents ready",
      "Visit the official government portal",
      "Submit or update the required information",
      "Track the application / beneficiary status"
    ],

    officialLink: "https://pmkisan.gov.in",

    needs: ["financial"]
  },


  {
    id: "crop-insurance",
    title: "प्रधानमंत्री पीक विमा योजना",
    subtitle: "Crop Insurance Support",
    icon: "🛡️",

    category: "insurance",
    government: "Central Government",
    source: "central",

    status: "seasonal",

    benefit: "Crop insurance protection according to notified rules",

    description:
      "This scheme provides crop insurance support against specified crop and weather related risks according to notified guidelines and applicable season conditions.",

    eligibility: [
      "Crop and area should fall under notified conditions",
      "Farmer must satisfy applicable enrolment requirements",
      "Application must follow the notified crop season"
    ],

    documents: [
      "Identity document",
      "Bank account details",
      "Land / cultivation record",
      "Crop details"
    ],

    steps: [
      "Check whether your crop and area are notified",
      "Check the current season deadline",
      "Keep farmer and crop documents ready",
      "Apply through the authorised channel",
      "Keep acknowledgement for future reference"
    ],

    officialLink: "https://pmfby.gov.in",

    needs: ["insurance"]
  },


  {
    id: "kcc",
    title: "Kisan Credit Card",
    subtitle: "Agricultural Credit Support",
    icon: "🏦",

    category: "loan",
    government: "Central Government",
    source: "central",

    status: "available",

    benefit: "Agricultural credit facility subject to lender rules",

    description:
      "Kisan Credit Card is an agricultural credit facility designed to help eligible farmers access credit for farming and related needs.",

    eligibility: [
      "Applicant must satisfy the lending institution's eligibility requirements",
      "Cultivation / agricultural activity may need to be established",
      "Loan approval depends on applicable banking rules"
    ],

    documents: [
      "Identity and address proof",
      "Land / cultivation documents",
      "Bank-related documents",
      "Other documents requested by the lender"
    ],

    steps: [
      "Contact an eligible bank or lending institution",
      "Ask for Kisan Credit Card facility",
      "Submit the required documents",
      "Complete verification",
      "Wait for the lender's decision"
    ],

    officialLink: "https://www.rbi.org.in",

    needs: ["loan"]
  },


  {
    id: "farm-equipment",
    title: "Agricultural Mechanization Support",
    subtitle: "Farm Equipment Assistance",
    icon: "🚜",

    category: "equipment",
    government: "Maharashtra Government",
    source: "maharashtra",

    status: "available",

    benefit: "Support for eligible agricultural machinery / equipment",

    description:
      "Agricultural mechanization programmes may provide support for eligible farm machinery and equipment according to current state guidelines and availability.",

    eligibility: [
      "Applicant must satisfy the applicable state scheme conditions",
      "Equipment must fall under the notified category",
      "Subsidy rules may differ by programme"
    ],

    documents: [
      "Farmer identity document",
      "Land record",
      "Bank details",
      "Quotation / equipment documents where required"
    ],

    steps: [
      "Check the current Maharashtra scheme",
      "Check equipment eligibility",
      "Register or login to the applicable portal",
      "Submit documents",
      "Complete verification and follow purchase instructions"
    ],

    officialLink: "https://mahadbt.maharashtra.gov.in",

    needs: ["equipment"]
  },


  {
    id: "irrigation-support",
    title: "Micro Irrigation Support",
    subtitle: "Drip & Sprinkler Assistance",
    icon: "💧",

    category: "irrigation",
    government: "Maharashtra Government",
    source: "maharashtra",

    status: "available",

    benefit: "Assistance for eligible irrigation systems",

    description:
      "Eligible farmers may receive assistance for approved micro-irrigation systems subject to current government guidelines.",

    eligibility: [
      "Farmer must satisfy applicable programme conditions",
      "Approved irrigation system should be selected",
      "Application must follow the current process"
    ],

    documents: [
      "Farmer identity document",
      "Land details",
      "Bank account details",
      "Required irrigation-related documents"
    ],

    steps: [
      "Check current programme availability",
      "Select eligible irrigation system",
      "Complete online registration",
      "Upload required documents",
      "Follow verification and installation process"
    ],

    officialLink: "https://mahadbt.maharashtra.gov.in",

    needs: ["irrigation"]
  },


  {
    id: "input-support",
    title: "Seed & Agricultural Input Support",
    subtitle: "Seeds / Farm Inputs",
    icon: "🌱",

    category: "seeds",
    government: "Maharashtra Government",
    source: "maharashtra",

    status: "seasonal",

    benefit: "Support for eligible agricultural inputs",

    description:
      "Various agriculture programmes may support eligible farmers with seeds and other agricultural inputs depending on season and programme guidelines.",

    eligibility: [
      "Programme-specific farmer eligibility applies",
      "Crop and season conditions may apply",
      "Availability depends on current notification"
    ],

    documents: [
      "Farmer identity proof",
      "Farmer registration details",
      "Land / crop information",
      "Other documents according to the programme"
    ],

    steps: [
      "Check current notification",
      "Check crop and season eligibility",
      "Apply through authorised channel",
      "Submit required documents",
      "Track application status"
    ],

    officialLink: "https://krishi.maharashtra.gov.in",

    needs: ["seeds"]
  },


  {
    id: "livestock-support",
    title: "Livestock Development Support",
    subtitle: "Animal Husbandry",
    icon: "🐄",

    category: "livestock",
    government: "Maharashtra Government",
    source: "maharashtra",

    status: "available",

    benefit: "Support under applicable livestock development programmes",

    description:
      "Different government programmes support eligible livestock owners and farmers for animal husbandry related activities.",

    eligibility: [
      "Applicant must meet programme-specific conditions",
      "Animal / livestock details may be required",
      "Support depends on the active programme"
    ],

    documents: [
      "Identity proof",
      "Bank account details",
      "Livestock details",
      "Other programme-specific documents"
    ],

    steps: [
      "Find the applicable livestock programme",
      "Check eligibility",
      "Prepare documents",
      "Submit application",
      "Complete department verification"
    ],

    officialLink: "https://ahd.maharashtra.gov.in",

    needs: ["livestock"]
  },


  {
    id: "horticulture",
    title: "Horticulture Development Support",
    subtitle: "Fruit & Horticulture",
    icon: "🥭",

    category: "horticulture",
    government: "Maharashtra Government",
    source: "maharashtra",

    status: "available",

    benefit: "Support under applicable horticulture programmes",

    description:
      "Horticulture programmes can provide support for eligible fruit, vegetable and related agricultural activities under current guidelines.",

    eligibility: [
      "Crop / horticulture activity must satisfy programme conditions",
      "Farmer must meet applicable eligibility requirements",
      "Approved activity and documents may be required"
    ],

    documents: [
      "Identity proof",
      "Land documents",
      "Bank details",
      "Project / crop details where required"
    ],

    steps: [
      "Check active horticulture programme",
      "Verify crop and activity eligibility",
      "Submit application",
      "Complete document verification",
      "Follow department instructions"
    ],

    officialLink: "https://krishi.maharashtra.gov.in",

    needs: ["horticulture"]
  }

];


/* =========================================================
   STATE
========================================================= */

let currentSource = "all";
let currentSearch = "";
let currentCategory = "all";
let currentStatus = "all";

let savedSchemes =
  JSON.parse(localStorage.getItem("kisaanmitra_saved_schemes")) || [];

let compareSchemes = [];


/* =========================================================
   DOM
========================================================= */

const schemeGrid = document.getElementById("schemeGrid");
const recommendedGrid = document.getElementById("recommendedGrid");

const emptyState = document.getElementById("emptyState");

const searchInput = document.getElementById("schemeSearch");
const categoryFilter = document.getElementById("categoryFilter");
const statusFilter = document.getElementById("statusFilter");

const savedCount = document.getElementById("savedCount");


/* =========================================================
   INITIAL LOAD
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  renderSchemes();
  renderRecommendedSchemes();
  updateSavedCount();

  setupFinder();
  setupNeedCards();
  setupSourceTabs();
  setupFAQ();
  setupModal();

});


/* =========================================================
   RENDER SCHEMES
========================================================= */

function renderSchemes() {

  if (!schemeGrid) return;

  let filtered = schemes.filter(scheme => {

    const searchMatch =
      !currentSearch ||
      scheme.title.toLowerCase().includes(currentSearch.toLowerCase()) ||
      scheme.subtitle.toLowerCase().includes(currentSearch.toLowerCase()) ||
      scheme.category.toLowerCase().includes(currentSearch.toLowerCase());

    const categoryMatch =
      currentCategory === "all" ||
      scheme.category === currentCategory;

    const statusMatch =
      currentStatus === "all" ||
      scheme.status === currentStatus;

    const sourceMatch =
      currentSource === "all" ||
      scheme.source === currentSource;

    return searchMatch &&
           categoryMatch &&
           statusMatch &&
           sourceMatch;

  });

  schemeGrid.innerHTML = "";

  if (filtered.length === 0) {

    emptyState.style.display = "block";

    return;

  }

  emptyState.style.display = "none";

  filtered.forEach(scheme => {

    schemeGrid.insertAdjacentHTML(
      "beforeend",
      createSchemeCard(scheme)
    );

  });

}


/* =========================================================
   RECOMMENDED SCHEMES
========================================================= */

function renderRecommendedSchemes(need = null) {

  if (!recommendedGrid) return;

  let recommended = schemes;

  if (need) {

    recommended = schemes.filter(scheme =>
      scheme.needs.includes(need)
    );

  }

  recommended = recommended.slice(0, 3);

  recommendedGrid.innerHTML = "";

  recommended.forEach(scheme => {

    recommendedGrid.insertAdjacentHTML(
      "beforeend",
      createSchemeCard(scheme, true)
    );

  });

}


/* =========================================================
   CREATE CARD
========================================================= */

function createSchemeCard(scheme, recommended = false) {

  const isSaved =
    savedSchemes.includes(scheme.id);

  const isCompared =
    compareSchemes.includes(scheme.id);

  const statusText =
    scheme.status === "seasonal"
      ? "Seasonal"
      : "Currently Available";


  return `

    <article class="scheme-card">

      <div class="scheme-card-top">

        <div class="scheme-icon">
          ${scheme.icon}
        </div>

        <button
          class="save-btn ${isSaved ? "saved" : ""}"
          onclick="toggleSave('${scheme.id}')"
          title="Save scheme"
        >
          <i class="fa-${isSaved ? "solid" : "regular"} fa-bookmark"></i>
        </button>

      </div>


      <span class="scheme-status">
        ${statusText}
      </span>


      <h3>
        ${scheme.title}
      </h3>


      <p class="scheme-subtitle">
        ${scheme.subtitle}
      </p>


      <div class="scheme-benefit">

        <span>
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
              Relevant based on your selected need
            </div>
          `
          : ""
      }


      <div class="scheme-card-actions">

        <button
          class="details-btn"
          onclick="openSchemeModal('${scheme.id}')"
        >
          View Details
        </button>


        <button
          class="compare-btn ${isCompared ? "active" : ""}"
          onclick="toggleCompare('${scheme.id}')"
          title="Compare"
        >
          <i class="fa-solid fa-scale-balanced"></i>
        </button>

      </div>

    </article>

  `;

}


/* =========================================================
   SAVE SCHEME
========================================================= */

function toggleSave(id) {

  if (savedSchemes.includes(id)) {

    savedSchemes =
      savedSchemes.filter(item => item !== id);

    showToast("Scheme removed from saved list");

  } else {

    savedSchemes.push(id);

    showToast("Scheme saved successfully");

  }

  localStorage.setItem(
    "kisaanmitra_saved_schemes",
    JSON.stringify(savedSchemes)
  );

  updateSavedCount();

  renderSchemes();
  renderRecommendedSchemes();

}


/* =========================================================
   SAVED COUNT
========================================================= */

function updateSavedCount() {

  if (savedCount) {
    savedCount.textContent =
      savedSchemes.length;
  }

}


/* =========================================================
   COMPARE
========================================================= */

function toggleCompare(id) {

  if (compareSchemes.includes(id)) {

    compareSchemes =
      compareSchemes.filter(item => item !== id);

    showToast("Removed from comparison");

  } else {

    if (compareSchemes.length >= 3) {

      showToast("You can compare up to 3 schemes");

      return;

    }

    compareSchemes.push(id);

    showToast("Scheme added to comparison");

  }

  renderSchemes();
  renderRecommendedSchemes();

  updateCompareUI();

}


/* =========================================================
   UPDATE COMPARE
========================================================= */

function updateCompareUI() {

  const empty =
    document.getElementById("compareEmpty");

  const table =
    document.getElementById("compareTableWrap");

  if (!empty || !table) return;


  if (compareSchemes.length === 0) {

    empty.style.display = "block";
    table.style.display = "none";

    return;

  }


  empty.style.display = "none";
  table.style.display = "block";


  const selected =
    compareSchemes.map(id =>
      schemes.find(scheme => scheme.id === id)
    );


  for (let i = 1; i <= 3; i++) {

    const scheme = selected[i - 1];

    document.getElementById(
      `compareName${i}`
    ).textContent =
      scheme ? scheme.title : "—";


    document.getElementById(
      `compareCategory${i}`
    ).textContent =
      scheme ? scheme.category : "—";


    document.getElementById(
      `compareGov${i}`
    ).textContent =
      scheme ? scheme.government : "—";


    document.getElementById(
      `compareBenefit${i}`
    ).textContent =
      scheme ? scheme.benefit : "—";


    document.getElementById(
      `compareEligibility${i}`
    ).textContent =
      scheme
        ? `${scheme.eligibility.length} key conditions`
        : "—";


    document.getElementById(
      `compareDocs${i}`
    ).textContent =
      scheme
        ? `${scheme.documents.length} document types`
        : "—";

  }

}


/* =========================================================
   SOURCE TABS
========================================================= */

function setupSourceTabs() {

  document
    .querySelectorAll(".source-tab")
    .forEach(tab => {

      tab.addEventListener("click", () => {

        document
          .querySelectorAll(".source-tab")
          .forEach(item =>
            item.classList.remove("active")
          );

        tab.classList.add("active");

        currentSource =
          tab.dataset.source;

        renderSchemes();

      });

    });

}


/* =========================================================
   SEARCH
========================================================= */

if (searchInput) {

  searchInput.addEventListener(
    "input",
    e => {

      currentSearch =
        e.target.value.trim();

      renderSchemes();

    }
  );

}


if (categoryFilter) {

  categoryFilter.addEventListener(
    "change",
    e => {

      currentCategory =
        e.target.value;

      renderSchemes();

    }
  );

}


if (statusFilter) {

  statusFilter.addEventListener(
    "change",
    e => {

      currentStatus =
        e.target.value;

      renderSchemes();

    }
  );

}


/* =========================================================
   NEED CARDS
========================================================= */

function setupNeedCards() {

  document
    .querySelectorAll(".need-card")
    .forEach(card => {

      card.addEventListener("click", () => {

        document
          .querySelectorAll(".need-card")
          .forEach(item =>
            item.classList.remove("selected")
          );

        card.classList.add("selected");

        const need =
          card.dataset.need;

        renderRecommendedSchemes(need);

        document
          .getElementById("recommendedSection")
          ?.scrollIntoView({
            behavior: "smooth"
          });

      });

    });

}


/* =========================================================
   FINDER
========================================================= */

function setupFinder() {

  document
    .querySelectorAll(".finder-next")
    .forEach(button => {

      button.addEventListener("click", () => {

        const nextStep =
          Number(button.dataset.next);

        if (!validateStep(nextStep - 1)) {
          return;
        }

        showFinderStep(nextStep);

      });

    });


  document
    .querySelectorAll(".finder-back")
    .forEach(button => {

      button.addEventListener("click", () => {

        showFinderStep(
          Number(button.dataset.back)
        );

      });

    });


  const analyzeBtn =
    document.getElementById("analyzeBtn");

  if (analyzeBtn) {

    analyzeBtn.addEventListener(
      "click",
      startAnalysis
    );

  }

}


/* =========================================================
   VALIDATE
========================================================= */

function validateStep(step) {

  if (step === 1) {

    const state =
      document.getElementById("state").value;

    const district =
      document.getElementById("district").value.trim();

    if (!state || !district) {

      showToast(
        "Please enter your state and district"
      );

      return false;

    }

  }


  if (step === 2) {

    const area =
      document.getElementById("landArea").value;

    const crop =
      document.getElementById("crop").value.trim();

    if (!area || !crop) {

      showToast(
        "Please enter land area and main crop"
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

  document
    .querySelectorAll(".finder-step")
    .forEach(item => {

      item.classList.remove("active");

      if (
        Number(item.dataset.step) === step
      ) {

        item.classList.add("active");

      }

    });


  const stepNumber =
    document.getElementById("stepNumber");

  if (stepNumber) {

    stepNumber.textContent = step;

  }

}


/* =========================================================
   ANALYSIS
========================================================= */

function startAnalysis() {

  const selectedNeed =
    document.querySelector(
      'input[name="supportNeed"]:checked'
    );


  if (!selectedNeed) {

    showToast(
      "Please select what support you need"
    );

    return;

  }


  const finder =
    document.querySelector(".finder-card");

  const loader =
    document.getElementById("analysisLoader");


  document
    .querySelectorAll(".finder-step")
    .forEach(step =>
      step.style.display = "none"
    );


  loader.classList.add("active");


  const messages = [

    "तुमच्या location ची माहिती तपासत आहोत...",
    "तुमच्या शेतीची माहिती समजून घेत आहोत...",
    "योजनेच्या eligibility conditions तपासत आहोत...",
    "तुमच्यासाठी संबंधित योजना शोधत आहोत..."
  ];


  const progressSteps =
    document.querySelectorAll(".analysis-item");

  const progressBar =
    document.getElementById(
      "analysisProgressBar"
    );

  const analysisText =
    document.getElementById(
      "analysisText"
    );


  let index = 0;


  const interval =
    setInterval(() => {

      if (index < messages.length) {

        analysisText.textContent =
          messages[index];

        progressBar.style.width =
          `${(index + 1) * 25}%`;


        progressSteps.forEach(
          (item, itemIndex) => {

            item.classList.toggle(
              "active",
              itemIndex <= index
            );

          }
        );

        index++;

      } else {

        clearInterval(interval);

        finishAnalysis(
          selectedNeed.value
        );

      }

    }, 700);

}


/* =========================================================
   FINISH ANALYSIS
========================================================= */

function finishAnalysis(need) {

  const loader =
    document.getElementById(
      "analysisLoader"
    );

  loader.classList.remove("active");


  const finderSteps =
    document.querySelectorAll(
      ".finder-step"
    );

  finderSteps.forEach(
    step => step.style.display = ""
  );


  showFinderStep(3);


  renderRecommendedSchemes(need);


  const summary =
    document.getElementById(
      "recommendationSummary"
    );


  const categoryName =
    getCategoryName(need);


  if (summary) {

    summary.textContent =
      `तुमच्या ${categoryName} गरजेनुसार संबंधित योजना दाखवत आहोत.`;

  }


  document
    .getElementById("recommendedSection")
    ?.scrollIntoView({
      behavior: "smooth"
    });

}


/* =========================================================
   CATEGORY NAME
========================================================= */

function getCategoryName(category) {

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

  return names[category] || "शेती";

}


/* =========================================================
   MODAL
========================================================= */

function setupModal() {

  const close =
    document.getElementById("modalClose");

  const overlay =
    document.getElementById("modalOverlay");


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
    e => {

      if (
        e.key === "Escape"
      ) {

        closeSchemeModal();

      }

    }
  );

}


function openSchemeModal(id) {

  const scheme =
    schemes.find(
      item => item.id === id
    );


  if (!scheme) return;


  document.getElementById(
    "modalIcon"
  ).textContent =
    scheme.icon;


  document.getElementById(
    "modalCategory"
  ).textContent =
    getCategoryName(
      scheme.category
    );


  document.getElementById(
    "modalTitle"
  ).textContent =
    scheme.title;


  document.getElementById(
    "modalGovernment"
  ).textContent =
    scheme.government;


  document.getElementById(
    "modalBenefit"
  ).textContent =
    scheme.benefit;


  document.getElementById(
    "modalDescription"
  ).textContent =
    scheme.description;


  document.getElementById(
    "modalEligibility"
  ).innerHTML =
    scheme.eligibility
      .map(item => `<li>${item}</li>`)
      .join("");


  document.getElementById(
    "modalDocuments"
  ).innerHTML =
    scheme.documents
      .map(item => `<li>${item}</li>`)
      .join("");


  document.getElementById(
    "modalSteps"
  ).innerHTML =
    scheme.steps
      .map(
        (step, index) => `
          <div class="application-step">

            <span class="application-step-number">
              ${index + 1}
            </span>

            <div>
              <strong>${step}</strong>
              <p>
                Follow the applicable official process.
              </p>
            </div>

          </div>
        `
      )
      .join("");


  const officialLink =
    document.getElementById(
      "modalOfficialLink"
    );


  officialLink.href =
    scheme.officialLink;


  const modal =
    document.getElementById(
      "schemeModal"
    );


  modal.classList.add("active");

  document.body.style.overflow =
    "hidden";

}


function closeSchemeModal() {

  const modal =
    document.getElementById(
      "schemeModal"
    );


  modal.classList.remove("active");

  document.body.style.overflow =
    "";

}


/* =========================================================
   FAQ
========================================================= */

function setupFAQ() {

  document
    .querySelectorAll(".faq-question")
    .forEach(question => {

      question.addEventListener(
        "click",
        () => {

          const item =
            question.parentElement;

          const answer =
            item.querySelector(
              ".faq-answer"
            );


          const isOpen =
            item.classList.contains("open");


          document
            .querySelectorAll(".faq-item")
            .forEach(other => {

              other.classList.remove("open");

              const otherAnswer =
                other.querySelector(
                  ".faq-answer"
                );

              if (otherAnswer) {
                otherAnswer.style.maxHeight =
                  null;
              }

            });


          if (!isOpen) {

            item.classList.add("open");

            answer.style.maxHeight =
              answer.scrollHeight + "px";

          }

        }
      );

    });

}


/* =========================================================
   SCROLL HELPERS
========================================================= */

function scrollToFinder() {

  document
    .getElementById("schemeFinder")
    ?.scrollIntoView({
      behavior: "smooth"
    });

}


function scrollToSchemes() {

  document
    .getElementById("allSchemes")
    ?.scrollIntoView({
      behavior: "smooth"
    });

}


/* =========================================================
   CLEAR FILTERS
========================================================= */

function clearFilters() {

  currentSearch = "";
  currentCategory = "all";
  currentStatus = "all";


  if (searchInput)
    searchInput.value = "";

  if (categoryFilter)
    categoryFilter.value = "all";

  if (statusFilter)
    statusFilter.value = "all";


  renderSchemes();

}


/* =========================================================
   TOAST
========================================================= */

let toastTimeout;


function showToast(message) {

  const toast =
    document.getElementById(
      "schemeToast"
    );

  const messageElement =
    document.getElementById(
      "toastMessage"
    );


  if (!toast || !messageElement)
    return;


  messageElement.textContent =
    message;


  toast.classList.add("show");


  clearTimeout(toastTimeout);


  toastTimeout =
    setTimeout(() => {

      toast.classList.remove("show");

    }, 2500);

}


/* =========================================================
   GLOBAL FUNCTIONS
========================================================= */

window.openSchemeModal =
  openSchemeModal;

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