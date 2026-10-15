# -*- coding: utf-8 -*-
"""Diagrama de casos de uso do Service (plataforma de compra e venda).

    python3 docs/diagrams/gen_use_case_diagram.py
"""

from __future__ import annotations

import math
import os
from pathlib import Path

os.environ.setdefault("MPLCONFIGDIR", "/tmp/mpl-service")

import matplotlib.pyplot as plt
from matplotlib.patches import Circle, Ellipse, FancyArrowPatch, Polygon, Rectangle

OUT = Path(__file__).resolve().parent
W, H = 2600, 1680
DPI = 160

INK = "#161616"
UC_FILL = "#fff3a8"
UC_STROKE = "#2a2a2a"
NOTE_FILL = "#fffbe6"
MUTED = "#666666"

RX, RY = 132, 48


def ellipse_edge(cx, cy, tx, ty, rx=RX, ry=RY):
    dx, dy = tx - cx, ty - cy
    if abs(dx) < 1e-6 and abs(dy) < 1e-6:
        return cx + rx, cy
    k = 1.0 / math.sqrt((dx / rx) ** 2 + (dy / ry) ** 2)
    return cx + k * dx, cy + k * dy


def draw_actor(ax, x, y, name, stereotype=None, abstract=False):
    head_r = 12
    head_y = y - 56
    ax.add_patch(Circle((x, head_y), head_r, fill=False, lw=1.7, ec=INK, zorder=8))
    ax.plot([x, x], [head_y + head_r, y - 20], color=INK, lw=1.7, zorder=8, solid_capstyle="round")
    ax.plot([x - 17, x + 17], [y - 38, y - 38], color=INK, lw=1.7, zorder=8, solid_capstyle="round")
    ax.plot([x, x - 14], [y - 20, y], color=INK, lw=1.7, zorder=8, solid_capstyle="round")
    ax.plot([x, x + 14], [y - 20, y], color=INK, lw=1.7, zorder=8, solid_capstyle="round")
    ax.text(
        x, y + 8, name, ha="center", va="top", fontsize=9, color=INK, zorder=9,
        linespacing=1.12, style="italic" if abstract else "normal",
    )
    if stereotype:
        ax.text(x, y + 36, stereotype, ha="center", va="top", fontsize=7.5,
                color=MUTED, style="italic", zorder=9)
    return x, y - 38


def draw_uc(ax, cx, cy, code, title):
    ax.add_patch(Ellipse((cx, cy), RX * 2, RY * 2, facecolor=UC_FILL,
                         edgecolor=UC_STROKE, lw=1.4, zorder=6))
    ax.text(cx, cy, f"{code}\n{title}", ha="center", va="center", fontsize=8,
            color=INK, zorder=7, linespacing=1.15)
    return cx, cy


def assoc(ax, actor_xy, uc, side="left"):
    ax0, ay = actor_xy
    ucx, ucy = uc
    end_x = (ucx - RX) if side == "left" else (ucx + RX)
    ax.plot([ax0, end_x], [ay, ucy], color=INK, lw=1.15, zorder=3, solid_capstyle="round")


def spine(ax, actor_xy, ucs, spine_x):
    ax0, ay = actor_xy
    points = [(uc[0], uc[1]) for uc in ucs]
    ys = [ay] + [p[1] for p in points]
    ax.plot([ax0, spine_x], [ay, ay], color=INK, lw=1.15, zorder=3, solid_capstyle="round")
    ax.plot([spine_x, spine_x], [min(ys), max(ys)], color=INK, lw=1.15, zorder=3, solid_capstyle="round")
    for ucx, ucy in points:
        end_x = (ucx - RX) if spine_x <= ucx else (ucx + RX)
        ax.plot([spine_x, end_x], [ucy, ucy], color=INK, lw=1.15, zorder=3, solid_capstyle="round")


