Router.route('/', function () {
  this.render('home');
});

Template.home.rendered = function() {
  var helpers = ethlightjs.helpers
  var api = new ethlightjs.blockchainapi.blockappsapi("http://stablenet.blockapps.net")

  var password = 'silly horse battery staple nonce trying bass uke fuck'
  var keystore = undefined

  var nonce = 0
  var balance = 0
  var abi = [{"constant":false,"inputs":[{"name":"hash","type":"bytes32"}],"name":"addHash","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"data","type":"bytes32"}],"name":"submitData","outputs":[],"type":"function"},{"inputs":[],"type":"constructor"}]
  var bytecode = '60606040525b6101f460006000508190555033600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b61015d8061004c6000396000f30060606040526000357c01000000000000000000000000000000000000000000000000000000009004806343e08ad114610044578063bb985d7d1461005757610042565b005b61005560048035906020015061006a565b005b6100686004803590602001506100ac565b005b7f6f70656e0000000000000000000000000000000000000000000000000000000060026000506000838152602001908152602001600020600050819055505b50565b6000600282604051808281526020019150506020604051808303816000866161da5a03f1156100025750506040515190507f6f70656e00000000000000000000000000000000000000000000000000000000600260005060008381526020019081526020016000206000505414151561012457610159565b3373ffffffffffffffffffffffffffffffffffffffff16600060c8604051809050600060405180830381858888f19350505050505b505056'
  var contractAddr = '0d1f18cca99e5d9b78530bf7d1fe9739d6bee1e1'
  var newContractAddr = ''

  function setAddress(seed) {
    keystore = new ethlightjs.keystore(seed, password)
    address = keystore.generateNewAddress(password)
    //balance = api.getBalance(address, function(bal){})
  }

  function sendHash(hashObject,hashArray,index,nonce) {
    var value = hashObject[hashArray[index]]
    txObj = {gasLimit: 3141592 , gasPrice: 100, nonce: nonce, value: value}
    var hash = hashArray[index]
    helpers.sendFunctionTx(abi, newContractAddr, 'addHash', [hash], address, txObj, api, keystore, password, function (err, data) {
      nonce+=1
      index-=1
      if(index > 0) {
        sendHash(hashObject,hashArray,index,nonce)
      }
    })
  }

  function createContract() {
    setAddress($('#seed').val())
    api.getNonce(address, function(error,nonce){
      txObj = {gasLimit: 3141592, gasPrice: 100, nonce: nonce}
      helpers.sendCreateContractTx(bytecode, address, txObj, api, keystore, password,function(error, newContractAddress) {
        newContractAddr = newContractAddress
        $('#newContractAddr').html(newContractAddr)
        var hashObject = $('#hash-object').val()
        if(hashObject == "")
          return
        hashObject = jQuery.parseJSON(hashObject)
        hashArray = $.map(hashObject, function(e1,e2) { return e2; })
        console.log(hashArray);
        nonce+=1
        sendHash(hashObject,hashArray,hashArray.length-1,nonce)
      })
    })
  }
  $('#submitContractInfo').click(createContract);

  function submitData() {
    var data = $('#data').val()
    address = $('#address').val()
    api.getNonce(address, function(error,nonce){
      console.log(address);
      console.log(nonce);
      txObj = {gasLimit: 3141592 , gasPrice: 100, nonce: nonce}
      helpers.sendFunctionTx(abi, contractAddr, 'submitData', [data], address, txObj, api, keystore, password, function(error,data) {
        // body...
      })
    })
  }
  $('#submitData').click(submitData);

  function getContractData() {
    var storage = api.getStorage(contractAddr, function(val){})
  }

  jQuery.each(jQuery('textarea[autoresize]'), function() {
    var offset = this.offsetHeight - this.clientHeight;

    var resizeTextarea = function(el) {
        jQuery(el).css('height', 'auto').css('height', el.scrollHeight + offset);
    };
    jQuery(this).on('keyup input', function() { resizeTextarea(this); }).removeAttr('data-autoresize');
  });
}
