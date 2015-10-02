# Incy Wincy Web Spider

A small, built for fun (targetting 2hrs) website resource mapper.

Given a start URL it will go climbing to tell you what is internally or externally linked and what is loaded as static resource.

## Get it
```
git clone git@github.com:michael-donat/incywincy.git
cd incywincy
make
```
## Test it
```
make test
```
## Make it work
```
node ./incywincy.js

node ./incywincy.js http://michael-donat.github.io
```

## Caveats

IncyWincy is still in his tender teens, as such he doesn't yet understand few things:

  - he's not nice to web and completely ignores robots.txt
  - he doesn't consider HTML 'base href' tag and takes all locations relatively to the context
  - he does not check for canonical link in the DOM so will go over the same page if url is different
  - he's also been told to ignore # parts of locations
  - he only climbs html waterspouts, no javascript
  - he's normally told to only consider http(s) protocol, will ignore other
  - he weaves plain text webs, no json, xml or other formats

## Notes

Getting node services up/down is super quick, as such the effort required to classically unit test the async parts of the code was not worth the time, instead, an outside-in approach has been followed with small mock server in the background to verify results.

~~There is also the unanswered question of why the queue drain callback isn't fired, there is a workaround in place where scheduled function checks for the queue to be empty/idle periodically - I will go finding out what's wrong but this will take me over the target 2hrs of fun.~~ fixed in https://github.com/michael-donat/incywincy/commit/330a6179a532573b695a2ba8be63a12a95e12c06
