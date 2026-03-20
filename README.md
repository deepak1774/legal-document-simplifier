# ⚖️ AI-Powered Legal Document Simplifier

A full-stack web application that transforms complex legal documents into plain, easy-to-understand language — and automatically flags risky clauses. Upload a PDF and get an instant, AI-generated summary with risk analysis.

---

## ✨ Features

- 📄 **PDF Upload** — Drag & drop or click to upload any legal PDF
- 🤖 **AI Summarisation** — Simplifies dense legal language using HuggingFace Transformers
- 🚨 **Risk Detection** — Automatically identifies and highlights risky clauses
- 📊 **Document Stats** — Pages, clauses found, risk items, and estimated reading time saved
- ⚡ **Fast & Responsive** — React + Vite frontend with smooth animations via Framer Motion

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Framer Motion, Axios |
| Backend | FastAPI, Uvicorn |
| PDF Parsing | PyMuPDF (fitz) |
| AI Model | HuggingFace Transformers (summarisation pipeline) |

---

## 📁 Project Structure

```
Legal Document Simplifier/
├── backend/
│   ├── main.py          # FastAPI app & /upload endpoint
│   ├── extractor.py     # PDF text extraction (PyMuPDF)
│   ├── simplifier.py    # AI summarisation & risk detection
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/  # UploadArea, ResultsView, RiskCards, Footer, etc.
│   │   ├── App.css
│   │   └── index.css
│   ├── .env             # VITE_API_URL=http://localhost:8000
│   └── package.json
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+

### 1. Clone the repository

```bash
git clone https://github.com/deepak1774/legal-document-simplifier.git
cd legal-document-simplifier
```

### 2. Set up the Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv .venv
.venv\Scripts\activate      # Windows
# source .venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Start the backend server
uvicorn main:app --reload --port 8000
```

> The backend will be available at `http://localhost:8000`

### 3. Set up the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

> The frontend will be available at `http://localhost:5173`

---

## 🔧 Environment Variables

Create a `.env` file inside the `frontend/` directory:

```env
VITE_API_URL=http://localhost:8000
```

---

## 📖 How It Works

1. **Upload** a legal PDF via the drag-and-drop interface
2. The **backend** extracts text using PyMuPDF
3. The extracted text is passed through a **HuggingFace summarisation model**
4. The app **detects risky clauses** (e.g. liability, termination, indemnity)
5. Results are displayed with a **simplified summary**, **risk cards**, and **document stats**

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).

---

> Built by [deepak1774](https://github.com/deepak1774)
