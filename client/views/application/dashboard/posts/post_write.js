

Template.postWrite.created = function() {
  console.log('Dashboard Created');
  console.log(this.data);

  Session.set('postTypes', []);
  if ( !!this.data && !!this.data.newPostTypes )
    Session.set('postTypes', this.data.newPostTypes);

  console.log('session data:')
  console.log(Session.get('postTypes'));

  // initialize as blank
  Session.set('selectedType', '');
}


Template.postWrite.rendered = function() {

};



Template.postWrite.helpers({
  newPostSelect: function() {
    if (Session.get('postTypes').length > 0 && Session.get('selectedType').length == '' )
      return true;
    return false;
  }
});


Template.postWrite.events({
  'click a[data-type="monthly"]': function(e) { 
    console.log('monthly novel init')
    Session.set('selectedType', 'monthly');
  },
  'click a[data-type="weekly"]': function(e) { 
    console.log('weekly novel init')
    Session.set('selectedType', 'weekly');
  },
  'click a[data-type="nanowrimo"]': function(e) { 
    console.log('nanowrimo novel init')
    Session.set('selectedType', 'nanowrimo');
  },
  'click a[data-type="free"]': function(e) { 
    console.log('free novel init')
    Session.set('selectedType', 'free');
  }
});
