# btc-ownership-transfer
Secure and convenient transfer of BTC from owner to recovery party in case of accident.

### Use case
- Owner key loss
- Owner unavailability or death

### Prerequisites:

Alice posesses some bitcoins which she would like to transfer to Bob in case of some accident. Alice should keep full control of funds so Bob can't get them before the accident. There should be a way to avoid dependency on any intermediaries with minimal overhead.

### Process flow:

1. For all Bitcoin inputs which appears under her control, Alice continuously signs but NOT broadcasts Bitcoin transactions with the following properties. The transactions output are to P2SH or P2WSH address where unlock script allows Alice to spend anytime, but Bob to spend in N days after broadcast time. It may look as follows.

```
OP_IF
    <Alice's Public Key> OP_CHECKSIG
OP_ELSE
    <N days> OP_CSV DROP <Bob's Public Key> OP_CHECKSIG
OP_ENDIF
```

2. Alice DOES NOT broadcast the transactions but just sends it to Bob and have an agreement with him that he broadcasts ONLY in case of some accident. Bob is motivated now to store the transactions on his side.
3. Alice is motivated to check at least in every N days if the transactions were not broadcasted.
4. If Bob breaks the agreement and broadcasts or the transactions accidentally hit the chain then Alice will just withdraw bitcoins from their outputs.
5. If there is an accident then Bob broadcasts the transactions, waits N days and withdraws the funds.
