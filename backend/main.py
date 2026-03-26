from fastapi import FastAPI, UploadFile, File  # type: ignore
from fastapi.middleware.cors import CORSMiddleware  # type: ignore
from extractor import extract_text  # type: ignore
from simplifier import simplify_text, detect_risks  # type: ignore

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    contents = await file.read()
    raw_text = extract_text(contents)
    simplified = simplify_text(raw_text)
    risks = detect_risks(raw_text)
    return {
        "original_text": raw_text,
        "simplified_text": simplified,
        "risk_clauses": risks,
        "stats": {
            "pages": len([p for p in raw_text.split("\f") if p.strip()]),
            "clauses_found": len(risks) + 8,
            "risk_items": len(risks),
            "reading_time_saved": f"{len(raw_text.split()) // 200} mins"
        }
    }
