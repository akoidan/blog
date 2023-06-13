---
title: "Linode MySql Monitoring"
description: "Connect Linode LongView to Kubernetes MySQL inside of a Pod"
date: "24 May 2022"
tags:
 - mysql
 - longview
 - linode
 - kubernetes
 - featured
---


### Get the container id

```bash
$ kubectl get pods |grep mariadb
1cd88d6474f1   b940d9417762                    "/scripts/run.sh"        18 hours ago   Up 18 hours             k8s_mariadb_mariadb-deployment-6789f89cb6-4qqrw_pychat_2a4e2a0a-2899-4752-ac12-feaee3c6299c_1

0e1fa08095f8   linode/pause:3.2                "/pause"                 18 hours ago   Up 18 hours             k8s_POD_mariadb-deployment-6789f89cb6-4qqrw_pychat_2a4e2a0a-2899-4752-ac12-feaee3c6299c_1
```

### Find docker IP address:

```bash
$ kubectl exec 1cd88d6474f1 ifconfig -a|grep 'inet addr:'

          inet addr:10.2.0.12  Bcast:0.0.0.0  Mask:255.255.255.255
          inet addr:127.0.0.1  Mask:255.0.0.0
```

Edit `/opt/linode/longview/Linode/Longview/DataGetter/Applications/MySQL.pm` and specify your host to `10.2.0.12`

```perl
my $dbh = DBI->connect_cached( "DBI:mysql:host=10.2.0.12;", $creds->{username}, $creds->{password} ) or do {
```

You probably should wait a few minutes till Linode dashboard refreshes the data.

![longview mysql tab](/posts/connect-linode-longview-kubernetes-mysql-pod/longview-mysql-tab.png "Information about ip address should be here")


This is a good sign, all is left is to setup the access. Get into your mysql console inside the docker and create a new user.

```bash
$ kubectl exec -ti 1cd88d6474f1 mysql -u root -pYOUR_ROOT_PASSWORD

CREATE USER 'linode-longview'@'139.162.148.101' IDENTIFIED BY 'password';
```

Password for this user you should get from vim `/etc/linode/longview.d/MySQL.conf` and user ip address from Linode's dashboard error. Or from the logs  `/var/log/linode/longview.log`

If you done all correctly, restart the longview process again and check the Dashboard

![Mysql longview graph](/posts/connect-linode-longview-kubernetes-mysql-pod/mysql-longview-graph.webp "Magic isn't it? ")


