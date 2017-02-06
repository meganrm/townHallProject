(function(module) {
  var firebasedb = firebase.database()
  var provider = new firebase.auth.GoogleAuthProvider();

  // object to hold the front end view functions
  var eventHandler = {};

  // creates new TownHall object from form
  eventHandler.save = function (e) {
    e.preventDefault();
    var newTownHall = new TownHall( $('#save-event input').get().reduce(function(newObj, cur){
      newObj[cur.id] = $(cur).val();
      return newObj;
    }, {})
  );
    newTownHall.getLatandLog(newTownHall.address);
  };


// Given a new event, creates TownHall Object and encodes with lat and lng based on address from google docs
  eventHandler.saveSimple = function (newevent) {
    var newTownHall = new TownHall(newevent);
    newTownHall.getLatandLog(newTownHall.streetNumber + newTownHall.streetName +newTownHall.Zip);
  };

  // given an event and a current key, update that event.
  eventHandler.update = function (newevent , key) {
    var newTownHall = new TownHall(newevent)
    var address = newTownHall.streetNumber +' '+ newTownHall.streetName +' '+ newTownHall.City + ' ' + newTownHall.Zip
    console.log(address);
    newTownHall.getLatandLog(address, key);
  };

  //Sign in fuction for firebase
  eventHandler.signIn = function (){
    firebase.auth().signInWithRedirect(provider);
    firebase.auth().getRedirectResult().then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage);
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
    });
  };

  // firebase.auth().onAuthStateChanged(function(user) {
  //   if (user) {
  //   // User is signed in.
  //     console.log(user.displayName, ' is signed in');
  //   } else {
  //     eventHandler.signIn()
  //     // No user is signed in.
  //   }
  // });

  eventHandler.lookup = function (e) {
    e.preventDefault();
    TownHall.lookupZip($('#look-up input').val());
  };

  eventHandler.renderPanels = function(event, $parent) {
    var $panel = $(event.toHtml($('#event-template')));
    if (event.Party === 'Democratic') {
      $panel.children('.panel').addClass('panel-dem');
      $panel.appendTo($parent);
    }
    else {
      $panel.children('.panel').addClass('panel-rep');
      $panel.appendTo($parent);
    }
  };

  eventHandler.renderTable = function (events, $tableid) {
    for (var i = 0; i < events.length; i++) {
      events[i].Date = events[i].Date.toDateString();
      events[i].dist = Math.round(events[i].dist/1609.344);
      events[i].addressLink = "https://www.google.com/maps?q=" + escape(events[i].address);
      $($tableid).append(events[i].toHtml($('#table-template')));
    }
  }

  eventHandler.render = function (events) {
    var $parent = $('#nearest');
    $parent.empty();
    var $table = $('#all-events-table');
    $table.empty();
    maxDist = 80467.2;
    recenterMap(events.slice(0, 2));
    var nearest = events.reduce(function(acc, cur){
      if (cur.dist < maxDist) {
        acc.push(cur);
      }
      return acc;
    },[])
    if (nearest.length === 0) {
      events[0].Date = events[0].Date.toDateString();
      events[0].dist = Math.round(events[0].dist/1609.344);
      events[0].addressLink = "https://www.google.com/maps?q=" + escape(events[0].address);
      $parent.html('<h4>No events within 50 miles of your zip, the closest one is ' + events[0].dist + ' miles away</h4>')
      eventHandler.renderPanels(events[0], $parent);
      eventHandler.renderTable(events, $table)
    } else {
      eventHandler.renderTable(nearest, $table)
      nearest.forEach(function(ele){
        eventHandler.renderPanels(ele, $parent);
      })
    }
    addtocalendar.load();
  };


  $('#all-events').on('focusout', '.event-row', function(){
    id = this.id;
    console.log(id);
    newTownHall = $(this).children('td').get().reduce(function(newObj, cur){
      newObj[cur.id] = $(cur).html();
      return newObj;
    }, {});
    console.log(newTownHall);
    eventHandler.update(newTownHall , id);
  });


  $('#save-event').on('submit', eventHandler.save);
  $('#look-up').on('submit', eventHandler.lookup);
  $('#view-all').on('click', TownHall.viewAll);

  module.eventHandler = eventHandler;
})(window);