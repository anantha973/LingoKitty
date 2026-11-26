#!/usr/bin/env python3
"""
Unified deck builder for LingoKitty.
Combines:
  - drkameleon/complete-hsk-vocabulary (HSK 3.0 wordlists, traditional/simplified, pinyin, POS)
  - zydeo/HanDeDict (149k Chinese <-> German dictionary entries)
  - hugolpz/audio-cmn (human Mandarin word MP3s via jsDelivr CDN)
  - no7z/hsk-sentences-audio (HSK 3.0 graded sentences + normal/slow MP3s + tokens)
  - edge-tts (zh-CN-XiaoxiaoNeural) for only the ~197 HSK 1-2 words missing from audio-cmn
"""

from __future__ import annotations

import asyncio
import hashlib
import json
import os
import re
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CACHE_DIR = ROOT / ".cache"
OUT_DECKS_DIR = ROOT / "src" / "data" / "decks"
GAP_AUDIO_DIR = ROOT / "public" / "audio" / "gap"

AUDIO_CMN_BASE = "https://cdn.jsdelivr.net/gh/hugolpz/audio-cmn@master/64k/hsk/cmn-{}.mp3"
SENTENCE_AUDIO_BASE = "https://raw.githubusercontent.com/no7z/hsk-sentences-audio/main/dist/"

SOURCES = {
    "complete.min.json": "https://raw.githubusercontent.com/drkameleon/complete-hsk-vocabulary/main/complete.min.json",
    "handedict.u8": "https://raw.githubusercontent.com/zydeo/HanDeDict/master/handedict.u8",
    "cmn_audios_words.txt": "https://raw.githubusercontent.com/hugolpz/audio-cmn/master/lists/cmn-audios_words.txt",
    "sentences.json": "https://raw.githubusercontent.com/no7z/hsk-sentences-audio/main/dist/sentences.json",
}

POS_DE = {
    "n": "Nomen",
    "v": "Verb",
    "a": "Adjektiv",
    "d": "Adverb",
    "r": "Pronomen",
    "m": "Zahlwort",
    "q": "Zählwort",
    "p": "Präposition",
    "c": "Konjunktion",
    "u": "Partikel",
    "e": "Interjektion",
    "t": "Zeitwort",
    "f": "Ortswort",
    "s": "Ortsnomen",
    "nz": "Eigenname",
    "nr": "Personenname",
    "ns": "Ortsname",
}

POS_EN = {
    "n": "Noun",
    "v": "Verb",
    "a": "Adjective",
    "d": "Adverb",
    "r": "Pronoun",
    "m": "Numeral",
    "q": "Classifier",
    "p": "Preposition",
    "c": "Conjunction",
    "u": "Particle",
    "e": "Interjection",
    "t": "Time Word",
    "f": "Localizer",
    "s": "Place Noun",
    "nz": "Proper Noun",
    "nr": "Person Name",
    "ns": "Place Name",
    "y": "Modal Particle",
    "cc": "Conjunction",
    "qv": "Verbal Classifier",
    "qt": "Time Classifier",
}

# Preferred (num_pinyin_no_space, optional traditional) for polyphonous/ambiguous HSK 1-2 entries
PREFERRED_FORM_SPEC: dict[str, tuple[str, str | None]] = {
    "个": ("ge4", None),
    "都": ("dou1", None),
    "东西": ("dong1xi5", None),
    "和": ("he2", "和"),
    "还": ("hai2", None),
    "着": ("zhe5", None),
    "吗": ("ma5", None),
    "吧": ("ba5", None),
    "啊": ("a5", None),
    "过": ("guo5", None),
    "了": ("le5", None),
    "得": ("dei3", None),
    "地": ("de5", None),
    "看": ("kan4", None),
    "行": ("xing2", None),
    "说": ("shuo1", None),
    "听": ("ting1", None),
    "比": ("bi3", None),
    "后": ("hou4", "後"),
    "几": ("ji3", "幾"),
    "累": ("lei4", None),
    "别": ("bie2", None),
    "里": ("li3", "裡"),
    "场": ("chang3", "場"),
    "干": ("gan4", "幹"),
    "云": ("yun2", "雲"),
    "喂": ("wei4", "喂"),
    "只": ("zhi3", "只"),
    "长": ("chang2", None),
    "发": ("fa1", "發"),
    "觉": ("jue2", "覺"),
    "少": ("shao3", None),
    "难": ("nan2", None),
    "占": ("zhan4", "占"),
    "数": ("shu3", None),
    "周": ("zhou1", None),
    "克": ("ke4", "克"),
    "正": ("zheng4", None),
    "背": ("bei4", "背"),
    "便": ("bian4", None),
    "便宜": ("pian2yi5", None),
    "读": ("du2", None),
    "上": ("shang4", None),
    "下": ("xia4", None),
    "打": ("da3", None),
    "大": ("da4", None),
    "小": ("xiao3", None),
    "中": ("zhong1", None),
    "要": ("yao4", None),
    "会": ("hui4", None),
    "为": ("wei4", "為"),
    "好": ("hao3", None),
    "雨": ("yu3", None),
    "腿": ("tui3", "腿"),
    "药": ("yao4", None),
    "页": ("ye4", None),
    "脏": ("zang1", None),
    "重": ("zhong4", None),
    "重点": ("zhong4dian3", None),
    "种": ("zhong3", None),
    "教": ("jiao1", None),
    "角": ("jiao3", None),
    "假": ("jia3", None),
    "干嘛": ("gan4ma2", None),
    "高兴": ("gao1xing4", None),
    "兴趣": ("xing4qu4", None),
    "没关系": ("mei2guan1xi5", None),
    "哪里": ("na3li3", None),
    "哪儿": ("na3r5", None),
    "这里": ("zhe4li3", "這裡"),
    "那": ("na4", None),
    "哪": ("na3", None),
    "吧台": ("ba1tai2", None),
    "处": ("chu4", None),
    "分": ("fen1", None),
    "切": ("qie1", None),
    "空": ("kong1", None),
    "量": ("liang2", None),
    "倒": ("dao4", None),
    "把": ("ba3", None),
    "冲": ("chong1", None),
    "当": ("dang1", None),
    "传": ("chuan2", None),
    "弹": ("tan2", None),
    "调": ("tiao2", None),
    "落": ("luo4", None),
    "强": ("qiang2", None),
    "省": ("sheng3", None),
    "盛": ("sheng4", None),
    "挑": ("tiao1", None),
    "吐": ("tu3", None),
    "鲜": ("xian1", None),
    "相": ("xiang1", None),
    "应": ("ying1", None),
    "载": ("zai4", None),
    "转": ("zhuan3", None),
}

