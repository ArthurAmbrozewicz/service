# -*- coding: utf-8 -*-
"""Gera o diagrama do modelo de features do Service em SVG.

Os dados abaixo espelham src/config/features/index.ts e src/config/business/index.ts.
Ao alterar features ou presets no código, atualize aqui e rode:
    python3 docs/diagrams/gen_feature_model.py
"""

from pathlib import Path

W, H = 2000, 1200

FONT = "Helvetica Neue, Helvetica, Arial, sans-serif"

INK = "#1a1f2b"
MUTED = "#5b6472"
LINE = "#9aa3b0"
CORE_FILL = "#eef2f7"
CORE_STROKE = "#59677a"
VAR_FILL = "#fdf3e7"
VAR_STROKE = "#c98a3c"
SEG_FILL = "#eaf4ee"
SEG_STROKE = "#3f8f63"
ROOT_FILL = "#1f2937"

ROW_H = 54
BOX_H = 42
CHILD_TOP = 246
GROUP_Y, GROUP_H = 150, 62

# (rótulo, obrigatória?, [subfilhos]) — obrigatória=None em grupo alternativo
COLUMNS = [
    {
        "title": "Núcleo (core)",
        "subtitle": "comum a todos os produtos",
        "mandatory": True,
        "badge": None,
        "fill": CORE_FILL,
        "stroke": CORE_STROKE,
        "left": 40,
        "right": 540,
        "children": [
            ("Autenticação e perfis", True, []),
            ("Dashboard de indicadores", True, []),
            ("Clientes (CRUD)", True, []),
            ("Serviços (CRUD)", True, []),
            ("Agendamento", True, [("Regras de agenda", True, [])]),
            ("Profissionais", True, []),
            ("Pagamentos", True, []),
            ("Notificações", True, []),
            ("Histórico de atendimentos", True, []),
        ],
    },
    {
        "title": "Personalização",
        "subtitle": "identidade do cliente",
        "mandatory": True,
        "badge": None,
        "fill": CORE_FILL,
        "stroke": CORE_STROKE,
        "left": 572,
        "right": 952,
        "children": [
            ("Identidade (nome, logo)", True, []),
            ("Tema e cores", True, []),
            ("Rótulos do domínio", True, []),
        ],
    },
    {
        "title": "Segmento",
        "subtitle": "variante do produto",
        "mandatory": True,
        "badge": "alternativa — exatamente 1",
        "fill": SEG_FILL,
        "stroke": SEG_STROKE,
        "left": 984,
        "right": 1404,
        "children": [
            ("Petshop", None, []),
            ("Barbearia", None, []),
            ("Academia", None, []),
            ("Clínica de Estética", None, []),
        ],
    },
    {
        "title": "Módulos opcionais",
        "subtitle": "pontos de variação",
        "mandatory": False,
        "badge": "combinação livre",
        "fill": VAR_FILL,
        "stroke": VAR_STROKE,
        "left": 1436,
        "right": 1960,
        "children": [
            ("Ficha do Pet", False, [("Vacinação", False, [])]),
            ("Avaliações", False, []),
            ("Anamnese", False, []),
            ("Planos Recorrentes", False, [("Controle de Frequência", False, [])]),
            ("Pacotes de sessões", False, []),
        ],
    },
]

MATRIX_FEATURES = [
    "Avaliações",
    "Ficha do Pet",
    "Vacinação",
    "Anamnese",
    "Planos Recorrentes",
    "Controle de Frequência",
    "Pacotes",
]
MATRIX_PRESETS = {
    "Petshop": {"Avaliações", "Ficha do Pet", "Vacinação", "Pacotes"},
    "Barbearia": {"Avaliações", "Pacotes"},
    "Academia": {"Planos Recorrentes", "Controle de Frequência", "Pacotes"},
    "Clínica": {"Avaliações", "Anamnese", "Pacotes"},
}

out = []
add = out.append


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def box(x, y, w, h, fill, stroke, rx=7, width=1.4):
    add(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" '
        f'fill="{fill}" stroke="{stroke}" stroke-width="{width}"/>')


