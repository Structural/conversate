Structural.Collections.Actions = Backbone.Collection.extend({
  model: Structural.Models.Action,
  url: function() {
    return Structural.apiPrefix + '/conversations/' + this.conversationId + '/actions';
  },
  initialize: function(data, options) {
    options = options || {};
    this.conversationId = options.conversation;
  },
  comparator: 'timestamp',

  focus: function(id) {
    // findWhere is coming in backbone 1.0.0.
    var action = this.where({id: id}).pop();
    if(action) {
      action.focus();
    }

    this.filter(function(act) { return act.id != id; }).forEach(function(act) {
      act.unfocus();
    });
  },

  createRetitleAction: function(title, user) {
    var model = new Structural.Models.Action({
      type: 'retitle',
      title: title,
      user: {
        name: user.get('name'),
        id: user.id
      }
    });
    this.add(model);
    model.save();
  },
  createUpdateUserAction: function(added, removed, user) {
    console.log('added', added);
    console.log('removed', removed);
    var model = new Structural.Models.Action({
      type: 'update_users',
      user: {
        name: user.get('name'),
        id: user.id
      },
      added: new Structural.Collections.Participants(added).toJSON(),
      removed: new Structural.Collections.Participants(removed).toJSON()
    });
    console.log(model);
    this.add(model);
    model.save();
  }
});
