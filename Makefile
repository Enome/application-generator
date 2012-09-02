build:
	@browserify src/index.js -o app.js

deploy:
	@git checkout gh-pages && git merge master && git push origin gh-pages && git checkout master
