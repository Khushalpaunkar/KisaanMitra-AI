# 🌾 KisaanMitra AI

### One AI for Every Farm Decision.

**Smarter Farming. Better Decisions.**

<p align="center">
  <strong>AI-Powered Agricultural Decision Support Platform for Indian Farmers</strong>
</p>

<p align="center">
  🌱 Crop Intelligence &nbsp; • &nbsp;
  🦠 Disease Detection &nbsp; • &nbsp;
  🌦️ Weather Intelligence &nbsp; • &nbsp;
  📈 Market Intelligence &nbsp; • &nbsp;
  🏛️ Government Schemes
</p>

---

## 🚀 Live Demo

🌐 **[Visit KisaanMitra AI](https://kisaanmitra-ai.onrender.com/)**

💻 **[View Source Code](YOUR_GITHUB_REPOSITORY_LINK)**

---

## 🌾 About KisaanMitra AI

**KisaanMitra AI** is an AI-powered agricultural assistant designed to help Indian farmers make smarter and more informed farming decisions through a single, simple platform.

The platform combines **Artificial Intelligence, weather intelligence, agricultural market information, crop analysis, disease detection, and government scheme discovery** to create a digital farming companion for Indian farmers.

Instead of searching across multiple platforms, farmers can access important agricultural information from one place.

> **From crop planning to crop health, from weather to market information — KisaanMitra AI brings essential farm intelligence together.**

---

## 💡 Why KisaanMitra AI?

Farmers often need information from multiple sources before making an agricultural decision.

For example:

```text
What crop should I grow?
        ↓
Is my soil suitable?
        ↓
What will the weather be like?
        ↓
Is my crop affected by disease?
        ↓
What is the current market situation?
        ↓
Which government scheme can help me?
```

KisaanMitra AI aims to connect these decisions through one intelligent platform.

### 🎯 Core Idea

> **One AI. Every Farm Decision.**

---

# ✨ Key Features

## 🤖 1. AI Farming Assistant

A conversational agricultural assistant powered by **Google Gemini API**.

Farmers can ask questions about:

* 🌱 Crop cultivation
* 💧 Irrigation
* 🌾 Fertilizers
* 🐛 Pest management
* 🌦️ Weather-related decisions
* 🦠 Crop diseases
* 🏛️ Government schemes
* 📈 Agricultural markets
* 🌿 General farming practices

### 🌐 Multilingual Support

The AI assistant supports:

* 🇮🇳 Marathi
* 🇮🇳 Hindi
* 🇬🇧 English

Responses are designed to use simple, farmer-friendly language.

---

# 🌱 2. AI Crop Intelligence

The Crop Intelligence module helps farmers understand which crops may be suitable for their farming conditions.

### Farmer Inputs

* Land area
* Soil type
* Previous crop
* Water availability
* Season
* Location
* Soil testing information

### AI Analysis

The system generates information such as:

* 🌾 Recommended crops
* 📊 Crop suitability
* 🌱 Soil compatibility
* 💧 Water requirements
* ⏳ Crop duration
* 📋 Farming considerations
* 🤖 AI-generated recommendations

### Example

```text
Land Area       : 3 Acres
Soil Type       : Medium Black Soil
Previous Crop   : Cotton
Water           : Medium Borewell
Season          : Rabi
Location        : Wani, Yavatmal
```

The AI can analyze these conditions and provide structured crop recommendations.

---

# 🦠 3. AI Crop Disease Detection

Farmers can upload a crop image and receive AI-assisted crop health analysis.

### Input

* 📸 Crop image
* 🌱 Crop name
* 📍 Location
* 🗣️ Preferred language
* ❓ Farmer's question

### AI Output

The system can provide:

* Possible disease
* Visible symptoms
* Possible causes
* Immediate actions
* Preventive measures
* General crop-care guidance

### Supported Images

```text
JPG
PNG
WEBP
```

**Maximum image size:** `5 MB`

> ⚠️ Disease detection is AI-assisted and should not replace professional agricultural advice, especially for serious crop damage.

---

# 🌦️ 4. Smart Weather Intelligence

Weather information can directly affect farming decisions.

KisaanMitra AI provides location-based weather information such as:

* 🌡️ Temperature
* 💧 Humidity
* 💨 Wind speed
* 🌧️ Weather conditions
* 📍 Location-based information

The weather module is designed to help farmers consider weather conditions while planning agricultural activities.

---

# 📈 5. Agricultural Market Intelligence

The Market Intelligence module focuses on agricultural market information.

Farmers can explore information based on:

* 🌾 Commodity / Crop
* 📍 State
* 🏘️ District
* 🏪 Market
* 🌱 Variety
* 💰 Market prices

The module is being integrated with Indian agricultural market data sources such as **Agmarknet and government agricultural datasets**.

### Goal

Help farmers understand available market information before making selling-related decisions.

---

# 🏛️ 6. Government Schemes Finder

Many farmers know about government schemes but may not know:

> **Which scheme is relevant to my situation?**

KisaanMitra AI organizes agricultural schemes into categories.

### Categories

| Category                | Examples                   |
| ----------------------- | -------------------------- |
| 💰 Financial Assistance | Farmer financial support   |
| 🛡️ Crop Insurance      | Crop protection schemes    |
| 🏦 Agricultural Loans   | Farmer credit support      |
| 🚜 Equipment            | Agricultural machinery     |
| 💧 Irrigation           | Water & irrigation support |
| 🌱 Seeds                | Seed-related assistance    |
| 🐄 Livestock            | Animal husbandry schemes   |
| 🌳 Horticulture         | Horticulture support       |

### Features

* 🔎 Scheme search
* 🏷️ Category filtering
* 📋 Eligibility information
* 💰 Benefits
* 🔗 Official sources
* ⭐ Saved schemes
* ⚖️ Scheme comparison
* 🤖 AI-assisted recommendations
* 🌐 Multilingual information

Official government sources are prioritized wherever applicable.

---

# 🔐 7. Authentication System

KisaanMitra AI includes a complete authentication workflow.

### Features

* User Registration
* User Login
* Session Management
* Password Hashing
* User Profile
* Protected Routes
* Logout

### Technologies

```text
Express Session
bcrypt
MongoDB
Mongoose
```

Passwords are hashed before being stored.

---

# 👤 8. User Profile

Authenticated users can maintain their basic profile information.

Profile information can include:

* Name
* Address
* Mobile number
* Account information

This creates a foundation for future personalized farming recommendations.

---

# 💬 9. AI Chat History

Authenticated users can access their previous AI conversations.

Stored information can include:

```text
User ID
Conversation ID
User Message
AI Response
Timestamp
```

### Guest Mode

Users can also try the AI assistant without creating an account.

Guest conversations are not permanently stored in the user's account.

---

# ⭐ 10. Feedback System

KisaanMitra AI includes a feedback system to understand user experience.

Users can share:

* Experience
* Suggestions
* Feedback
* Improvement ideas

Feedback is stored in MongoDB for further analysis.

---

# 🧠 System Architecture

```text
                         ┌──────────────────────┐
                         │   Farmer / User      │
                         └──────────┬───────────┘
                                    │
                                    ▼
                    ┌─────────────────────────────┐
                    │       EJS Web Interface     │
                    │    HTML + CSS + JavaScript  │
                    └─────────────┬───────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────────┐
                    │      Express.js Server      │
                    │        Node.js Backend      │
                    └─────────────┬───────────────┘
                                  │
              ┌───────────────────┼────────────────────┐
              │                   │                    │
              ▼                   ▼                    ▼
      ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
      │   MongoDB    │    │  Gemini API  │    │  Weather API │
      │   Database   │    │  AI Engine   │    │              │
      └──────────────┘    └──────────────┘    └──────────────┘
                                  │
                                  ▼
                       ┌─────────────────────┐
                       │ Agricultural Data   │
                       │ Market + Schemes    │
                       └─────────────────────┘
```

---

# 🏗️ Project Architecture

KisaanMitra AI follows a structured **MVC architecture**.

```text
KisaanMitra-AI/
│
├── config/
│   ├── db.js
│   ├── gemini.js
│   ├── cloudinary.js
│   └── marketApi.js
│
├── controllers/
│   ├── authController.js
│   ├── chatController.js
│   ├── cropController.js
│   ├── diseaseController.js
│   ├── weatherController.js
│   ├── marketController.js
│   ├── schemeController.js
│   └── profileController.js
│
├── middleware/
│   └── authentication / session middleware
│
├── models/
│   ├── User.js
│   ├── Conversation.js
│   ├── Feedback.js
│   └── other application models
│
├── routes/
│   ├── authRoutes.js
│   ├── chatRoutes.js
│   ├── cropRoutes.js
│   ├── diseaseRoutes.js
│   ├── weatherRoutes.js
│   ├── marketRoutes.js
│   ├── schemeRoutes.js
│   └── feedbackRoutes.js
│
├── views/
│   ├── home.ejs
│   ├── chat.ejs
│   ├── crop/
│   ├── cropdisease/
│   ├── weather/
│   ├── market/
│   ├── schemes/
│   ├── auth/
│   └── profile/
│
├── public/
│   ├── css/
│   ├── js/
│   └── images/
│
├── app.js
├── package.json
├── .env
└── README.md
```

> The project structure may evolve as new features are added.

---

# 🛠️ Technology Stack

## Frontend

* HTML5
* CSS3
* JavaScript
* EJS
* Responsive Web Design

## Backend

* Node.js
* Express.js

## Database

* MongoDB
* Mongoose
* MongoDB Atlas

## Artificial Intelligence

* Google Gemini API

## External APIs / Services

* Weather API
* Agricultural Market Data APIs
* Government Agricultural Datasets
* Government Scheme Sources
* Cloudinary

## Security

* Express Session
* bcrypt
* Environment Variables
* Input Validation
* Output Sanitization

---

# 📂 Main Modules

| Module                 | Description                         |
| ---------------------- | ----------------------------------- |
| 🤖 AI Assistant        | Conversational agricultural support |
| 🌱 Crop Intelligence   | AI-based crop recommendations       |
| 🦠 Disease Detection   | AI-assisted crop image analysis     |
| 🌦️ Weather            | Location-based weather information  |
| 📈 Market Intelligence | Agricultural market information     |
| 🏛️ Government Schemes | Scheme discovery and comparison     |
| 🔐 Authentication      | Secure user accounts                |
| 👤 Profile             | User profile management             |
| 💬 Chat History        | Conversation storage                |
| ⭐ Feedback             | User experience collection          |

---

# 🔄 How KisaanMitra AI Works

### 01 — User Input

The farmer provides information through the web interface.

```text
Crop
Location
Soil
Land Area
Crop Image
Farmer Question
```

### 02 — Backend Processing

The Express.js server receives and validates the request.

### 03 — Data & AI Processing

Depending on the feature, the request can be processed using:

```text
Gemini AI
Weather APIs
Agricultural Market Data
Government Scheme Data
MongoDB
```

### 04 — Structured Response

The system processes the result and presents understandable information to the user.

### 05 — Farm Decision Support

The farmer can use the information as one input when making an agricultural decision.

---

# 🌍 Example Use Case

### 👨‍🌾 Farmer Scenario

A farmer from **Wani, Yavatmal, Maharashtra** wants to decide which crop may be suitable during the Rabi season.

The farmer enters:

```text
Land Area       : 3 Acres
Soil            : Medium Black Soil
Previous Crop   : Cotton
Water           : Medium Borewell
Season          : Rabi
Location        : Wani, Yavatmal
```

KisaanMitra AI can analyze these inputs and provide:

```text
🌱 Crop Recommendation
📊 Suitability
💧 Water Requirement
⏳ Crop Duration
🌾 Soil Compatibility
📋 Important Considerations
🤖 AI Recommendation
```

This demonstrates how agricultural information can be converted into structured decision-support information.

---

# 📊 Development Status

| Feature                   | Status                |
| ------------------------- | --------------------- |
| 🏠 Landing Page           | ✅ Completed           |
| 🧭 Responsive Navigation  | ✅ Completed           |
| 🔐 Authentication         | ✅ Completed           |
| 🗄️ MongoDB Integration   | ✅ Completed           |
| 🤖 AI Chat Assistant      | ✅ Completed           |
| 👤 Guest Chat             | ✅ Completed           |
| 💬 Chat History           | ✅ Completed           |
| 🌦️ Weather Module        | ✅ Completed           |
| 🌱 Crop Intelligence      | ✅ Completed           |
| 🦠 Crop Disease Detection | ✅ Implemented         |
| 🏛️ Government Schemes    | ✅ Implemented         |
| ⭐ Feedback System         | ✅ Completed           |
| 👤 User Profile           | ✅ Implemented         |
| 📈 Market Intelligence    | 🚧 Active Development |

---

# ⚙️ Installation & Setup

## 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_LINK
```

## 2. Navigate to Project

```bash
cd KisaanMitra-AI
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Create Environment File

Create a `.env` file in the root directory.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

GEMINI_API_KEY=your_gemini_api_key

SESSION_SECRET=your_session_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## 5. Start the Application

### Development

```bash
npm run dev
```

### Or

```bash
node app.js
```

## 6. Open in Browser

```text
http://localhost:5000
```

---

# 📦 Main Dependencies

The project uses Node.js packages such as:

```text
express
mongoose
ejs
dotenv
bcrypt
express-session
axios
@google/generative-ai
cloudinary
multer
dompurify
```

Install dependencies using:

```bash
npm install
```

---

# 🔐 Environment & Security

Never expose API keys or database credentials publicly.

Add the following to `.gitignore`:

```text
.env
node_modules/
```

### Security Practices

* Password hashing with bcrypt
* Session-based authentication
* Environment-based credentials
* Input validation
* Sanitized AI output
* Protected routes
* MongoDB authentication

---

# 🎯 Project Objectives

The major objectives of KisaanMitra AI are:

1. Build an accessible AI assistant for Indian farmers.
2. Provide multiple agricultural services through one platform.
3. Support regional languages such as Marathi and Hindi.
4. Simplify complex agricultural information using AI.
5. Assist farmers with crop planning.
6. Provide AI-assisted crop disease analysis.
7. Provide weather and market information.
8. Help farmers discover relevant government schemes.
9. Create a scalable agricultural technology platform.
10. Explore the practical application of Generative AI in agriculture.

---

# 🔮 Future Enhancements

Future versions of KisaanMitra AI can include:

* 📱 Progressive Web App
* 📲 Dedicated Android / iOS Application
* 🎙️ Voice-based AI Assistant
* 🗣️ Marathi Voice Interaction
* 📷 Advanced Real-Time Crop Scanning
* 📊 Historical Market Price Analytics
* 🔔 Personalized Weather Alerts
* 🌧️ Rainfall-Based Farming Alerts
* 💧 Smart Irrigation Recommendations
* 🛰️ Satellite-Based Crop Monitoring
* 🌱 Soil Health Integration
* 📍 Nearby Mandi Discovery
* 🧑‍🌾 Agricultural Expert Connectivity
* 📡 IoT Sensor Integration
* 🤖 Personalized Farm AI
* 📈 Predictive Agricultural Analytics

---

# 🛡️ Disclaimer

KisaanMitra AI is an **AI-powered agricultural decision-support platform** developed for educational, research, and demonstration purposes.

AI-generated information may contain inaccuracies and may not fully represent local agricultural conditions.

Farmers should verify important decisions with:

* Qualified agricultural experts
* Local agricultural officers
* Agricultural universities
* Trusted government sources

Weather information, market prices, government schemes, eligibility criteria, and other external information may change over time.

---

# 👨‍💻 Developer

## Khushal Paunkar

**B.Tech Computer Science Engineering Student**
**JD College of Engineering and Management, Nagpur**



---

# 📚 Academic Project

**Project Name:** KisaanMitra AI
**Project Type:** AI-Powered Full-Stack Web Application
**Domain:** Artificial Intelligence + Agriculture
**Architecture:** MVC
**Backend:** Node.js + Express.js
**Frontend:** EJS + HTML + CSS + JavaScript
**Database:** MongoDB Atlas
**AI Engine:** Google Gemini API

---

# 🌱 Vision

> **Technology should not make farming more complicated.
> It should make better decisions easier.**

KisaanMitra AI aims to bridge the gap between **modern Artificial Intelligence and everyday farming** by making agricultural technology more accessible, understandable, and useful for Indian farmers.

---

# ⭐ Support the Project

If you find **KisaanMitra AI** interesting:

⭐ Star the repository
🍴 Fork the project
💡 Share suggestions
🐛 Report issues
🤝 Contribute improvements

---

# 📄 License

This project is developed for **academic, learning, research, and demonstration purposes**.

---

<div align="center">

## 🌾 KisaanMitra AI

### One AI for Every Farm Decision.

**Smarter Farming. Better Decisions.**

### Built by **Khushal Paunkar** 🇮🇳

</div>

