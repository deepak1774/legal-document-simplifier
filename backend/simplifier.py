"""
Fast legal document simplifier — no neural models.
Uses a comprehensive legal-to-plain-English dictionary + sentence scoring.
Runs in < 100ms per page.
"""
import re
from collections import Counter

# ─── Legal Jargon → Plain English dictionary ──────────────────────────────────
LEGAL_DICT = {
    # Parties & references
    r'\bhereinafter\b': 'from here on called',
    r'\bhereto\b': 'to this agreement',
    r'\bherein\b': 'in this document',
    r'\bthereof\b': 'of that',
    r'\btherein\b': 'in that',
    r'\bthereto\b': 'to that',
    r'\bwhereof\b': 'of which',
    r'\bwhereas\b': 'Given that',
    r'\bhereby\b': 'by this agreement',
    r'\bhereunder\b': 'under this agreement',
    r'\bthereunder\b': 'under that',
    r'\baforesaid\b': 'previously mentioned',
    r'\bsaid\b(?=\s+\w)': 'the',
    r'\bforthwith\b': 'immediately',
    r'\bwithall\b': 'with that',
    r'\bwhereupon\b': 'after which',
    r'\bthereupon\b': 'then',
    r'\bthereafter\b': 'after that',
    r'\bwhereby\b': 'by which',
    r'\bnotwithstanding\b': 'despite',
    r'\bnevertheless\b': 'however',
    r'\bpursuant to\b': 'in accordance with',
    r'\bin accordance with\b': 'following',
    r'\bsubject to\b': 'depending on',
    r'\bin the event (that|of)\b': 'if',
    r'\bprior to\b': 'before',
    r'\bsubsequent to\b': 'after',
    r'\bIn lieu of\b': 'Instead of',
    r'\bin lieu of\b': 'instead of',
    r'\binter alia\b': 'among other things',
    r'\bipso facto\b': 'by that fact',
    r'\bpari passu\b': 'equally',
    r'\bmutatis mutandis\b': 'with necessary changes',
    r'\bforce majeure\b': 'unforeseeable events beyond control',
    r'\bindemnify\b': 'compensate and protect',
    r'\bindemnification\b': 'financial protection',
    r'\bindemnitor\b': 'the party providing protection',
    r'\bindemnitee\b': 'the protected party',
    r'\bwarranty\b': 'guarantee',
    r'\bwarrants\b': 'guarantees',
    r'\brepresentation\b': 'statement of fact',
    r'\brepresentations\b': 'statements of fact',
    r'\bbreach\b': 'violation',
    r'\bbreaches\b': 'violations',
    r'\bin breach\b': 'in violation',
    r'\bdefault\b': 'failure to meet obligations',
    r'\bliability\b': 'legal responsibility',
    r'\bliable\b': 'legally responsible',
    r'\bobligation(s?)\b': 'duty/duties',
    r'\bremedy\b': 'legal solution',
    r'\bremedies\b': 'legal solutions',
    r'\bconstitute(s?)\b': 'is/are considered',
    r'\bconstruction\b(?=\s+(of|shall))': 'interpretation',
    r'\bexecute(s?)\b': 'sign(s)',
    r'\bexecution\b': 'signing',
    r'\bseverability\b': 'if one part is invalid, the rest still applies',
    r'\bseverable\b': 'able to stand independently',
    r'\bamendment\b': 'change to the agreement',
    r'\bwaiver\b': 'giving up a right',
    r'\bwaivers\b': 'giving up rights',
    r'\barbitration\b': 'resolving disputes outside court',
    r'\bmediation\b': 'neutral third-party dispute resolution',
    r'\bjurisdiction\b': 'the court location that handles disputes',
    r'\bgoverning law\b': 'the state/country law that applies',
    r'\bconfidentiality\b': 'keeping information private',
    r'\bproprietary\b': 'privately owned',
    r'\bterminate(s?)\b': 'end(s)',
    r'\btermination\b': 'ending the agreement',
    r'\bauto-?renewal\b': 'automatic renewal',
    r'\brenew(s?)\b': 'continue(s) automatically',
    r'\bpenalty\b': 'fine/fee',
    r'\bpenalties\b': 'fines/fees',
    r'\bdamages\b': 'financial compensation',
    r'\bliquidated damages\b': 'pre-agreed financial penalties',
    r'\bconsequential damages\b': 'indirect financial losses',
    r'\bnon-disclosure\b': 'keeping information secret',
    r'\bnon-compete\b': 'restriction on working for competitors',
    r'\bassignment\b': 'transferring rights to someone else',
    r'\bassign\b': 'transfer',
    r'\bassignee\b': 'the person receiving the transfer',
    r'\bassignor\b': 'the person making the transfer',
    r'\bsubcontract\b': 'hire another party to do the work',
    r'\bindependent contractor\b': 'self-employed worker (not an employee)',
    r'\bintellectual property\b': 'creative works and inventions (patents, copyrights)',
    r'\bproprietary information\b': 'private business information',
    r'\btrade secret(s?)\b': 'confidential business methods',
    r'\bcopyright\b': 'legal ownership of creative work',
    r'\btrademark\b': 'protected brand name or logo',
    r'\bpat?ent(s?)\b': 'legal protection for inventions',
    r'\bwork product\b': 'deliverables created for this project',
    r'\bmaterial breach\b': 'serious violation of the agreement',
    r'\bcure period\b': 'time to fix a violation',
    r'\bnotice period\b': 'advance warning time required',
    r'\bwritten notice\b': 'official written communication',
    r'\bat (its|their|his|her) sole discretion\b': 'entirely at their own choosing',
    r'\bsole discretion\b': 'complete freedom to decide',
    r'\bcommence(s?)\b': 'begin(s)',
    r'\bcommencement\b': 'beginning',
    r'\bexpiration\b': 'end date',
    r'\bterm of (the|this) agreement\b': 'length/duration of this contract',
    r'\bgood faith\b': 'honestly and fairly',
    r'\barm\'s length\b': 'without any special relationship or bias',
    r'\bdue diligence\b': 'thorough investigation/research',
    r'\bforce of law\b': 'legally binding',
    r'\bbinding\b': 'legally required',
    r'\bmutually agree(d?)\b': 'both parties agreed',
    r'\bunilateral(ly)?\b': 'by one party alone',
    r'\beffective date\b': 'start date',
    r'\bcounterpart(s?)\b': 'separate identical copy/copies of this agreement',
    r'\bappended hereto\b': 'attached to this document',
    r'\bexhibit\b': 'attached document',
    r'\bschedule\b(?=\s+[A-Z])': 'attachment',
    r'\baddendum\b': 'addition to the agreement',
    r'\bsupersede(s?)\b': 'replace(s)',
    r'\bprecedence\b': 'priority',
    r'\battest(s?)\b': 'confirm(s)',
    r'\backnowledge(s?)\b': 'agree(s) that',
}

