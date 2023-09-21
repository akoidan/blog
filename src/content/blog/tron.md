---
title: "Tron network transaction prices"
description: "Tron protobuf transaction structure. Transaction price in Tron network. Decode/encode tron transaction. Get free trx token in tron test network"
date: "21 Sep 2023"
tags:
 - crypto
 - trongrid
 - featured
---

To understand the price of transaction lets break down this article to multiple parts parts
 - transaction structure and how to parse it with example
 - bandwidth and energy terms
 - resource consumptions
 - example

# Transaction structure
Tron transaction is encoded with protobuf and stored as binary in trongrid. When you call trongrid API you always pass this binary as a hex string (base16 0-9A-F).
The protobuf structure can be found in npm package @tronscan here node_modules/@tronscan/client/protobuf/core/Tron.proto

There are 2 types of hex data you usually send
 - transaction data
 - transaction signature + transaction data
If you take a look at @tronscan/client/protobuf/core/Tron.proto class you'll find Transaction class that contains 2 fields.
 - raw_data (field number 1, type 'raw')
 - signature (field number 2, type 'repeated bytes')

If you have to parse such a hex transaction (with signature) you can do the following:
With signature:
```bash
# pacman -S extra/protobuf
cd ./node_modules/@tronscan/client/protobuf
echo 'long-hex-message-string-like-a30174b6c2223' | xxd -r -p - > message.bin
protoc --decode protocol.Transaction core/Tron.proto < message.bin
```
If you want to check the transaction  without a signature you'll spat that it's a `raw` field  Tron.proto file:

```bash
protoc --decode protocol.Transaction.raw core/Tron.proto < message.bin
```

You can also use https://protobuf-decoder.netlify.app/ but it won't show you fields names and concrete types.

## Tron transaction prices
So as we understand what transaction is, lets review how its price is formed.

There are 2 types of transactions:
 - native coin (trx), this uses tron bandwidth
 - smart contracts (e.g. USDT). this one uses both bandwidth and energy

If you don't have enough energy/bandwidth, it will be burned automatically per current bandwidth/energy price. Current prices you can find out with:
 - GET https://api.trongrid.io/wallet/getbandwidthprices
 - GET https://api.trongrid.io/wallet/getenergyprices

The response will be in comma separated format with 'price:timestamp' value. e.g.
```csv
0:100,1575871200000:10,1606537680000:40,1614238080000:140,1635739080000:280,1681895880000:420
```
Which means that the latest energy price is 420 SUN (1000'000 SUN = 1 TRX).

### Bandwidth consumption per transaction

Your transaction will consume exactly the amount of its length. So the less info you have in your transaction, the less bandwidth it burns. Since your transaction consist of 3 parts:
 - transaction data (the hex message, 2 hex chars = 1 byte) + 3 bytes of protobuf field
 - signature (65 bytes + 2 bytes of protobuf field start)
 - transaction output (up to 64 bytes)
So trx fee would be (BANDWIDTH_PRICE * TRANSACTION_LENGTH) SUN
 - if this is less than CURRENT_BANDWIDTH, it's free
 - if more than the difference 

## Energy consumption per transaction
Let's review USDT transfer. To estimate the energy required, you'll need to check the code of the smart contract, particularly the function transfer you call (keccak256(transfer).substr(2,10) = "a9059cbb").
Since each smart contract is different, it's much easier to use trongrid api to calc it. You can use [estimateenergy](https://developers.tron.network/reference/estimateenergy) api 
```bash
curl --request POST \
     --url https://api.shasta.trongrid.io/wallet/estimateenergy \
     --header 'accept: application/json' \
     --header 'content-type: application/json' \
     --data '
{
  "owner_address": "TM94JwXLN33Gw4L8KF1eBPaEEPcdQi6hht",
  "contract_address": "TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs",
  "function_selector": "transfer(address,uint256)",
  "parameter": "0000000000000000000000001c000dd56b9e634fe67346b89045990cb7bb821d00000000000000000000000000000000000000000000000000000000000f4240",
  "visible": true
}
'
```

## Obtain test TRX and USDT tokens in Shasta trongrid.
If you install [tronlink](https://chrome.google.com/webstore/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec) web extension, you can select TRON Shasta testnet on top of the screen.
Then you can use a discord channel to obtain free tokens and even smart contract tokens like USDT. Just join [discord group](https://discord.gg/CzUFtfBZ), go to faucet channel and type:
```text
!shasta TM94JwXLN33Gw4L8KF1eBPaEEPcdQi6hht
```
To get TRX or 
```text
!shasta_usdt TM94JwXLN33Gw4L8KF1eBPaEEPcdQi6hht
```
To get USDT, where TM94JwXLN33Gw4L8KF1eBPaEEPcdQi6hht is your public address. You can post 1 message per 24 hours. But you are free to spam from multiple accounts to a single public address
