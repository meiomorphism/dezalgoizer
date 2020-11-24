SHELL = /bin/bash

all: bookmarklet.html bookmarklet-raw.txt
.PHONY: all
.DELETE_ON_ERROR:

HTML_SRC = src/bookmarklet.html.t
JS_SRC = src/dezalgoizer.js
JS_SRC_MINI = src/dezalgoizer-mini.js
TERSER = node_modules/terser/bin/terser

$(TERSER):
	npm install "terser@5.5.0" --no-package-lock --no-audit --no-progress --silent &>/dev/null

$(JS_SRC_MINI): $(JS_SRC) ./Makefile | $(TERSER)
	cat $< | sed 's/\bconst\b/let/g' | npx -q terser -mc > $@

bookmarklet-raw.txt: $(JS_SRC_MINI)
	cat <(echo -n 'javascript:') $< > $@

bookmarklet.html: $(HTML_SRC) bookmarklet-raw.txt
	src/inject-js.pl $(HTML_SRC) bookmarklet-raw.txt > $@
