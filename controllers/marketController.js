const {
  getMarketFilters, getMarketPricesLastWeek,} = require("../config/marketApi");
const { askAgriBot } = require("../config/gemini");

const NO_PRICE_MESSAGE =
  "Selected market/commodity साठी सध्या अधिकृत बाजारभाव उपलब्ध नाही.";
const NO_DATA_INSIGHT =
  "सध्या निवडलेल्या बाजारासाठी अधिकृत बाजारभाव उपलब्ध नाही. उपलब्ध डेटा मिळाल्यावर KisaanMitra AI बाजारातील बदल आणि तुलना समजावून सांगेल.";

const field = (record, names) => {
  if (!record || typeof record !== "object") return undefined;
  for (const name of names) {
    if (record[name] !== undefined && record[name] !== null && record[name] !== "") {
      return record[name];
    }
  }
  const normalizedNames = new Set(names.map((name) => name.toLowerCase().replace(/[_-]/g, "")));
  const match = Object.entries(record).find(([key, value]) =>
    normalizedNames.has(key.toLowerCase().replace(/[_-]/g, "")) &&
    value !== undefined && value !== null && value !== ""
  );
  return match?.[1];
};

const numericValue = (value) => {
  if (value === undefined || value === null || String(value).trim() === "") return null;
  if (typeof value === "string" && /^(nr|n\.r\.|na|n\/a)$/i.test(value.trim())) return null;
  const parsed = Number(String(value).replace(/,/g, "").replace(/[₹\s]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
};

const getFilterData = (response) => response?.data?.data || response?.data || response || {};

const getRecordId = (record, kind) => {
  const candidates = {
    state: ["state_id", "stateId", "stateid", "id"],
    district: ["district_id", "districtId", "districtid", "dist_id", "id"],
    market: ["id", "mkt_id", "market_id", "marketId", "marketid"],
    commodity: ["cmdt_id", "commodity_id", "commodityId", "id"],
  };
  return field(record, candidates[kind]);
};

const getRecordName = (record, kind) => {
  const candidates = {
    state: ["state_name", "stateName", "state", "name"],
    district: ["district_name", "districtName", "district", "name"],
    market: ["mkt_name", "market_name", "marketName", "name"],
    commodity: ["cmdt_name", "commodity_name", "commodityName", "name"],
  };
  return field(record, candidates[kind]);
};

const findPriceRecords = (payload) => {
  const records = [];
  const visit = (value) => {
    if (Array.isArray(value)) {
      for (const item of value) visit(item);
      return;
    }
    if (!value || typeof value !== "object") return;

    const hasPriceField = [
      "min_price", "minPrice", "minimum_price", "modal_price", "modalPrice",
      "max_price", "maxPrice", "price", "modal", "min", "max",
    ].some((key) => field(value, [key]) !== undefined);
    if (hasPriceField) records.push(value);
    for (const [key, child] of Object.entries(value)) {
      if (child && typeof child === "object" && key !== "meta") visit(child);
    }
  };
  visit(payload);
  return [...new Set(records)];
};

const normalizePriceData = (payload) => {
  const records = findPriceRecords(payload);
  const normalized = records.map((record) => ({
    minPrice: numericValue(field(record, ["min_price", "minPrice", "minimum_price", "min"])),
    modalPrice: numericValue(field(record, ["modal_price", "modalPrice", "modal", "price"])),
    maxPrice: numericValue(field(record, ["max_price", "maxPrice", "maximum_price", "max"])),
    date: field(record, ["arrival_date", "price_date", "date", "reported_date", "created_at"]),
  }));
  const validRecords = normalized.filter((record) =>
    record.minPrice !== null || record.modalPrice !== null || record.maxPrice !== null
  );
  const latest = validRecords[validRecords.length - 1];
  return {
    hasData: validRecords.length > 0,
    minPrice: latest?.minPrice ?? null,
    modalPrice: latest?.modalPrice ?? null,
    maxPrice: latest?.maxPrice ?? null,
    lastUpdated: latest?.date ?? null,
    trend: validRecords
      .filter((record) => record.date && record.modalPrice !== null)
      .map((record) => ({ date: record.date, price: record.modalPrice })),
    comparison: [],
  };
};

const renderMarketDashboard = async (req, res, next) => {
  try {
    return res.render("market/index", { title: "KisaanMitra AI — Market" });
  } catch (error) {
    return next(error);
  }
};

const renderMarketAnalysis = async (req, res, next) => {
  try {
    let filters = {};
    try {
      filters = getFilterData(await getMarketFilters());
    } catch (error) {
      console.error("Market filters unavailable:", error.message);
    }
    return res.render("market/finder", {
      title: "KisaanMitra AI — Market Analysis",
      states: Array.isArray(filters.state_data) ? filters.state_data : [],
      commodities: Array.isArray(filters.cmdt_data) ? filters.cmdt_data : [],
    });
  } catch (error) {
    return next(error);
  }
};

const getDistricts = async (req, res) => {
  try {
    const { stateId } = req.query;
    if (!stateId) {
      return res.status(400).json({ success: false, message: "State is required" });
    }
    const filters = getFilterData(await getMarketFilters());
    const districtData = Array.isArray(filters.district_data) ? filters.district_data : [];
    const districts = districtData
      .filter((district) => String(field(district, ["state_id", "stateId", "stateid"])) === String(stateId))
      .map((district) => {
        const id = getRecordId(district, "district");
        const name = getRecordName(district, "district");
        return id === undefined || name === undefined ? null : { id, district_id: id, name, district_name: name };
      })
      .filter(Boolean);
    return res.json({ success: true, districts });
  } catch (error) {
    console.error("District API Error:", error.message);
    return res.status(502).json({ success: false, message: "Unable to fetch market data" });
  }
};

const getMarkets = async (req, res) => {
  try {
    const { districtId } = req.query;
    if (!districtId) {
      return res.status(400).json({ success: false, message: "District is required" });
    }
    const filters = getFilterData(await getMarketFilters());
    const marketData = Array.isArray(filters.market_data) ? filters.market_data : [];
    const markets = marketData
      .filter((market) => String(field(market, ["district_id", "districtId", "districtid", "dist_id"])) === String(districtId))
      .map((market) => {
        const id = getRecordId(market, "market");
        const name = getRecordName(market, "market");
        return id === undefined || name === undefined ? null : { id, name, mkt_name: name };
      })
      .filter(Boolean);
    return res.json({ success: true, markets });
  } catch (error) {
    console.error("Market List Error:", error.message);
    return res.status(502).json({ success: false, message: "Unable to fetch market data" });
  }
};

const analyzeMarket = async (req, res) => {
  try {
    const { stateId, districtId, marketId, commodityId, quantity } = req.body || {};
    if (!stateId || !districtId || !marketId || !commodityId) {
      return res.status(400).json({ success: false, message: "State, district, market, and commodity are required" });
    }

    const filters = getFilterData(await getMarketFilters());
    const states = Array.isArray(filters.state_data) ? filters.state_data : [];
    const districts = Array.isArray(filters.district_data) ? filters.district_data : [];
    const markets = Array.isArray(filters.market_data) ? filters.market_data : [];
    const commodities = Array.isArray(filters.cmdt_data) ? filters.cmdt_data : [];
    const selectedState = states.find((item) => String(getRecordId(item, "state")) === String(stateId));
    const selectedDistrict = districts.find((item) => String(getRecordId(item, "district")) === String(districtId));
    const selectedMarket = markets.find((item) => String(getRecordId(item, "market")) === String(marketId));
    const selectedCommodity = commodities.find((item) => String(getRecordId(item, "commodity")) === String(commodityId));

    const priceResponse = await getMarketPricesLastWeek({ stateId, districtId, marketId, commodityId });
    const prices = normalizePriceData(priceResponse);
    const quantityValue = numericValue(quantity);
    if (!prices.hasData) {
      return res.json({
        success: true,
        message: NO_PRICE_MESSAGE,
        data: { hasData: false, minPrice: null, modalPrice: null, maxPrice: null, trend: [], comparison: [] },
      });
    }

    return res.json({
      success: true,
      data: {
        hasData: true,
        commodityName: getRecordName(selectedCommodity, "commodity") || null,
        marketName: getRecordName(selectedMarket, "market") || null,
        stateName: getRecordName(selectedState, "state") || null,
        districtName: getRecordName(selectedDistrict, "district") || null,
        minPrice: prices.minPrice,
        modalPrice: prices.modalPrice,
        maxPrice: prices.maxPrice,
        lastUpdated: prices.lastUpdated,
        trend: prices.trend,
        comparison: prices.comparison,
        quantity: quantityValue,
      },
    });
  } catch (error) {
    console.error("Market Analysis Error:", error.response?.data || error.message);
    return res.status(502).json({ success: false, message: "Unable to fetch market data" });
  }
};

const getAIInsight = async (req, res) => {
  try {
    const { commodity, market, minPrice, maxPrice, modalPrice, trend } = req.body || {};
    const prices = [minPrice, modalPrice, maxPrice].map(numericValue);
    const hasPriceData = prices.some((price) => price !== null) ||
      (Array.isArray(trend) && trend.some((item) => numericValue(item?.price ?? item?.modalPrice) !== null));
    if (!hasPriceData) return res.json({ success: true, insight: NO_DATA_INSIGHT });

    const prompt = [
      "Explain this verified AGMARKNET market information to an Indian farmer in simple Marathi.",
      "Use only the supplied values. Do not estimate, infer, or invent prices or trends.",
      "If a value is missing, say it was not reported. Keep the answer concise.",
      JSON.stringify({ commodity, market, minPrice, modalPrice, maxPrice, trend }),
    ].join("\n\n");
    const insight = await askAgriBot(prompt);
    return res.json({ success: true, insight });
  } catch (error) {
    console.error("AI Market Insight Error:", error.message);
    return res.status(502).json({ success: false, message: "Unable to generate AI insight" });
  }
};

module.exports = {
  renderMarketDashboard,
  renderMarketAnalysis,
  getDistricts,
  getMarkets,
  analyzeMarket,
  getAIInsight,
};