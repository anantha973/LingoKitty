#!/usr/bin/env python3
"""
Outline-aware transparent cutout, halo decontamination, and 3x Lanczos upscaler
for the 12 Hello Kitty & Keroppi illustration sheets (1200x896).
"""

from __future__ import annotations

from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage

DL = Path("/Users/ananth/Downloads")
ROOT = Path("/Users/ananth/Antigravity-projects/LingoKitty")
MASCOTS_DIR = ROOT / "public" / "assets" / "mascots"
ACCENTS_DIR = ROOT / "public" / "assets" / "accents"
PROOF_DIR = Path("/Users/ananth/.gemini/antigravity/brain/0d39560e-d09a-4733-901d-f2a44475286a/scratch")

SHEETS = {
    "hk2": DL / "image.png",
    "hk1": DL / "Generated Image November 26, 2026 - 2_13PM.jpg",
    "kr1": DL / "Generated Image November 26, 2026 - 2_13PM (2).jpg",
    "kr2": DL / "Generated Image November 26, 2026 - 2_13PM (3).jpg",
    "globe": DL / "Generated Image November 26, 2026 - 2_14PM (2).jpg",
    "duo1": DL / "Generated Image November 26, 2026 - 2_14PM (3).jpg",
    "duo2": DL / "Generated Image November 26, 2026 - 2_14PM (4).jpg",
    "cel": DL / "Generated Image November 26, 2026 - 2_14PM (5).jpg",
    "fest": DL / "Generated Image November 26, 2026 - 2_14PM (6).jpg",
}

# (output_name, sheet_key, (x0, y0, x1, y1), min_blob_px, optional_mask_rects_in_sheet_coords)
MASCOT_SPECS = [
    ("lantern-festival", "fest", (430, 546, 775, 818), 100, []),
    ("foodie-duo", "fest", (790, 532, 1185, 818), 100, []),
    ("globe-traveler", "globe", (398, 242, 825, 882), 100, [(395, 435, 430, 585)]),
    ("bao-zi-time", "kr2", (35, 205, 385, 478), 140, []),
    ("hop-to-it", "kr1", (445, 238, 745, 468), 100, []),
    ("reader-kitty", "hk1", (815, 550, 1175, 820), 100, []),
    ("sweetheart-kitty", "hk1", (45, 215, 385, 478), 100, []),
    ("artist-kitty", "hk1", (795, 195, 1185, 452), 100, []),
    ("music-makers", "duo1", (810, 592, 1175, 822), 80, []),
    ("singing-rain", "kr1", (795, 208, 1175, 476), 100, []),
    ("teatime-kitty", "hk1", (425, 248, 765, 474), 100, []),
    ("picnic-party", "duo1", (25, 584, 415, 835), 100, []),
    ("dreamer-kitty", "hk1", (445, 535, 745, 820), 100, []),
    ("gardener-keroppi", "kr2", (470, 522, 795, 818), 100, [(470, 580, 572, 700)]),
    ("sweet-dreams", "hk2", (825, 528, 1150, 822), 80, []),
    ("graduation-duo", "cel", (40, 592, 390, 825), 80, [(125, 588, 285, 600)]),
    ("winners-cup", "duo2", (25, 202, 395, 476), 80, []),
    ("little-explorer", "kr1", (35, 535, 395, 818), 140, []),
    ("celebrate-duo", "duo1", (35, 234, 410, 476), 80, []),
    ("bubble-joy", "kr2", (795, 535, 1175, 818), 80, []),
    ("little-baker", "hk2", (45, 524, 375, 822), 100, []),
    ("high-flyer", "hk2", (795, 210, 1175, 478), 100, []),
    ("crafty-creator", "hk2", (425, 242, 775, 472), 100, []),
    ("night-pond-dreams", "kr1", (810, 534, 1155, 818), 100, []),
]

ACCENT_SPECS = [
    ("star-gold", "hk2", (272, 80, 329, 137)),
    ("sparkle-four", "hk2", (371, 499, 405, 538)),
    ("heart-pink", "hk2", (238, 55, 276, 93)),
    ("bow-pink", "hk2", (173, 84, 247, 138)),
    ("leaf-green", "kr1", (180, 84, 238, 140)),
    ("baozi-mini", "kr1", (272, 70, 360, 142)),
    ("music-note-pink", "hk2", (534, 564, 584, 618)),
    ("music-note-green", "hk2", (702, 634, 756, 688)),
    ("music-note-blue", "hk2", (688, 584, 728, 634)),
    ("paper-plane", "globe", (195, 70, 289, 138)),
    ("compass-mini", "globe", (80, 50, 170, 174)),
    ("mini-book", "hk1", (266, 72, 332, 142)),
]


