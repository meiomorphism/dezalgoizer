SHELL = /bin/bash

all: bookmarklet.html bookmarklet-raw.txt
.PHONY: all
.DELETE_ON_ERROR:

HTML_SRC = src/bookmarklet.html.t
JS_SRC = src/dezalgoizer.js
JS_SRC_MINI = src/dezalgoizer-mini.js

$(JS_SRC_MINI): $(JS_SRC)
	yui-compressor $< > $@
	
bookmarklet-raw.txt: $(JS_SRC_MINI)
	cat <(echo -n 'javascript:') $< > $@
	
bookmarklet.html: $(HTML_SRC) bookmarklet-raw.txt
	src/inject-js.pl $(HTML_SRC) bookmarklet-raw.txt > $@
	