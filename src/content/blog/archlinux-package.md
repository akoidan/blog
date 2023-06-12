---
title: "Archlinux custom package"
description: "Stop installing packages with curl |bash"
date: "24 May 2022"
heroImage: "/connect-linode-longview-kubernetes-mysql-pod-graph.webp"
tags: 
 - archlinux
---
example of how to post package to archlinux,

NEVER do curl |bash install


pacman -Qo will always keep track of all installed files in the system 
