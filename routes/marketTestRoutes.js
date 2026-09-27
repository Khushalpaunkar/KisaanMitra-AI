const express = require("express");
const router = express.Router();


const {
  getFilters,
  getStatesPage,
  getAllStates,
  getMarketsByDistrict,
  getMarketFilters,
  getCommodities,
  findCommodity,
  findMarkets,
  getMarketPricesLastWeek,
  getCommodityPricesLastWeek,
  
} = require("../config/marketApi");



router.get("/price/maharashtra-cotton", async (req, res) => {
  try {
    const data = await getCommodityPricesLastWeek({
      stateId: 20,
      commodityId: 15,
    });

    res.json({
      success: true,
      state: "Maharashtra",
      commodity: "Cotton",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch Maharashtra cotton prices",
      error: error.response?.data || error.message,
    });
  }
});


// Test AGMARKNET filters
router.get("/filters", async (req, res) => {
  try {
    const data = await getMarketFilters();

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch AGMARKNET filters",
      error: error.response?.data || error.message,
    });
  }
});

// Test states
router.get("/states", async (req, res) => {
  try {
    const data = await getAllStates();

    res.json(data);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch states",
      error: error.response?.data || error.message,
    });
  }
});

router.get("/markets/yavatmal", async (req, res) => {
  try {
    const data = await getMarketsByDistrict(374);

    res.json({
      success: true,
      district: "Yavatmal",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch markets",
      error: error.response?.data || error.message,
    });
  }
});

router.get("/commodities", async (req, res) => {
  try {
    const data = await getCommodities();

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch commodities",
      error: error.response?.data || error.message,
    });
  }
});

router.get("/filters", async (req, res) => {
  try {
    const data = await getMarketFilters();

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch AGMARKNET filters",
      error: error.response?.data || error.message,
    });
  }
});

router.get("/commodity/cotton", async (req, res) => {
  try {
    const data = await findCommodity("cotton");

    res.json({
      success: true,
      search: "cotton",
      count: data.length,
      commodities: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to search commodity",
      error: error.response?.data || error.message,
    });
  }
});


router.get("/market/wani", async (req, res) => {
  try {
    const data = await findMarkets("wani");

    res.json({
      success: true,
      search: "wani",
      count: data.length,
      markets: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to search market",
      error: error.response?.data || error.message,
    });
  }
});


router.get("/price/wani-cotton", async (req, res) => {
  try {
    const data = await getMarketPricesLastWeek({
      stateId: 20,
      districtId: 374,
      marketId: 3978,
      commodityId: 15,
    });

    res.json({
      success: true,
      location: {
        state: "Maharashtra",
        district: "Yavatmal",
        market: "Mahavira Agricare Pvt Ltd, Lalguda, Wani",
        commodity: "Cotton",
      },
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch market prices",
      error: error.response?.data || error.message,
    });
  }
});



router.get("/price/yavatmal-cotton-markets", async (req, res) => {
  try {
    const markets = [
      {
        id: 3978,
        name: "Mahavira Agricare Pvt Ltd, Lalguda, Wani",
      },
      {
        id: 3985,
        name: "Mahavir Agriculture Produce Market Company Pvt Ltd, Talegaon",
      },
      {
        id: 4018,
        name: "Mahesh Krushi Utpanna Bazar, Digras",
      },
    ];

    const results = [];

    for (const market of markets) {
      try {
        const data = await getMarketPricesLastWeek({
          stateId: 20,
          districtId: 374,
          marketId: market.id,
          commodityId: 15,
        });

        results.push({
          marketId: market.id,
          marketName: market.name,
          data,
        });
      } catch (error) {
        results.push({
          marketId: market.id,
          marketName: market.name,
          error: error.response?.data || error.message,
        });
      }
    }

    res.json({
      success: true,
      state: "Maharashtra",
      district: "Yavatmal",
      commodity: "Cotton",
      results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch Yavatmal cotton prices",
      error: error.response?.data || error.message,
    });
  }
});


module.exports = router;