# Legal importance keywords for sentence scoring
LEGAL_IMPORTANCE = [
    "shall", "must", "agree", "obligation", "payment", "terminate", "liable",
    "responsible", "penalty", "damages", "breach", "notice", "confidential",
    "exclusive", "rights", "warranty", "indemnif", "arbitrat", "jurisdiction",
    "govern", "effective", "expire", "renew", "cancel", "refund", "fee", "cost",
    "intellectual property", "prohibited", "forbidden", "restrict", "non-compete",
    "default", "remedy", "dispute", "court", "law", "binding"
]

STOP_WORDS = set([
    "the","a","an","and","or","but","in","on","at","to","for","of",
    "with","by","from","as","is","are","was","were","be","been","being",
    "have","has","had","do","does","did","will","would","shall","should",
    "may","might","can","could","this","that","these","those","it","its",
])

RISK_KEYWORDS = {
    "termination": "high",
    "auto-renewal": "medium",
    "auto renewal": "medium",
    "liability": "high",
    "indemnification": "high",
    "arbitration": "medium",
    "penalty": "high",
    "confidentiality": "medium",
    "jurisdiction": "low",
    "breach": "high",
    "default": "high",
    "damages": "high",
    "intellectual property": "medium",
    "governing law": "low",
    "limitation of liability": "high",
    "force majeure": "low",
    "non-compete": "high",
    "assignment": "medium",
    "warranty": "medium",
}


