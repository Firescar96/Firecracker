Router.route('/', function () {
  this.render('home');
});
// TODO: ADD DELAYS SO THAT ALL THE CONTRACT GO TROUGH, THE NUMKEYS NEEDS TO UPDATE
Template.home.rendered = function() {
  var helpers = ethlightjs.helpers
  var api = new ethlightjs.blockchainapi.blockappsapi("http://stablenet.blockapps.net")

  var password = 'silly horse battery staple nonce trying bass uke fuck'
  var keystore = undefined

  var nonce = 0
  var balance = 0
  var abi = [{"constant":false,"inputs":[{"name":"hash","type":"bytes32"}],"name":"addHash","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"data","type":"bytes32"}],"name":"submitData","outputs":[],"type":"function"},{"inputs":[],"type":"constructor"}]
  var bytecode = '60606040525b5b610196806100156000396000f30060606040526000357c01000000000000000000000000000000000000000000000000000000009004806343e08ad114610044578063bb985d7d1461005757610042565b005b61005560048035906020015061006a565b005b6100686004803590602001506100e5565b005b7f6f70656e0000000000000000000000000000000000000000000000000000000060006000506000838152602001908152602001600020600050819055508060016000506210000160005054621000008110156100025790900160005081905550600162100001600050540162100001600050819055505b50565b6000600282604051808281526020019150506020604051808303816000866161da5a03f1156100025750506040515190507f6f70656e00000000000000000000000000000000000000000000000000000000600060005060008381526020019081526020016000206000505414151561015d57610192565b3373ffffffffffffffffffffffffffffffffffffffff16600060c8604051809050600060405180830381858888f19350505050505b505056'
  var contractAddr = ''
  var newContractAddr = ''

  function setAddress(seed) {
    keystore = new ethlightjs.keystore(seed, password)
    address = keystore.generateNewAddress(password)
    //balance = api.getBalance(address, function(bal){})
  }

  var sendTime;
  var sentTime;
  function sendHash(hashObject,hashArray,ind,nonny) {
    console.log("index:"+ind);
    window.clearInterval(sendTime);
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
        sendTime = window.setTimeout(sendHash, 3000,hashObject,hashArray,ind-1,nonny+1)
      }
      else {
        return
      }
    })
  }

  function createContract() {
    setAddress($('#seed').val())
    api.getNonce(address, function(error,nonce){
      txObj = {gasLimit: 3141592, gasPrice: 100, nonce: nonce}
      helpers.sendCreateContractTx(bytecode, address, txObj, api, keystore, password,function(error, newContractAddress) {
        if(newContractAddr == newContractAddress)
          return
        newContractAddr = newContractAddress
        $('#newContractAddr').html(newContractAddr)
        var hashObject = $('#hash-object').val()
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
  $('#submitContractInfo').click(createContract)

  function submitData() {
    var data = $('#data').val()
    setAddress($('#addressSeed').val())
    api.getNonce(address, function(error,nonce){
      console.log(address);
      console.log(nonce);
      txObj = {gasLimit: 3141592 , gasPrice: 100, nonce: nonce}
      helpers.sendFunctionTx(abi, contractAddr, 'submitData', [data], address, txObj, api, keystore, password, function(error,data) {
        // body...
      })
    })
  }
  $('#submitData').click(submitData)

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

  function examineContract() {
    contractAddr = $('#examinee').val()
    $.get("http://stablenet.blockapps.net/query/storage?address="+contractAddr, function( data ) {
      console.log(JSON.stringify(data));
      var storage = "{"
      $.each(data, function( index, element ) {
        var key = element.key//hex2a(element.key.replace(/^(00)+/, '').replace(/(00)+$/, '')) //truncate leading zeros and make ascii
        var value = element.value //hex2a(element.value.replace(/^(00)+/, '').replace(/(00)+$/, '')) //truncate leading zeros and make ascii
        storage += '"'+key+'":"'+value+'",'
      });
      storage = storage.substring(0, storage.length - 1);
      storage+="}"

      storage = $.parseJSON(storage)
      var numKeys = parseInt(storage["0000000000000000000000000000000000000000000000000000000000100001"])+1
      var keyMap = {}
      console.log(numKeys);
      for(var i=1; i<numKeys;i++)
      {
          var key = storage[leftpad(i,64)]
          console.log(key);
          keyMap[hex2a(key.replace(/^(00)+/, '').replace(/(00)+$/, ''))] = hex2a(storage[keyIndexToLookup(key,"0000000000000000000000000000000000000000000000000000000000000000")].replace(/^(00)+/, '').replace(/(00)+$/, '')) //00... is the position of the mapping in the array
      }
      $("#examination").html(JSON.stringify(keyMap, null, 2));
    });
  }
  $('#examineContract').click(examineContract)

  jQuery.each(jQuery('textarea[autoresize]'), function() {
    var offset = this.offsetHeight - this.clientHeight;

    var resizeTextarea = function(el) {
        jQuery(el).css('height', 'auto').css('height', el.scrollHeight + offset);
    };
    jQuery(this).on('keyup input', function() { resizeTextarea(this); }).removeAttr('data-autoresize');
  });
}
