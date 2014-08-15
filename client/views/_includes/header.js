

var userId = Meteor.userId();
var user = Meteor.user();

Template.header.created = function() {
   userId = Meteor.userId();
   user = Meteor.user();
}

Template.header.rendered = function() {

   // set name and check the radio buttons in the menu
   // $('#form-tweak-author').val(user.profile.nickname);
   // $("input[name='form-tweak-size'][value='"+user.profile.textsize+"']").attr('checked', true);
   // $("input[name='form-tweak-wordcounter'][value='"+user.profile.wordcounter+"']").attr('checked', true);
   
}



Template.header.events({
   'click .settings-open': function(e) {
      // reset every time users open
      // set name and check the radio buttons in the menu

      console.log('sesame open')
      $("input[name='form-tweak-size']").prop('checked', false);


      $('#form-tweak-author').val(user.profile.nickname);
      $("input[name='form-tweak-size'][value='"+user.profile.textsize+"']").prop('checked', true);
      $("input[name='form-tweak-wordcounter'][value='"+user.profile.wordcounter+"']").prop('checked', true);
   },
   // 'blur .form-group, keyup #form-tweak-author': function(e) {
  'click .settings-save': function(e) {

      console.log('updating user profile')

      Meteor.users.update({_id: userId }, {
         $set: {
               profile: {
                  textsize: $("input[name='form-tweak-size']:checked").val(),
                  wordcounter: $("input[name='form-tweak-wordcounter']:checked").val(),
                  nickname: $('#form-tweak-author').val()
               }
            }
         }, function(error) {
         if (!error) {
            // close the dropdown on complete
            $('.dropdown.open .dropdown-toggle').dropdown('toggle');
         } else {
            // display the error to the user
            Errors.throw(error.reason);
            return false;
         }
     });

    e.preventDefault();
  }
});


// <!-- lets the dropdown stay open on click, since it's a form control now -->
  // <script type="text/javascript">
    $(document).ready(function() {
        $(document).on('click', '.dropdown-menu', function (e) {
            $(this).hasClass('keep_open') && e.stopPropagation(); // This replace if conditional.
        }); 
    });
