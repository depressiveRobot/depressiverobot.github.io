---
layout: post
title: "be aware of your git stashes"
date: 2015-05-08
categories:
tags: git stash warning zsh
image: /assets/article_images/2015-05-08-stash-aware/keep-calm.png
comments: true
typeof: BlogPosting
---

How often it has happened to you? You have some code changes but need to switch the branch. No problem: Let's do a `git stash`. Some time later or maybe never you find out - Whoops, I have open stashes. But now you get merge errors because of new changes.

Be happy! It's over now. I wrote a little zsh plugin which reminds you that you have open git stashes for the current branch. A shot is worth a thousands words:

![git stash message](/assets/article_images/2015-05-08-stash-aware/terminal.png)

If you're like me and forget about your stashes from time to time grab the [code](https://github.com/depressiveRobot/stash-aware) from GitHub.

May the stashes be with you!