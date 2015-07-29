---
layout: post
title: "SPARQL and the RDF Dataset: specification vs. implementation"
date: 2015-07-29
categories:
tags: [rdf, sparql, dataset, graph, semantic web, linked data, endpoint]
image: /assets/article_images/2015-07-29-sparql-datasets/semantic_web.jpg
image_credits: "<a href='https://www.flickr.com/photos/cpjobling/5046905848' target='_blank'>Chris Jobling</a>"
comments: true
typeof: BlogPosting
---

## the theory

*SPARQL* is the de facto standard query language for RDF databases of the [Semantic Web](https://en.wikipedia.org/wiki/Semantic_Web). Many RDF databases hold their data in multiple RDF graphs. To allow queries over more than one graph the SPARQL specification defines the term [RDF Dataset](http://www.w3.org/TR/2013/REC-sparql11-query-20130321/#rdfDataset):

> A SPARQL query is executed against an RDF Dataset which represents a collection of graphs. An RDF Dataset comprises one graph, the default graph, which does not have a name, and zero or more named graphs, where each named graph is identified by an IRI.

By using the `FROM` and `FROM NAMED` clauses a SPARQL query can specify the dataset to be used for matching ([13.2 Specifying RDF Datasets](http://www.w3.org/TR/2013/REC-sparql11-query-20130321/#specifyingDataset)):

> The dataset resulting from a number of FROM and FROM NAMED clauses is: a default graph consisting of the RDF merge of the graphs referred to in the FROM clauses, and a set of (IRI, graph) pairs, one from each FROM NAMED clause.

If a query provides no such dataset description, the SPARQL service should use a self-defined one instead ([13.2 Specifying RDF Datasets](http://www.w3.org/TR/2013/REC-sparql11-query-20130321/#specifyingDataset)):

> If a query provides such a dataset description, then it is used in place of any dataset that the query service would use if no dataset description is provided in a query.

To my knowledge, current RDF databases use two different approaches for the default dataset where both contain all the available named graphs and:

1. an unnamed default graph which holds its own information (*Dedicated Unnamed Default Graph*);
2. an unnamed default graph which is the RDF merge of all named graphs (the so called [*Union Default Graph*](http://www.w3.org/TR/2013/REC-sparql11-service-description-20130321/#sd-uniondefaultgraph)).

### the problem of approach 1

A problem arises if the service to be queried utilizes approach 1. As the *Dedicated Unnamed Default Graph* is not referencable, it is not possible to join it with other graphs. In other words, if a query specifies any other graph (whether using FROM or FROM NAMED) the default dataset of the service will be overwritten ([13.2 Specifying RDF Datasets](http://www.w3.org/TR/2013/REC-sparql11-query-20130321/#specifyingDataset)) and therefore the *Dedicated Unnamed Default Graph* is not accessible anymore.

> If a query provides such a dataset description, then it is used in place of any dataset that the query service would use if no dataset description is provided in a query.

What does this mean for service providers? Never ever store important data into the *Dedicated Unnamed Default Graph* as it is not possible to combine its data with other graphs in the service.

## the broken reality

In the following I want to test some popular SPARQL service implementations and how they deal with the different scenarios a query can define its dataset. In concrete these are:

* [Fuseki 2.0.0](http://jena.apache.org/download/#apache-jena-fuseki)
* [Virtuoso Open Source 7.2.1](https://github.com/openlink/virtuoso-opensource/releases/tag/v7.2.1)
* [Oracle 12c Enterprise Edition 12.1.0.2.0](http://www.oracle.com/technetwork/database/enterprise-edition/downloads/database12c-linux-download-2240591.html)
* [Stardog Developer 3.1.3](http://stardog.com/#download)

All servers were started with their default settings and loaded with the test data below. If the service does not support approach 1, the data of the default graph will be written into an explicit named graph `ex:default`.

{% highlight turtle %}
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix ex: <http://example.org/> .

ex:graph1 rdfs:label "Graph1" .
ex:graph2 rdfs:label "Graph2" .
{% endhighlight %}
<figcaption>default graph (ex:default)</figcaption>

{% highlight turtle %}
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .

<graph1:subject> rdfs:label "Subject of Graph1" .
{% endhighlight %}
<figcaption>ex:graph1</figcaption>

{% highlight turtle %}
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .

<graph2:subject> rdfs:label "Subject of Graph2" .
{% endhighlight %}
<figcaption>ex:graph2</figcaption>

</p>

### 1. no dataset description

In the first scenario the query does not define its own dataset. That means the default dataset is defined by the service to be queried.

{% highlight sparql %}
SELECT ?s
WHERE {
  ?s ?p ?o .
}
{% endhighlight %}

According to the specification ([13.2 Specifying RDF Datasets](http://www.w3.org/TR/2013/REC-sparql11-query-20130321/#specifyingDataset)) we should see the content of the default graph defined by the service when executing this query. If the service uses approach 1 we should get the content of the *Dedicated Unnamed Default Graph*:

     s
    ===========
     ex:graph1
     ex:graph2

With approach 2 the result set should contain the content of all graphs:

     s
    ==================
     <graph1:subject>
     <graph2:subject>
     ex:graph1
     ex:graph2

Now let's see what the different services returned:

     s
    ===========
     ex:graph1
     ex:graph2
<figcaption>Fuseki</figcaption>

     s
    ==================
     <graph1:subject>
     <graph2:subject>
     ex:graph1
     ex:graph2
<figcaption>Virtuoso</figcaption>

     s
    ===========
     ex:graph1
     ex:graph2
<figcaption>Oracle</figcaption>

     s
    ===========
     ex:graph2
     ex:graph1
<figcaption>Stardog</figcaption>

<p/>
As you can see Fuseki, Oracle and Stardog use approach 1 by default. Virtuoso being the only one utilizing approach 2.

### 2. one FROM, no FROM NAMED clause

Now the query defines a dataset with a specific graph as the default graph (`ex:graph1`) and an empty set of named graphs:

{% highlight sparql %}
PREFIX ex: <http://example.org/>

SELECT ?s ?g ?x
FROM ex:graph1
WHERE {
  ?s ?p ?o .
  OPTIONAL {
    GRAPH ?g { ?x ?y ?z . }
  }
}
{% endhighlight %}

The specification states ([13.2.1 Specifying the Default Graph](http://www.w3.org/TR/2013/REC-sparql11-query-20130321/#unnamedGraph)):

> Each FROM clause contains an IRI that indicates a graph to be used to form the default graph. This does not put the graph in as a named graph. [...] If a query provides more than one FROM clause, providing more than one IRI to indicate the default graph, then the default graph is the RDF merge of the graphs obtained from representations of the resources identified by the given IRIs.

In this case we should get a result set as follows:

     s                | g   | x
    ==================|=====|=====
     <graph1:subject> |     |

Here are the actual results:

     s         | g         | x
    ===========|===========|==================
     ex:graph1 | ex:graph1 | <graph1:subject>
     ex:graph1 | ex:graph2 | <graph2:subject>
     ex:graph2 | ex:graph1 | <graph1:subject>
     ex:graph2 | ex:graph2 | <graph2:subject>
<figcaption>Fuseki</figcaption>

     s                | g          | x
    ==================|============|==================
     <graph1:subject> | ex:graph1  | <graph1:subject>
     <graph1:subject> | ex:graph2  | <graph2:subject>
     <graph1:subject> | ex:default | ex:graph1
     <graph1:subject> | ex:default | ex:graph2
<figcaption>Virtuoso</figcaption>

     s                | g   | x
    ==================|=====|=====
     <graph1:subject> |     |
<figcaption>Oracle</figcaption>

     s                | g   | x
    ==================|=====|=====
     <graph1:subject> |     |
<figcaption>Stardog</figcaption>

<p/>

Oracle and Stardog are the services doing it right. But what about the other two?

When inspecting the result set returned by Virtuoso we can see all the named graphs (available in the service) bound to variable `?g`. That means, Virtuoso does not use an empty set for the named graphs (which is expected by the specification), instead all named graphs are still available in the dataset. According to an [email conversation](http://sourceforge.net/p/virtuoso/mailman/message/32434598/) with Hugh Williams a year ago this has been implemented intentionally. He also notes this is *"not specified by the spec"*. In my opinion the specification does define this scenario for an RDF Dataset: *"An RDF Dataset comprises [...] zero or more named graphs"*. The only way to define zero named graphs is to specify no `FROM NAMED` clause at all. I already filed a [bug report](https://github.com/openlink/virtuoso-opensource/issues/451) if you want to keep track if this.

Now let's evaluate the result set of Fuseki. It is the same as for Virtuoso: the set of named graphs is not empty (despite the specification), therefore the wrong result is returned. I created a [bug report](https://issues.apache.org/jira/browse/JENA-1001) for that. But this is not the main problem here. Looking at the bindings of `?s` we can see that the `FROM ex:graph1` clause is ignored completely. Instead, the *Dedicated Unnamed Default Graph* is used for matching the triple pattern `?s ?p ?o`. This is definitely not correct, which is why I have created a [bug report](https://issues.apache.org/jira/browse/JENA-1002) for this too.

### 3. no FROM, one FROM NAMED clause

{% highlight sparql %}
PREFIX ex: <http://example.org/>

SELECT ?s ?g ?x
FROM NAMED ex:graph1
WHERE {
  OPTIONAL { ?s ?p ?o . }
  GRAPH ?g { ?x ?y ?z . }
}
{% endhighlight %}

In the third scenario the dataset to be queried contains only one named graph `ex:graph1` (and no default graph). According to the specification this will produce an empty default graph ([13.2 Specifying RDF Datasets](http://www.w3.org/TR/2013/REC-sparql11-query-20130321/#specifyingDataset)):

> If there is no FROM clause, but there is one or more FROM NAMED clauses, then the dataset includes an empty graph for the default graph.

As the default graph should be empty and the single triple pattern is matched against this empty graph we expect no binding for `?s` ([13.3 Querying the Dataset](http://www.w3.org/TR/2013/REC-sparql11-query-20130321/#queryDataset)):

> The use of GRAPH changes the active graph for matching graph patterns within that part of the query. Outside the use of GRAPH, matching is done using the default graph.

Additionally, the variable `?g` should only have one possible value ([13.3 Querying the Dataset](http://www.w3.org/TR/2013/REC-sparql11-query-20130321/#queryDataset)):

> GRAPH can provide an IRI to select one graph or use a variable which will range over the IRI of all the named graphs in the query's RDF dataset.

That means we expect the following result:

     s   | g          | x
    ==================|==================
         | ex:graph1  | <graph1:subject>

These are the results:

     s         | g         | x
    ===========|===========|==================
     ex:graph1 | ex:graph1 | <graph1:subject>
     ex:graph1 | ex:graph2 | <graph2:subject>
     ex:graph2 | ex:graph1 | <graph1:subject>
     ex:graph2 | ex:graph2 | <graph2:subject>
<figcaption>Fuseki</figcaption>

    Virtuoso 37000 Error SP031: SPARQL compiler: Variable 's' can not be bound due to mutually exclusive restrictions on its value
<figcaption>Virtuoso</figcaption>

     g          | x
    ============|==================
     ex:graph1  | <graph1:subject>
<figcaption>Virtuoso (SELECT ?g ?x)</figcaption>

     s   | g          | x
    ==================|==================
         | ex:graph1  | <graph1:subject>
<figcaption>Oracle</figcaption>

     s   | g          | x
    ==================|==================
         | ex:graph1  | <graph1:subject>
<figcaption>Stardog</figcaption>

<p/>
Like in the scenario before, Oracle and Stardog are returning the correct result.

Inspecting the result of Fuseki, I think the query dataset handling is broken. It seems that Fuseki just ignores the dataset defined by the query. I did not create any new bug reports as the problem seems to be related to the already opened issues mentioned before.

So, what's up with Virtuoso? Executing the query produces an internal error in the SPARQL compiler. Here is my presumption: the compiler is aware of the fact that the default graph of the query's dataset is empty and therefore throws this error. However, if I remove the variable `?s` from the projection of the query it will be executed without any error. I am confused. As with the other issues, I have filed one more [bug report](https://github.com/openlink/virtuoso-opensource/issues/452) again.

### 4. one FROM, one FROM NAMED clause

The last scenario will use a query that defines a specific default graph (`ex:graph1`) as well as a named graph (`ex:graph2`).

{% highlight sparql %}
PREFIX ex: <http://example.org/>

SELECT ?s ?g ?x
FROM ex:graph1
FROM NAMED ex:graph2
WHERE {
  ?s ?p ?o .
  GRAPH ?g { ?x ?y ?z . }
}
{% endhighlight %}

Based on all previously mentioned definitions, the expected result set should be:

     s                | g         | x
    ==================|===========|==================
     <graph1:subject> | ex:graph2 | <graph2:subject>

The following results are produced by different the services:

     s         | g         | x
    ===========|===========|==================
     ex:graph1 | ex:graph1 | <graph1:subject>
     ex:graph1 | ex:graph2 | <graph2:subject>
     ex:graph2 | ex:graph1 | <graph1:subject>
     ex:graph2 | ex:graph2 | <graph2:subject>
<figcaption>Fuseki</figcaption>

     s                | g         | x
    ==================|===========|==================
     <graph1:subject> | ex:graph2 | <graph2:subject>
<figcaption>Virtuoso</figcaption>

     s                | g         | x
    ==================|===========|==================
     <graph1:subject> | ex:graph2 | <graph2:subject>
<figcaption>Oracle</figcaption>

     s                | g         | x
    ==================|===========|==================
     <graph1:subject> | ex:graph2 | <graph2:subject>
<figcaption>Stardog</figcaption>

<p/>
As we can see, the only service not returning the expected result set is Fuseki. Like in the scenarios before, this may be related to the fact that Fuseki ignores the query's dataset definition. Hence, no need to create another bug report.

## Conclusion

The summary of my post? Four dead simple queries which led to four bug reports. What an outcome! There is still a lot to do in *SPARQL-land*.