Structural.Models.Conversation = Backbone.Model.extend({
  initialize: function(attributes, options) {
    var self = this;
    this.inflateExtend(this.attributes);

    this.actions = new Structural.Collections.Actions([], {
      conversation: this,
      user:Structural._user.id
    });
    this.actions.on('add', function() {
      self.trigger('updated', self);
    })
    this.on('change:unread_count', function() {
      self.trigger('updated', self);
    });
    this.on('change:archived', function() {
      self.trigger('archived', self);
    });

    // We want to update our most recent viewed right away if we've been clicked.
    // TODO: Should almost certainly punt this to a controller.
    Structural.on('readConversation', function(conversation) {
      if (conversation === self) {
        // This has the side effect that we'll also redraw for free.
        self.updateMostRecentViewedToNow();
      }
    });

  },
  parse: function (response, options) {
    return this.inflateReturn(response);
  },

  inflateAttributes: function(attrs) {
    if (attrs.participants) {
      attrs.participants = this.inflate(Structural.Collections.Participants,
                                        attrs.participants,
                                        { conversation: attrs.id });
    }
    return attrs;
  },

  focus: function() {
    this.set('is_current', true);
    this.actions.viewActions();
  },
  unfocus: function() {
    this.set('is_current', false);
  },

  changeTitle: function(title) {
    this.set('title', title);
  },

  unreadCount: function() {
    var countByActions = this.actions.unreadCount(this.get('most_recent_viewed'));
    var countByConversation = this.get('unread_count');
    return countByConversation > countByActions ? countByConversation : countByActions;
  },

  // Sets our local values immediately and lets the server side participants collection know
  // for persistence. TODO: Most recent viewed is funky enough that it will probably require
  // a refactor at some point.
  updateMostRecentViewedTo: function(time) {
    var self = this;

    // We want to basically reset our server-side information.
    self.set('most_recent_viewed', time);
    var unreadActions = self.actions.filter(function(act) {
      return act.get('timestamp') > time;
    });
    self.set('unread_count', unreadActions.length);

    self.actions.filter(function(action) {
      return action.get('timestamp') <= time &&
             action.get('is_unread');
    }).forEach(function(action) {
      action.markRead();
    });

    self.withCurrentUserFromSelf(function(participant) {
      // The server-side function has a side effect in that it will update most recent viewed
      // for this conversation and user, which will be close enough to the time we want.
      participant.save({
        most_recent_viewed: self.get('most_recent_viewed')
      });
    });
    self.trigger('updated', self);
  },
  updateMostRecentViewedToNow: function() {
    this.updateMostRecentViewedTo((new Date()).valueOf());
  },
  updateFolderIds: function(added, removed) {
    var self = this;
    added.forEach(function(folder) {
      self.get('folder_ids').push(folder.id);
    });
    removed.forEach(function(folder) {
      self.set('folder_ids', _.without(self.get('folder_ids'), folder.id));
    });
  },
  toggleArchive: function() {
    // Note that we don't need to trigger an archive event because the model is watching its own state.
    var self = this;
    self.set('archived', ! self.get('archived'));
    self.withCurrentUserFromSelf(function(participant) {
      participant.save({
        archived: self.get('archived')
      });
    });
  },
  withCurrentUserFromSelf: function(callback) {
    this.get('participants').each( function(participant) {
      if (Structural._user.id === participant.id) {
        callback(participant);
      }
    });
  }
});

_.extend(Structural.Models.Conversation.prototype,
         Support.HumanizedTimestamp('most_recent_event'));
_.extend(Structural.Models.Conversation.prototype, Support.InflatableModel);