def rel_arrow(ax, src, dst, label, rad=0.0, dy=-12):
    x1, y1 = ellipse_edge(*src, dst[0], dst[1])
    x2, y2 = ellipse_edge(*dst, src[0], src[1])
    ax.add_patch(FancyArrowPatch(
        (x1, y1), (x2, y2),
        arrowstyle="->", mutation_scale=14,
        linestyle=(0, (7, 4)), linewidth=1.2, color=INK,
        connectionstyle=f"arc3,rad={rad}",
        zorder=5, shrinkA=1, shrinkB=1,
    ))
    mx, my = (x1 + x2) / 2, (y1 + y2) / 2
    if rad:
        my += (-16 if rad > 0 else 14)
    ax.text(mx, my + dy, label, ha="center", va="center", fontsize=8,
            color=INK, zorder=10,
            bbox=dict(boxstyle="square,pad=0.2", fc="white", ec="none"))


def gen_parent_child(ax, parent_xy, child_xy):
    """Triângulo no pai, linha até o filho (generalização)."""
    px, py = parent_xy
    cx, cy = child_xy
    ax.plot([px, px], [py + 10, cy], color=INK, lw=1.2, zorder=4)
    ax.plot([px, cx - 22], [cy, cy], color=INK, lw=1.2, zorder=4)
    ax.add_patch(Polygon(
        [(px, py + 10), (px - 9, py + 28), (px + 9, py + 28)],
        closed=True, facecolor="white", edgecolor=INK, lw=1.3, zorder=9,
    ))


