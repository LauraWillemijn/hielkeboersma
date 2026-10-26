#!/usr/bin/env python3
"""Maakt dj.html, presentator.html en voice-over.html uit index.html.

Elke pagina krijgt de kop, het menu, de sectie van die dienst (met video's, foto's en
reviews), het contactformulier, de bijpassende veelgestelde vragen en de footer van de
homepage, plus een eigen titel, beschrijving, H1, introductie en gegevens voor Google.
Pas je de homepage aan, draai dit script dan opnieuw:  python3 tools/maak-dienstpaginas.py
"""
import html
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://hielkeboersma.com"

PAGES = [
    {
        "file": "dj.html", "path": "/dj", "section": "dj", "label": "DJ",
        "title": "DJ boeken voor je feest of bedrijfsfeest | Hielke Boersma",
        "description": "DJ Hielke Boersma boeken? SLAM!-DJ voor bedrijfsfeesten, bruiloften, festivals en verjaardagen door heel Nederland. Bekijk video's en reviews.",
        "h1": "DJ Hielke Boersma boeken",
        "intro": "Op zoek naar een DJ die de zaal leest en de dansvloer vol houdt? Hielke Boersma is DJ bij SLAM! en draait door heel Nederland op bedrijfsfeesten, bruiloften, festivals en verjaardagen, met een set op maat van 80s en 90s tot meezingers, house en de clubhits van nu.",
        "hero_img": "images/hielke12.jpg",
        "service": "DJ voor feesten en evenementen",
        "faq": ["Wat voor DJ is Hielke?", "Welke muziek draait hij?", "Voor wat voor feesten en events draait hij?", "Komt hij door heel Nederland?", "Wat kost het om hem te boeken?", "Hoe boek ik Hielke?"],
        "extra_sections": [],
    },
    {
        "file": "presentator.html", "path": "/presentator", "section": "presentator", "label": "Presentator",
        "title": "Dagvoorzitter of presentator boeken | Hielke Boersma",
        "description": "Hielke Boersma boeken als dagvoorzitter, presentator of event host. SLAM!-presentator voor congressen, bedrijfsevents, awards en video. Door heel Nederland.",
        "h1": "Dagvoorzitter en presentator Hielke Boersma",
        "intro": "Een dagvoorzitter die de energie erin houdt, de juiste vragen stelt en sprekers en publiek scherp houdt. Hielke Boersma presenteert bij SLAM! en staat als dagvoorzitter, event host en presentator op congressen, bedrijfsevents en awardshows, en voor de camera in video's en commercials.",
        "hero_img": "images/hielkenieuwade.jpg",
        "service": "Dagvoorzitter en presentator",
        "faq": ["Kan hij ook mijn event presenteren?", "Waar is hij op de radio te horen?", "Komt hij door heel Nederland?", "Wat kost het om hem te boeken?", "Hoe neem ik contact op?"],
        "extra_sections": ["opdrachtgevers"],
    },
    {
        "file": "voice-over.html", "path": "/voice-over", "section": "voice-over", "label": "Voice-over",
        "title": "Voice-over inhuren: radio, tv en video | Hielke Boersma",
        "description": "Voice-over Hielke Boersma inhuren voor radio- en tv-commercials, webvideo's, animaties en uitlegvideo's. Een heldere, enthousiaste stem. Beluister voorbeelden.",
        "h1": "Voice-over Hielke Boersma inhuren",
        "intro": "Een stem die blijft hangen: helder, authentiek en enthousiast. Hielke Boersma is radiostem bij SLAM! en spreekt voice-overs in voor radio- en tv-commercials, webvideo's, animaties, productvideo's en uitlegvideo's, altijd met de juiste tone of voice voor jouw merk.",
        "hero_img": "images/hielke-over.jpg",
        "service": "Voice-over",
        "faq": ["Wat voor voice-over werk doet hij?", "Wat kost het om hem te boeken?", "Hoe neem ik contact op?"],
        "extra_sections": [],
    },
]


def section_by_id(body, sid):
    m = re.search(rf'<section[^>]*id="{re.escape(sid)}"[^>]*>.*?</section>', body, re.S)
    return m.group(0) if m else ""


