var CryptoJS=CryptoJS||function(v,p){var d={},u=d.lib={},r=function(){},f=u.Base={extend:function(a){r.prototype=this;var b=new r;a&&b.mixIn(a);b.hasOwnProperty("init")||(b.init=function(){b.$super.init.apply(this,arguments)});b.init.prototype=b;b.$super=this;return b},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var b in a)a.hasOwnProperty(b)&&(this[b]=a[b]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
s=u.WordArray=f.extend({init:function(a,b){a=this.words=a||[];this.sigBytes=b!=p?b:4*a.length},toString:function(a){return(a||y).stringify(this)},concat:function(a){var b=this.words,c=a.words,j=this.sigBytes;a=a.sigBytes;this.clamp();if(j%4)for(var n=0;n<a;n++)b[j+n>>>2]|=(c[n>>>2]>>>24-8*(n%4)&255)<<24-8*((j+n)%4);else if(65535<c.length)for(n=0;n<a;n+=4)b[j+n>>>2]=c[n>>>2];else b.push.apply(b,c);this.sigBytes+=a;return this},clamp:function(){var a=this.words,b=this.sigBytes;a[b>>>2]&=4294967295<<
32-8*(b%4);a.length=v.ceil(b/4)},clone:function(){var a=f.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var b=[],c=0;c<a;c+=4)b.push(4294967296*v.random()|0);return new s.init(b,a)}}),x=d.enc={},y=x.Hex={stringify:function(a){var b=a.words;a=a.sigBytes;for(var c=[],j=0;j<a;j++){var n=b[j>>>2]>>>24-8*(j%4)&255;c.push((n>>>4).toString(16));c.push((n&15).toString(16))}return c.join("")},parse:function(a){for(var b=a.length,c=[],j=0;j<b;j+=2)c[j>>>3]|=parseInt(a.substr(j,
2),16)<<24-4*(j%8);return new s.init(c,b/2)}},e=x.Latin1={stringify:function(a){var b=a.words;a=a.sigBytes;for(var c=[],j=0;j<a;j++)c.push(String.fromCharCode(b[j>>>2]>>>24-8*(j%4)&255));return c.join("")},parse:function(a){for(var b=a.length,c=[],j=0;j<b;j++)c[j>>>2]|=(a.charCodeAt(j)&255)<<24-8*(j%4);return new s.init(c,b)}},q=x.Utf8={stringify:function(a){try{return decodeURIComponent(escape(e.stringify(a)))}catch(b){throw Error("Malformed UTF-8 data");}},parse:function(a){return e.parse(unescape(encodeURIComponent(a)))}},
t=u.BufferedBlockAlgorithm=f.extend({reset:function(){this._data=new s.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=q.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var b=this._data,c=b.words,j=b.sigBytes,n=this.blockSize,e=j/(4*n),e=a?v.ceil(e):v.max((e|0)-this._minBufferSize,0);a=e*n;j=v.min(4*a,j);if(a){for(var f=0;f<a;f+=n)this._doProcessBlock(c,f);f=c.splice(0,a);b.sigBytes-=j}return new s.init(f,j)},clone:function(){var a=f.clone.call(this);
a._data=this._data.clone();return a},_minBufferSize:0});u.Hasher=t.extend({cfg:f.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){t.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(b,c){return(new a.init(c)).finalize(b)}},_createHmacHelper:function(a){return function(b,c){return(new w.HMAC.init(a,
c)).finalize(b)}}});var w=d.algo={};return d}(Math);
(function(v){var p=CryptoJS,d=p.lib,u=d.Base,r=d.WordArray,p=p.x64={};p.Word=u.extend({init:function(f,s){this.high=f;this.low=s}});p.WordArray=u.extend({init:function(f,s){f=this.words=f||[];this.sigBytes=s!=v?s:8*f.length},toX32:function(){for(var f=this.words,s=f.length,d=[],p=0;p<s;p++){var e=f[p];d.push(e.high);d.push(e.low)}return r.create(d,this.sigBytes)},clone:function(){for(var f=u.clone.call(this),d=f.words=this.words.slice(0),p=d.length,r=0;r<p;r++)d[r]=d[r].clone();return f}})})();
(function(v){for(var p=CryptoJS,d=p.lib,u=d.WordArray,r=d.Hasher,f=p.x64.Word,d=p.algo,s=[],x=[],y=[],e=1,q=0,t=0;24>t;t++){s[e+5*q]=(t+1)*(t+2)/2%64;var w=(2*e+3*q)%5,e=q%5,q=w}for(e=0;5>e;e++)for(q=0;5>q;q++)x[e+5*q]=q+5*((2*e+3*q)%5);e=1;for(q=0;24>q;q++){for(var a=w=t=0;7>a;a++){if(e&1){var b=(1<<a)-1;32>b?w^=1<<b:t^=1<<b-32}e=e&128?e<<1^113:e<<1}y[q]=f.create(t,w)}for(var c=[],e=0;25>e;e++)c[e]=f.create();d=d.SHA3=r.extend({cfg:r.cfg.extend({outputLength:512}),_doReset:function(){for(var a=this._state=
[],b=0;25>b;b++)a[b]=new f.init;this.blockSize=(1600-2*this.cfg.outputLength)/32},_doProcessBlock:function(a,b){for(var e=this._state,f=this.blockSize/2,h=0;h<f;h++){var l=a[b+2*h],m=a[b+2*h+1],l=(l<<8|l>>>24)&16711935|(l<<24|l>>>8)&4278255360,m=(m<<8|m>>>24)&16711935|(m<<24|m>>>8)&4278255360,g=e[h];g.high^=m;g.low^=l}for(f=0;24>f;f++){for(h=0;5>h;h++){for(var d=l=0,k=0;5>k;k++)g=e[h+5*k],l^=g.high,d^=g.low;g=c[h];g.high=l;g.low=d}for(h=0;5>h;h++){g=c[(h+4)%5];l=c[(h+1)%5];m=l.high;k=l.low;l=g.high^
(m<<1|k>>>31);d=g.low^(k<<1|m>>>31);for(k=0;5>k;k++)g=e[h+5*k],g.high^=l,g.low^=d}for(m=1;25>m;m++)g=e[m],h=g.high,g=g.low,k=s[m],32>k?(l=h<<k|g>>>32-k,d=g<<k|h>>>32-k):(l=g<<k-32|h>>>64-k,d=h<<k-32|g>>>64-k),g=c[x[m]],g.high=l,g.low=d;g=c[0];h=e[0];g.high=h.high;g.low=h.low;for(h=0;5>h;h++)for(k=0;5>k;k++)m=h+5*k,g=e[m],l=c[m],m=c[(h+1)%5+5*k],d=c[(h+2)%5+5*k],g.high=l.high^~m.high&d.high,g.low=l.low^~m.low&d.low;g=e[0];h=y[f];g.high^=h.high;g.low^=h.low}},_doFinalize:function(){var a=this._data,
b=a.words,c=8*a.sigBytes,e=32*this.blockSize;b[c>>>5]|=1<<24-c%32;b[(v.ceil((c+1)/e)*e>>>5)-1]|=128;a.sigBytes=4*b.length;this._process();for(var a=this._state,b=this.cfg.outputLength/8,c=b/8,e=[],h=0;h<c;h++){var d=a[h],f=d.high,d=d.low,f=(f<<8|f>>>24)&16711935|(f<<24|f>>>8)&4278255360,d=(d<<8|d>>>24)&16711935|(d<<24|d>>>8)&4278255360;e.push(d);e.push(f)}return new u.init(e,b)},clone:function(){for(var a=r.clone.call(this),b=a._state=this._state.slice(0),c=0;25>c;c++)b[c]=b[c].clone();return a}});
p.SHA3=r._createHelper(d);p.HmacSHA3=r._createHmacHelper(d)})(Math);


