---
title: "Archlinux custom package"
description: "Are you still installing packages via curl, that a website dictated you?"
date: "6 June 2023"
tags: 
 - archlinux
---

## Quick example
To be able to post a package on AUR its source code should be downloadable. Lets review the package cf-terraforming which wasn't on AUR before.
The build is available at github release pages. You can specify the package version and replace the link path with it.

Create a file name `PKGBUILD` with the following content:

```PKGBUILD
# Maintainer: Andrew Koidan <deathangel908@gmail.com>
pkgname=cf-terraforming
pkgbase=cf-terraforming
pkgver=0.12.0
pkgrel=1
pkgdesc="Cloudflare Terraforming"
url="https://github.com/cloudflare/cf-terraforming"
license=("unknown")
arch=('x86_64')

source=(
    "${pkgname}-${pkgver}-amd64.tar.gz::https://github.com/cloudflare/${pkgname}/releases/download/v${pkgver}/${pkgname}_${pkgver}_linux_amd64.tar.gz"
)

md5sums=('c53e9337397761a04d963343c6daf7ff')
sha256sums=('c2955c03994e38c4628c6445dfb760e4c6ee93319f621e9254a24440eb17aa33')

prepare() {
  tar -xvzf "${pkgname}-${pkgver}-amd64.tar.gz" 
}


package() {
  install -D -m755 "${srcdir}/cf-terraforming" "${pkgdir}/usr/bin/cf-terraforming"
}
```

Now you can do makepkg which will build pkg in the current directory

## Why is this usefull
Keep the system clean. You can track any file to which package it belows:
```bash
$ pacman -Qo /usr/bin/bash
/usr/bin/bash is owned by bash 5.1.016-3
```
You can track which files your package has:
```bash
$ pacman -Ql bash
bash /etc/
bash /etc/bash.bashrc
# ...
```
You can find which pkg you need to install if you know which file you need by a filename:
```bash
# pacman -S pkgfile && updatedb
$ pkgfile bash
core/bash
extra/apparmor
community/grunt-cli
community/gulp
community/misfortune
```


## Upload package to AUR
Well, lets help other people now, and save the code somewhere so we can install it in the future.
- Check the [wiki](https://wiki.archlinux.org/title/AUR_submission_guidelines)
- Sign up on [AUR](https://aur.archlinux.org/)
- Upload your RSA public key to aur
- Create local git repo from a remote one. Replace pkgbase with your package name. Otherwise you would waste 20 mins like me fooling around ;)
```bash
git -c init.defaultbranch=master clone ssh://aur@aur.archlinux.org/pkgbase.git
```
- Generate src info with:
```bash
$ makepkg --printsrcinfo > .SRCINFO
```
- Commit and push to the repo.
- Wait a few minutes until package becomes available
