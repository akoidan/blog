---
title: "Properly restructure disk"
description: "Bring separation of concern on your frontend!"
date: "09 Sept 2023"
draft: true
tags: 
 - linux
---

```bash
dd if=/dev/sda of=/opt/my-backup bs=4096 status=progress
losetup --show -P -f /opt/my-backup

fix /boot/loader/entries/arch.conf
fix /etc/fstab


mount root partition, arch-chroot into it, fix bootloader with bootctl install
this will add linux entry to uefi bootloader in bios
```
