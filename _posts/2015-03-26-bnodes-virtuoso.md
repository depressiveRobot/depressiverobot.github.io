---
layout: post
title: "insert blank nodes into Virtuoso using SPARQL"
date: 2015-03-26
categories:
tags: virtuoso rdf sparql bnodes
image: /assets/article_images/2015-03-26-bnodes-virtuoso/punch.jpg
image_credits: "<a href='https://commons.wikimedia.org/wiki/File:Once_inch_punch.jpg' target='_blank'>Wikimedia Commons</a>"
comments: true
typeof: BlogPosting
---

Despite being allowed by the the SPARQL 1.1 Update language, Virtuoso doesn't allow to insert statements containing blank nodes using the `INSERT DATA` update query. Oddly enough, when using the `INSERT` update query it **is** possible to add statements with blank nodes. Unfortunately in this case a `WHERE` clause has to be specified. So what is needed is a `WHERE` clause which returns a non-empty result in all circumstances to ensure insertion of the statements. Here is a rather hacky solution to accomplish this problem:

{% highlight sparql %}
INSERT {
  _:node123 <http://example.org/property> <http://example.org/object> .
}
WHERE {
  SELECT * {
    OPTIONAL { ?s ?p ?o . }
  } LIMIT 1
}
{% endhighlight %}

 To get a non-empty result set at any price just use a nested `SELECT` query with an optional triple selection limited to one result. This guarantees the execution of the `INSERT` clause. Happy inserting of blank nodes.

 Head over to GitHub to follow [this issue](https://github.com/openlink/virtuoso-opensource/issues/126).

 ![Image credits: <a href="http://milicicvuk.com/blog/2011/07/14/problems-of-the-rdf-model-blank-nodes/">Problems of the RDF model: Blank Nodes</a>](/assets/article_images/2015-03-26-bnodes-virtuoso/bnode.png)