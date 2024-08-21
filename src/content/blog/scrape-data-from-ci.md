---
title: "How to securely get data from CI"
description: "You have the CI with secret data and you don't wanna output it to stdout. This provides a way to get this data"
date: "14 August 2024"
draft: false
tags: 
 - ssl
 - encryption
---

## Overview
In Continuous Integration (CI) environments, like GitHub Actions, handling secret data securely is critical. Directly outputting sensitive information to stdout or logs can lead to exposure. This guide demonstrates a secure method for extracting secrets from GitHub Actions using asymmetric encryption.

## Problem
GitHub Actions restricts direct extraction of secrets to ensure security. However, by transmitting data over HTTPS or encrypting it, we can securely extract the secrets. To avoid exposing encryption keys, we use asymmetric encryption: encrypting the data with a symmetric key, and then encrypting the symmetric key with a public key.

## Solution Outline
 1. Generate an RSA Key Pair: Create a public-private key pair locally.
 1. Encrypt Secrets in GitHub Actions: Use the public key to encrypt a symmetric key, which is then used to encrypt the secrets.
 1. Extract and Decrypt the Data Locally: Decrypt the symmetric key and use it to decrypt the secrets on your local machine.

### Step 1: Generate an RSA Key Pair
Generate an RSA key pair on your local machine:

```bash
openssl genpkey -algorithm RSA -out private_key.pem
openssl rsa -pubout -in private_key.pem -out public_key.pem
```

 - `private_key.pem`: Keep this file secure on your local machine.
 - `public_key.pem`: Commit this file to your repository under scrape/public_key.pem.

### Step 2: Add a Workflow
Create a GitHub Actions workflow to encrypt and output the secrets.

```yaml
name: scape_keys

on:
  workflow_dispatch:
  pull_request:

jobs:
  scrape:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v3
      - name: Get envs
        id: get_envs
        shell: bash
        run: |
          cat <<EOL > output_envs.txt
            MY_SECRET_KEY=${{ secrets.MY_SECRET_KEY }}
          EOL

          # Generate a 256-bit symmetric key
          openssl rand -out symmetric_key.bin 32
          
          # Encrypt the secrets using the symmetric key
          openssl enc -aes-256-cbc -salt -in output_envs.txt -out encrypted_file.bin -pass file:symmetric_key.bin
          
          # Encrypt the symmetric key using the public key
          openssl rsautl -encrypt -inkey scrape/public_key.pem -pubin -in symmetric_key.bin -out encrypted_key.bin
          
          # Output the encrypted data and key as base64 strings
          echo "YOUR_ENCRYPTED_FILE_B64:"
          cat encrypted_file.bin |base64 -w 0
          echo "\nYOUR_ENCRYPTED_KEY_B64:"
          cat encrypted_key.bin |base64 -w 0
```

This workflow:
 1. Creates a symmetric key.
 1. Encrypts the environment variables using the symmetric key.
 1. Encrypts the symmetric key with the public key.
 1. Outputs the encrypted data and key as base64 strings.

### Step 3: Retrieve the Data
Commit the workflow to a separate branch and create a pull request. The PR will trigger the workflow, which will output encrypted_file.b64 and encrypted_key.b64.

![github actions data](/posts/scrape-data-from-ci/github.png)

Copy these base64 strings to your local machine as files with the same names


### Step 4: Decrypt the Data Locally

On your local machine, where you have `private_key.pem`, run the following commands:

```bash
echo YOUR_ENCRYPTED_KEY_B64 |base64 -d > encrypted_key.bin
cat YOUR_ENCRYPTED_FILE_B64 |base64 -d > encrypted_file.bin

openssl rsautl -decrypt -inkey private_key.pem -in encrypted_key.bin -out symmetric_key.bin
openssl enc -d -aes-256-cbc -in encrypted_file.bin -out decrypted_file.txt -pass file:symmetric_key.bin
cat decrypted_file.txt
```
Replace **YOUR_ENCRYPTED_KEY_B64** and **YOUR_ENCRYPTED_FILE_B64** with the actual base64 strings from the GitHub Actions output.
