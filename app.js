App = {
     web3Provider: null,  // no contract at the start 
     contracts: {},
     account: 0x0,      // give it inital account, which is null account in this case (0x0). 
     loading: false,       // This is where account address is held. 0x0 because it takes time to load  
     
     init: function() {    //constructor function, can put anything in it 
          /*    
           * Replace me...
           */

          return App.initWeb3();
     },

     initWeb3: function() {        // connects a DApp to a network (in this case ganache but can also use metamask) 
          
          // initialize web3
          if (window.web3) {
               App.web3Provider = window.web3.currentProvider  //checks if there is a provider in the browser
                    }
     // If no injected web3 instance is detected, fall back to Ganache
     else {
          App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545')     
          }
     web3 = new Web3(App.web3Provider)   //acts as a connection to any network 
          return App.initContract()      //deploys blockchain
     },
  
     initContract: function() {          // connects to the smart contract  
          
          $.getJSON('ZombieOwnership.json', function(zombieOwnershipArtifact){  //gets all the properties of ZombieOwnership from the json file 
               /* passes input parameter (ZombieOwnership) to the function so ZombieOwnership function gets found in the json file 
               and imports all the associated functions under ZombieOwnership  */ 
               
               // get the contract artifact file and use it to instantiate a truffle contract abstraction
               App.contracts.ZombieOwnership = TruffleContract(zombieOwnershipArtifact);  //puts ZombieOwnership interaction into the empty contract 
               // set the provider for our contract
               App.contracts.ZombieOwnership.setProvider(App.web3Provider);  //sets network provider as Web3.App 
               // retrieve zombies from the contract
           
               //update account info
               App.displayAccountInfo();  // function will display the current account we are connected to in Ganache, but in MetaMask one can switch between accounts 
           
               // Listen to smart contract events
               App.listenToEvents();

               // show zombies owned by current user      
               return App.reloadZombies();   // function will show all Zombies listed in the address 
           });
     },    
     displayAccountInfo: function () {  //placeholders for the above functions 
            
        // get current account information                    // want to display account information to the frontend 
          web3.eth.getCoinbase(function (err, account) {    // 'web3.eth.getCoinbase' gets the current account we are connected to 
       // if there is no error
          if (err === null) {                                // returns either the account address or an error
         //set the App object's account variable
         App.account = account;                               // confirms address of account 
         // insert the account address in the p-tag with id='account'
         $("#account").text(account);                            // finds the ID of the account - "#account" - and inserts into the p-tag as text 
         // retrieve the balance corresponding to that account
         web3.eth.getBalance(account, function (err, balance) {     //want to display the account balance 
             // if there is no error
             if (err === null) {                             // returns either the account balance or an error 
                 // insert the balance in the p-tag with id='accountBalance'
                 $("#accountBalance").text(web3.fromWei(balance, "ether") + " ETH");  //convert to Ether from Wei as Wei is a big number 
             }
         });
     }
 });
     }, 

   reloadZombies: function () {
               // avoid reentry
               if (App.loading) {           // if already inside the function, dont run it again, if false then load it 
                       return;                 
               }
               App.loading = true;
           
               App.displayAccountInfo();       // updates account information because the balance may have changed
           
               // define placeholder for contract instance
               // this is done because instance is needed multiple times
               var zombieOwnershipInstance;
           
               App.contracts.ZombieOwnership.deployed().then(function (instance) {   // gets deployed instance from node 
                       zombieOwnershipInstance = instance;              // declare variable the holds the instance 
                       // retrieve the zombies belonging to the current user
                       return zombieOwnershipInstance.getZombiesByOwner(App.account);
               }).then(function (zombieIds) {
                       // Retrieve and clear the zombie placeholder
                       var zombieRow = $('#zombieRow');      //retrieve ZombieRow from json 
                       zombieRow.empty();
           
                       // fill template for each zombie
                       for (var i = 0; i < zombieIds.length; i++) {      //loop through the zombieIDs 
                           var zombieId = zombieIds[i];
                           zombieOwnershipInstance.zombies(zombieId.toNumber()).then(function (zombie) {   //use the struct to retrieve all the info 
                                   App.displayZombie(               // the struct is returned as an ordered list 
                                       zombieId.toNumber(),
                                       zombie[0],
                                       zombie[1],
                                       zombie[2],
                                       zombie[3],
                                       zombie[4],
                                       zombie[5]
                                   );
                           });
                       }
                       // hide and show the generate button
                       App.displayGenerateButton(zombieIds);    //put into display zombie function 
                       // app is done loading
                       App.loading = false;
               // catch any errors that may occur
               }).catch(function (err) {
                       console.log(err.message);
                       App.loading = false;
               });
           },


      displayZombie: function (id, name, dna, level, readyTime, winCount, lossCount) {
               // Retrieve the zombie placeholder
               var zombieRow = $('#zombieRow');
           
               // define the price for leveling up
               // should not be hard-coded in the final version
               var etherPrice = web3.toWei(0.001, "ether");
             
           
               // Retrieve and fill the zombie template
               var zombieTemplate = $('#zombieTemplate');
               zombieTemplate.find('.panel-title').text(name);
               zombieTemplate.find('.zombie-dna').text(dna);
               zombieTemplate.find('.zombie-level').text(level);
               zombieTemplate.find('.zombie-readyTime').text(App.convertTime(readyTime));
               zombieTemplate.find('.zombie-winCount').text(winCount);
               zombieTemplate.find('.zombie-lossCount').text(lossCount);
               zombieTemplate.find('.btn-levelup').attr('data-id', id);
               zombieTemplate.find('.btn-levelup').attr('data-value', etherPrice);
               zombieTemplate.find('.panel-heading').attr('color', style);   //Q4c) - adding style attribute to panel-heading

            
              var backgroundColor = HEXColor; 
              var color = HEXColor; 
               
           
               // add this new zombie to the placeholder
               zombieRow.append(zombieTemplate.html());
           },

     
      displayGenerateButton: function (zombieIds) {
               if (zombieIds.length > 0) {
                       $(".btn-create").hide();
               } else {
                       $(".btn-create").show();
               }
           },


      convertTime: function (timestamp) {
               var d = new Date();
               var date = new Date(timestamp * 1000 + d.getTimezoneOffset() * 60000);
               return date;
           },    


      createRandomZombie: function () {
          // get information from the modal
          var _zombieName = $('#zombie_name').val();   //create variable called zombieName. retrieves info from modal input - #zombie_name
      
          // if the name was not provided    
          if (_zombieName.trim() == '') {           // checks that name has been provided. must contain a name, cannot be empty 
                  // we cannot create a zombie
                  return false;
          }
      
          // get the instance of the ZombieOwnership contract
          App.contracts.ZombieOwnership.deployed().then(function (instance) {   // creates an instance of ZombieOwnership
                  // call the createRandomZombie function, 
                  // passing the zombie name and the transaction parameters
                  instance.createRandomZombie(_zombieName, {              // calling createRandomZombie from cryptozombies 
                      from: App.account,  
                      gas: 500000
                  });
          // log the error if there is one
          }).then(function () {
                                                  // logs an error in the console if there is an error
          }).catch(function (error) {
                  console.log(error);
          });
      },

     levelUp: function (data) {
          // retrieve the zombie data
          var _zombieId = data.getAttribute("data-id");
          var _price = parseFloat(data.getAttribute("data-value"));
      
          // call the levelUp function in the zombie contract
          App.contracts.ZombieOwnership.deployed().then(function (instance) {
              return instance.levelUp(_zombieId, {      //pass values from current account and gas price. 
                  from: App.account,
                  value: _price,
                  gas: 500000
              });
          // catch any occuring errors
          }).then(function () {
      
          }).catch(function (err) {
                  console.error(err);
          });
      },

      
     randomHex: function (dna) {
         var HEXColor = Math.floor(Math.random()*16).toString(16);   //Q4a) Defining RandomHex function
         return HEXColor;
          },
          
 
     invertHex: function (HEXColor) {       // Q4b) Defining invertHex function 
         var invertHEX = invert(HEXColor);       
         return invertHEX;    
        },

          
     listenToEvents: function () {
          App.contracts.ZombieOwnership.deployed().then(function (instance) {
              // watch the event
              instance.NewZombie({}, {}).watch(function (error, event) {    //fires the CreateNewZombie event 
                  // log error if one occurs   
                  if (error) {
                          console.error(error);
                  }
                  // reload the zombie list if event is triggered
                  App.reloadZombies();
                  App.reloadNewLevel();     //Q3b) reload zombie list when NewLevel is fired
              });
          }); 
          }, 

}; 



$(function() {
     $(window).load(function() {
          App.init();
     });
});


// placeholder for current account 
var _account;
// set the interval
setInterval(function () {        //periodically checks the current account and the zombie list 
    // check for new account information and display it
    App.displayAccountInfo();
    // check if current account is still the same, if not
    if (_account != App.account) {
            // load the new zombie list
            App.reloadZombies();
            // update the current account
            _account = App.account;
    }
}, 100);  