def remove_paper_background(
    rgba_crop: np.ndarray,
    min_blob_px: int = 50,
    remove_interior_paper: bool = True,
) -> np.ndarray:
    """
    Outline-aware flood segmentation:
    - Treats pale graph-paper & grid lines (luma > 168 & low chroma) as walkable paper.
    - Treats only true dark ink outlines (luma < 142) or colored fills as barriers.
    - Flood-fills from all outer borders + detects enclosed cream-paper pockets while
      preserving white Kitty faces, Keroppi eyes, and steamed baozi.
    """
    rgb = rgba_crop[:, :, :3].astype(np.float32)
    r, g, b = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
    mx = np.maximum(np.maximum(r, g), b)
    mn = np.minimum(np.minimum(r, g), b)
    chroma = mx - mn
    luma = 0.299 * r + 0.587 * g + 0.114 * b

    border = np.concatenate([
        rgb[:5, :, :].reshape(-1, 3),
        rgb[-5:, :, :].reshape(-1, 3),
        rgb[:, :5, :].reshape(-1, 3),
        rgb[:, -5:, :].reshape(-1, 3),
    ], axis=0)
    paper_rgb = np.median(border, axis=0)
    dist_paper = np.linalg.norm(rgb - paper_rgb[None, None, :], axis=2)

    # Strict ink detector: dark brown outlines (<142 luma) OR strongly non-paper dark edges
    is_ink = (luma < 142) | ((luma < 168) & (dist_paper > 45))
    # Colored fills: distinct chroma & far from paper color
    is_color = (chroma > 28) & (dist_paper > 26)
    # Pale grid lines and cream paper
    is_paper_candidate = (dist_paper < 56) & (luma > 160) & (chroma < 32) & (~is_ink) & (~is_color)

    barrier = ndimage.binary_closing(is_ink | is_color, structure=np.ones((3, 3)))
    walkable = ~barrier & is_paper_candidate

    seed = np.zeros_like(walkable, dtype=bool)
    seed[0, :] = walkable[0, :]
    seed[-1, :] = walkable[-1, :]
    seed[:, 0] = walkable[:, 0]
    seed[:, -1] = walkable[:, -1]

    exterior_bg = ndimage.binary_propagation(seed, mask=walkable, structure=np.ones((3, 3)))

    # Remove enclosed exterior paper pockets (gaps between arms/props) while keeping bright white faces
    if remove_interior_paper:
        labeled, n_comp = ndimage.label(walkable & ~exterior_bg)
        for cid in range(1, n_comp + 1):
            comp = labeled == cid
            area = int(comp.sum())
            if area < 14:
                continue
            mean_rgb = rgb[comp].mean(axis=0)
            mean_luma = float(luma[comp].mean())
            mean_dist = float(np.linalg.norm(mean_rgb - paper_rgb))
            if mean_dist < 14.0 and mean_luma < 241.0 and area < 12000:
                exterior_bg |= comp

    fg = ~exterior_bg

    # Prune tiny isolated speckles (stray dots/grid remnants)
    lbl, n = ndimage.label(fg, structure=np.ones((3, 3)))
    if n > 0:
        sizes = ndimage.sum(fg, lbl, range(1, n + 1))
        keep = np.zeros(n + 1, dtype=bool)
        for i, sz in enumerate(sizes, start=1):
            if sz >= min_blob_px:
                keep[i] = True
        fg = keep[lbl]

    alpha = fg.astype(np.float32) * 255.0
    eroded = ndimage.binary_erosion(fg, structure=np.ones((3, 3)))
    boundary = fg & ~eroded
    soft_edge = boundary & (dist_paper < 46) & (~is_ink)
    alpha[soft_edge] = np.clip((dist_paper[soft_edge] - 14.0) / 32.0, 0.0, 1.0) * 255.0

    # Decontaminate edge halos
    out = np.dstack([rgb, alpha]).astype(np.uint8)
    edge_mask = (alpha > 0) & (alpha < 225)
    if np.any(edge_mask):
        a_norm = alpha[edge_mask][:, None] / 255.0
        ink_tone = np.array([75.0, 52.0, 44.0], dtype=np.float32)
        blended = rgb[edge_mask] * a_norm + ink_tone * (1.0 - a_norm)
        out[:, :, :3][edge_mask] = np.clip(blended, 0, 255).astype(np.uint8)

    return out