def main():
    src = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()
    head, body = src.split("<body", 1)
    body = "<body" + body
    nav = re.search(r"<nav>.*?</nav>", body, re.S).group(0)
    contact = section_by_id(body, "contact")
    faq_sec = section_by_id(body, "faq")
    tail = body[body.index("<footer"):]
    # de opdrachtgevers-sectie (logo's) staat zonder id tussen voice-over en contact
    vo_end = body.index(section_by_id(body, "voice-over")) + len(section_by_id(body, "voice-over"))
    clients = body[vo_end:body.index(contact)].strip()
    ld = json.loads(re.search(r'<script type="application/ld\+json">(.*?)</script>', head, re.S).group(1))
    graph = ld.get("@graph", [ld])
    faq_items = {q["name"]: q for x in graph if x.get("@type") == "FAQPage" for q in x["mainEntity"]}

    # menu: ankers op de homepage worden /#anker, diensten krijgen hun eigen pagina
    nav_sub = nav.replace('href="#top"', 'href="/"')
    for sid in ("over", "faq"):
        nav_sub = nav_sub.replace(f'href="#{sid}"', f'href="/#{sid}"')
    for p in PAGES:
        nav_sub = nav_sub.replace(f'href="#{p["section"]}"', f'href="{p["path"]}"')

    for p in PAGES:
        url = SITE + p["path"]
        page_head = head
        page_head = re.sub(r"<title>.*?</title>", f"<title>{html.escape(p['title'])}</title>", page_head, 1, flags=re.S)
        for name in ("description",):
            page_head = re.sub(rf'<meta name="{name}" content="[^"]*">', f'<meta name="{name}" content="{html.escape(p["description"], quote=True)}">', page_head, 1)
        page_head = re.sub(r'<meta name="keywords" content="[^"]*">\n?', "", page_head)
        page_head = re.sub(r'<link rel="canonical" href="[^"]*">', f'<link rel="canonical" href="{url}">', page_head, 1)
        page_head = re.sub(r'(property="og:url" content=")[^"]*', rf"\g<1>{url}", page_head)
        page_head = re.sub(r'(property="og:title" content=")[^"]*', lambda m: m.group(1) + html.escape(p["title"], quote=True), page_head)
        page_head = re.sub(r'(name="twitter:title" content=")[^"]*', lambda m: m.group(1) + html.escape(p["title"], quote=True), page_head)
        page_head = re.sub(r'(property="og:description" content=")[^"]*', lambda m: m.group(1) + html.escape(p["description"], quote=True), page_head)
        page_head = re.sub(r'(name="twitter:description" content=")[^"]*', lambda m: m.group(1) + html.escape(p["description"], quote=True), page_head)
        page_head = re.sub(r'(property="og:image" content=")[^"]*', rf"\g<1>{SITE}/{p['hero_img']}", page_head)
        faqs = [faq_items[q] for q in p["faq"] if q in faq_items]
        page_ld = {"@context": "https://schema.org", "@graph": [
            {"@type": "WebPage", "@id": f"{url}#page", "url": url, "name": p["title"], "description": p["description"],
             "inLanguage": "nl-NL", "isPartOf": {"@id": f"{SITE}/#website"}, "about": {"@id": f"{SITE}/#hielke"}},
            {"@type": "Service", "@id": f"{url}#service", "name": p["service"], "serviceType": p["service"],
             "description": p["description"], "provider": {"@type": "Person", "@id": f"{SITE}/#hielke", "name": "Hielke Boersma", "url": SITE + "/"},
             "areaServed": {"@type": "Country", "name": "Nederland"}, "url": url},
            {"@type": "BreadcrumbList", "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE + "/"},
                {"@type": "ListItem", "position": 2, "name": p["label"], "item": url}]},
            {"@type": "FAQPage", "mainEntity": faqs},
        ]}
        page_head = re.sub(r'<script type="application/ld\+json">.*?</script>',
                           lambda m: '<script type="application/ld+json">' + json.dumps(page_ld, ensure_ascii=False) + "</script>", page_head, 1, flags=re.S)

        hero = f"""<header class="hero" id="top">
  <img class="hero-bg" src="{p['hero_img']}" alt="{html.escape(p['h1'], quote=True)}">
  <div class="hero-overlay"></div>
  <div class="hero-inner">
    <p class="crumbs" style="opacity:.8;font-size:14px;margin-bottom:10px"><a href="/" style="color:inherit">Home</a> / {html.escape(p['label'])}</p>
    <h1>{html.escape(p['h1'])}</h1>
    <p>{html.escape(p['intro'])}</p>
    <div class="hero-cta"><a href="#contact" class="btn-primary">Neem contact op →</a><a href="#{p['section']}" class="btn-ghost">Bekijk werk</a></div>
  </div>
</header>"""
        sec = section_by_id(body, p["section"])
        sec = re.sub(r'<p class="page-link".*?</p>\n?', "", sec, flags=re.S)
        sec = sec.replace('<h2>', '<h2>', 1)
        extra = clients if "opdrachtgevers" in p["extra_sections"] else ""
        # alleen de vragen van deze dienst tonen
        faq_page = faq_sec
        for q in faq_items:
            if q not in p["faq"]:
                faq_page = re.sub(rf'<div class="faq-item">\s*<button[^>]*>\s*{re.escape(html.escape(q, quote=False))}.*?</div>\s*</div>', "", faq_page, flags=re.S)
        others = " · ".join(f'<a class="inline-link" href="{o["path"]}">{html.escape(o["label"])}</a>' for o in PAGES if o is not p)
        more = f'<section class="section"><div class="wrap"><p style="text-align:center">Hielke is ook te boeken als: {others} · <a class="inline-link" href="/">alles over Hielke</a></p></div></section>'
        out = f'{page_head}<body>\n{nav_sub}\n{hero}\n{sec}\n{extra}\n{contact}\n{faq_page}\n{more}\n{tail}'
        open(os.path.join(ROOT, p["file"]), "w", encoding="utf-8").write(out)
        print(f"✓ {p['file']}  ({len(faqs)} vragen)")


if __name__ == "__main__":
    main()