def text(x, y, s, size=15, fill=INK, weight="400", anchor="start", extra=""):
    add(f'<text x="{x}" y="{y}" font-family="{FONT}" font-size="{size}" '
        f'fill="{fill}" font-weight="{weight}" text-anchor="{anchor}"{extra}>'
        f'{esc(s)}</text>')


def marker(cx, cy, mandatory):
    """Notação FODA: círculo cheio = obrigatória, vazio = opcional."""
    if mandatory is None:
        return
    fill = INK if mandatory else "#ffffff"
    add(f'<circle cx="{cx}" cy="{cy}" r="6.5" fill="{fill}" '
        f'stroke="{INK}" stroke-width="1.6"/>')


add(f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" '
    f'viewBox="0 0 {W} {H}">')
add(f'<rect width="{W}" height="{H}" fill="#ffffff"/>')
add(f'<defs><marker id="req" markerWidth="9" markerHeight="9" refX="8" refY="3" '
    f'orient="auto"><path d="M0,0 L8,3 L0,6 z" fill="{VAR_STROKE}"/></marker></defs>')

# ------------------------------------------------------------------- raiz
root_w, root_h, root_y = 560, 60, 34
root_x = (W - root_w) / 2
box(root_x, root_y, root_w, root_h, ROOT_FILL, ROOT_FILL, rx=9)
text(W / 2, root_y + 26, "SERVICE", 17, "#ffffff", "700", "middle",
     ' letter-spacing="1.4"')
text(W / 2, root_y + 47,
     "Linha de Produto de Software — gestão de serviços locais",
     13, "#c7d0dc", "400", "middle")

bus_y = 122
add(f'<line x1="{W/2}" y1="{root_y + root_h}" x2="{W/2}" y2="{bus_y}" '
    f'stroke="{LINE}" stroke-width="1.6"/>')

centers = [(c["left"] + c["right"]) / 2 for c in COLUMNS]
add(f'<line x1="{centers[0]}" y1="{bus_y}" x2="{centers[-1]}" y2="{bus_y}" '
    f'stroke="{LINE}" stroke-width="1.6"/>')

positions = {}

for col, cx in zip(COLUMNS, centers):
    left, right = col["left"], col["right"]
    gx, gw = left + 10, (right - left) - 20

    add(f'<line x1="{cx}" y1="{bus_y}" x2="{cx}" y2="{GROUP_Y - 8}" '
        f'stroke="{LINE}" stroke-width="1.6"/>')
    marker(cx, GROUP_Y - 9, col["mandatory"])
    box(gx, GROUP_Y, gw, GROUP_H, col["fill"], col["stroke"], rx=8, width=1.8)
    text(cx, GROUP_Y + 25, col["title"], 16, INK, "700", "middle")
    text(cx, GROUP_Y + 46, col["badge"] or col["subtitle"], 12.5, MUTED,
         "400", "middle")

    row = [0]

    def emit(nodes, depth, parent_bottom):
        spine_x = left + 34 + depth * 40
        box_x = spine_x + 24
        box_w = right - 10 - box_x
        last_y = parent_bottom
        for label, mandatory, kids in nodes:
            y = CHILD_TOP + row[0] * ROW_H
            cy = y + BOX_H / 2
            row[0] += 1

            add(f'<line x1="{spine_x}" y1="{last_y}" x2="{spine_x}" y2="{cy}" '
                f'stroke="{LINE}" stroke-width="1.4"/>')
            add(f'<line x1="{spine_x}" y1="{cy}" x2="{box_x - 13}" y2="{cy}" '
                f'stroke="{LINE}" stroke-width="1.4"/>')
            last_y = cy

            shade = "#ffffff" if depth == 0 else "#fbfcfd"
            box(box_x, y, box_w, BOX_H, shade, col["stroke"], rx=6, width=1.2)
            marker(box_x - 6.5, cy, mandatory)
            text(box_x + 14, cy + 5, label, 14.5)
            positions[label] = (box_x, cy, box_x + box_w)

            if kids:
                emit(kids, depth + 1, y + BOX_H)

    emit(col["children"], 0, GROUP_Y + GROUP_H)