# Clean English overrides for HSK 1-2 words where complete.min.json has overly terse or misleading primary glosses
ENGLISH_OVERRIDES = {
    "车上": "in the car / on the vehicle",
    "这时候": "at this moment / right now",
    "送到": "to deliver to",
    "不一会儿": "in a short while / after a moment",
    "不太": "not too / not very",
    "见过": "have seen / have met",
    "不大": "not very big / not very often",
    "打球": "to play ball",
    "读书": "to read a book / to study",
    "没事儿": "it doesn't matter / no problem",
    "一块儿": "together / in the same place",
    "有一些": "some / a few",
    "不够": "not enough / insufficient",
    "好人": "good person",
    "老朋友": "old friend",
    "送给": "to give (as a gift) to",
    "笑话儿": "joke / funny story",
    "的一部分": "part of",
    "中小学": "primary and secondary schools",
    "吃": "to eat",
    "喝": "to drink",
    "在": "at; in; on / (in progress)",
    "有": "to have; there is / are",
    "走": "to walk; to go (on foot)",
    "做": "to do; to make",
    "玩": "to play; to have fun",
    "玩儿": "to play; to have fun",
    "克": "gram (weight)",
    "里": "inside; interior / in",
    "后": "back; behind / after; later",
    "别": "don't (imperative) / other",
    "喂": "hello (on the phone) / hey",
    "干": "to do; to work / dry",
    "得": "must; have to (děi) / structural particle (de)",
    "地": "-ly (adverbial particle) / earth; ground (dì)",
    "个": "(general measure word / classifier)",
    "了": "(completed action / change of state particle)",
    "吗": "(yes-no question particle)",
    "吧": "(suggestion / softening modal particle)",
    "啊": "ah! / (modal particle)",
    "着": "(ongoing action / state aspect particle)",
    "过": "(past experience particle) / to pass; to cross",
}

# Curated German overrides for the ~39 HSK 1-2 words not present in HanDeDict
GERMAN_OVERRIDES = {
    "爸": "Papa / Vater",
    "不大": "nicht sehr groß / nicht besonders",
    "车上": "im Fahrzeug / im Zug",
    "打球": "Ball spielen",
    "弟": "jüngerer Bruder",
    "读书": "ein Buch lesen / lernen",
    "进去": "hineingehen",
    "没事儿": "macht nichts / kein Problem",
    "一块儿": "zusammen / gemeinsam",
    "有一些": "einige / etwas",
    "这边": "hier drüben / diese Seite",
    "笔记": "Notizen (machen)",
    "不够": "nicht genug / unzureichend",
    "不太": "nicht allzu / nicht besonders",
    "不一会儿": "nach einem kurzen Moment",
    "草地": "Wiese / Rasen",
    "常见": "häufig / oft gesehen",
    "出国": "ins Ausland gehen",
    "出院": "aus dem Krankenhaus entlassen werden",
    "从小": "von klein auf",
    "大门": "Haupteingang / großes Tor",
    "的话": "falls / wenn (... dann)",
    "得出": "zu einem Ergebnis kommen",
    "等到": "warten bis",
    "东方": "Osten / Orient",
    "懂得": "verstehen / begreifen",
    "队长": "Teamkapitän / Gruppenleiter",
    "多数": "Mehrheit / die meisten",
    "分数": "Punktzahl / Note / Bruch",
    "好人": "guter Mensch",
    "叫作": "genannt werden / heißen",
    "老朋友": "alter Freund",
    "里头": "drinnen / im Inneren",
    "难听": "unangenehm zu hören / unschön",
    "送给": "schenken / überreichen",
    "笑话儿": "Witz / Scherz",
    "一部分": "ein Teil (von)",
    "早就": "schon längst",
    "中小学": "Grund- und Mittelschule",
    "怎么": "wie / warum",
    "哪里": "wo / ach was (höflich)",
    "哪儿": "wo",
    "为什么": "warum",
    "没关系": "kein Problem / macht nichts",
    "对不起": "Entschuldigung / tut mir leid",
    "不客气": "gern geschehen / bitte sehr",
}

