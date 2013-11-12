Structural.Views.ConversationsSection = Support.CompositeView.extend({
  className: 'cnv-section',
  initialize: function(options) {
    options = options || {};
    this.name = options.name;
    this.collection = options.collection;
  },
  template: JST['backbone/templates/conversations/conversations-section'],
  render: function() {
    if (this.collection.length > 0) {
      this.$el.html(this.template({name: this.name}));
      this.renderConversations(this.collection);
    }
    return this;
  },
  events: {
    'click .cnv-divider': 'toggleCollapsed',
    'click .cnv-note': 'toggleCollapsed'
  },
  renderConversation: function(conversation) {
    var view = new Structural.Views.Conversation({
      model: conversation,
      user: this.user
    });
    this.appendChild(view);
  },
  toggleCollapsed: function(e){
    $(e.target).closest('.cnv-section').toggleClass('is-collapsed')
  },
  renderConversations: function(conversations) {
    var self = this;
    conversations.forEach(function(conversation) {
      self.renderConversation(conversation);
    });
  }
});