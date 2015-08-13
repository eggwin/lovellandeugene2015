if (Meteor.isClient) {

  Template.lodging.events({
    "click #reserveRoom": function (e, template) {
      // opens in a new tab
      var url = 'http://www.marriott.com/meeting-event-hotels/group-corporate-travel/groupCorp.mi?resLinkData=Hourany-Abungan%20Wedding%5Esfosb%60HAWHAWA%60149.00%60USD%60false%6010/16/15%6010/18/15%609/18/15&app=resvlink&stop_mobi=yes';
      window.open(url, '_blank');
    }
  });

  Template.contactus.events({
    "submit form": function (e, template) {
      e.preventDefault();
      e.stopPropagation();
      var fullname = template.$('#fullname').val(),
          email = template.$('#emailaddress').val(),
          message = template.$('#message').val();

      Meteor.call('sendEmail',
                  'ehourany@gmail.com, labungan@gmail.com, beezybeets@yahoo.com',
                  email,
                  '',
                  'Message from ' + fullname,
                  fullname + ' has submitted a message: \n' + message);

      template.$('.thankyou').toggleClass('hide');
      template.$('.form-horizontal').toggleClass('hide');

      return false;
    }
  });

  Template.rsvp.events({
    "change #numberGuests": function (e, template) {
      var numberGuests = +template.$('#numberGuests').val(),
          guestForm = template.$('.guest-form'),
          guestConstructor = $('<div class="form-horizontal" id="guestForm">');

      if (numberGuests > 0 && numberGuests < 6) {
        for (var i = 1; i <= numberGuests; i++) {
          guestSelection = $('<select>').addClass('form-control guest-culinary').attr('id', 'guest'+i).append($('<option>Please select culinary option</option><option>Beef</option><option>Mahi Mahi</option><option>Vegetarian</option>'));
          $(guestConstructor).append($('<div>').addClass('form-group col-md-12')
                             .append($('<input type="text" class="form-control guest-form-input" placeholder="Name for Guest #' + i + '">').attr('id', 'guest' + i))
                             .append(guestSelection));
        };
      } else if (numberGuests >= 6) {
        $(guestConstructor).append($('<h4>').addClass('normal').text('Please specify names & culinary preference for each person below'))
                           .append($('<textarea rows="4">').addClass('form-control').attr('id', 'largeParty'))
                           .append($('<span>').addClass('col-md-12 row requiredLargeParty hide').text('* Required'));
      }
      $(guestForm).html(guestConstructor);
    },
    "change #repondez input[name=optionsWedding]": function (e, template) {
      var repondez = template.$('input[type=radio]:checked').val();
      if (repondez === 'no') {
        template.$('.response-yes, .response-no, #guestSelect').toggleClass('hide');
      } else {
        template.$('.response-yes, .response-no, #guestSelect').toggleClass('hide');
      }
    },
    "submit .rsvp-submit": function (e, template) {
      e.preventDefault();
      e.stopPropagation();
      var fullname = template.$('#fullname').val(),
          email = template.$('#emailaddress').val(),
          mealMain = template.$('#guestSelect').val(),
          numberGuests = template.$('#numberGuests').val(),
          guestNames = _(template.$('.guest-form-input:visible')).map(function (v) { return $(v).val(); }),
          mealGuests = _(template.$('.guest-culinary')).map(function (v) { return $(v).val(); }),
          attendance = template.$('input[type=radio]:checked').val() === 'yes' ? true : false,
          thankyou = template.$('.thankyou'),
          largeParty = $('#largeParty:visible'),
          formattedNames = '',
          formattedMeals = '';

      _(guestNames).each(function (v, k) { formattedNames += v + (k === guestNames.length ? '' : ', ')});
      _(mealGuests).each(function (v, k) { formattedMeals += v + (k === mealGuests.length ? '' : ', ')});

      if (formattedMeals == '') {
        formattedMeals = 'None';
      }
      if (formattedNames == '') {
        formattedNames = 'None';
      } 

      var isEmail = validator.isEmail(email),
          isName = fullname != '',
          isLargeParty = (largeParty.length) ? largeParty.val() != '' : true;

      if (!(isEmail && isName && isLargeParty)) {
        if (!isLargeParty) {
          template.$('.requiredLargeParty').removeClass('hide');
        }
        if (!isName) {
          template.$('.required:first').removeClass('hide');
        }
        if (email == '') {
          template.$('.required:last').removeClass('hide');
        } else {
          template.$('.required:last').text('* Really, that\'s your email address?').removeClass('hide');
        }
        if (isEmail) {
          template.$('.required:last').addClass('hide');
        }
      } else {
        template.$('.required:visible, .requiredLargeParty:visible').addClass('hide');
        var message = '';
        message += 'Hello!\nAn invitee has RSVP\'d. Response below.\nName: ' + fullname
                + '\nEmail: ' + email
                + '\nAttending? ' + (attendance ? 'Yes!' : 'No :(');
        if (attendance) {
          if (largeParty.length) {
            message += '\nLarge Party requirements:\n' + largeParty.val();
          } else {
            message += '\nMeal Preference: ' + mealMain
                      + '\nNumber of Guests: ' + numberGuests
                      + '\nGuest Names: ' + formattedNames
                      + '\nMeal Preferences (in order): ' + formattedMeals;
          }
        }
        debugger;
        Meteor.call('sendEmail',
                    'ehourany@gmail.com, labungan@gmail.com',
                    email,
                    '',
                    'RSVP from ' + fullname,
                    message);

        Meteor.call('sendEmail',
                    email,
                    'automated@lovellandeugene2015.meteor.com',
                    '',
                    'Eugene & Lovell Wedding RSVP Confirmation',
                    'Hi! Thank you for submitting your response.\n\nEugene & Lovell');

        $(thankyou).toggleClass('hide');
        $('.bottom-response, .left-column, .right-column').addClass('hide');
      }      
      return false;
    }
  });

  Template.slideshow.rendered = function () {
      $('.slideshow').slick({
        dots: false,
        infinite: true,
        speed: 300,
        fade: true,
        draggable: true,
        cssEase: 'linear'
    });
  }

  Template.groomsmen.rendered = function () {
    $('.groomsmen').slick({
        dots: true,
        infinite: true,
        speed: 300,
        fade: true,
        draggable: true,
        cssEase: 'linear',
        centerMode: true,
        mobileFirst: true,
        variableWidth: false,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              centerMode: true
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              centerMode: true
            }
          }
        ]
    });
  }

  Template.bridesmaids.rendered = function () {
    $('.bridesmaids').slick({
        dots: true,
        infinite: true,
        speed: 300,
        fade: true,
        draggable: true,
        cssEase: 'linear',
        centerMode: true,
        mobileFirst: true,
        variableWidth: false,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              centerMode: true
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              centerMode: true
            }
          }
        ]
    });
  }
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    Meteor.methods({
      sendEmail: function (to, from, cc, subject, text) {
        check([to, from, cc, subject, text], [String]);

        // Let other method calls from the same client start running,
        // without waiting for the email sending to complete.
        this.unblock();

        Email.send({
          to: to,
          from: from,
          cc: cc,
          subject: subject,
          text: text
        });
      }
    });
  });
}

Router.route('/', function () {
  this.render('index');
});

Router.route('/info', function () {
  this.render('info');
});

Router.route('/aboutus', function () {
  this.render('aboutus');
});

Router.route('/weddingparty', function () {
  this.render('weddingparty');
});

Router.route('/gallery', function () {
  this.render('gallery');
});

Router.route('/registry', function () {
  this.render('registry');
});

Router.route('/lodging', function () {
  this.render('lodging');
});

Router.route('/contactus', function () {
  this.render('contactus');
});

Router.route('/rsvp', function () {
  this.render('rsvp');
});