# Curated Cantonese <-> Mandarin bridge metadata: (hanzi, kind, english_note, german_note)
CANTONESE_BRIDGE_ITEMS = [
    ("吃", "non_cognate", "Cantonese: 食 (sik6) · Mandarin: 吃 (chī) — to eat", "Kantonesisch: 食 (sik6) · Mandarin: 吃 (chī) — essen"),
    ("喝", "non_cognate", "Cantonese: 飲 (jam2) · Mandarin: 喝 (hē) — to drink", "Kantonesisch: 飲 (jam2) · Mandarin: 喝 (hē) — trinken"),
    ("看", "non_cognate", "Cantonese: 睇 (tai2) · Mandarin: 看 (kàn) — to look / read / watch", "Kantonesisch: 睇 (tai2) · Mandarin: 看 (kàn) — schauen/lesen"),
    ("走", "false_friend", "False Friend! Cantonese 走 = run / leave, Mandarin 走 (zǒu) = walk", "False Friend! Kantonesisch 走 = rennen/weggehen, Mandarin 走 (zǒu) = zu Fuß gehen"),
    ("他", "non_cognate", "Cantonese: 佢 (keoi5) · Mandarin: 他 (tā) — he / him", "Kantonesisch: 佢 (keoi5) · Mandarin: 他 (tā) — er"),
    ("她", "non_cognate", "Cantonese: 佢 (keoi5) · Mandarin: 她 (tā) — she / her", "Kantonesisch: 佢 (keoi5) · Mandarin: 她 (tā) — sie"),
    ("不", "non_cognate", "Cantonese: 唔 (m4) · Mandarin: 不 (bù) — not / no", "Kantonesisch: 唔 (m4) · Mandarin: 不 (bù) — nicht"),
    ("没有", "non_cognate", "Cantonese: 冇 (mou5) · Mandarin: 没有 (méiyǒu) — do not have", "Kantonesisch: 冇 (mou5) · Mandarin: 没有 (méiyǒu) — nicht haben"),
    ("在", "non_cognate", "Cantonese: 喺 (hai2) · Mandarin: 在 (zài) — at / in / on", "Kantonesisch: 喺 (hai2) · Mandarin: 在 (zài) — sich befinden"),
    ("这", "non_cognate", "Cantonese: 呢 (ni1) · Mandarin: 这 (zhè) — this", "Kantonesisch: 呢 (ni1) · Mandarin: 这 (zhè) — dies"),
    ("哪儿", "non_cognate", "Cantonese: 邊度 (bin1 dou6) · Mandarin: 哪儿 (nǎr) — where", "Kantonesisch: 邊度 (bin1 dou6) · Mandarin: 哪儿 (nǎr) — wo"),
    ("什么", "non_cognate", "Cantonese: 乜嘢 (mat1 je5) · Mandarin: 什么 (shénme) — what", "Kantonesisch: 乜嘢 (mat1 je5) · Mandarin: 什么 (shénme) — was"),
    ("谁", "non_cognate", "Cantonese: 邊個 (bin1 go3) · Mandarin: 谁 (shéi) — who", "Kantonesisch: 邊個 (bin1 go3) · Mandarin: 谁 (shéi) — wer"),
    ("怎么", "non_cognate", "Cantonese: 點解 / 點樣 · Mandarin: 怎么 (zěnme) — how / why", "Kantonesisch: 點解/點樣 · Mandarin: 怎么 (zěnme) — wie/warum"),
    ("为什么", "non_cognate", "Cantonese: 點解 (dim2 gaai2) · Mandarin: 为什么 (wèishénme) — why", "Kantonesisch: 點解 (dim2 gaai2) · Mandarin: 为什么 (wèishénme) — warum"),
    ("东西", "non_cognate", "Cantonese: 嘢 (je5) · Mandarin: 东西 (dōngxi) — thing / stuff", "Kantonesisch: 嘢 (je5) · Mandarin: 东西 (dōngxi) — Ding/Sache"),
    ("说话", "non_cognate", "Cantonese: 講嘢 (gong2 je5) · Mandarin: 说话 (shuōhuà) — to speak / talk", "Kantonesisch: 講嘢 (gong2 je5) · Mandarin: 说话 (shuōhuà) — sprechen"),
    ("睡觉", "non_cognate", "Cantonese: 瞓覺 (fan3 gaau3) · Mandarin: 睡觉 (shuìjiào) — to sleep", "Kantonesisch: 瞓覺 (fan3 gaau3) · Mandarin: 睡觉 (shuìjiào) — schlafen"),
    ("穿", "non_cognate", "Cantonese: 著 (zoek3) · Mandarin: 穿 (chuān) — to wear (clothes)", "Kantonesisch: 著 (zoek3) · Mandarin: 穿 (chuān) — tragen (Kleidung)"),
    ("找", "non_cognate", "Cantonese: 搵 (wan2) · Mandarin: 找 (zhǎo) — to look for / find", "Kantonesisch: 搵 (wan2) · Mandarin: 找 (zhǎo) — suchen"),
    ("给", "non_cognate", "Cantonese: 畀 (bei2) · Mandarin: 给 (gěi) — to give", "Kantonesisch: 畀 (bei2) · Mandarin: 给 (gěi) — geben"),
    ("玩", "false_friend", "Watch tone & Erhua: Mandarin wán (often 玩儿 wánr)", "Vorsicht Ton & Erhua: Mandarin wán (oft 玩儿 wánr)"),
    ("一点儿", "non_cognate", "Cantonese: 少少 / 一啲 · Mandarin: 一点儿 (yīdiǎnr) — a little", "Kantonesisch: 少少 / 一啲 · Mandarin: 一点儿 (yīdiǎnr) — ein bisschen"),
    ("没关系", "non_cognate", "Cantonese: 唔緊要 · Mandarin: 没关系 (méi guānxi) — it doesn't matter", "Kantonesisch: 唔緊要 · Mandarin: 没关系 (méi guānxi) — macht nichts"),
    ("对不起", "non_cognate", "Cantonese: 對唔住 · Mandarin: 对不起 (duìbuqǐ) — sorry", "Kantonesisch: 對唔住 · Mandarin: 对不起 (duìbuqǐ) — Entschuldigung"),
    ("你好", "cognate", "Tone Sandhi! 3rd+3rd tone shifts to 2nd+3rd: nǐ hǎo → spoken ní hǎo", "Ton-Sandhi! 3.+3. Ton wird zu 2.+3. Ton: nǐ hǎo → gesprochen ní hǎo"),
    ("很", "non_cognate", "Cantonese: 好 (hou2) · Mandarin: 很 (hěn) — very", "Kantonesisch: 好 (hou2) · Mandarin: 很 (hěn) — sehr"),
    ("都", "non_cognate", "Cantonese: 話 / 都 (dou1) — in Mandarin dōu precedes the verb", "Kantonesisch: 話/都 (dou1) — in Mandarin als dōu vor dem Verb"),
    ("还", "non_cognate", "Cantonese: 仲 (zung6) · Mandarin: 还 (hái) — still / also", "Kantonesisch: 仲 (zung6) · Mandarin: 还 (hái) — noch"),
    ("再", "non_cognate", "Cantonese: 再 (zoi3) · Mandarin: 再 (zài) — again (future)", "Kantonesisch: 再 (zoi3) · Mandarin: 再 (zài) — noch einmal (Zukunft)"),
    ("就", "false_friend", "Grammar focus: Mandarin 就 (jiù) for 'then / right away / just'", "Grammatik-Fokus: Mandarin 就 (jiù) für 'dann/schon/genau'"),
    ("跟", "non_cognate", "Cantonese: 同 (tung4) · Mandarin: 跟 (gēn) — with / to follow", "Kantonesisch: 同 (tung4) · Mandarin: 跟 (gēn) — mit"),
    ("帮", "cognate", "Simplified diff: 幫 (Trad.) → 帮 (Simp.) — to help", "Vereinfachung: 幫 (Trad.) → 帮 (Vereinf.)"),
    ("买", "cognate", "Simplified diff: 買 (Trad.) → 买 (Simp.) — to buy", "Vereinfachung: 買 (Trad.) → 买 (Vereinf.) — kaufen"),
    ("听", "cognate", "Simplified diff: 聽 (Trad.) → 听 (Simp.) — to listen", "Vereinfachung: 聽 (Trad.) → 听 (Vereinf.) — hören"),
    ("说", "cognate", "Simplified diff: 說 (Trad.) → 说 (Simp.) — to speak", "Vereinfachung: 說 (Trad.) → 说 (Vereinf.) — sprechen"),
]

