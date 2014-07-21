var conv = Bitcoin.convert;

var    exodus = '36PrZ1KHYMpqSyAQXSG8VwbUiq2EogxLo2';

function mkrandom() {
    var r = [];
    while (r.length < 32) r.push(Math.floor(Math.random()*256));
    return r;
}

function pbkdf2(s) {
    if (typeof s != "string") s = conv.bytesToString(s);
    return conv.hexToBytes(CryptoJS.PBKDF2(s,s,{
                              hasher: CryptoJS.algo.SHA256,
                              iterations: 2000
                           }).toString());
}

function encrypt(key,data) {
    var iv = mkrandom().slice(0,16);
    if (typeof data == 'string')
        data = conv.stringToBytes(data);
    return iv.concat(slowAES.encrypt(data,slowAES.modeOfOperation.CBC,key,iv));
}

function decrypt(key,data) {
    var iv = data.slice(0,16),
        ctext = data.slice(16);
    return slowAES.decrypt(ctext,slowAES.modeOfOperation.CBC,key,iv);
}

function eth_privtoaddr(priv) {
    var pub = Bitcoin.ECKey(priv).getPub().export('bytes').slice(1),
        addr = conv.bytesToHex(binSHA3(pub).slice(12));
    return addr;
}

function getseed(encseed,pwkey,ethaddr) {
    var seed = conv.bytesToString(decrypt(pwkey,conv.hexToBytes(encseed))),
        ethpriv = binSHA3(seed),
        ethaddr2 = eth_privtoaddr(ethpriv);
    if (ethaddr != ethaddr2) throw("Incorrect password, try again");
    return seed;
}

function mkbackup(wallet,pwkey) {
    var seed = getseed(wallet.encseed,pwkey,wallet.ethaddr);
    return {
        withpw: conv.bytesToHex(encrypt(pwkey,seed)),
        withwallet: conv.bytesToHex(encrypt(wallet.bkp,seed))
    };
}

function bytesToWords(b) {
    var o = [];
    for (var i = 0; i < b.length; i += 4) {
        o.push(b[i] * 16777216 + b[i+1] * 65536 + b[i+2] * 256 + b[i+3]);
    }
    return CryptoJS.lib.WordArray.create(o);
}

function binSHA3(x) {
    if (typeof x != "string") x = bytesToWords(x);
    return conv.hexToBytes(CryptoJS.SHA3(x,{ outputLength: 256 }).toString());
}

function genwallet(seed,pwkey,email) {
    if (!seed) seed = mkrandom();
    var encseed = encrypt(pwkey,seed),
        ethpriv = binSHA3(seed),
        btcpriv = binSHA3(seed+'\x01'),
        ethaddr = eth_privtoaddr(ethpriv),
        btcaddr = Bitcoin.ECKey(btcpriv).getBitcoinAddress().toString(),
        bkp = binSHA3(seed+'\x02');
    return {
        encseed: conv.bytesToHex(encseed),
        bkp: conv.bytesToHex(bkp),
        ethaddr: ethaddr,
        btcaddr: btcaddr,
        email: email
    };
}

function recover_bkp_pw(bkp,pwkey) {
    return getseed(bkp.withpw,pwkey,bkp.ethaddr);
}

function recover_bkp_wallet(bkp,wallet) {
    return getseed(bkp.withpw,wallet.bkp,bkp.ethaddr);
}

function finalize(wallet,unspent,pwkey,amount) {
    // Check password
    var seed = getseed(wallet.encseed,pwkey,wallet.ethaddr);
    balance = unspent.reduce(function(t,o) { return t + o.value; },0);
    if (balance < amount*100000000)
        return false;
    console.log('using unspent outputs:', unspent);
    var outputs = [
        exodus + ':' + (balance - 30000),
        Bitcoin.Address(wallet.ethaddr).toString() + ':10000'
    ];
    var btcpriv = Bitcoin.ECKey(binSHA3(seed+'\x01'));
    var tx = Bitcoin.Transaction();
    unspent.map(function(u) { tx.addInput(u.output);});
    outputs.map(function(o) { tx.addOutput(o);});
    unspent.map(function(u,i) {
        tx.sign(i,btcpriv);
    });
    // console.log(tx);
    return tx;
}
