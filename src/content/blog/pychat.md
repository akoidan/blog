---
title: "Pychat opensource chat"
description: "Pychat is an opensource absolutely free communication tool targeted for a company use. It's created as alternative to Slack/Discord. See the table below to understand its key features."
date: "13 June 2023"
tags:
 - chat
 - slack
 - kubernetes
 - docker
 - python
 - vue
 - videoconference
---

# When should I use pychat
|                        | Pychat | Slack | Skype | Telegram | Viber | Discord |
|------------------------|--------|-------|-------|----------|-------|---------|
| Open Source            | +      | -     | -     | -        | -     | -       |
| Free                   | +      | +/-   | +/-   | +        | +/-   | +/-     |
| Screen sharing         | +      | +     | -     | +        | -     | +       |
| Stream drawing         | +      | -     | -     | -        | -     | -       |
| Syntax highlight       | +      | -     | -     | -        | -     | +       |
| Only company users     | +      | +     | -     | -        | -     | +       |
| Audio/Video conference | +      | +     | +     | +        | -     | +       |
| Can run on your server | +      | -     | -     | -        | -     | -       |
| Audio/Video messages   | +      | -     | -     | +        | +     | -       |
| P2P file sharing       | +      | -     | -     | -        | -     | -       |
| P2P messaging          | +      | -     | -     | +        | -     | -       |
| Message read status    | +      | -     | +     | +        | +     | -       |
| Tagging user           | +      | +     | -     | +        | +     | +       |
| Message threads        | +      | +     | -     | -        | -     | -       |
| PWA (works w/o lan)    | +      | -     | -     | -        | -     | -       |
| Desktop client         | +/-    | +     | +     | +        | +/-   | +       |
| Mobile client          | +/-    | +     | +     | +        | +     | +       |
| 3rd-party plugins      | -      | +     | -     | -        | -     | +       |

I would personally use discord or slack as a company chat. They are built and maintained by thousands of people rather than a single person. BUT wait!!! There're some key factors of picking pychat over others:

1. Being opensource. If you need to add some custom tool or feature, you will never able to do this with any other messanger. Slack and discord provides plugins but they are still limited.
2. Being absolutely free. You don't need to pay anything to use or setup pychat at all. You can host pychat on low-end hardware like Raspberry Pi which costs under 50$ and will easily handle thousands of active users. Slack and Discord [will charge you](https://www.chanty.com/blog/discord-vs-slack/) for the set of features you need now or WILL need in the future. Telegram/Skype/Viber and etc are not corporate chats and they lack a lot of features and there're people all over the world which could accidentaly be invited to your group.
3. Security. All of the chats above are SAAS solutions, but not Pychat! Remember wHen you chose any messangers, all of your communication is stored on external hard drive which is always less secure. Some messangers like viber or whatsapp backup do not store messages but rather backup history to your google driver. But that often leads to holes in history and broken search. Also only pychat features p2p file sharing. Do you still use messangers to echange ssh keys or any other secure files? Never store them on the server! Only with pychat you can send file directly to another person ommiting persisting it on the server.
4. You just feel enthusiastic for bleeding-edge opensource projects.

# How to host pychat

Notice:
pychat is migrating from vue2 to vue3 and this change has been released to master. The older code that supports some feature (electron/cordova) is still not migrated and located at branch [vue2-webpack](https://github.com/akoidan/pychat/tree/vue2-webpack)

## Run test docker image
Please don't use this build for production, as it uses debug ssl certificate, lacks a few features and all files are located inside of container, meaning you will lose all data on container destroy.

- Download and run image:
 ```bash
 docker run -tp 443:443 deathangel908/pychat-test
 ```
- Open [https://localhost](https://localhost)

## Run prod docker image

Please run each step very carefully. **Do not skip editing files, reading comments or any instructions**. This may lead to bugs in the future.

- Ssl is required for webrtc (to make calls) and secure connection. Put your ssl certificates in the current directory: `server.key` and `certificate.crt`. If you don't own a domain you can create self-signed certificates with command below, with self-signed certificate browser will warn users with broken ssl.
```bash
openssl req -nodes -new -x509 -keyout server.key -out certificate.crt -days 3650
wget https://raw.githubusercontent.com/akoidan/pychat/master/backend/chat/settings_example.py
wget https://raw.githubusercontent.com/akoidan/pychat/master/docker/pychat.org/production.json
wget https://raw.githubusercontent.com/akoidan/pychat/master/docker/pychat.org/turnserver.conf
```
- Edit `settings_example.py` according comments in it.
- Edit production.json according [wiki](https://github.com/akoidan/pychat#frontend-config)
- Replace server-name and realm to your domain in `turnserver.conf`
- Create volume and copy configuration files there.
 ```bash
 docker volume create pychat_data
 containerid=`docker container create --name dummy -v pychat_data:/data hello-world`
 docker cp settings_example.py dummy:/data/settings.py
 docker cp production.json dummy:/data/production.json
 docker cp turnserver.conf dummy:/data/turnserver.conf
 docker cp certificate.crt dummy:/data/certificate.crt
 docker cp server.key dummy:/data/server.key
 docker rm dummy
 ```
This volume will contain all production data: config, mysql data, redis and etc. If you need to edit files inside container you can use:
 ```bash
docker run -i -t -v pychat_data:/tmp -it alpine /bin/sh
```
- Since all configs are created, you can run pychat with command below:
```bash
docker run -t -v pychat_data:/data -p 443:443 -p 3478:3478 deathangel908/pychat
```
- Open [https://localhost](https://localhost) and enjoy it!
