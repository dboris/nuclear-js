.PHONY: build dev bundle

build:
	npm run build

dev:
	npm run dev-build

bundle:
	esbuild --bundle --format=esm --outfile=dist/nuclear.js src/main.js
	esbuild --bundle --minify --format=esm --outfile=dist/nuclear.min.js src/main.js