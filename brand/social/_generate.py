"""
Generate BE333 social-media profile pictures and banners.

Uses the existing gold lotus (assets/images/logo.png) and composes brand-green
canvases at every social platform's recommended sizes. Text uses Georgia
(Windows default serif) which reads close enough to the BE333 wordmark for
social — swap font_serif/font_sans if you install a custom typeface.

Output: brand/social/*.png
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parent.parent.parent   # repo root
LOGO = ROOT / "assets" / "images" / "logo.png"
OUT = ROOT / "brand" / "social"
OUT.mkdir(parents=True, exist_ok=True)

# Brand palette from constants/Colors.ts
DEEP_GREEN = (26, 67, 49, 255)       # #1A4331 primary
MID_GREEN = (44, 110, 82, 255)        # #2C6E52 primaryLight
GOLD = (225, 183, 37, 255)            # #E1B725 secondary
SOFT_GOLD = (245, 215, 101, 255)      # #F5D765 secondaryLight
CREAM = (255, 248, 220, 255)          # for text on green

FONT_SERIF = "C:/Windows/Fonts/georgiab.ttf"
FONT_SERIF_REG = "C:/Windows/Fonts/georgia.ttf"


def load_lotus_transparent():
    """Load the gold lotus and knock out its white background so it can
    sit on any color canvas."""
    img = Image.open(LOGO).convert("RGBA")
    px = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            # Anything close to pure white becomes transparent, scaled by
            # distance-from-white so edges antialias nicely.
            brightness = (r + g + b) / 3
            if brightness > 220:
                # remap 220..255 to alpha 255..0
                falloff = max(0, min(255, int((255 - brightness) * (255 / 35))))
                px[x, y] = (r, g, b, falloff)
    return img


LOTUS = load_lotus_transparent()


def vertical_gradient(size, top_color, bottom_color):
    """Simple top-to-bottom gradient for banner backgrounds."""
    w, h = size
    grad = Image.new("RGBA", size, top_color)
    d = ImageDraw.Draw(grad)
    for y in range(h):
        t = y / max(1, h - 1)
        r = int(top_color[0] * (1 - t) + bottom_color[0] * t)
        g = int(top_color[1] * (1 - t) + bottom_color[1] * t)
        b = int(top_color[2] * (1 - t) + bottom_color[2] * t)
        d.line([(0, y), (w, y)], fill=(r, g, b, 255))
    return grad


def paste_lotus(canvas, target_h, cx, cy, tint_glow=True):
    """Resize the lotus to target_h pixels tall and paste centered at (cx, cy)."""
    ratio = target_h / LOTUS.height
    tw = int(LOTUS.width * ratio)
    th = target_h
    lotus = LOTUS.resize((tw, th), Image.LANCZOS)
    if tint_glow:
        glow = lotus.copy().filter(ImageFilter.GaussianBlur(max(6, target_h // 24)))
        gx = cx - tw // 2
        gy = cy - th // 2
        canvas.alpha_composite(glow, (gx, gy))
    canvas.alpha_composite(lotus, (cx - tw // 2, cy - th // 2))


def font(size, bold=True):
    path = FONT_SERIF if bold else FONT_SERIF_REG
    return ImageFont.truetype(path, size)


def draw_text_centered(canvas, text, xy, size, color, bold=True):
    d = ImageDraw.Draw(canvas)
    f = font(size, bold=bold)
    bbox = d.textbbox((0, 0), text, font=f)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    x = xy[0] - tw // 2 - bbox[0]
    y = xy[1] - th // 2 - bbox[1]
    d.text((x, y), text, font=f, fill=color)


def draw_text_left(canvas, text, xy, size, color, bold=True):
    d = ImageDraw.Draw(canvas)
    f = font(size, bold=bold)
    d.text(xy, text, font=f, fill=color)


# ------------------------------------------------------------
# Profile picture generator (square). Displays cropped to a circle on
# most platforms — lotus centered with generous padding keeps it safe.
# ------------------------------------------------------------
def profile(size, filename):
    canvas = Image.new("RGBA", (size, size), DEEP_GREEN)
    # Subtle radial-ish highlight — center is a touch brighter.
    highlight = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    hd = ImageDraw.Draw(highlight)
    hd.ellipse(
        [size * 0.15, size * 0.15, size * 0.85, size * 0.85],
        fill=(44, 110, 82, 120),
    )
    highlight = highlight.filter(ImageFilter.GaussianBlur(size // 6))
    canvas.alpha_composite(highlight)
    # Lotus takes ~62% of the frame — big enough to read at 100px favicon size.
    paste_lotus(canvas, int(size * 0.62), size // 2, int(size * 0.55))
    out = OUT / filename
    canvas.convert("RGB").save(out, "PNG", optimize=True)
    print(f"  ✓ {filename} ({size}×{size})")


# ------------------------------------------------------------
# Banner generator. Left-anchored lotus + wordmark + tagline over a
# subtle green gradient. Sizes span the aspect-ratio zoo of social banners.
# ------------------------------------------------------------
def fit_size(text, max_w, start_size, bold=True, min_size=10):
    """Shrink font size until text renders within max_w pixels."""
    size = start_size
    while size > min_size:
        f = font(size, bold=bold)
        bbox = ImageDraw.Draw(Image.new("RGBA", (1, 1))).textbbox((0, 0), text, font=f)
        if bbox[2] - bbox[0] <= max_w:
            return size
        size -= 2
    return min_size


def banner(w, h, filename, tagline="Three minutes. Three times. Three weeks.",
           wordmark_size=None, tagline_size=None):
    canvas = vertical_gradient((w, h), DEEP_GREEN, MID_GREEN)
    # Narrow banners (e.g., LinkedIn company 5.9:1) need a smaller lotus
    # and a single-line text block.
    is_narrow = h < 250
    if is_narrow:
        lotus_h = int(h * 0.78)
        lotus_cx = int(w * 0.08)
    else:
        lotus_h = int(h * 0.82)
        lotus_cx = int(w * 0.14)
    lotus_cy = h // 2
    paste_lotus(canvas, lotus_h, lotus_cx, lotus_cy)

    # Wordmark + tagline block right of the lotus.
    d = ImageDraw.Draw(canvas)
    text_x = lotus_cx + int(lotus_h * 0.75)
    text_max_w = w - text_x - int(w * 0.04)  # 4% right margin

    if is_narrow:
        wm_size_start = wordmark_size or int(h * 0.55)
        wm_size = fit_size("BE333", int(text_max_w * 0.35), wm_size_start, bold=True)
        d.text((text_x, (h - wm_size) // 2 - int(h * 0.05)),
               "BE333", font=font(wm_size, bold=True), fill=GOLD)
        wm_w = d.textbbox((0, 0), "BE333", font=font(wm_size, bold=True))[2]
        tg_start = tagline_size or int(h * 0.30)
        tg_avail = text_max_w - wm_w - int(h * 0.15)
        tg_size = fit_size(tagline, tg_avail, tg_start, bold=False)
        d.text((text_x + wm_w + int(h * 0.15), (h - tg_size) // 2),
               tagline, font=font(tg_size, bold=False), fill=CREAM)
    else:
        wm_size_start = wordmark_size or int(h * 0.32)
        wm_size = fit_size("BE333", int(text_max_w * 0.55), wm_size_start, bold=True)
        wm_y = int(h * 0.35) - wm_size // 2
        d.text((text_x, wm_y), "BE333",
               font=font(wm_size, bold=True), fill=GOLD)
        wm_w = d.textbbox((0, 0), "BE333", font=font(wm_size, bold=True))[2]
        # Gold accent underline
        line_y = wm_y + wm_size + int(h * 0.02)
        d.line([(text_x, line_y), (text_x + wm_w, line_y)],
               fill=GOLD, width=max(2, h // 200))
        # Tagline auto-fitted to available width
        tg_start = tagline_size or int(h * 0.13)
        tg_size = fit_size(tagline, text_max_w, tg_start, bold=False)
        tg_y = line_y + int(h * 0.04)
        d.text((text_x, tg_y), tagline,
               font=font(tg_size, bold=False), fill=CREAM)
        # domain
        dom_size = int(tg_size * 0.82)
        dom_y = tg_y + tg_size + int(h * 0.03)
        d.text((text_x, dom_y), "be333.app",
               font=font(dom_size, bold=False), fill=SOFT_GOLD)

    out = OUT / filename
    canvas.convert("RGB").save(out, "PNG", optimize=True)
    print(f"  ✓ {filename} ({w}×{h})")


print("Profile pictures →")
# One master high-res that every platform will accept downscaled…
profile(1080, "universal-profile-1080x1080.png")
# …and platform-specific if you want the exact recommended upload size.
profile(1080, "instagram-profile-1080x1080.png")
profile(500, "facebook-profile-500x500.png")
profile(400, "x-profile-400x400.png")
profile(400, "linkedin-personal-profile-400x400.png")
profile(400, "linkedin-company-profile-400x400.png")
profile(500, "tiktok-profile-500x500.png")
profile(800, "youtube-profile-800x800.png")
profile(500, "pinterest-profile-500x500.png")
profile(1080, "threads-profile-1080x1080.png")

print("\nBanners / cover images →")
banner(851, 315, "facebook-cover-851x315.png")
banner(1500, 500, "x-header-1500x500.png")
banner(1584, 396, "linkedin-personal-cover-1584x396.png")
banner(1128, 191, "linkedin-company-cover-1128x191.png",
       tagline="Small moments. Real change.")
banner(2560, 1440, "youtube-channel-art-2560x1440.png")
banner(800, 450, "pinterest-cover-800x450.png",
       tagline="Small moments. Real change.")
banner(1920, 1080, "facebook-event-cover-1920x1080.png")

print(f"\nAll images written to: {OUT}")
