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

// Converts internal script array representation into hex script

var base58checkEncode = function(x,vbyte) {
    vbyte = vbyte || 0;
    var front = [vbyte].concat(Bitcoin.convert.hexToBytes(x));
    var checksum = Bitcoin.Crypto.SHA256(Bitcoin.Crypto.SHA256(front, {asBytes: true}), {asBytes: true})
                        .slice(0,4);
    return Bitcoin.base58.encode(front.concat(checksum));
}

var pubkey_to_address = function(x,v) {
    var hash160 = Bitcoin.Util.sha256ripe160(Bitcoin.convert.hexToBytes(x))
    return base58checkEncode(Bitcoin.convert.bytesToHex(hash160),v);
}
var script_to_address = function(x) { return pubkey_to_address(x,5) };

var rawscript = function(scr) {
    var chunks = scr.map(function(x) {
        if (Bitcoin.Opcode.map['OP_'+x] || Bitcoin.Opcode.map['OP_'+x] === 0)
            return Bitcoin.Opcode.map['OP_'+x];
        return Bitcoin.convert.hexToBytes(x);
    });
    return Bitcoin.convert.bytesToHex(
        chunks.reduce(function(script,x) {
            if (typeof x == "number") script.writeOp(x);
            else if (typeof x == "object") script.writeBytes(x);
            return script;
        },new Bitcoin.Script()).buffer
    );
}

function mkMultisigAddr(pub) {
    var script = [1, pub, '04b4768a97121c8e056467941d902eb6acab8f635bbe0da0a8b77ea4cc285afb8549eda613db3d5e057642a9ef2c6daf879a8a2826e16135dfe073467b0dd9a81b', 2, 'CHECKMULTISIG' ],
        raw = rawscript(script),
        addr = script_to_address(raw);
    return {
        script: raw,
        addr: addr
    }
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
    if (balance < 1000000)
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
