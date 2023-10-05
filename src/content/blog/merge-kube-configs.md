---
title: "Merge kubernetes configs"
description: "Managing multiple config contexts properly"
date: "5 Oct 2023"
tags: 
 - kubernetes
---

Sometimes managing k8s cluster could be a pain in the ass, but it should be so. Lets see how we can work this around.

## Adding new config
 - Put your new config into `$HOME/.kube/config-new`.
 - Backup your current config
```bash
cp ~/.kube/config ~/.kube/config-bu  
```
Merge 2 configs together

```bash
KUBECONFIG=$HOME/.kube/config:$HOME/.kube/config-new kubectl config view --merge --flatten > ~/.kube/config
```

## Managing multiple cluster and environemtns
I recommend using [kubectx](https://github.com/ahmetb/kubectx)
You can now switch between your cluster within a single command
```bash
$ kubectx
minikube
prod-cluster
$ kubectx minikube
```
And environments as well
```bash
$ kubens
default
staging
production
development
$ kubens development
```
