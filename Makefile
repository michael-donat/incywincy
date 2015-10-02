.PHONY: build test

build:
	npm install

test:
	./node_modules/mocha/bin/mocha  --recursive test