CANTONESE_NON_COGNATE_SET = {
    w for w, kind, _, _ in CANTONESE_BRIDGE_ITEMS if kind in ("non_cognate", "false_friend")
} | {
    "那", "哪", "哪里", "多少", "几", "怎么样", "叫", "告诉", "让", "把", "被",
    "比", "太", "真", "刚才", "马上", "已经", "才", "因为", "所以", "但是",
    "非常", "特别", "觉得", "知道", "认识", "喜欢", "想", "要", "会", "能", "可以",
    "吃饭", "喝茶", "看书", "走路", "休息", "早上", "晚上", "今天", "明天", "昨天",
}

BRIDGE_NOTE_EN_MAP = {w: en_note for w, _, en_note, _ in CANTONESE_BRIDGE_ITEMS}
BRIDGE_NOTE_DE_MAP = {w: de_note for w, _, _, de_note in CANTONESE_BRIDGE_ITEMS}
BRIDGE_KIND_MAP = {w: kind for w, kind, _, _ in CANTONESE_BRIDGE_ITEMS}


def pick_primary_form(entry: dict) -> dict:
    forms = entry.get("f", [])
    if len(forms) <= 1:
        return forms[0]
    simp = entry["s"]
    bad_prefixes = ("surname ", "used in ", "old variant", "variant of", "archaic variant", "see ", "abbr. for ", "euphemistic variant")
    pos_list = entry.get("p", [])
    primary_pos = pos_list[0] if pos_list else ""

    def score_form(fr: dict) -> int:
        pinyin = fr.get("i", {}).get("y", "")
        meanings = fr.get("m", [])
        if not meanings:
            return -1000
        score = 0
        first = meanings[0].lower()
        if any(w in m.lower() for m in meanings for w in ("old variant of", "archaic variant", "unofficial variant", "euphemistic variant")):
            score -= 80
        if any(first.startswith(bp) for bp in bad_prefixes):
            score -= 70
        if all(any(m.lower().startswith(bp) for bp in bad_prefixes) for m in meanings):
            score -= 100
        if pinyin and pinyin[0].isupper():
            score -= 35
        if any(w in m.lower() for m in meanings[:1] for w in ("(literary)", "(classical)", "(onom.)", "loanword")):
            score -= 25
        joined = " ".join(meanings).lower()
        if primary_pos in ("y", "u") and ("particle" in joined or "marker" in joined or "-ly" in joined):
            score += 30
        if primary_pos == "q" and "classifier" in joined:
            score += 30
        if primary_pos == "p" and ("preposition" in joined or "because of" in joined or "towards" in joined):
            score += 15
        if primary_pos == "v" and any(m.startswith("to ") for m in meanings):
            score += 15
        return score

    if simp in PREFERRED_FORM_SPEC:
        pref_np, pref_trad = PREFERRED_FORM_SPEC[simp]
        candidates = [
            (idx, fr)
            for idx, fr in enumerate(forms)
            if fr.get("i", {}).get("n", "").lower().replace(" ", "") == pref_np
            and (pref_trad is None or fr.get("t") == pref_trad)
        ]
        if not candidates:
            candidates = [
                (idx, fr)
                for idx, fr in enumerate(forms)
                if fr.get("i", {}).get("n", "").lower().replace(" ", "") == pref_np
            ]
        if candidates:
            return sorted(candidates, key=lambda x: (-score_form(x[1]), x[0]))[0][1]

    return sorted(enumerate(forms), key=lambda x: (-score_form(x[1]), x[0]))[0][1]


