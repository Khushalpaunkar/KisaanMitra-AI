const axios = require("axios");

const AGMARKNET_BASE_URL = "https://api.agmarknet.gov.in/v1";

const marketApi = axios.create({
  baseURL: AGMARKNET_BASE_URL,
  timeout: 30000,
  headers: {
    Accept: "application/json, text/plain, */*",
    Origin: "https://agmarknet.gov.in",
    Referer: "https://agmarknet.gov.in/",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/135.0.0.0 Safari/537.36",
  },
});

// =========================================================
// STATES
// =========================================================

// Get one page of states
const getStatesPage = async (page = 1) => {
  try {
    const response = await marketApi.get("/location/state", {
      params: { page },
    });

    return response.data;
  } catch (error) {
    console.error(
      "AGMARKNET States Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// Get ALL states
const getAllStates = async () => {
  try {
    const firstPage = await getStatesPage(1);

    const totalPages = firstPage?.pagination?.total_pages || 1;

    let allStates = [...(firstPage?.states || [])];

    for (let page = 2; page <= totalPages; page++) {
      const pageData = await getStatesPage(page);

      if (pageData?.states?.length) {
        allStates.push(...pageData.states);
      }
    }

    return {
      success: true,
      totalStates: allStates.length,
      states: allStates,
    };
  } catch (error) {
    console.error(
      "AGMARKNET All States Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// =========================================================
// FILTERS
// =========================================================

// Get all AGMARKNET filters
const getMarketFilters = async () => {
  try {
    const response = await marketApi.get(
      "/daily-price-arrival/filters"
    );

    return response.data;
  } catch (error) {
    console.error(
      "AGMARKNET Filters Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// =========================================================
// COMMODITIES
// =========================================================

// Get commodities
const getCommodities = async () => {
  try {
    const response = await marketApi.get("/list-comm");

    return response.data;
  } catch (error) {
    console.error(
      "AGMARKNET Commodities Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// Search commodity
const findCommodity = async (keyword) => {
  try {
    const response = await marketApi.get(
      "/daily-price-arrival/filters"
    );

    const commodities =
      response.data?.data?.cmdt_data || [];

    const search = String(keyword || "")
      .trim()
      .toLowerCase();

    if (!search) {
      return commodities;
    }

    return commodities.filter((item) =>
      item.cmdt_name?.toLowerCase().includes(search)
    );
  } catch (error) {
    console.error(
      "AGMARKNET Commodity Search Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// =========================================================
// MARKETS
// =========================================================

// Search markets from AGMARKNET filters
const findMarkets = async (keyword) => {
  try {
    const response = await marketApi.get(
      "/daily-price-arrival/filters"
    );

    const filters = response.data?.data || {};

    const markets = filters.market_data || [];

    const search = String(keyword || "")
      .trim()
      .toLowerCase();

    if (!search) {
      return markets;
    }

    return markets.filter((item) =>
      item.mkt_name?.toLowerCase().includes(search)
    );
  } catch (error) {
    console.error(
      "AGMARKNET Market Search Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// =========================================================
// MARKET PRICE
// =========================================================

// Get market-wise prices for last week
const getMarketPricesLastWeek = async ({
  stateId,
  districtId,
  marketId,
  commodityId,
}) => {
  try {
    const response = await marketApi.get(
      "/prices-and-arrivals/market-price/lastweek",
      {
        params: {
          stateId,
          districtId,
          marketId,
          commodityId,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "AGMARKNET Market Price Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// =========================================================
// RAW MARKET PRICE
// =========================================================
// Useful for testing different parameter combinations
// without changing the main function.

const getMarketPriceLastWeekRaw = async (params = {}) => {
  try {
    const response = await marketApi.get(
      "/prices-and-arrivals/market-price/lastweek",
      {
        params,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "AGMARKNET Raw Market Price Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// =========================================================
// EXPORTS
// =========================================================

module.exports = {
  getStatesPage,
  getAllStates,

  getMarketFilters,

  getCommodities,
  findCommodity,

  findMarkets,

  getMarketPricesLastWeek,
  getMarketPriceLastWeekRaw,
};