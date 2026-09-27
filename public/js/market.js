/* =========================================================
   KISAANMITRA AI — MARKET ANALYSIS
   Frontend Controller
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  // =======================================================
  // ELEMENTS
  // =======================================================

  const marketForm = document.getElementById("marketForm");

  const stateSelect = document.getElementById("stateId");
  const districtSelect = document.getElementById("districtId");
  const marketSelect = document.getElementById("marketId");
  const commoditySelect = document.getElementById("commodityId");
  const quantityInput = document.getElementById("quantity");

  const analyzeBtn = document.getElementById("analyzeBtn");
  const btnContent = analyzeBtn?.querySelector(".btn-content");
  const btnLoading = analyzeBtn?.querySelector(".btn-loading");

  const emptyState = document.getElementById("emptyState");
  const marketResults = document.getElementById("marketResults");

  const marketError = document.getElementById("marketError");
  const errorMessage = document.getElementById("errorMessage");

  const resultTitle = document.getElementById("resultTitle");
  const resultLocation = document.getElementById("resultLocation");
  const lastUpdated = document.getElementById("lastUpdated");

  const minPrice = document.getElementById("minPrice");
  const modalPrice = document.getElementById("modalPrice");
  const maxPrice = document.getElementById("maxPrice");

  const estimateQuantity = document.getElementById("estimateQuantity");
  const estimateRate = document.getElementById("estimateRate");
  const estimatedValue = document.getElementById("estimatedValue");

  const comparisonList = document.getElementById("comparisonList");

  const chartCanvas = document.getElementById("priceChart");
  const chartEmpty = document.getElementById("chartEmpty");

  const aiInsightBtn = document.getElementById("aiInsightBtn");
  const aiResponse = document.getElementById("aiResponse");

  const trendTabs = document.querySelectorAll(
    ".trend-tabs button"
  );

  let priceChart = null;

  let currentMarketData = null;

  // =======================================================
  // HELPERS
  // =======================================================

  const escapeHTML = (value) => {
    if (value === null || value === undefined) {
      return "";
    }

    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const formatNumber = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      Number.isNaN(Number(value))
    ) {
      return "—";
    }

    return Number(value).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });
  };

  const formatCurrency = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      Number.isNaN(Number(value))
    ) {
      return "₹ —";
    }

    return `₹ ${Number(value).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  };

  const getSelectedText = (select) => {
    if (!select || select.selectedIndex < 0) {
      return "";
    }

    return select.options[select.selectedIndex]?.text || "";
  };

  const setSelectLoading = (
    select,
    message = "Loading..."
  ) => {
    if (!select) return;

    select.disabled = true;

    select.innerHTML = `
      <option value="">${message}</option>
    `;
  };

  const resetSelect = (
    select,
    message,
    disabled = true
  ) => {
    if (!select) return;

    select.innerHTML = `
      <option value="">${message}</option>
    `;

    select.disabled = disabled;
  };

  const hideResults = () => {
    marketResults?.classList.add("d-none");
  };

  const showResults = () => {
    emptyState?.classList.add("d-none");
    marketResults?.classList.remove("d-none");
  };

  const showError = (message) => {
    if (!marketError) return;

    errorMessage.textContent =
      message || "कृपया पुन्हा प्रयत्न करा.";

    marketError.classList.remove("d-none");
  };

  window.hideError = () => {
    marketError?.classList.add("d-none");
  };

  const hideError = () => {
    marketError?.classList.add("d-none");
  };

  // =======================================================
  // API HELPER
  // =======================================================

  const fetchJSON = async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    let data;

    try {
      data = await response.json();
    } catch (error) {
      throw new Error(
        "Server returned an invalid response."
      );
    }

    if (!response.ok || data.success === false) {
      throw new Error(
        data.message ||
          data.error?.message ||
          "Request failed."
      );
    }

    return data;
  };

  // =======================================================
  // LOAD DISTRICTS
  // =======================================================

  const loadDistricts = async (stateId) => {
    resetSelect(
      districtSelect,
      "जिल्हा निवडा",
      true
    );

    resetSelect(
      marketSelect,
      "प्रथम जिल्हा निवडा",
      true
    );

    if (!stateId) {
      return;
    }

    try {
      setSelectLoading(
        districtSelect,
        "जिल्हे शोधत आहे..."
      );

      const data = await fetchJSON(
        `/market/districts?stateId=${encodeURIComponent(
          stateId
        )}`
      );

      const districts = data.districts || [];

      if (!districts.length) {
        resetSelect(
          districtSelect,
          "जिल्हा उपलब्ध नाही",
          true
        );

        return;
      }

      districtSelect.innerHTML = `
        <option value="">जिल्हा निवडा</option>
      `;

      districts.forEach((district) => {
        const id =
          district.district_id ||
          district.id;

        const name =
          district.district_name ||
          district.district ||
          district.name;

        if (!id || !name) return;

        const option = document.createElement("option");

        option.value = id;
        option.textContent = name;

        districtSelect.appendChild(option);
      });

      districtSelect.disabled = false;
    } catch (error) {
      console.error(
        "District Loading Error:",
        error
      );

      resetSelect(
        districtSelect,
        "जिल्हे मिळाले नाहीत",
        true
      );

      showError(
        "जिल्ह्यांची माहिती मिळवता आली नाही."
      );
    }
  };

  // =======================================================
  // LOAD MARKETS
  // =======================================================

  const loadMarkets = async (districtId) => {
    resetSelect(
      marketSelect,
      "बाजार निवडा",
      true
    );

    if (!districtId) {
      return;
    }

    try {
      setSelectLoading(
        marketSelect,
        "बाजार शोधत आहे..."
      );

      const data = await fetchJSON(
        `/market/markets?districtId=${encodeURIComponent(
          districtId
        )}`
      );

      const markets = data.markets || [];

      if (!markets.length) {
        resetSelect(
          marketSelect,
          "बाजार उपलब्ध नाही",
          true
        );

        return;
      }

      marketSelect.innerHTML = `
        <option value="">बाजार निवडा</option>
      `;

      markets.forEach((market) => {
        const id =
          market.id ||
          market.market_id;

        const name =
          market.mkt_name ||
          market.market_name ||
          market.name;

        if (!id || !name) return;

        const option = document.createElement("option");

        option.value = id;
        option.textContent = name;

        marketSelect.appendChild(option);
      });

      marketSelect.disabled = false;
    } catch (error) {
      console.error(
        "Market Loading Error:",
        error
      );

      resetSelect(
        marketSelect,
        "बाजार मिळाले नाहीत",
        true
      );

      showError(
        "बाजारांची माहिती मिळवता आली नाही."
      );
    }
  };

  // =======================================================
  // STATE CHANGE
  // =======================================================

  stateSelect?.addEventListener(
    "change",
    async () => {
      hideError();
      hideResults();

      await loadDistricts(
        stateSelect.value
      );
    }
  );

  // =======================================================
  // DISTRICT CHANGE
  // =======================================================

  districtSelect?.addEventListener(
    "change",
    async () => {
      hideError();
      hideResults();

      await loadMarkets(
        districtSelect.value
      );
    }
  );

  // =======================================================
  // RESET PRICE CARDS
  // =======================================================

  const resetPriceCards = () => {
    if (minPrice) minPrice.textContent = "—";
    if (modalPrice) modalPrice.textContent = "—";
    if (maxPrice) maxPrice.textContent = "—";
  };

  // =======================================================
  // UPDATE PRICE CARDS
  // =======================================================

  const updatePriceCards = (data) => {
    if (!data) {
      resetPriceCards();
      return;
    }

    minPrice.textContent =
      formatNumber(data.minPrice);

    modalPrice.textContent =
      formatNumber(data.modalPrice);

    maxPrice.textContent =
      formatNumber(data.maxPrice);
  };

  // =======================================================
  // FARMER ESTIMATE
  // =======================================================

  const updateEstimate = (data) => {
    const quantity = Number(
      quantityInput?.value || 0
    );

    const modal = Number(data?.modalPrice);

    if (
      quantity > 0 &&
      Number.isFinite(modal) &&
      modal > 0
    ) {
      const total = quantity * modal;

      estimateQuantity.textContent =
        `${formatNumber(quantity)} क्विंटल`;

      estimateRate.textContent =
        formatCurrency(modal);

      estimatedValue.textContent =
        formatCurrency(total);
    } else {
      estimateQuantity.textContent = "—";
      estimateRate.textContent = "₹ —";
      estimatedValue.textContent = "₹ —";
    }
  };

  // =======================================================
  // RESULT HEADER
  // =======================================================

  const updateResultHeader = (data) => {
    const commodity =
      data?.commodityName ||
      getSelectedText(commoditySelect) ||
      "पीक";

    const market =
      data?.marketName ||
      getSelectedText(marketSelect) ||
      "बाजार";

    const state =
      data?.stateName ||
      getSelectedText(stateSelect);

    const district =
      data?.districtName ||
      getSelectedText(districtSelect);

    if (resultTitle) {
      resultTitle.textContent =
        `${commodity} — बाजारभाव`;
    }

    if (resultLocation) {
      resultLocation.innerHTML = `
        <i class="bi bi-geo-alt"></i>
        ${escapeHTML(market)}
        ${district ? `, ${escapeHTML(district)}` : ""}
        ${state ? `, ${escapeHTML(state)}` : ""}
      `;
    }

    if (lastUpdated) {
      lastUpdated.textContent =
        data?.lastUpdated || "—";
    }
  };

  // =======================================================
  // CHART DATA NORMALIZER
  // =======================================================

  const normalizeTrend = (trend) => {
    if (!Array.isArray(trend)) {
      return [];
    }

    return trend
      .map((item) => {
        if (!item) return null;

        const date =
          item.date ||
          item.day ||
          item.label;

        const price = Number(
          item.price ??
            item.modalPrice ??
            item.modal ??
            item.value
        );

        if (!date || !Number.isFinite(price)) {
          return null;
        }

        return {
          date,
          price,
        };
      })
      .filter(Boolean);
  };

  // =======================================================
  // RENDER CHART
  // =======================================================

  const renderChart = (trend = []) => {
    if (!chartCanvas) return;

    const normalizedTrend =
      normalizeTrend(trend);

    if (priceChart) {
      priceChart.destroy();
      priceChart = null;
    }

    if (!normalizedTrend.length) {
      chartEmpty?.classList.remove(
        "d-none"
      );

      return;
    }

    chartEmpty?.classList.add("d-none");

    const labels = normalizedTrend.map(
      (item) => item.date
    );

    const prices = normalizedTrend.map(
      (item) => item.price
    );

    priceChart = new Chart(
      chartCanvas,
      {
        type: "line",

        data: {
          labels,

          datasets: [
            {
              label: "Modal Price",

              data: prices,

              borderWidth: 3,

              tension: 0.35,

              fill: true,

              pointRadius: 4,

              pointHoverRadius: 6,
            },
          ],
        },

        options: {
          responsive: true,

          maintainAspectRatio: false,

          interaction: {
            intersect: false,
            mode: "index",
          },

          plugins: {
            legend: {
              display: false,
            },

            tooltip: {
              callbacks: {
                label: (context) => {
                  return ` ₹ ${Number(
                    context.raw
                  ).toLocaleString("en-IN")}`;
                },
              },
            },
          },

          scales: {
            x: {
              grid: {
                display: false,
              },

              ticks: {
                font: {
                  size: 10,
                },
              },
            },

            y: {
              beginAtZero: false,

              ticks: {
                font: {
                  size: 10,
                },

                callback: (value) =>
                  `₹${Number(
                    value
                  ).toLocaleString("en-IN")}`,
              },
            },
          },
        },
      }
    );
  };

  // =======================================================
  // MARKET COMPARISON
  // =======================================================

  const renderComparison = (
    comparison = []
  ) => {
    if (!comparisonList) return;

    if (!Array.isArray(comparison)) {
      comparison = [];
    }

    if (!comparison.length) {
      comparisonList.innerHTML = `
        <div class="comparison-empty">

          <i class="bi bi-shop"></i>

          <p>
            उपलब्ध बाजारांची तुलना येथे दिसेल.
          </p>

        </div>
      `;

      return;
    }

    comparisonList.innerHTML =
      comparison
        .map((item) => {
          const name =
            item.marketName ||
            item.market ||
            item.name ||
            "Market";

          const min =
            item.minPrice ??
            item.min;

          const modal =
            item.modalPrice ??
            item.modal;

          const max =
            item.maxPrice ??
            item.max;

          return `
            <div class="comparison-item">

              <div class="comparison-market">

                <div class="comparison-market-icon">
                  <i class="bi bi-shop"></i>
                </div>

                <div>
                  <strong>
                    ${escapeHTML(name)}
                  </strong>

                  <small>
                    Market
                  </small>
                </div>

              </div>

              <div class="comparison-value">

                <span>Min</span>

                <strong>
                  ${formatCurrency(min)}
                </strong>

              </div>

              <div class="comparison-value">

                <span>Modal</span>

                <strong>
                  ${formatCurrency(modal)}
                </strong>

              </div>

              <div class="comparison-value">

                <span>Max</span>

                <strong>
                  ${formatCurrency(max)}
                </strong>

              </div>

            </div>
          `;
        })
        .join("");
  };

  // =======================================================
  // APPLY RESULT
  // =======================================================

  const applyMarketResult = (data) => {
    currentMarketData = data;

    showResults();

    updateResultHeader(data);

    updatePriceCards(data);

    updateEstimate(data);

    renderComparison(
      data?.comparison || []
    );

    renderChart(
      data?.trend || []
    );
  };

  // =======================================================
  // ANALYZE MARKET
  // =======================================================

  marketForm?.addEventListener(
    "submit",
    async (event) => {
      event.preventDefault();

      hideError();

      const stateId =
        stateSelect?.value;

      const districtId =
        districtSelect?.value;

      const marketId =
        marketSelect?.value;

      const commodityId =
        commoditySelect?.value;

      const quantity =
        quantityInput?.value;

      // -----------------------------------------------
      // VALIDATION
      // -----------------------------------------------

      if (!stateId) {
        showError("कृपया राज्य निवडा.");
        stateSelect?.focus();
        return;
      }

      if (!districtId) {
        showError("कृपया जिल्हा निवडा.");
        districtSelect?.focus();
        return;
      }

      if (!marketId) {
        showError("कृपया बाजार निवडा.");
        marketSelect?.focus();
        return;
      }

      if (!commodityId) {
        showError("कृपया पीक निवडा.");
        commoditySelect?.focus();
        return;
      }

      // -----------------------------------------------
      // LOADING
      // -----------------------------------------------

      analyzeBtn.disabled = true;

      btnContent?.classList.add(
        "d-none"
      );

      btnLoading?.classList.remove(
        "d-none"
      );

      try {
        const result =
          await fetchJSON(
            "/market/analyze",
            {
              method: "POST",

              body: JSON.stringify({
                stateId,
                districtId,
                marketId,
                commodityId,
                quantity,
              }),
            }
          );

        if (!result.success) {
          throw new Error(
            result.message ||
              "Market analysis failed."
          );
        }

        applyMarketResult(
          result.data || {}
        );

        // Scroll smoothly to results
        setTimeout(() => {
          marketResults?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      } catch (error) {
        console.error(
          "Market Analysis Error:",
          error
        );

        showError(
          error.message ||
            "बाजार माहिती मिळवता आली नाही."
        );
      } finally {
        analyzeBtn.disabled = false;

        btnContent?.classList.remove(
          "d-none"
        );

        btnLoading?.classList.add(
          "d-none"
        );
      }
    }
  );

  // =======================================================
  // QUANTITY CHANGE
  // =======================================================

  quantityInput?.addEventListener(
    "input",
    () => {
      if (currentMarketData) {
        updateEstimate(
          currentMarketData
        );
      }
    }
  );

  // =======================================================
  // TREND TABS
  // =======================================================

  trendTabs.forEach((button) => {
    button.addEventListener(
      "click",
      () => {
        trendTabs.forEach((btn) => {
          btn.classList.remove(
            "active"
          );
        });

        button.classList.add("active");

        const period =
          button.dataset.period;

        console.log(
          `Selected trend period: ${period} days`
        );

        /*
          Future API integration:

          7 days  → currentMarketData.trend7
          30 days → currentMarketData.trend30

          For now the controller can return
          whichever trend is available.
        */

        if (!currentMarketData) {
          return;
        }

        const trend =
          period === "30"
            ? currentMarketData.trend30 ||
              []
            : currentMarketData.trend7 ||
              currentMarketData.trend ||
              [];

        renderChart(trend);
      }
    );
  });

  // =======================================================
  // AI INSIGHT
  // =======================================================

  aiInsightBtn?.addEventListener(
    "click",
    async () => {
      if (!currentMarketData) {
        showError(
          "प्रथम बाजार विश्लेषण करा."
        );

        return;
      }

      aiInsightBtn.disabled = true;

      const originalHTML =
        aiInsightBtn.innerHTML;

      aiInsightBtn.innerHTML = `
        <span
          class="spinner-border spinner-border-sm"
        ></span>

        AI विचार करत आहे...
      `;

      aiResponse?.classList.add(
        "d-none"
      );

      try {
        const commodity =
          currentMarketData.commodityName ||
          getSelectedText(
            commoditySelect
          );

        const market =
          currentMarketData.marketName ||
          getSelectedText(
            marketSelect
          );

        const result =
          await fetchJSON(
            "/market/ai-insight",
            {
              method: "POST",

              body: JSON.stringify({
                commodity,
                market,

                minPrice:
                  currentMarketData.minPrice,

                maxPrice:
                  currentMarketData.maxPrice,

                modalPrice:
                  currentMarketData.modalPrice,

                trend:
                  currentMarketData.trend ||
                  [],
              }),
            }
          );

        if (aiResponse) {
          aiResponse.textContent =
            result.insight ||
            "AI insight उपलब्ध नाही.";

          aiResponse.classList.remove(
            "d-none"
          );
        }
      } catch (error) {
        console.error(
          "AI Insight Error:",
          error
        );

        if (aiResponse) {
          aiResponse.textContent =
            "AI insight सध्या उपलब्ध नाही. कृपया पुन्हा प्रयत्न करा.";

          aiResponse.classList.remove(
            "d-none"
          );
        }
      } finally {
        aiInsightBtn.disabled = false;

        aiInsightBtn.innerHTML =
          originalHTML;
      }
    }
  );

  // =======================================================
  // INITIAL STATE
  // =======================================================

  resetSelect(
    districtSelect,
    "प्रथम राज्य निवडा",
    true
  );

  resetSelect(
    marketSelect,
    "प्रथम जिल्हा निवडा",
    true
  );

  resetPriceCards();

  console.log(
    "🌱 KisaanMitra Market Analysis initialized."
  );
});