def format_english_gloss(simp: str, meanings: list[str]) -> str:
    if simp in ENGLISH_OVERRIDES:
        return ENGLISH_OVERRIDES[simp]
    bad_prefixes = ("surname ", "used in ", "old variant", "variant of", "archaic variant", "see ", "abbr. for ")
    cleaned: list[str] = []
    for m in meanings:
        s = re.sub(r"\[[^\]]*\]", "", m).strip()
        s = re.sub(r"\s{2,}", " ", s)
        if not s:
            continue
        if any(s.lower().startswith(bp) for bp in bad_prefixes):
            continue
        cleaned.append(s)
        if len(cleaned) >= 2:
            break
    if not cleaned and meanings:
        cleaned = [re.sub(r"\[[^\]]*\]", "", meanings[0]).strip()]
    res = " / ".join(cleaned)
    if len(res) > 95:
        res = res[:92].rsplit("/", 1)[0].rsplit(";", 1)[0].strip()
    return res or simp


def ensure_sources():
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    for fname, url in SOURCES.items():
        path = CACHE_DIR / fname
        if not path.exists():
            print(f"Downloading {fname}...")
            urllib.request.urlretrieve(url, path)


def clean_handedict_def(raw_defs: str) -> str:
    parts = [p.strip() for p in raw_defs.split("/") if p.strip()]
    cleaned = []
    for p in parts:
        # Remove HanDeDict example blocks (; Bsp.: ...) and [bracketed notes]
        p = re.sub(r";\s*Bsp\.:.*$", "", p)
        p = re.sub(r"\[[^\]]*\]", "", p)
        p = re.sub(r"<[^>]*(&gt|&lt)?", "", p)
        p = p.replace("&gt;", "").replace("&gt", "").replace("&lt;", "").replace("&lt", "")
        # Remove dictionary tags like (u.E.), (S), (V), (Adj), (Eig), (Geo), etc.
        p = re.sub(r"\(\s*(?:u\.E\.|S|V|Adj|Adv|Pron|Präp|Konj|Part|Int|Eig|Geo|Pers|Ess|Mus|Med|Bio|Math|Phys|Chem|Tech|Sprachw|EDV|zählw|Zählw|coll\.|umg\.|lit\.)(?:\s*,\s*[^)]*)?\)", "", p)
        p = re.sub(r"\(u\.E\.\)", "", p)
        p = re.sub(r"\s{2,}", " ", p).strip(" ,;·\t\r\n")
        if p and not p.lower().startswith("siehe ") and not p.lower().startswith("vgl."):
            cleaned.append(p)
        if len(cleaned) >= 2:
            break
    result = " / ".join(cleaned) if cleaned else (parts[0] if parts else "")
    if len(result) > 85:
        result = result[:82].rsplit(",", 1)[0].rsplit("/", 1)[0].strip()
    return result


def load_handedict() -> dict[str, list[tuple[str, str]]]:
    hd: dict[str, list[tuple[str, str]]] = {}
    with open(CACHE_DIR / "handedict.u8", encoding="utf-8") as f:
        for line in f:
            if line.startswith("#") or not line.strip():
                continue
            m = re.match(r"^(\S+)\s+(\S+)\s+\[([^\]]+)\]\s+/(.+)/\s*$", line)
            if m:
                _, simp, num_pin, defs = m.groups()
                hd.setdefault(simp, []).append((num_pin.lower().replace(" ", ""), defs))
    return hd


