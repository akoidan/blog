---
title: "Managing Windows and Linux bootloaders"
description: "A proper way resize partition on dualboot Windows and Linux System"
date: "13 Sept 2023"
tags: 
 - linux
---

I would never risk managing a live system without backups. So we need 2 flashdrives. And running dualboot system with Linux and Windows.

## Prepare flash drives:

### Linux
Boot from Linux. Downloads [archlinux.iso](https://archlinux.org/download/) and flash it to a 1st flash drive.
```bash
dd if=./archlinux.iso of=/dev/sdX bs=4096 status=progress
```
Please choose sdX carefully, it should be your flash drive, not your root system, neither specific partition like /dev/sda1.

### Windows
Boot from windows. Google `download windows 11` and select `Create Windows 11 Insallation Media`. Currently it's [here](https://www.microsoft.com/software-download/windows11)
Flash it to the 2nd flash drive.


## Backup
I would recommend using any other harddrive or flash drive to backup current system.
Inject Linux flash drive into PC, go to BIOS and select boot from flash

Boot from your Linux flash drive, and mount the place you want to back up your FS.

```bash
mkdir /mnt/bu
mount /dev/sdX /mnt/bu
```

I would recommend backing up the whole disk, if you have enough space
```bash
dd if=/dev/sdX of=/mnt/bu/sdX bs=4096 status=progress
```
 - `bs=4096` requires, otherwise copying would be byte by byte and really slow. 
 - `status=progress` informs your about how much time it will take.
 - `if=/dev/sdX` your disk that you want to backup.
 - `of=/mnt/bu/sdX` the path you want to backup, where sdX is just a name of the file on filesystem

Verify that file is backed up properly. You can load partitions from the backed file `/mnt/bu/sdX` with

```bash
losetup --show -P -f /mnt/bu/sdX
```
After this command you will have files like `/dev/loop1p1` that you can mount if needed. THey will contain your partition backed up data.

## Restructure your partitions
I personally like using `cfdisk`. It's much more intuitive than fdisk, and much more broad than other cli or even GUI applications.
Do any operation that's required for you.
```bash
cfdisk /dev/sdX
```
If you increased the size of your partition you'll need to tell the fs to make use of a new space. This is for ext4 fs.
```bash
resize2fs /dev/sdX1
```
Do not forget to leave or recreate EFI filesystem and if you have Windows, all partitions that it has. 
I would recommend `dd` them back and resize after, instead of copying files with `cp -rp`

You can use `losetup` to load partition table from the file like above.

## Fix windows bootloader
Inject flash drive with windows, select it from the BIOS and boot from it.

Go to restore windows, and Use CLI. 

#### Assign letter 
Mount old drive C to letter `K`. In the command below replace `disk 0` and `partition 2` to your partition and disk
```bash
> diskpart
DISKPART> list disk
DISKPART> select disk 0
DISKPART> select partition 2
DISKPART> assign letter=K 
```
Mount UEFI partition to letter `L`.  In the command below replace `disk 0` and `partition 2` to your partition and disk
```bash
DISKPART> select disk 1
DISKPART> select partition 3
DISKPART> assign letter=L
DISKPART> exit
```

#### Fix bootloader

From the cli tell the UEFI that you want to add new Windows 11 OS.
```bash
> bcdboot K:\Windows /s L: /f UEFI
```

Now you should be able too reboot your PC and be able to boot from windows. Check if BIOS contains the proper Windows loader.

#### Remove old Windows entry
During Windows boot you might experience choosing the proper OS. You can remove the old one by going to `msconfig`.
- Press Win+R, type `msconfig` and hit enter
- Select BOOT tab
- Remove the old Windows entry. The one that is currently in use, gonna be called C:\. You need to keep that. Another one you are free to remove



## Fix Linux bootloader
Inject Linux flash drive, you might required to go to BIOS and select flash drive to boot from.

Mount root partition, arch-chroot into it, fix bootloader with bootctl install.
```bash
mount /dev/sda4 /mnt
arch-chroot /mnt
```
Edit fstab and fix the path to your partitions
```bash
vim /etc/fstab
```
Mount boot now and fix its loader. Remember you are still in chrooted system
```bash
mount /boot
```
Fix bootloader entry. I'm using SystemDBoot. For systemD you do:
```bash
vim /boot/loader/entries/arch.conf
```
Or w/e path you have your configs

Don't forget to install bootloader to UEFI now.
Verify that UEFI mode is avaiable:
```bash
efivar --list
```
And install the loader again
```bash
bootctl install
```

Select Linux bootloader from BIOS.
