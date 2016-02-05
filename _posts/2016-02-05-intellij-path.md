---
layout: post
title: "fix PATH environment variable for IntelliJ IDEA on Mac OS X"
date: 2016-02-05
categories:
tags: [os x, intellij idea, environment variables, gradle, external commands, jetbrains]
image: /assets/article_images/2016-02-05-intellij-path/env.jpg
comments: true
typeof: BlogPosting
---

### what is the problem?

Recently I wrote a Gradle plugin which uses the docker client of the local machine. When running Gradle from the terminal everything is fine. However, when I import the project into my IntelliJ IDEA and try to run the Gradle tasks using IntelliJ IDEA I keep getting the following error:

> Cannot run program "docker": error=2, No such file or directory

It seems, I am not the only one having this problem:

* [issue IDEA-127993](https://youtrack.jetbrains.com/issue/IDEA-127993)
* [issue IDEA-133299](https://youtrack.jetbrains.com/issue/IDEA-133299)
* [issue IDEA-141832](https://youtrack.jetbrains.com/issue/IDEA-141832)

### why the problem exists?

The cause of the problem is a different set of environment variables for terminal and GUI applications in Mac OS X. As the docker client is usually installed via `brew install docker`, the binary is located in `/usr/local/bin`. However, the `PATH` environment for GUI applications is limited to `/usr/bin:/bin:/usr/sbin:/sbin` by default. That means, the `docker` command is not available to IntelliJ IDEA.

### how to solve the problem?

The easiest way is to start IntelliJ IDEA from the terminal:

```bash
$ open -a "IntelliJ IDEA 15"
```

That way, the same environment variables are set for IntelliJ IDEA as declared in your terminal.

However, if you still want to start IntelliJ IDEA using Spotlight, Dock etc., it is a bit more complicated. You need to edit the application package of IntelliJ IDEA. To spare you from messing around with the package, I wrote a small script that does all the editing for you:

<script src="https://gist.github.com/depressiveRobot/9cb8f799c970f0cd57ea.js"></script>

As you can see, the script accepts two input parameters: the absolute path to the IntelliJ IDEA application package (e.g. `/Applications/IntelliJ IDEA 15.app`) and the value of the `PATH` variable to set.

To apply the changes, download the script, make it executable and run it as follows:

```sh
curl https://gist.githubusercontent.com/depressiveRobot/9cb8f799c970f0cd57ea/raw/964253533dd46e0202c4873468b3a1ef304b0af1/osx-intellij-set-path.sh > osx-intellij-set-path.sh
chmod +x osx-intellij-set-path.sh
./osx-intellij-set-path.sh "/Applications/IntelliJ IDEA 15.app" "$PATH"
```

This will set the `PATH` variable for IntelliJ IDEA to the value of your terminal. Now you're able to run external commands with IntelliJ. Just like as you know it from the terminal ;)

**P.S.:** With a few adjustments this should be portable to the other Jetbrains editors, too, such as WebStorm and even Android Studio.
