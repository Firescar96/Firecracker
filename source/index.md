---
title: Firecracker Documentation

language_tabs:
  - javascript

toc_footers:
  - Copyright © 2015 by <a href="http://www.consensys.net">ConsenSys, LLC</a>

includes:

search: true
---

# Introduction
Firecracker is a decentralized application for solving SHA256 hashes. This api allow programs to easily generate contracts, submit solutions to hashes, and examine the storage of contracts. The sections below detail these actions.

Firecracker works by placing hashes on the ethereum blockchain with an attached bounty. When a user submits data that hashes to that value they receive the bounty for the computation. The API exposes examination of the storage of Firecracker contracts so that programs may more easily optimize their computation.

###Solve

```javascript
$.post("http://fireael.blockapps.net/query/", { solve: "true", seed: "print angle evolve stick wild blue hidden danger nest bar retire north", address: "05e1e2b994e9965e12e26446143c79e72230d2a3", data:"some random data" }
```

`POST /query/?`

Parameter |	Type | Description
--------- | ---- | -----------
solve | string | include and set to true to enable this query
seed   | string | 12 word seed for generating a receiving address
address | string | contract address
data  | string | value such that SHA256(value) matches a hash on the contract

###Generate

```javascript
$.get("http://fireael.blockapps.net/query/", { generate: "true", seed: "print angle evolve stick wild blue hidden danger nest bar retire north", hashes: '{"hash1":"91c9c3ff310a53f8d179461d9af55371c78b67c38ab030bf9c026693ca495399"}'} );
```

`GET /query/?`

Parameter |	Type | Description
--------- | ---- | -----------
generate | string | include and set to true to enable this query
seed   | string | 12 word seed for generating a receiving address
hashes   | string | JSON formatted string of {hash:reward} values


###Examine

```javascript
$.get("http://fireael.blockapps.net/query/", { examine: "true", seed: "print angle evolve stick wild blue hidden danger nest bar retire north", address: "05e1e2b994e9965e12e26446143c79e72230d2a3", data:"some random data" }
```

>The above command returns JSON structured like this:

```json
[
  {
    "hash1":"open",
    "hash2":"open",
    "hash42":"open",
    "hash69":"closed"
  }
]
```

`GET /query/?`

Parameter |	Type | Description
--------- | ---- | -----------
examine | string | include and set to true to enable this query
address   | string | The address of the contract you would like information for
