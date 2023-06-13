---
title: "Kubernetes cronjob"
description: "Another way of running a periodic job in kubernetes"
date: "14 June 2023"
tags: 
 - kubernetes
 - cron-job
---
If you work with kubernetes and you have to create a CronJob practically what you do is create a separate script that's totally decoupled from the infrastructure and create a k8s cronjob with something like this:
```yaml
apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: my-cron-job
spec:
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - command:
            - yarn
            - run
            - cronjob
            image: gcr.io/my-namespace/my-image
            imagePullPolicy: Always
          restartPolicy: Never
  schedule: '*/60 * * * *'
```
But what if it's too small, or you need to communicate with clients that are connected via WebSocket. Well in this case you can create and API endpoint that will execute a required action and call it like this:
```yaml
apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: cron-job-name
spec:
  schedule: "*/20 * * * *"
  concurrencyPolicy: Forbid
  successfulJobsHistoryLimit: 1
  failedJobsHistoryLimit: 1
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: cron-job-name
            image: buildpack-deps:curl
            env:
            - name: API_URL
              valueFrom:
                configMapKeyRef:
                  name: project-conf
                  key: API_URL
            args:
            - /bin/sh
            - -ec
            - curl --fail-with-body -X POST $API_URL/cron-job
          restartPolicy: Never
```
