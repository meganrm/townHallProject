(function(module) {
  var dataviz = {};

  dataviz.getPastEvents = function(path, dateStart, dateEnd){
    var ref = firebasedb.ref(path);
    ref.orderByChild('dateObj').startAt(dateStart).endAt(dateEnd).on('child_added', function(snapshot) {
      dataviz.recessProgress(snapshot.val());
    });
  };

  dataviz.listenForRemove = function(path){
    var ref = firebasedb.ref(path);
    ref.on('child_removed', function(snapshot) {
      var remove = true;
      dataviz.removeLiveEvent(snapshot.val(), remove);
    });
  };

  function updateProgressBar($bar, total, $total, remove){
    var increment = remove ? -1 : 1;

    var current = Number($bar.attr('data-count'));
    var updated = current + increment;
    $bar.attr('data-count', updated);
    var width = updated / total * 100;
    $bar.width(width + '%');
    $bar.text(updated);

    var currentNoEvents = Number($total.attr('data-count'));
    var updatedNoEvents = currentNoEvents - increment;
    $total.attr('data-count', updatedNoEvents);
    var widthNoEvents = updatedNoEvents / total * 100;
    $total.width(widthNoEvents + '%');
    $total.text(updatedNoEvents);
  }

  function updateTotalEventsBar($bar, remove){
    var increment = remove ? -1 : 1;
    var current = Number($bar.attr('data-count'));
    var max = Number($bar.attr('data-max'));
    var updated = current + increment;
    max = updated > max ? updated : max;
    var width = updated / (max + 50) * 100;
    $bar.attr('data-count', updated);
    $bar.width(width + '%');
    $bar.text(updated);
  }

  function parseBars(party, chamber, newMember, total) {
    if (newMember) {
      var $memberBar = $('.' + party + '-aug-progress-' + chamber);
      var $total = $('.' + party + '-' + chamber);
      updateProgressBar($memberBar, total, $total);
    }
    var $bar = $('.' + party + '-aug-total-' + chamber);
    updateTotalEventsBar($bar);
  }

  dataviz.membersEvents = new Set();

  dataviz.recessProgress = function (townhall, removed) {
    var total;
    var newMember = false;
    var chamber;
    if (moment(townhall.dateObj).isBetween('2017-07-29', '2017-09-04', []) && townhall.meetingType ==='Town Hall') {
      if (!dataviz.membersEvents.has(townhall.Member)) {
        newMember = true;
        dataviz.membersEvents.add(townhall.Member);
      }
      if (townhall.party === 'Republican') {
        var party = 'rep';
      } else {
        party = 'dem';
      }
      if (townhall.district) {
        total = 434;
        chamber = 'house';
      } else {
        total = 100;
        chamber = 'senate';
      }
      parseBars(party, chamber, newMember, total, removed);
    }
  };


  dataviz.initalProgressBar = function initalProgressBar(total, $total){
    var currentNoEvents = Number($total.attr('data-count'));
    $total.attr('data-count', currentNoEvents);
    var widthNoEvents = currentNoEvents / total * 100;
    $total.width(widthNoEvents + '%');
    $total.text(currentNoEvents);
  };

  var dateStart = new Date('2017-07-29').valueOf();
  var dateEnd = new Date('2017-09-04').valueOf();
  // dataviz.getPastEvents('townHallsOld/2017-8', dateStart, dateEnd);
  // dataviz.getPastEvents('townHallsOld/2017-7', dateStart, dateEnd);
  // dataviz.getPastEvents('townHallsOld/2017-6', dateStart, dateEnd);
  // dataviz.initalProgressBar(100, $('.dem-senate'));
  // dataviz.initalProgressBar(100, $('.rep-senate'));
  // dataviz.initalProgressBar(434, $('.dem-house'));
  // dataviz.initalProgressBar(434, $('.rep-house'));

  module.dataviz = dataviz;
})(window);