def lookup_german(
    simp: str,
    numeric_pinyin: str,
    hd: dict[str, list[tuple[str, str]]],
    en_fallback: list[str],
) -> str:
    if simp in GERMAN_OVERRIDES:
        return GERMAN_OVERRIDES[simp]
    entries = hd.get(simp)
    if entries:
        target = numeric_pinyin.lower().replace(" ", "")
        for pin, defs in entries:
            if pin == target:
                res = clean_handedict_def(defs)
                if res:
                    return res
        res = clean_handedict_def(entries[0][1])
        if res:
            return res
    return "; ".join(en_fallback[:2]) if en_fallback else simp


def gap_audio_filename(hanzi: str) -> str:
    digest = hashlib.sha1(hanzi.encode("utf-8")).hexdigest()[:12]
    return f"w-{digest}.mp3"


async def generate_gap_audio(missing_words: list[str]) -> dict[str, str]:
    import edge_tts

    GAP_AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    url_map: dict[str, str] = {}
    to_generate: list[tuple[str, Path, str]] = []

    for hanzi in sorted(set(missing_words)):
        fname = gap_audio_filename(hanzi)
        out_path = GAP_AUDIO_DIR / fname
        rel_url = f"/audio/gap/{fname}"
        url_map[hanzi] = rel_url
        if not out_path.exists() or out_path.stat().st_size < 200:
            to_generate.append((hanzi, out_path, rel_url))

    if not to_generate:
        print("All gap audio files already cached.")
        return url_map

    print(f"Generating {len(to_generate)} missing Mandarin word MP3s with edge-tts (zh-CN-XiaoxiaoNeural)...")
    sem = asyncio.Semaphore(4)

    async def synth(text: str, dest: Path):
        async with sem:
            for attempt in range(4):
                try:
                    comm = edge_tts.Communicate(text, "zh-CN-XiaoxiaoNeural", rate="-5%")
                    await comm.save(str(dest))
                    await asyncio.sleep(0.08)
                    return
                except Exception as exc:
                    if attempt == 3:
                        print(f"WARN: failed {text}: {exc}")
                    await asyncio.sleep(1.5 * (attempt + 1))

    await asyncio.gather(*(synth(text, dest) for text, dest, _ in to_generate))
    return url_map


def classify_bridge(simp: str, trad: str) -> str:
    if simp in BRIDGE_KIND_MAP:
        return BRIDGE_KIND_MAP[simp]
    if simp in CANTONESE_NON_COGNATE_SET:
        return "non_cognate"
    if trad and trad != simp:
        return "simplified_diff"
    return "cognate"


def translate_batch_en_to_de(texts: list[str]) -> list[str] | None:
    if not texts:
        return []
    try:
        from transformers import MarianMTModel, MarianTokenizer
        import torch

        model_name = "Helsinki-NLP/opus-mt-en-de"
        print(f"Loading offline {model_name} for {len(texts)} sentences...")
        tokenizer = MarianTokenizer.from_pretrained(model_name)
        model = MarianMTModel.from_pretrained(model_name)
        device = "mps" if torch.backends.mps.is_available() else "cpu"
        model = model.to(device)

        results: list[str] = []
        batch_size = 32
        for i in range(0, len(texts), batch_size):
            batch = texts[i : i + batch_size]
            encoded = tokenizer(batch, return_tensors="pt", padding=True, truncation=True, max_length=128).to(device)
            with torch.no_grad():
                generated = model.generate(**encoded, max_new_tokens=128)
            decoded = tokenizer.batch_decode(generated, skip_special_tokens=True)
            results.extend(decoded)
        return results
    except Exception as exc:
        print(f"Offline MarianMT translation unavailable ({exc}), falling back to English glosses.")
        return None


