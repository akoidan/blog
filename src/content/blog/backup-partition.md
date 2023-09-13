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


download windows 11 flash drive, boot from it
go to CLI

> diskpart
DISKPART> list disk
DISKPART> select disk 0
DISKPART> select partition 2
DISKPART> assign letter=K // real disk C

DISKPART> select disk 1
DISKPART> select partition 3
assign letter=L // real disk UEFI
