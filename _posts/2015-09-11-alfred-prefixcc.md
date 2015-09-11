---
layout: post
title: "Lookup RDF namespaces with Alfred"
date: 2015-09-11
categories:
tags: [rdf, semantic web, linked data, alfred, workflow]
image: /assets/article_images/2015-09-11-alfred-prefixcc/back.jpg
comments: true
typeof: BlogPosting
---

When working with RDF vocabulary files I often need to lookup an RDF namespace. In the past I used the [rdf.sh](https://github.com/seebi/rdf.sh) command line tool for this task (which provides a lot of other features too). But recently I bought [Alfred](https://www.alfredapp.com/) after using the free version for quite a while. At the same day the idea of an [prefix.cc](http://prefix.cc) workflow came into my mind. And here it is:

![prefix.cc workflow](/assets/article_images/2015-09-11-alfred-prefixcc/alfred-prefixcc.png)

Simply enter the keyword `ns` followed by the prefix and it shows you the corresponding RDF namespace plus Turtle and SPARQL syntax declarations. Select one and it will be copied to the clipboard and pasted to the frontmost application.

Feel free to download it from [GitHub](https://github.com/depressiveRobot/alfred-prefix.cc) or [Packal](http://www.packal.org/workflow/prefixcc).