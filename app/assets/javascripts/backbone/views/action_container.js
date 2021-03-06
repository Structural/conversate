Structural.Views.ActionContainer = Support.CompositeView.extend({
  className: function() {
    var classes = 'ui-section act-container';

    if (!this.participants ||
               !_(this.participants.map(function(p) { return p.id; })).contains(this.user.id)) {
      classes += ' not-participating-in';
    }

    if (this.$el && this.$el.hasClass('visible')){
      classes += ' visible'
    }

    if (!this.conversation || !this.conversation.id) {
      classes += ' no-conversation';
    }

    return classes;
  },
  initialize: function(options) {
    options = options || {};
    this.conversation = options.conversation;
    this.participants = options.participants;
    this.actions = options.actions;
    this.user = options.user;
    this.folders = options.folders;

    this.titleView = new Structural.Views.TitleEditor({
      conversation: this.conversation,
      folders: this.folders
    });
    this.participantsView = new Structural.Views.Participants({
      participants: this.participants,
      userId: this.user.id
    });
    this.actionsView = new Structural.Views.Actions({collection: this.actions});
    this.composeView = new Structural.Views.Compose({conversation: this.conversation});
    this.detailsView = new Structural.Views.ActionDetails();

    this.participants.on('reset', this.reClass, this);
    this.conversation.actions.on('showDetails', this.detailsView.show, this.detailsView);
    this.titleView.on('change_title', Structural.createRetitleAction, Structural);
    this.participantsView.on('update_users', Structural.createUpdateUserAction, Structural);

    this.listenTo(Structural, 'changeConversation', this.changeConversation, this);
    this.listenTo(Structural, 'clearConversation', this.clearConversation, this);
  },
  render: function() {
    this.appendChild(this.detailsView);
    this.appendChild(this.titleView);
    this.appendChild(this.participantsView);
    this.appendChild(this.actionsView);
    this.appendChild(this.composeView);

    // The first time backbone calls className we don't have some data?
    this.reClass();

    return this;
  },

  // TODO: Seems a little funky that we're holding onto so much information about our
  // current coversation, but c'est la vie.
  changeConversation: function(conversation) {
    this.conversation = conversation;
    this.participants = conversation.get("participants");
    this.reClass();

    this.conversation.actions.on('showDetails', this.detailsView.show, this.detailsView);
  },
  clearConversation: function() {
    if (this.participants) {
      this.participants.off(null, null, this);
      this.participants = undefined;
    }
    this.conversation = undefined;
    this.reClass();
  },
  scrollToBottom: function() {
    this.actionsView.scrollToBottom();
  },
  isAtBottom: function() {
    return this.actionsView.isAtBottom();
  },

  reClass: function() {
    this.el.className = this.className();
  },
  show: function(show){
    if (show) {
      this.$el.addClass('visible');
    } else {
      this.$el.removeClass('visible');
    }
  }
});
