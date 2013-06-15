Structural.Collections.Actions = Backbone.Collection.extend({
  model: Structural.Models.Action,
  url: function() {
    return Structural.apiPrefix + '/conversations/' + this.conversationId + '/actions';
  },
  initialize: function(data, options) {
    options = options || {};
    this.conversationId = options.conversation;
    this.userId = options.user;
    this.on('reset', this._lieAboutActionsSoItLooksNiceToHumans, this);
    this.on('reset', this.calculateUnreadedness, this);
    this.on('reset', this._daisyChainUnreadCascade, this);
    this.on('add', this.setStateOnNewAction, this);

    this.startUpdate();
  },
  comparator: 'timestamp',

  _lieAboutActionsSoItLooksNiceToHumans: function() {
    this.each(function(action) {
      if (action.get('type') === 'deletion') {
        var target = this.where({id: action.get('msg_id')})[0];
        if(target) {
          target.delete(action.get('user'));
          this.remove(action);
        }
      }
      // TODO: Do something similar for moved messages.
    }, this);
  },
  _daisyChainUnreadCascade: function() {
    this.forEach(function(action, index) {
      var next = this.at(index + 1);
      if (next) {
        next.on('change:is_unread', function() {
          if (!next.get('is_unread')) {
            action.markRead();
          }
        })
      }
    }, this);
  },

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
    this._newAction({
      type: 'retitle',
      title: title,
      user: {
        name: user.get('name'),
        id: user.id
      }
    });
  },
  createUpdateUserAction: function(added, removed, user) {
    this._newAction({
      type: 'update_users',
      user: {
        name: user.get('name'),
        id: user.id
      },
      added: new Structural.Collections.Participants(added).toJSON(),
      removed: new Structural.Collections.Participants(removed).toJSON()
    });
  },
  createMessageAction: function(text, user) {
    this._newAction({
      type: 'message',
      text: text,
      user: {
        name: user.get('name'),
        id: user.id
      },
      timestamp: Date.now()
    });
  },
  createDeleteAction: function(action, user) {
    var model = new Structural.Models.Action({
      type: 'deletion',
      msg_id: action.id,
      user: {
        name: user.get('name'),
        id: user.id
      }
    });
    model.url = this.url();
    model.save();
    action.delete(user);
  },
  createMoveConversationAction: function(topic, user) {
    this._newAction({
      type: 'move_conversation',
      user: {
        name: user.get('name'),
        id: user.id
      },
      conversation_id: this.conversationId,
      to: {
        name: topic.get('name'),
        id: topic.id
      }
    });
  },

  changeConversation: function(id) {
    this.conversationId = id;
    this.fetch({reset: true});
  },
  clearConversation: function() {
    this.conversationId = undefined;
    this.reset();
  },

  calculateUnreadedness: function(participants) {
    if (participants) {
      this.cachedParticipants = participants;
    }
    else if (this.cachedParticipants) {
      participants = this.cachedParticipants;
    }
    else {
      return;
    }

    var me = participants.where({id: this.userId})[0];
    if (!me) { return; }

    var cutoff = me.get('most_recent_viewed');
    // The server loses millisecond information, so we have to move the cutoff
    // up to the nearest full second in the future.
    cutoff = cutoff + 1000;
    this.filter(function(action) {
      return action.get('timestamp') > cutoff;
    }).forEach(function(action) {
      action.markUnread();
    });
  },
  setStateOnNewAction: function(model, collection) {
    var prev = collection.at(collection.indexOf(model) - 1);
    model.on('change:is_unread', function() {
      if (!model.get('is_unread')) {
        prev.markRead();
      }
    });

    if (model.get('user').id === this.userId) {
      model.markRead();
    }
    else {
      // All new messages from other users are unread.
      model.markUnread();
    }
  },

  _newAction: function(data) {
    var model = new Structural.Models.Action(data);
    this.add(model);
    model.save();
  }
});

_.extend(Structural.Collections.Actions.prototype, Support.FetchTimer(5000));
