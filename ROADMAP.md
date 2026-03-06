# 🗺️ NeerKavach Roadmap

NeerKavach is a smart water surveillance and disease risk prediction platform designed to help authorities identify potential outbreaks of water-borne diseases early.

This roadmap outlines the **current capabilities of the project and the future direction** for development. While the initial version was built during a hackathon, the long-term goal is to evolve NeerKavach into a **scalable environmental health monitoring system**.

---

# 🚀 Version 1.0 — Hackathon Release

The first release focuses on building a functional system that collects water quality data and predicts potential disease risks.

### Implemented Features

🧪 **Water Quality Report Submission**

Authorities can submit water testing reports containing parameters such as:

- Water Source Type  
- Contaminant Level (ppm)  
- pH Level  
- Turbidity (NTU)  
- Dissolved Oxygen (mg/L)  
- Nitrate Level (mg/L)  
- Bacteria Count (CFU/mL)  
- Fecal Coliform  
- Total Coliform  
- Temperature  

🤖 **AI-Based Disease Risk Prediction**

Using the submitted parameters, the ML model predicts the likelihood (%) of:

- Diarrheal Disease  
- Cholera  
- Typhoid  

📊 **Monitoring Dashboard**

Authorities can view:

- Reports they submitted  
- Prediction results  
- Risk summaries

🗺️ **Hotspot Risk Map**

Locations with higher predicted disease risk are highlighted on a map to help authorities quickly identify vulnerable areas.

📢 **Automated Awareness Suggestions**

After prediction, NeerKavach provides preventive recommendations such as:

- Boiling drinking water  
- Water chlorination  
- Community hygiene measures

---

# 🌱 Planned Improvements (v1.1 → v2.0)

Future versions aim to improve **prediction accuracy, usability, and real-world deployment capability**.

---

## v1.1 — Improved Monitoring

- Risk categorization (Low / Medium / High)
- Advanced dashboard analytics
- Historical data comparison
- Exportable reports (PDF / CSV)
- Better hotspot visualization

---

## v1.5 — Field Usability

- Mobile responsive interface for field workers
- Offline report submission
- Multi-language support
- Improved awareness recommendation engine

---

## v2.0 — Smart Water Surveillance System

- Integration with low-cost water quality sensors
- Automated contamination alerts
- Real-time monitoring of water sources
- AI-powered outbreak early warning system
- Integration with government health monitoring systems

---

# ⚠️ Known Limitations / Technical Debt

Due to hackathon time constraints, some areas require improvement:

- Limited dataset used for ML model training
- Prediction accuracy can improve with real-world data
- Manual entry of water testing parameters
- Map visualization currently supports basic hotspot identification
- Backend prediction pipeline can be optimized for scalability

These will be addressed in future releases.

---

# 🤝 Call for Contributors

NeerKavach is designed as an **open-source project**, and we welcome contributions from developers, researchers, and public health enthusiasts.

We are especially looking for contributors in the following areas:

### Machine Learning
- Improve prediction accuracy
- Train models with larger environmental datasets
- Implement anomaly detection for contamination spikes

### Web Development
- Improve dashboard UI/UX
- Add advanced visualizations and charts
- Improve performance and responsiveness

### Backend Development
- Improve API structure
- Implement scalable data pipelines
- Add automated alert systems

### Public Health Research
- Validate prediction models with epidemiological studies
- Improve disease risk modeling

---

# 🌍 Long-Term Vision

NeerKavach aims to become a **community-scale environmental health monitoring platform**.

By combining **water quality data, machine learning predictions, and geographic risk mapping**, the system can help authorities detect contamination early and prevent water-borne disease outbreaks.

The ultimate goal is simple:

**Safer water. Healthier communities.**