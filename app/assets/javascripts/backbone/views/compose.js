Structural.Views.Compose = Support.CompositeView.extend({
  className: 'act-compose',
  template: JST.template('actions/compose'),
  initialize: function(options) {
    options = options || {};
    this.conversation = options.conversation;

    this.listenTo(Structural, 'changeConversation', this.changeConversation, this);
  },
  render: function() {
    this.$el.html(this.template({conversation: this.conversation}));

    this._short = this.$('.short-form-compose');
    this._long = this.$('.long-form-compose');
    this._fileUpload = new Structural.Views.FileUpload();
    this.appendChildTo(this._fileUpload, this.$('.enable-long-form-group'));

    return this;
  },
  events: {
    'click .act-short-form-send': 'newMessageAction',
    'click .send-long-form': 'newMessageAction',
    'click a.enable-long-form': 'enableLongForm',
    'click a.disable-long-form': 'disableLongForm',
    'keydown .short-form-textarea': 'shortFormType',
    'focus .short-form-compose': 'shortFormFocus'
  },
  newMessageAction: function(e) {
    if (e) { e.preventDefault(); }
    var input = this._long.hasClass('hidden') ? this._short : this._long;
    var text = input.find('.msg-textarea').val();

    if (text.length > 0) {
      Structural.createMessageAction(input.find('.msg-textarea').val());
    }

    this.disableLongForm();
    $(this._short, this._long).find('.msg-textarea').val('');

    // The user has actually taken an action which we consider to be a viewing update.
    Structural.trigger('readConversation', Structural._conversation);
    this.conversation.updateMostRecentViewedToNow();
  },
  enableLongForm: function(e) {
    if (e) { e.preventDefault(); }
    this._long.find('.msg-textarea').val(this._short.find('.msg-textarea').val());
    this._long.removeClass('hidden');
  },
  disableLongForm: function(e) {
    if (e) { e.preventDefault(); }
    this._short.find('.msg-textarea').val(this._long.find('.msg-textarea').val());
    this._long.addClass('hidden');
  },
  shortFormType: function(e) {
    if (e.which === Support.Keys.enter) {
      this.newMessageAction(e);
    }
  },
  changeConversation: function(conversation) {
    this.conversation = conversation;
    this.$el.empty();
    this.render();
  }
});
