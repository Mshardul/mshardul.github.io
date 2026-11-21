.PHONY: up mockup screenshots screenshots-mockup

# Serve the static design mockups at http://localhost:8000/docs/design/mockup/.
# Served from the repo root because the mockups load logos and the photo from
# ../../../src/assets. Needs .venv (python3 -m venv .venv). Change the port with
#   make mockup PORT=9000
PORT ?= 8000
mockup:
	.venv/bin/python -m http.server $(PORT) --bind 127.0.0.1

# Start the Astro dev server (hot reload) at http://localhost:4321/.
# Pass extra flags with ARGS, e.g. make up ARGS="--host --port 3000"
up:
	npm run dev -- $(ARGS)

# Build, then screenshot every view in every screen size, theme and JS setting
# into .screenshots/<yyyymmdd>-<HHMMSS>/. Narrow it with ARGS, e.g.
#   make screenshots ARGS="--view home,experience --screen mobile --theme dark"
#   make screenshots ARGS="--browser safari"
screenshots:
	npm run build
	node scripts/screenshots.ts $(ARGS)

# Screenshot the static design mockups (docs/design/mockup) the same way, into
# .screenshots/<yyyymmdd>-<HHMMSS>-mockup/. No build needed. Same ARGS filters:
#   make screenshots-mockup ARGS="--view home --screen mobile"
screenshots-mockup:
	node scripts/screenshots.ts --target mockup $(ARGS)
