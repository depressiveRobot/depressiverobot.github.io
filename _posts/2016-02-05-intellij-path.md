---
layout: post
title: "fix PATH environment variable for IntelliJ IDEA on Mac OS X"
date: 2016-02-05
categories:
tags: [os x, intellij idea, environment variables, gradle, external commands]
image: /assets/article_images/2016-02-05-intellij-path/env.jpg
comments: true
typeof: BlogPosting
---

## what is the problem?

Recently I wrote a Gradle plugin which uses the docker client of the local machine.
When running Gradle from the terminal everything was fine. However, when I import the project into my IntelliJ IDEA and try to run the Gradle tasks using IntelliJ IDEA I keep getting the following error:

> Cannot run program "docker": error=2, No such file or directory

It seems, I am not the only one having this problem:

* [https://youtrack.jetbrains.com/issue/IDEA-127993](https://youtrack.jetbrains.com/issue/IDEA-127993)
* [https://youtrack.jetbrains.com/issue/IDEA-133299](https://youtrack.jetbrains.com/issue/IDEA-133299)
* [https://youtrack.jetbrains.com/issue/IDEA-141832](https://youtrack.jetbrains.com/issue/IDEA-141832)

## why the problem exists?

The cause of the problem is a different set of environment variables for terminal and GUI applications in Mac OS X. As the docker client is usually installed via `brew install docker` on OS X, the binary is located in `/usr/local/bin`. However, the `PATH` environment for GUI applications is limited to `/usr/bin:/bin:/usr/sbin:/sbin` by default. That means, the `docker` command is not available for the Gradle plugin of IntelliJ IDEA.

## how to solve the problem?

The easiest way is to start IntelliJ IDEA from the terminal:

```bash
$ open -a "IntelliJ IDEA 15"
```

That way, IntelliJ IDEA has the same environment variables set as declared in your terminal.

However, if you still want to start IntelliJ IDEA using Spotlight, Dock etc., it is a bit more complicated. You need to edit the `Info.plist` file of the IntelliJ IDEA application package. To spare you from messing around with the file, I wrote a small script that does all the editing for you:

<script src="https://gist.github.com/depressiveRobot/23cd30d14aecb30ca186.js"></script>

Just close your IntelliJ IDEA instance. Save the above script to a file, make it executable and run it by passing the path of the IntelliJ IDEA app as single argument:

```sh
wget https://gist.githubusercontent.com/depressiveRobot/23cd30d14aecb30ca186/raw/f150599d70a4628de1d66704f6881a4e17b1cb5e/osx-intellij-set-path.sh
chmod +x osx-intellij-set-path.sh
./osx-intellij-set-path.sh '/Applications/IntelliJ IDEA 15.app'
```

This will set the `PATH` variable for IntelliJ IDEA to the value of your terminal. Now you're able to run external commands with the IntelliJ IDEA Gradle plugin.