// TODO: ADD DELAYS SO THAT ALL THE CONTRACT GO TROUGH, THE NUMKEYS NEEDS TO UPDATE
var helpers;
var api;
var keystore;

Template.query.rendered = function() {
  helpers = ethlightjs.helpers
  api = new ethlightjs.blockchainapi.blockappsapi("http://stablenet.blockapps.net")
}

  var password = 'silly horse battery staple nonce trying bass uke fuck'

  var nonce = 0
  var balance = 0
  var abi = [{"constant":false,"inputs":[{"name":"hash","type":"bytes32"}],"name":"addHash","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"data","type":"bytes32"}],"name":"submitData","outputs":[],"type":"function"},{"inputs":[],"type":"constructor"}]
  var bytecode = '60606040525b5b610196806100156000396000f30060606040526000357c01000000000000000000000000000000000000000000000000000000009004806343e08ad114610044578063bb985d7d1461005757610042565b005b61005560048035906020015061006a565b005b6100686004803590602001506100e5565b005b7f6f70656e0000000000000000000000000000000000000000000000000000000060006000506000838152602001908152602001600020600050819055508060016000506210000160005054621000008110156100025790900160005081905550600162100001600050540162100001600050819055505b50565b6000600282604051808281526020019150506020604051808303816000866161da5a03f1156100025750506040515190507f6f70656e00000000000000000000000000000000000000000000000000000000600060005060008381526020019081526020016000206000505414151561015d57610192565b3373ffffffffffffffffffffffffffffffffffffffff16600060c8604051809050600060405180830381858888f19350505050505b505056'
  var contractAddr = 'e5f1a561a04b58ae0022bd54246f1e96a987362d'
  var newContractAddr = ''

  function setAddress(seed) {
    keystore = new ethlightjs.keystore(seed, password)
    address = keystore.generateNewAddress(password)
  }
  var sendTime;
  var sentTime;
  function sendHash(hashObject,hashArray,ind,nonny) {
    console.log("index:"+ind);
    clearInterval(sendTime);
    var value = hashObject[hashArray[ind]]
    txObj = {gasLimit: 3141592 , gasPrice: 100, nonce: nonny, value: value}
    var hash = hashArray[ind]
    console.log(hash);
    helpers.sendFunctionTx(abi, newContractAddr, 'addHash', [hash], address, txObj, api, keystore, password, function (err, data) {
      if(sentTime[ind] == true)
        return
      sentTime[ind]=true
      if(ind > 0) {
        console.log(ind);
        sendTime = setTimeout(sendHash, 3000,hashObject,hashArray,ind-1,nonny+1)
      }
      else {
        return
      }
    })
  }

  function hex2a(d) {
      return unescape(d.replace(/(..)/g, '%$1'))
  }

  var keyIndexToLookup = function(key,index) {
    var words = CryptoJS.enc.Hex.parse(key.concat(index));
    return CryptoJS.SHA3(words, { outputLength: 256}).toString(CryptoJS.enc.Hex);
  }

  function leftpad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
  }

Router.route('/query', { where: "client" })
  .get(function(req, res, next) {
    console.log('################################################');
    console.log(this.params.query);
    this.response.statusCode = 200;

    console.log(this.response);
    if(this.params.query.examine != null)
    {
      console.log(this.response);
      contractAddr = this.params.query.address
      HTTP.call("GET","http://stablenet.blockapps.net/query/storage",{params: {address: contractAddr}}, function(error, data ) {
        data = data.data
        var storage = "{"
        for(var i=0;i<data.length;i++) {
          var element = data[i]
          var key = element.key//hex2a(element.key.replace(/^(00)+/, '').replace(/(00)+$/, '')) //truncate leading zeros and make ascii
          var value = element.value //hex2a(element.value.replace(/^(00)+/, '').replace(/(00)+$/, '')) //truncate leading zeros and make ascii
          storage += '"'+key+'":"'+value+'",'
        }
        storage = storage.substring(0, storage.length - 1);
        storage+="}"

        storage = JSON.parse(storage)
        var numKeys = parseInt(storage["0000000000000000000000000000000000000000000000000000000000100001"])+1
        var keyMap = {}
        for(var i=1; i<=numKeys;i++)
        {
          var key = storage[leftpad(i,64)]
          keyMap[hex2a(key.replace(/^(00)+/, '').replace(/(00)+$/, ''))] = hex2a(storage[keyIndexToLookup(key,"0000000000000000000000000000000000000000000000000000000000000000")].replace(/^(00)+/, '').replace(/(00)+$/, '')) //00... is the position of the mapping in the array
        }
        console.log("endid");
        res.end(JSON.stringify(keyMap, null, 2));
      });
    }
  }).post(function(req, res, next) {

    console.log('################################################');
    console.log(this.params.query);
    this.response.statusCode = 200;

    if(this.params.query.submit != null)
    {
      var data = this.request.query.data
      setAddress(this.request.query.seed)
      contractAddr = this.request.query.address
      api.getNonce(address, function(error,nonce){
        console.log(address);
        console.log(nonce);
        txObj = {gasLimit: 3141592 , gasPrice: 100, nonce: nonce}
        helpers.sendFunctionTx(abi, contractAddr, 'submitData', [data], address, txObj, api, keystore, password, function(error,data) {
          // body...
        })
      })
    }

    if(this.params.query.generate != null)
    {
      setAddress(this.params.query.seed)
      var hashObject = this.params.query.hashes
      api.getNonce(address, function(error,nonce){
        txObj = {gasLimit: 3141592, gasPrice: 100, nonce: nonce}
        helpers.sendCreateContractTx(bytecode, address, txObj, api, keystore, password,function(error, newContractAddress) {
          if(newContractAddr == newContractAddress)
            return
          newContractAddr = newContractAddress
          res.end(newContractAddress)
          if(hashObject == "")
            return
          hashObject = jQuery.parseJSON(hashObject)
          hashArray = $.map(hashObject, function(e1,e2) { return e2; })
          console.log(hashArray);
          nonce+=1
          sentTime = {}
          sendTime = window.setTimeout(sendHash, 4000,hashObject,hashArray,hashArray.length-1,nonce)
        })
      })
    }
  });