def crop_and_upscale(
    sheet_img: Image.Image,
    box: tuple[int, int, int, int],
    scale: int = 3,
    min_blob_px: int = 50,
    mask_rects: list[tuple[int, int, int, int]] | None = None,
    remove_interior_paper: bool = True,
) -> Image.Image:
    crop_img = sheet_img.crop(box).convert("RGBA")
    if mask_rects:
        # Paint masked rectangles with paper color estimated from crop border
        arr_tmp = np.array(crop_img)
        paper_col = tuple(int(v) for v in np.median(arr_tmp[:5, :, :3].reshape(-1, 3), axis=0)) + (255,)
        draw = ImageDraw.Draw(crop_img)
        x0, y0, _, _ = box
        for mx0, my0, mx1, my1 in mask_rects:
            draw.rectangle([mx0 - x0, my0 - y0, mx1 - x0, my1 - y0], fill=paper_col)

    cleaned = remove_paper_background(
        np.array(crop_img),
        min_blob_px=min_blob_px,
        remove_interior_paper=remove_interior_paper,
    )
    im = Image.fromarray(cleaned)
    bbox = im.getbbox()
    if bbox:
        px0 = max(0, bbox[0] - 4)
        py0 = max(0, bbox[1] - 4)
        px1 = min(im.width, bbox[2] + 4)
        py1 = min(im.height, bbox[3] + 4)
        im = im.crop((px0, py0, px1, py1))

    new_size = (im.width * scale, im.height * scale)
    rgb_up = im.convert("RGB").resize(new_size, Image.Resampling.LANCZOS)
    rgb_up = rgb_up.filter(ImageFilter.UnsharpMask(radius=1.1, percent=75, threshold=3))
    alpha_up = im.getchannel("A").resize(new_size, Image.Resampling.LANCZOS)
    a_arr = np.array(alpha_up)
    a_arr[a_arr < 16] = 0
    rgb_up.putalpha(Image.fromarray(a_arr))
    return rgb_up


def make_proof_sheet(items: list[tuple[str, Path]], out_path: Path, cols: int = 4, cell_size: int = 240):
    rows = (len(items) + cols - 1) // cols
    canvas = Image.new("RGB", (cols * cell_size, rows * cell_size), (58, 42, 36))
    draw = ImageDraw.Draw(canvas)

    for idx, (name, p) in enumerate(items):
        r, c = divmod(idx, cols)
        x0, y0 = c * cell_size, r * cell_size
        tile_bg = (248, 241, 231) if (r + c) % 2 == 0 else (62, 45, 39)
        draw.rectangle([x0 + 2, y0 + 2, x0 + cell_size - 2, y0 + cell_size - 2], fill=tile_bg)

        im = Image.open(p).convert("RGBA")
        im.thumbnail((cell_size - 28, cell_size - 40), Image.Resampling.LANCZOS)
        px = x0 + (cell_size - im.width) // 2
        py = y0 + (cell_size - 24 - im.height) // 2
        canvas.paste(im, (px, py), im)

        txt_col = (73, 53, 45) if (r + c) % 2 == 0 else (255, 249, 241)
        draw.text((x0 + 8, y0 + cell_size - 20), name, fill=txt_col)

    canvas.save(out_path)


def build_favicon_and_logo():
    lantern_path = MASCOTS_DIR / "lantern-festival.png"
    im = Image.open(lantern_path).convert("RGBA")

    for size, dest in [
        (512, ROOT / "public" / "apple-touch-icon.png"),
        (192, ROOT / "public" / "favicon-192.png"),
        (64, ROOT / "public" / "favicon.png"),
    ]:
        badge = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(badge)
        pad = max(2, size // 32)
        rad = size // 4
        draw.rounded_rectangle(
            [pad, pad, size - pad, size - pad],
            radius=rad,
            fill=(253, 247, 240, 255),
            outline=(233, 143, 156, 255),
            width=max(2, size // 24),
        )
        fg = im.copy()
        fg.thumbnail((int(size * 0.86), int(size * 0.86)), Image.Resampling.LANCZOS)
        badge.paste(fg, ((size - fg.width) // 2, (size - fg.height) // 2), fg)
        badge.save(dest)


def main():
    MASCOTS_DIR.mkdir(parents=True, exist_ok=True)
    ACCENTS_DIR.mkdir(parents=True, exist_ok=True)
    PROOF_DIR.mkdir(parents=True, exist_ok=True)

    loaded = {k: Image.open(p) for k, p in SHEETS.items()}

    mascot_proof_items = []
    for name, sheet_key, box, min_px, mask_rects in MASCOT_SPECS:
        out_p = MASCOTS_DIR / f"{name}.png"
        cutout = crop_and_upscale(
            loaded[sheet_key], box, scale=3, min_blob_px=min_px, mask_rects=mask_rects
        )
        cutout.save(out_p, optimize=True)
        mascot_proof_items.append((name, out_p))

    accent_proof_items = []
    for name, sheet_key, box in ACCENT_SPECS:
        out_p = ACCENTS_DIR / f"{name}.png"
        cutout = crop_and_upscale(
            loaded[sheet_key],
            box,
            scale=3,
            min_blob_px=15,
            remove_interior_paper=(name != "paper-plane"),
        )
        cutout.save(out_p, optimize=True)
        accent_proof_items.append((name, out_p))

    make_proof_sheet(mascot_proof_items, PROOF_DIR / "proof_mascots.png", cols=4, cell_size=240)
    make_proof_sheet(accent_proof_items, PROOF_DIR / "proof_accents.png", cols=4, cell_size=180)
    build_favicon_and_logo()
    print("Regenerated all cutouts, proof sheets, and favicons cleanly.")


if __name__ == "__main__":
    main()
