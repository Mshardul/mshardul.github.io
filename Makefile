.PHONY: screenshots

# Build, then screenshot every view in every screen size, theme and JS setting
# into .screenshots/<yyyymmdd>-<HHMMSS>/. Narrow it with ARGS, e.g.
#   make screenshots ARGS="--view home,experience --screen mobile --theme dark"
#   make screenshots ARGS="--browser safari"
screenshots:
	npm run build
	node scripts/screenshots.ts $(ARGS)
