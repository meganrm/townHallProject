(function(module) {
  var firebasedb = firebase.database();
  var provider = new firebase.auth.GoogleAuthProvider();

  // object to hold the front end view functions
  var eventHandler = {};

  // Renders the page in response to lookup
  eventHandler.lookup = function (e) {
    e.preventDefault();
    var zip = $('#look-up input').val();
    if (zip) {
      TownHall.lookupZip($('#look-up input').val());
    }
  };

  // reset the home page to originial view
  eventHandler.resetHome = function () {
    $('[data-toggle="popover"]').popover('hide');
    $('.header-small').hide();
    $('.header-large').fadeIn();
    $('#look-up input').val('');
    $('#representativeCards section').empty();
    $('.form-text-results').removeClass('text-center');
    $('.header-with-results .results').removeClass('multipleResults');
    $('.left-panels').removeClass('left-panels-border');
    $('#nearest').removeClass('nearest-with-results');
    $('#button-to-form').hide();
    $('.spacer').show();
    $('#look-up').appendTo($('.right-panels'));
    TownHall.isCurrentContext = false;
    TownHall.currentContext = [];
    TownHall.zipQuery = '';
    $('#map').appendTo('.map-large');
    onResizeMap();
    var $parent = $('#nearest');
    var $results = $('#textresults');
    $parent.empty();
    $results.empty();
    $table = $('#all-events-table');
    $('.event-row').remove();
    TownHall.filterIds['meetingType'] = 'Town ';
    data = eventHandler.getFilterState(TownHall.allTownHalls);
    eventHandler.renderTableWithArray(data, $table);
  };

  // Renders one panel, assumes data processing has happened
  eventHandler.renderPanels = function(event, $parent) {
    var compiledTemplate = Handlebars.getTemplate('eventCards');
    var $panel = $(compiledTemplate(event));
    $panel.children('.panel').addClass(event.Party.slice(0,3));
    $panel.appendTo($parent);
  };

  eventHandler.renderRepresentativeCards = function(representativePromise, $parent) {
    $parent.empty(); // If they search for a new zipcode clear the old info
    representativePromise.success(function(representatives) {
      var compiledTemplate = Handlebars.getTemplate('representativeCard');
      $parent.append('<h2 class="text-primary text-center">Your Representatives</h2>');
      representatives.results.forEach(function(rep) {
        switch(rep.party) {
        case 'R':
          rep.party = 'Republican';
          break;
        case 'D':
          rep.party = 'Democrat';
          break;
        case 'I':
          rep.party = 'Independent';
          break;
        }
        var termEnd = new Date(rep.term_end);
        // If term expires in janurary then assume the election is in the prior year
        rep.electionYear = termEnd.getMonth() === 0 ? termEnd.getFullYear() - 1 : termEnd.getFullYear();
        $parent.append(compiledTemplate(rep));
      });
      if (representatives.results.length > 3) {
        $parent.append('<h4 class="col-md-12 text-center">Your zip code encompasses more than one district.<br><small><a href="http://www.house.gov/representatives/find/">Learn More</a></small></h4>');
      }
    });
  };

  eventHandler.renderTableWithArray = function (array, $table) {
    $currentState = $('#current-state');
    var total = parseInt($currentState.attr('data-total'));
    var cur = array.length;
    array.forEach(function(ele){
      eventHandler.renderTable(ele, $table);
    });
    $('[data-toggle="popover"]').popover({
      container: 'body',
      html:true
    });
    /*eslint-env es6*/
    /*eslint quotes: ["error", "single", { "allowTemplateLiterals": true }]*/
    $currentState.text(`Viewing ${cur} of ${total} total events`);
  };

  // render table row
  eventHandler.renderTable = function (townhall, $tableid) {
    if (townhall.dist) {
      townhall.dist = Math.round(townhall.dist/1609.344);
    }
    townhall.addressLink = 'https://www.google.com/maps?q=' + escape(townhall.address);
    var compiledTemplate = Handlebars.getTemplate('eventTableRow');
    $($tableid).append(compiledTemplate(townhall));
  };

  eventHandler.getFilterState = function (data) {
    Object.keys(TownHall.filterIds).forEach(function(key) {
      if (TownHall.filterIds[key]) {
        data = TownHall.filterByCol(key, TownHall.filterIds[key], data);
      }
    });
    return data;
  };

  // takes the current set of data in the table and sorts by selection
  eventHandler.sortTable = function (e) {
    e.preventDefault();
    var sortOn = $(this).attr('data-filter');
    var data = TownHall.isCurrentContext ? TownHall.currentContext : TownHall.allTownHalls;
    var filtereddata = TownHall.filteredResults.length > 0 ? TownHall.filteredResults : data;
    TownHall.currentContext = TownHall.sortTable(filtereddata, sortOn);
    $table = $('#all-events-table');
    $('.event-row').remove();
    data = eventHandler.getFilterState(data);
    eventHandler.renderTableWithArray(data, $table);
  };

  // filters the table on click
  eventHandler.filterTable = function (e) {
    e.preventDefault();
    $this = $(this);
    $this.parent().addClass('active');
    $this.parent().siblings().removeClass('active');
    $table = $('#all-events-table');
    $('#resetTable').show();
    var filterID = this.id.slice(0,5);
    var filterCol = $this.attr('data-filter');
    var inputs = $('input[data-filter]');
    $('.event-row').remove();
    var data = TownHall.isCurrentContext ? TownHall.currentContext : TownHall.allTownHalls;
    if (filterID === 'All') {
      TownHall.filterIds[filterCol] = '';
    }
    else {
      data = TownHall.filteredResults.length > 0 ? TownHall.filteredResults : data;
      TownHall.filterIds[filterCol] = filterID;
    }
    data = eventHandler.getFilterState(data);
    eventHandler.renderTableWithArray(data, $table);
  };

  eventHandler.filterTableByInput = function(e) {
    e.preventDefault();
    $('#resetTable').show();
    $table = $('#all-events-table');
    var query = $(this).val();
    var filterCol = $(this).attr('data-filter');
    $('.event-row').remove();
    var data = TownHall.isCurrentContext ? TownHall.currentContext:TownHall.allTownHalls;
    // var data = TownHall.filteredResults.length>0 ? TownHall.filteredResults:data;
    data = eventHandler.getFilterState(data);
    TownHall.filteredResults = TownHall.filterColumnByQuery(filterCol, query, data);
    eventHandler.renderTableWithArray(TownHall.filteredResults, $table);
  };

  eventHandler.resetTable = function (e) {
    e.preventDefault();
    $table = $('#all-events-table');
    $('.event-row').remove();
    $('#resetTable').hide();
    $('.filter li').removeClass('active');
    TownHall.filterIds = {};
    TownHall.filteredResults = [];
    var data = TownHall.isCurrentContext ? TownHall.currentContext:TownHall.allTownHalls;
    eventHandler.renderTableWithArray(data, $table);
  };

  // initial state of table
  eventHandler.initialTable = function (townhall) {
    TownHall.filterIds['meetingType'] = 'Town ';
    $currentState = $('#current-state');
    var total = parseInt($currentState.attr('data-total')) + 1;
    var cur = parseInt($currentState.attr('data-current'));
    $currentState.attr('data-total', total);
    $table = $('#all-events-table');
    if (townhall.meetingType === 'Town Hall') {
      cur ++;
      eventHandler.renderTable(townhall, $table);
      $currentState.attr('data-current', cur);
    }
    $currentState.text(`Viewing ${cur} of ${total} total events`);
  };

  // renders results of search
  eventHandler.render = function (events, zipQuery, representativePromise) {
    $('[data-toggle="popover"]').popover('hide');
    $('.header-small').removeClass('hidden');
    $('.header-small').fadeIn();
    $('.header-large').hide();
    $('.form-text-results').addClass('text-center');
    $('.left-panels').addClass('left-panels-border');
    $('#nearest').addClass('nearest-with-results');
    $('#look-up').appendTo($('.left-panels'));
    $('#button-to-form').removeClass('hidden');
    $('#button-to-form').fadeIn();
    $('.spacer').hide();
    maxDist = 120701;
    eventHandler.resultsRouting(maxDist, events, zipQuery, representativePromise);
    addtocalendar.load();
  };

  eventHandler.resultsRouting = function (maxDist, events, zipQuery, representativePromise){
    var $zip = $('#look-up input').val();
    var $parent = $('#nearest');
    var $results = $('#textresults');
    $parent.empty();
    $results.empty();
    $('#resetTable').hide();
    var $table = $('#all-events-table');
    $('.event-row').remove();
    var $text = $('<h4>');
    var nearest = events.reduce(function(acc, cur){
      if (cur.dist < maxDist) {
        acc.push(cur);
      }
      return acc;
    },[]);
    $('#map').appendTo('.map-small');
    var info = '<small class="text-white">Event results by proximity, not by district.</small> ';
    // Display a list of reps with contact info
    eventHandler.renderRepresentativeCards(representativePromise, $('#representativeCards section'));

    if (nearest.length === 0) {
      $('.header-with-results .results').removeClass('multipleResults');
      var townHall = events[0];
      var townHalls = [townHall];
      recenterMap(townHalls, zipQuery);
      eventHandler.renderTableWithArray(events, $table);
      $text.html('There are no events within 75 miles of your zip, the closest one is ' + townHall.dist + ' miles away. <br>' + info);
      $results.append($text);
      TownHall.saveZipLookup($zip);
      eventHandler.renderPanels(townHall, $parent);
    }
    else{
      TownHall.currentContext = nearest;
      TownHall.isCurrentContext = true;
      recenterMap(nearest, zipQuery);
      if (nearest.length === 1) {
        $('.header-with-results .results').removeClass('multipleResults');
        $text.html('There is ' + nearest.length + ' upcoming events within 75 miles of you. <br>' + info);
      } else {
        $('.header-with-results .results').addClass('multipleResults');
        $text.html('There are ' + nearest.length + ' upcoming events within 75 miles of you. <br>' +info);
      }
      $results.append($text);
      eventHandler.renderTableWithArray(nearest, $table);
      nearest.forEach(function(ele){
        eventHandler.renderPanels(ele, $parent);
      });
    }
  };

  $(document).ready(function(){
    init();
  });

  function init() {
    var filterSelector = $('.filter');
    $('[data-toggle="popover"]').popover({html:true});
    $('#button-to-form').hide();
    $('#save-event').on('submit', eventHandler.save);
    $('#look-up').on('submit', eventHandler.lookup);
    $('#view-all').on('click', TownHall.viewAll);
    $('.sort').on('click', 'a', eventHandler.sortTable);
    $('#resetTable').on('click', eventHandler.resetTable);
    filterSelector.on('click', 'a', eventHandler.filterTable);
    filterSelector.on('input', eventHandler.filterTableByInput);

    // url hash for direct links to subtabs
    // slightly hacky routing
    if (location.hash) {
      $("a[href='" + location.hash + "']").tab('show');
    }
    else{
      TownHall.isMap = true;
    }
    $('.navbar-main').on('click', '.hash-link', function onClickGethref(event) {
      var hashid = this.getAttribute('href');
      if (hashid === '#home' && TownHall.isMap === false) {
        history.replaceState({}, document.title, '.');
        setTimeout( function(){
          onResizeMap();
          if (location.pathname ='/') {
            eventHandler.resetHome();
            TownHall.isMap = true;
          }
        }, 50);
      }
      else if (hashid === '#home' && TownHall.isMap === true) {
        console.log('going home and map');
        history.replaceState({}, document.title, '.');
        eventHandler.resetHome();
      }
      else {
        location.hash = this.getAttribute('href');
      }
      $('[data-toggle="popover"]').popover('hide');
    });

    // Only show one popover at a time
    $('#all-events-table').on('click', '[data-toggle="popover"]', function(e) {
      $('#all-events-table [data-toggle="popover"]').not(this).popover('hide');
    });

    $('body').on('click', '.popover .popover-title a.close', function(e) {
      $('[data-toggle="popover"]').popover('hide');
    });

    // Fix popover bug in bootstrap 3 https://github.com/twbs/bootstrap/issues/16732
    $('body').on('hidden.bs.popover', function (e) {
      $(e.target).data('bs.popover').inState.click = false;
    });
  }
  window.onBeforeunload=null;

  module.eventHandler = eventHandler;
})(window);