def main():
    ensure_sources()
    OUT_DECKS_DIR.mkdir(parents=True, exist_ok=True)

    with open(CACHE_DIR / "complete.min.json", encoding="utf-8") as f:
        complete = json.load(f)
    with open(CACHE_DIR / "cmn_audios_words.txt", encoding="utf-8") as f:
        audio_cmn_set = {line.strip() for line in f if line.strip()}
    with open(CACHE_DIR / "sentences.json", encoding="utf-8") as f:
        sentences = json.load(f)
    hd = load_handedict()

    # Index complete vocabulary by simplified form for lookups
    comp_by_simp: dict[str, dict] = {}
    for entry in complete:
        comp_by_simp.setdefault(entry["s"], entry)

    # 1. Collect all words that need gap audio (HSK 1, HSK 2, Bridge, Placement)
    hsk1_raw = [w for w in complete if "n1" in w.get("l", [])]
    hsk2_raw = [w for w in complete if "n2" in w.get("l", [])]

    needed_gap_words: list[str] = []
    for w in hsk1_raw + hsk2_raw:
        if w["s"] not in audio_cmn_set:
            needed_gap_words.append(w["s"])
    for w_hanzi, _, _, _ in CANTONESE_BRIDGE_ITEMS:
        if w_hanzi not in audio_cmn_set:
            needed_gap_words.append(w_hanzi)

    # Curated placement items across HSK 1-4 (5 per level = 20 items)
    placement_specs = [
        # (hskLevel, skill, simplified, preferred_bridge)
        # HSK 1: mix cognates (苹果, 医院, 电话) + Cantonese non-cognates (吃, 喝)
        (1, "reading", "苹果", "cognate"),
        (1, "listening", "吃", "non_cognate"),
        (1, "reading", "医院", "cognate"),
        (1, "listening", "喝", "non_cognate"),
        (1, "reading", "电话", "simplified_diff"),
        # HSK 2
        (2, "reading", "准备", "simplified_diff"),
        (2, "listening", "找", "non_cognate"),
        (2, "reading", "问题", "simplified_diff"),
        (2, "listening", "为什么", "non_cognate"),
        (2, "reading", "帮助", "simplified_diff"),
        # HSK 3
        (3, "reading", "环境", "simplified_diff"),
        (3, "listening", "决定", "cognate"),
        (3, "reading", "解决", "cognate"),
        (3, "listening", "习惯", "simplified_diff"),
        (3, "reading", "变化", "simplified_diff"),
        # HSK 4
        (4, "reading", "经验", "simplified_diff"),
        (4, "listening", "鼓励", "simplified_diff"),
        (4, "reading", "印象", "cognate"),
        (4, "listening", "负责", "simplified_diff"),
        (4, "reading", "顺利", "simplified_diff"),
    ]
    for _, _, simp, _ in placement_specs:
        if simp not in audio_cmn_set:
            needed_gap_words.append(simp)

    gap_audio_map = asyncio.run(generate_gap_audio(needed_gap_words))

    def resolve_word_audio(hanzi: str) -> str:
        if hanzi in audio_cmn_set:
            return AUDIO_CMN_BASE.format(urllib.parse.quote(hanzi))
        return gap_audio_map[hanzi]

    def build_word_card(entry: dict, deck_id: str, hsk_level: int, idx: int) -> dict:
        simp = entry["s"]
        form = pick_primary_form(entry)
        trad = form.get("t", simp)
        trans = form.get("i", {})
        pinyin = trans.get("y", "")
        num_pinyin = trans.get("n", "")
        en_meanings = form.get("m", [])
        english = format_english_gloss(simp, en_meanings)
        german = lookup_german(simp, num_pinyin, hd, en_meanings)
        pos_codes = entry.get("p", [])
        grammar = POS_EN.get(pos_codes[0], "Word") if pos_codes else "Word"
        bridge = classify_bridge(simp, trad)
        card = {
            "id": f"{deck_id}-{idx:04d}",
            "deckId": deck_id,
            "hanzi": simp,
            "traditional": trad if trad != simp else undefined_or_none(None),
            "pinyin": pinyin,
            "english": english,
            "german": german,
            "grammar": grammar,
            "level": f"HSK {hsk_level}",
            "hskLevel": hsk_level,
            "mode": "vocab",
            "audioUrl": resolve_word_audio(simp),
            "cantoneseBridge": bridge,
        }
        if simp in BRIDGE_NOTE_EN_MAP:
            card["bridgeNote"] = BRIDGE_NOTE_EN_MAP[simp]
            card["bridgeNoteDe"] = BRIDGE_NOTE_DE_MAP[simp]
        return {k: v for k, v in card.items() if v is not None}

    def undefined_or_none(v):
        return v

    # Build HSK 1 & HSK 2 word decks
    hsk1_words = [
        build_word_card(w, "hsk1-words", 1, i + 1)
        for i, w in enumerate(sorted(hsk1_raw, key=lambda x: x.get("q", 999999)))
    ]
    hsk2_words = [
        build_word_card(w, "hsk2-words", 2, i + 1)
        for i, w in enumerate(sorted(hsk2_raw, key=lambda x: x.get("q", 999999)))
    ]

    # Build Cantonese -> Mandarin bridge deck
    bridge_cards = []
    for i, (hanzi, kind, en_note, de_note) in enumerate(CANTONESE_BRIDGE_ITEMS):
        entry = comp_by_simp.get(hanzi)
        if not entry:
            continue
        form = pick_primary_form(entry)
        trad = form.get("t", hanzi)
        trans = form.get("i", {})
        en_meanings = form.get("m", [])
        english = format_english_gloss(hanzi, en_meanings)
        german = lookup_german(hanzi, trans.get("n", ""), hd, en_meanings)
        pos_codes = entry.get("p", [])
        grammar = POS_EN.get(pos_codes[0], "Word") if pos_codes else "Word"
        card = {
            "id": f"bridge-{i+1:03d}",
            "deckId": "cantonese-bridge",
            "hanzi": hanzi,
            "pinyin": trans.get("y", ""),
            "english": english,
            "german": german,
            "grammar": grammar,
            "level": "Bridge",
            "hskLevel": 1,
            "mode": "vocab",
            "audioUrl": resolve_word_audio(hanzi),
            "cantoneseBridge": kind,
            "bridgeNote": en_note,
            "bridgeNoteDe": de_note,
        }
        if trad and trad != hanzi:
            card["traditional"] = trad
        bridge_cards.append(card)

    # Translate HSK 1 & HSK 2 sentences into German using offline MarianMT (opus-mt-en-de)
    translation_cache_path = CACHE_DIR / "sentence_de_cache.json"
    de_cache: dict[str, str] = {}
    if translation_cache_path.exists():
        with open(translation_cache_path, encoding="utf-8") as f:
            de_cache = json.load(f)

    target_sents = [s for s in sentences if s.get("hsk_level") in (1, 2)]
    uncached = [s for s in target_sents if s["id"] not in de_cache and (s.get("translation") or {}).get("en")]
    if uncached:
        translated = translate_batch_en_to_de([s["translation"]["en"] for s in uncached])
        if translated and len(translated) == len(uncached):
            for s, de_txt in zip(uncached, translated):
                de_cache[s["id"]] = de_txt
            with open(translation_cache_path, "w", encoding="utf-8") as f:
                json.dump(de_cache, f, ensure_ascii=False, indent=2)

    def build_sentence_cards(level: int, deck_id: str) -> list[dict]:
        lvl_sents = [s for s in sentences if s.get("hsk_level") == level]
        cards = []
        for s in lvl_sents:
            sid = s["id"]
            en_text = (s.get("translation") or {}).get("en", "")
            de_text = de_cache.get(sid) or en_text

            tokens = []
            for tok in s.get("tokens", []):
                w_text = tok.get("word", "")
                en_gloss = tok.get("gloss_en", "")
                tokens.append(
                    {
                        "word": w_text,
                        "pinyin": tok.get("pinyin", ""),
                        "gloss": en_gloss or w_text,
                    }
                )

            card = {
                "id": sid,
                "deckId": deck_id,
                "hanzi": s["chinese"],
                "pinyin": s.get("pinyin", ""),
                "english": en_text,
                "german": de_text,
                "grammar": "Sentence",
                "level": f"HSK {level}",
                "hskLevel": level,
                "mode": "listening",
                "audioUrl": SENTENCE_AUDIO_BASE + s["audio"]["normal"],
                "audioSlowUrl": SENTENCE_AUDIO_BASE + s["audio"]["slow"],
                "grammarTags": s.get("grammar_tags", []),
                "tokens": tokens,
                "cantoneseBridge": "cognate",
            }
            if s.get("traditional") and s["traditional"] != s["chinese"]:
                card["traditional"] = s["traditional"]
            cards.append(card)
        return cards

    print("Building HSK 1 & HSK 2 sentence decks...")
    hsk1_sentences = build_sentence_cards(1, "hsk1-sentences")
    hsk2_sentences = build_sentence_cards(2, "hsk2-sentences")

    # Build curated 20-item Placement Test Deck with 3 level-matched ENGLISH distractors each
    level_pools: dict[int, list[str]] = {1: [], 2: [], 3: [], 4: []}
    spec_hanzi_set = {p[2] for p in placement_specs}
    for entry in complete:
        if entry["s"] in spec_hanzi_set:
            continue
        for ltag in entry.get("l", []):
            if ltag in ("n1", "n2", "n3", "n4"):
                lvl_num = int(ltag[1])
                form = pick_primary_form(entry)
                en = format_english_gloss(entry["s"], form.get("m", []))
                if en and len(en) < 42 and not en.startswith("("):
                    level_pools[lvl_num].append(en)

    placement_cards = []
    for idx, (lvl, skill, simp, bridge_kind) in enumerate(placement_specs):
        entry = comp_by_simp[simp]
        form = pick_primary_form(entry)
        trad = form.get("t", simp)
        trans = form.get("i", {})
        en_meanings = form.get("m", [])
        english = format_english_gloss(simp, en_meanings)
        german = lookup_german(simp, trans.get("n", ""), hd, en_meanings)
        pool = [d for d in level_pools[lvl] if d != english]
        # Deterministic distractor pick
        step = max(1, len(pool) // 7)
        distractors = []
        cursor = (idx * 17) % max(1, len(pool))
        while len(distractors) < 3 and pool:
            cand = pool[cursor % len(pool)]
            if cand not in distractors and cand != english:
                distractors.append(cand)
            cursor += step + 1
        options = [english] + distractors
        # Deterministic rotation so correct answer isn't always index 0
        rot = (idx * 3 + lvl) % len(options)
        options = options[rot:] + options[:rot]

        q = {
            "id": f"place-{lvl}-{idx+1:02d}",
            "hskLevel": lvl,
            "skill": skill,
            "hanzi": simp,
            "pinyin": trans.get("y", ""),
            "english": english,
            "german": german,
            "options": options,
            "audioUrl": resolve_word_audio(simp),
            "cantoneseBridge": bridge_kind,
        }
        if trad and trad != simp:
            q["traditional"] = trad
        if simp in BRIDGE_NOTE_EN_MAP:
            q["bridgeNote"] = BRIDGE_NOTE_EN_MAP[simp]
        placement_cards.append(q)

    # Write JSON files
    outputs = {
        "hsk1Words.json": hsk1_words,
        "hsk2Words.json": hsk2_words,
        "hsk1Sentences.json": hsk1_sentences,
        "hsk2Sentences.json": hsk2_sentences,
        "cantoneseBridge.json": bridge_cards,
        "placementDeck.json": placement_cards,
    }
    for fname, payload in outputs.items():
        out_path = OUT_DECKS_DIR / fname
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False, separators=(",", ":"))
        size_kb = out_path.stat().st_size / 1024
        print(f"Wrote {fname}: {len(payload)} items ({size_kb:.1f} KB)")


if __name__ == "__main__":
    main()
