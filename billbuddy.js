Router.route('/', function () {
  this.render('hello')
});

Router.route('/list', function () {
  this.render('list')
});

rent = new Mongo.Collection("adjrent"); // Adjusted Rent

bills = new Mongo.Collection("bills"); // Cable + Electric Bill

listed = new Mongo.Collection("listed"); // List Items


//rent.insert({nar:525,jar:525});
//bills.insert({cable:"TBD", electric:"TBD"});
// listed.insert({who:"John", item:"Towels", cost:8.99});

if (Meteor.isClient) {
  // counter starts at 0
  // Session.setDefault('counter', 0);
  
  // Make sure session username is created!
  // READD var name = Session.get("name");
  // READD if (name == null) { Router.go('/'); }


  Template.list.helpers({
    'name' : function() { return Session.get("name") },
    'nar' : function() { var nateRent = rent.findOne({}, { fields: { nar: 1 }}); return nateRent.nar; } ,
    'jar' : function() { var johnRent = rent.findOne({}, { fields: { jar: 1 }}); return johnRent.jar; },
    'cable' : function() { var cable = bills.findOne({}, { fields: { cable: 1 }}); return cable.cable; },
    'electric' : function() { var electric = bills.findOne({}, { fields: { electric: 1 }}); return electric.electric; },
    'listed': function() { return listed.find({}); },
    'isJohn' : function() { 
                          if (Session.get("name") == "John") { var verifyJohn = true; } else { var verifyJohn = false; }
                          return verifyJohn;
                          },
  
  });


  Template.list.events({
    'submit .admin-cable-electric' : function(event) {
      // T5seuMzrnprbS3HT4
      var c = Math.round(event.target.cable.value);
      var e = Math.round(event.target.electric.value);

      if ( c == null || c == "" || e == null || e == "" ) { alert("Please enter both cable and electric."); }
      bills.update("8yRzy45kdFZGCcdBC", { cable: c, electric: e });

      var theRent = rent.findOne({}, { fields: { nar:1,jar:1 }});
      var adjCable = Math.round(c / 3);
      var adjElect = Math.round(e /3);

      rent.update("WpaJvnS4NAMoA4n3R", { nar: theRent.nar + adjCable, jar: theRent.jar - Math.round(adjCable * 2) });
      rent.update("WpaJvnS4NAMoA4n3R", { nar: theRent.nar + adjElect, jar: theRent.jar - Math.round(adjElect * 2) });

      event.target.cable.value = "";
      event.target.electric.value = "";
                                         

      return false;
    },
    
    'click #reset' : function() {
      var confirmIt = confirm("Are you sure?");
        if(confirmIt == true) {
        rent.update("WpaJvnS4NAMoA4n3R", { nar: 525, jar: 525 });
        bills.update("8yRzy45kdFZGCcdBC", { cable: "TBD", electric: "TBD" });
        var items = listed.find({}).forEach(function(things) { listed.remove(things._id) });
        }
        else { return false;}
    },

    'submit .add-item' : function(event) {

                                          var item = event.target.item.value;
                                          var cost = Math.round(event.target.cost.value);
                                          var user = Session.get("name");

                                          if(user==null) { Router.go('/'); return false; }

                                          // Validation:
                                          if (item == null || item == "" || cost == null || cost == "" || isNaN(cost) == true ){
                                            alert("Please enter both an item and the cost.");
                                            return false;
                                          }
                                          // End Validation

                                          listed.insert({
                                            who: user,
                                            item: item,
                                            cost: cost
                                          });

                                          if(user=="Ryan") {
                                            var divCost = Math.round(cost / 3);

                                            var theRent = rent.findOne({}, { fields: { nar:1,jar:1 }});

                                            rent.update("WpaJvnS4NAMoA4n3R", { nar: theRent.nar + divCost, jar: theRent.jar + divCost });
                                          }

                                          if(user=="Nate") {
                                            var divCost = Math.round(cost / 3);

                                            var theRent = rent.findOne({}, { fields: { nar:1,jar:1 }});

                                            rent.update("WpaJvnS4NAMoA4n3R", { nar: theRent.nar - divCost, jar: theRent.jar + divCost });
                                          }

                                          if(user=="John") {
                                            var divCost = Math.round(cost / 3);

                                            var theRent = rent.findOne({}, { fields: { nar:1,jar:1 }});

                                            rent.update("WpaJvnS4NAMoA4n3R", { nar: theRent.nar + divCost, jar: theRent.jar - divCost });
                                          }

                                          // Clear form
                                          event.target.item.value = "";
                                          event.target.cost.value = "";

                                          // Prevent default form submit
                                          return false;

                                        }, // end 'submit .add-item'

  });

  Template.hello.events({
    'click #ryan': function(){ Session.set("name", "Ryan"); Router.go('/list'); }, // end click event
    'click #nate': function(){ Session.set("name", "Nate"); Router.go('/list'); }, // end click event
    'click #john': function(){ 
      Session.set("name", "John");
      Router.go('/list');
      }, // end click event

  });

} // end Meteor.isClient

/*if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}*/