def main():
    fig = plt.figure(figsize=(W / DPI, H / DPI), dpi=DPI, facecolor="white")
    ax = fig.add_axes([0, 0, 1, 1])
    ax.set_xlim(0, W)
    ax.set_ylim(H, 0)
    ax.set_axis_off()
    ax.set_facecolor("white")

    sys_x, sys_y, sys_w, sys_h = 430, 28, 1720, 1520
    ax.add_patch(Rectangle((sys_x, sys_y), sys_w, sys_h, fill=False, lw=1.8, ec=INK, zorder=2))
    ax.text(sys_x + 14, sys_y + 20, "Service", ha="left", va="top",
            fontsize=14, fontweight="bold", color=INK, zorder=4)

    xa, xb, xc = 700, 1120, 1540

    uc1 = draw_uc(ax, xa, 160, "UC1", "Autenticar\nno sistema")
    uc2 = draw_uc(ax, xa, 360, "UC2", "Visualizar\ndashboard")
    uc6 = draw_uc(ax, xa, 520, "UC6", "Gerenciar\nagenda")
    uc3 = draw_uc(ax, xa, 700, "UC3", "Manter\nserviços")
    uc4 = draw_uc(ax, xa, 860, "UC4", "Manter\nprofissionais")
    uc11 = draw_uc(ax, xa, 1020, "UC11", "Personalizar\no sistema")
    uc12 = draw_uc(ax, xa, 1180, "UC12", "Configurar\nmódulos")

    uc5 = draw_uc(ax, xb, 120, "UC5", "Realizar\nagendamento")
    uc7 = draw_uc(ax, xb, 320, "UC7", "Realizar\npagamento")
    uc8 = draw_uc(ax, xb, 500, "UC8", "Recuperar\nsenha")
    uc10 = draw_uc(ax, xb, 1320, "UC10", "Cadastrar-se\nno sistema")

    uc9 = draw_uc(ax, xc, 220, "UC9", "Enviar\nnotificação")

    a_user = draw_actor(ax, 190, 160, "Usuário", abstract=True)
    a_fun = draw_actor(ax, 190, 440, "Funcionário")
    a_adm = draw_actor(ax, 190, 860, "Administrador")
    a_cli = draw_actor(ax, 190, 1400, "Cliente")

    a_nt = draw_actor(ax, 2420, 180, "Sistema de\nNotificação", "«sistema»")
    a_pay = draw_actor(ax, 2420, 400, "Sistema de\nPagamento", "«sistema»")

    # Usuário ← Funcionário ← Administrador ; Usuário ← Cliente
    gen_parent_child(ax, a_user, (a_fun[0], a_fun[1]))
    gen_parent_child(ax, a_fun, (a_adm[0], a_adm[1]))
    # Cliente irmão de Funcionário: trilho à esquerda do Usuário
    px, py = a_user
    cx, cy = a_cli
    rail = px - 48
    ax.plot([px, rail], [py + 28, py + 28], color=INK, lw=1.2, zorder=4)
    ax.plot([rail, rail], [py + 28, cy], color=INK, lw=1.2, zorder=4)
    ax.plot([rail, cx - 22], [cy, cy], color=INK, lw=1.2, zorder=4)

    u = (a_user[0] + 22, a_user[1])
    fun = (a_fun[0] + 22, a_fun[1])
    adm = (a_adm[0] + 22, a_adm[1])
    cli = (a_cli[0] + 22, a_cli[1])
    nt = (a_nt[0] - 22, a_nt[1])
    pay = (a_pay[0] - 22, a_pay[1])

    assoc(ax, u, uc1, side="left")
    spine(ax, fun, [uc2, uc6], spine_x=500)
    spine(ax, adm, [uc3, uc4, uc11, uc12], spine_x=520)
    spine(ax, cli, [uc10, uc5, uc7], spine_x=980)

    assoc(ax, nt, uc9, side="right")
    assoc(ax, pay, uc7, side="right")

    # extend: extra → base
    rel_arrow(ax, uc8, uc1, "«extend»", rad=0.0, dy=-14)
    rel_arrow(ax, uc5, uc9, "«include»", rad=-0.08, dy=8)
    rel_arrow(ax, uc8, uc9, "«include»", rad=0.12, dy=-12)
    rel_arrow(ax, uc5, uc7, "«include»", rad=0.0, dy=10)

    ax.add_patch(Rectangle((1380, 560), 560, 150, fill=True,
                           facecolor=NOTE_FILL, edgecolor="#c8b56a", lw=1, zorder=5))
    ax.text(1660, 578, "Compra e venda", ha="center", va="top", fontsize=8,
            color="#7a6a2a", fontweight="bold", zorder=6)
    ax.text(
        1660, 602,
        "Cliente se cadastra, agenda e paga.\n"
        "Prestador só vê a agenda (não cadastra\n"
        "nem marca horário no lugar do cliente).\n"
        "«include»: sempre chama. «extend»: só se a\n"
        "condição ocorrer. Seta para o incluído / base.",
        ha="center", va="top", fontsize=7.5, color="#333", zorder=6, linespacing=1.32,
    )

    ly = 1600
    ax.add_patch(Rectangle((430, 1564), 1720, 72, fill=True,
                           facecolor="#f7f7f7", edgecolor="#d0d0d0", lw=0.8, zorder=4))
    ax.plot([460, 540], [ly, ly], color=INK, lw=1.4, zorder=5)
    ax.text(550, ly, "associação", ha="left", va="center", fontsize=8.2, zorder=5)
    ax.plot([700, 770], [ly, ly], color=INK, lw=1.2, linestyle=(0, (6, 3)), zorder=5)
    ax.annotate("", xy=(784, ly), xytext=(770, ly),
                arrowprops=dict(arrowstyle="->", color=INK, lw=1.2), zorder=5)
    ax.text(794, ly, "«include» / «extend»", ha="left", va="center", fontsize=8.2, zorder=5)
    ax.add_patch(Polygon([(1080, ly + 10), (1070, ly - 10), (1090, ly - 10)],
                         closed=True, facecolor="white", edgecolor=INK, lw=1.1, zorder=5))
    ax.text(1102, ly, "generalização", ha="left", va="center", fontsize=8.2, zorder=5)
    ax.add_patch(Ellipse((1360, ly), 38, 18, facecolor=UC_FILL, edgecolor=UC_STROKE, lw=1, zorder=5))
    ax.text(1386, ly, "caso de uso", ha="left", va="center", fontsize=8.2, zorder=5)
    ax.text(1570, ly, "itálico = ator abstrato", ha="left", va="center", fontsize=8.2, zorder=5)

    png = OUT / "use-case-diagram.png"
    svg = OUT / "use-case-diagram.svg"
    fig.savefig(png, dpi=DPI, facecolor="white")
    fig.savefig(svg, facecolor="white")
    plt.close(fig)
    print(f"Gerado {png}")
    print(f"Gerado {svg}")


if __name__ == "__main__":
    main()
