#!/usr/bin/env bash
# Pull the studio's web styling into design/.studio so proposals can use it.
#
#   yarn design:pull          # from GitLab (source of truth)
#   yarn design:pull vps      # from the production checkout on the VPS
#
# What comes over: tailwind.config.js (palette, gradients, radii, type scale),
# src/app/globals.css (glass utilities, heading scale), the base components
# that define the look (Button, Pill, TabFilterPill, Input, Label, MainMenu,
# Badge, cards) and the Freizeit / DetoGrotesk font files.
#
# design/.studio is gitignored: the fonts are licensed to the studio and this
# repository is public, so they must never be committed here.
set -euo pipefail

design="$(cd "$(dirname "$0")/.." && pwd)"
dest="$design/.studio"
source="${1:-gitlab}"

repo="${STUDIO_REPO:-git@gitlab.com:moredesign/moredesign-studio-next-js.git}"
host="${STUDIO_HOST:-MoredesignVPS}"
path="${STUDIO_PATH:-web/frontend}"

files=(
  tailwind.config.js
  src/app/globals.css
  src/fonts/Fonts.ts
  src/components/Default/Button.tsx
  src/components/Default/Input.tsx
  src/components/Default/Label.tsx
  src/components/Default/Checkbox.tsx
  src/components/Pill.tsx
  src/components/TabFilterPill.tsx
  src/components/Menus/MainMenu.tsx
  src/components/Header/Badge.tsx
  src/components/Junks/CloseButton.tsx
  src/components/Cards/ServicesCard.tsx
  src/components/Cards/CounterCard.tsx
  src/components/Icons/IconMoreDesignLogoClear.tsx
)
fonts=(
  Freizeit-Regular.otf
  Freizeit-Medium.otf
  Freizeit-Bold.otf
  DetoGrotesk-Regular.woff2
  DetoGrotesk-Medium.woff2
  DetoGrotesk-Bold.woff2
)

rm -rf "$dest.tmp"
mkdir -p "$dest.tmp/fonts"

case "$source" in
  gitlab)
    checkout="$(mktemp -d)"
    trap 'rm -rf "$checkout"' EXIT
    git clone --quiet --depth 1 --filter=blob:none --sparse "$repo" "$checkout"
    git -C "$checkout" sparse-checkout set --no-cone "${files[@]/#//}" "${fonts[@]/#//src/fonts/}"
    (cd "$checkout" && tar cf - "${files[@]}") | tar xf - -C "$dest.tmp"
    for font in "${fonts[@]}"; do cp "$checkout/src/fonts/$font" "$dest.tmp/fonts/"; done
    echo "gitlab $repo @ $(git -C "$checkout" log -1 --format='%h %s (%cr)')" > "$dest.tmp/SOURCE"
    ;;
  vps)
    ssh -o BatchMode=yes "$host" "cd $path && tar cf - ${files[*]}" | tar xf - -C "$dest.tmp"
    ssh -o BatchMode=yes "$host" "cd $path/src/fonts && tar cf - ${fonts[*]}" | tar xf - -C "$dest.tmp/fonts"
    echo "vps $host:$path @ $(ssh -o BatchMode=yes "$host" "cd $path && git log -1 --format='%h %s (%cr)'")" > "$dest.tmp/SOURCE"
    ;;
  *)
    echo "usage: $0 [gitlab|vps]" >&2
    exit 2
    ;;
esac

rm -rf "$dest"
mv "$dest.tmp" "$dest"
echo "Pulled studio styling into design/.studio"
cat "$dest/SOURCE"