def _simplify_sentence(text: str) -> str:
    """Apply legal jargon substitutions to a sentence."""
    for pattern, replacement in LEGAL_DICT.items():
        text = re.sub(pattern, replacement, text, flags=re.IGNORECASE)
    # Capitalize first letter
    if text:
        text = text[0].upper() + text[1:]  # type: ignore
    return text.strip()


def _score_sentence(sentence: str) -> int:
    """Score a sentence by legal importance."""
    lower = sentence.lower()
    score: int = 0
    for keyword in LEGAL_IMPORTANCE:
        if keyword in lower:
            score = score + 10  # type: ignore
    words = [w for w in re.findall(r'\w+', lower) if w not in STOP_WORDS]
    score = score + len(words)  # type: ignore
    return score


def _extract_and_simplify(page_text: str, top_n: int = 5) -> list:
    """Extract + simplify the top N most important sentences from a page."""
    # Split into sentences
    raw_sentences = re.split(r'(?<=[.!?])\s+(?=[A-Z])', page_text)
    raw_sentences = [s.strip() for s in raw_sentences if len(s.strip().split()) >= 8]

    if not raw_sentences:
        return []

    # Score and pick top N
    scored = [(s, _score_sentence(s)) for s in raw_sentences]
    scored.sort(key=lambda x: x[1], reverse=True)
    top = [s for s, _ in scored[:top_n]]  # type: ignore

    # Preserve reading order
    ordered = [s for s in raw_sentences if s in set(top)]

    # Apply simplification + truncate to ~20 words for concise bullet points
    simplified = []
    for s in ordered:
        clean = _simplify_sentence(s)
        words = clean.split()
        if len(words) > 20:
            clean = ' '.join(words[:20]).rstrip(',;:') + '.'  # type: ignore
        simplified.append(clean)
    return simplified


def simplify_text(text: str) -> str:
    """
    Analyzes every page. Returns 20-30 plain-English bullet points with page numbers,
    covering the most legally important points across the entire document.
    """
    pages = [p.strip() for p in text.split('\f') if len(p.strip()) > 80]

    if not pages:
        return "• No meaningful content could be extracted from this document."

    # Collect all sentences with their page number
    all_sentences = []  # list of (sentence, page_num)
    for page_num, page_text in enumerate(pages, start=1):
        raw = re.split(r'(?<=[.!?])\s+(?=[A-Z])', page_text)
        for s in raw:
            s = s.strip()
            if len(s.split()) >= 8:
                all_sentences.append((s, page_num))

    if not all_sentences:
        return "• Could not identify legal sentences in this document."

    # Deduplicate by first 60 chars
    seen = set()
    unique = []
    for s, pn in all_sentences:
        key = s[:60]
        if key not in seen:
            seen.add(key)
            unique.append((s, pn))

    # Score every sentence globally
    scored = [(s, pn, _score_sentence(s)) for s, pn in unique]
    scored.sort(key=lambda x: x[2], reverse=True)

    # Pick top 25, sorted back into document order (by page)
    top = scored[:25]  # type: ignore
    top.sort(key=lambda x: x[1])  # sort by page number for reading order

    bullets = []
    for s, pn, _ in top:
        simplified = _simplify_sentence(s)
        words = simplified.split()
        if len(words) > 20:
            simplified = ' '.join(words[:20]).rstrip(',;:') + '.'  # type: ignore
        bullets.append(f"• [Pg. {pn}] {simplified}")

    return "\n".join(bullets)


def detect_risks(text: str) -> list:
    risks = []
    lower = text.lower()
    for keyword, severity in RISK_KEYWORDS.items():
        if keyword in lower:
            idx = lower.find(keyword)
            excerpt = text[max(0, idx - 100):idx + 200]  # type: ignore
            risks.append({
                "type": keyword,
                "severity": severity,
                "original": excerpt.strip(),
                "simplified": _simplify_sentence(
                    f"This clause contains a {keyword} provision that may significantly affect your rights or obligations. Review carefully."
                )
            })
    return risks