# --------------------------------------------------- restrições entre ramos
for origin, target in (("Ficha do Pet", "Petshop"),
                       ("Anamnese", "Clínica de Estética")):
    ox, oy, _ = positions[origin]
    _, ty, tright = positions[target]
    mid = (tright + ox) / 2
    add(f'<path d="M {ox - 4} {oy} C {mid} {oy}, {mid} {ty}, {tright + 10} {ty}" '
        f'fill="none" stroke="{VAR_STROKE}" stroke-width="1.6" '
        f'stroke-dasharray="6 4" marker-end="url(#req)"/>')

text(1420, 238, "requer", 12, VAR_STROKE, "600", "middle")

# ---------------------------------------------------------------- legenda
LY = 838
box(40, LY, 860, 322, "#fbfcfd", "#dde3ea", rx=9, width=1.2)
text(66, LY + 32, "LEGENDA", 13, MUTED, "700", "start", ' letter-spacing="1.2"')

y = LY + 62
for mandatory, label in (
    (True, "Feature obrigatória — presente em todo produto da linha"),
    (False, "Feature opcional — ponto de variação, ativada por feature flag"),
):
    marker(84, y - 5, mandatory)
    text(108, y, label, 14)
    y += 30

add(f'<rect x="72" y="{y - 17}" width="26" height="15" rx="4" fill="{SEG_FILL}" '
    f'stroke="{SEG_STROKE}" stroke-width="1.4"/>')
text(108, y, "Grupo alternativo (XOR) — exatamente uma variante é selecionada", 14)
y += 30
add(f'<line x1="72" y1="{y - 10}" x2="94" y2="{y - 10}" stroke="{VAR_STROKE}" '
    f'stroke-width="1.6" stroke-dasharray="6 4" marker-end="url(#req)"/>')
text(108, y, "Restrição entre ramos: a feature exige a variante indicada", 14)

y += 36
text(66, y, "Sub-feature implica dependência do pai:", 13.5, MUTED, "700")
y += 23
text(66, y, "Vacinação requer Ficha do Pet · Controle de Frequência requer Planos "
     "Recorrentes", 13.5, MUTED)
y += 31
text(66, y, "Binding (momento da seleção):", 13.5, MUTED, "700")
y += 23
text(66, y, "tempo de execução — BusinessConfig + feature flags, sem recompilar o "
     "produto", 13.5, MUTED)
y += 31
text(66, y, "Rastreabilidade: src/config/features/index.ts · src/config/business/index.ts",
     13.5, MUTED)

# ----------------------------------------------------- matriz de derivação
MX, MW = 940, 1020
box(MX, LY, MW, 322, "#fbfcfd", "#dde3ea", rx=9, width=1.2)
text(MX + 26, LY + 32, "DERIVAÇÃO DOS PRODUTOS (engenharia de aplicação)", 13,
     MUTED, "700", "start", ' letter-spacing="1.2"')

col_x = [MX + 26, MX + 400, MX + 560, MX + 720, MX + 890]
head_y = LY + 68
text(col_x[0], head_y, "Feature opcional", 13.5, INK, "700")
for i, preset in enumerate(MATRIX_PRESETS):
    text(col_x[i + 1], head_y, preset, 13.5, INK, "700", "middle")
add(f'<line x1="{MX + 26}" y1="{head_y + 13}" x2="{MX + MW - 26}" y2="{head_y + 13}" '
    f'stroke="#dde3ea" stroke-width="1.4"/>')

ry = head_y + 44
for feature in MATRIX_FEATURES:
    text(col_x[0], ry, feature, 13.5)
    for i, active in enumerate(MATRIX_PRESETS.values()):
        marker(col_x[i + 1], ry - 5, feature in active)
    ry += 32

add("</svg>")

target = Path(__file__).with_name("feature-model.svg")
target.write_text("\n".join(out), encoding="utf-8")
print(f"gerado: {target} ({len(out)} elementos)")
