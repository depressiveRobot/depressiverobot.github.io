---
layout: post
title: "How to deploy a MySQL dump with docker"
date: 2015-02-19
categories:
tags: docker shell mysql dump
image: /assets/article_images/2015-02-19-mysql-dump-docker/docker.png
image_credits: "<a href='https://denibertovic.com/talks/supercharge-development-env-using-docker/#/' target='_blank'>Deni Bertovic</a>"
comments: true
typeof: BlogPosting
---

A few days ago it was time to do another transformation of SQL to RDF. This time my goal was to have a ETL script which has as few as possible dependencies and can be used out of the box without changing the system it runs on.

This is where [docker](https://www.docker.com/) enters the game. Thanks to [process injection](https://docs.docker.com/reference/commandline/cli/#exec) there is an easy way to load an SQL dump into a docker container:

### Start a mysql instance

{% highlight sh %}
docker run --name dump -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root -d mysql
{% endhighlight %}

This starts a docker container with name `dump` using the [official MySQL docker image](https://registry.hub.docker.com/_/mysql/). It also makes the database available to the host on standard port `3306`.

### Load the SQL dump

{% highlight sh %}
docker exec -i dump mysql -uroot -proot < dump.sql
{% endhighlight %}

And viola: the dump is loaded! Note that the `-i` option allows to use input redirection from the host right into the docker container.