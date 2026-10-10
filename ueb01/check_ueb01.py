from pathlib import Path
from html.parser import HTMLParser

ROOT = Path(__file__).parent
errors = []

class LinkParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags = []
    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))

def must(path):
    if not (ROOT / path).exists():
        errors.append(f'missing {path}')

def text(path):
    return (ROOT / path).read_text(encoding='utf-8')

for p in [
    'angabe_blatt01.pdf', 'Angabe/Assignment01.pdf', 'Angabe/files.zip',
    'ue1.1/antwort.md', 'ue1.2/antwort.md', 'ue1.3/index.html',
    'ue1.4/index.html', 'ue1.4/img1.html', 'ue1.4/img2.html', 'ue1.4/img3.html',
    'ue1.5/ex5.html', 'ue1.6/ex6.html', 'ue1.7/antwort.md',
    'ue1.8/ex8.html', 'ue1.9/ex8.html', 'erklaerung_blatt01.md', 'ki-bericht_blatt01.tex'
]:
    must(p)

# Exercise 3: no CSS, required structure.
e3 = text('ue1.3/index.html')
if '<style' in e3.lower() or 'style=' in e3.lower():
    errors.append('Exercise 3 must not use CSS')
for needle in ['This is a top-level heading', '<hr', '<ul>', '<ol>', 'https://www.aau.at/']:
    if needle not in e3:
        errors.append(f'Exercise 3 missing {needle}')

# Exercise 4: image pages and refresh chain.
for name, nxt in [('img1','img2.html'), ('img2','img3.html'), ('img3','img1.html')]:
    h = text(f'ue1.4/{name}.html')
    if 'http-equiv="refresh"' not in h or f'url={nxt}' not in h:
        errors.append(f'{name}.html missing refresh to {nxt}')
    if 'target="_blank"' not in h or 'Open image' not in h:
        errors.append(f'{name}.html missing full-image link attributes')

# Exercise 5: table semantics and data.
e5 = text('ue1.5/ex5.html')
for needle in ['<caption>', '<thead>', '<tbody>', 'scope="col"', 'scope="row"', 'Massachusetts Institute of Technology', '97.4']:
    if needle not in e5:
        errors.append(f'Exercise 5 missing {needle}')

# Exercise 6: form requirements.
e6 = text('ue1.6/ex6.html')
for needle in ['mailto:', 'method="post"', 'enctype="text/plain"', 'type="email"', 'type="tel"', 'type="date"', 'type="number"', 'type="color"', 'type="radio"', 'maxlength="512"', 'type="reset"', 'required']:
    if needle not in e6:
        errors.append(f'Exercise 6 missing {needle}')

# Exercise 8/9 CSS requirements.
e8 = text('ue1.8/ex8.html')
for needle in ['rgb(187, 204, 232)', 'rgb(20, 90, 204)', 'display: flex', 'font-family: Verdana', 'height: 4em', 'width: 100px', 'href^="http"', '(external)', 'margin-top: auto']:
    if needle not in e8:
        errors.append(f'Exercise 8 missing {needle}')
e9 = text('ue1.9/ex8.html')
for needle in ['@media (max-width: 600px)', 'flex-direction: column', 'border-radius', 'display: none']:
    if needle not in e9:
        errors.append(f'Exercise 9 missing {needle}')

if errors:
    print('\n'.join(errors))
    raise SystemExit(1)
print('All checks passed for ueb01.')
