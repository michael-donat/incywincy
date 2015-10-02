# Incy Wincy Web Spider

A small, built for fun (targetting 2hrs) website resource mapper.

Given a start URL it will go climbing to tell you what is internally or externally linked and what is loaded as static resource.

## Get it
```
  git@github.com:michael-donat/incywincy.git
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
  - he's also been told to ignore # parts of locations
  - he only climbs html waterspouts, no javascript
  - he's normally told to only consider http(s) protocol, will ignore others
