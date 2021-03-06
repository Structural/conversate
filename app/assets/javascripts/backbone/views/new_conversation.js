Structural.Views.NewConversation = Support.CompositeView.extend({
  className: 'new-cnv-compose',
  template: JST.template('conversations/new'),
  initialize: function(options) {
    options = options || {};
    this.participants = new Structural.Collections.Participants([]);

    this.listenTo(Structural, 'clickAnywhere', this.leaveParticipantEditingModeOnClickOff, this);
  },
  render: function() {
    this.autocomplete = new Structural.Views.Autocomplete({
      dictionary: Structural._user.addressBook(),
      blacklist: this.participants.clone(),
      addSelectionToBlacklist: true,
      property: 'name'
    });
    this.removableList = new Structural.Views.RemovableParticipantList({
      collection: this.participants.clone(),
      addAtEnd: true
    });

    this.autocomplete.on('select', this.removableList.add, this.removableList);
    this.removableList.on('remove', this.autocomplete.removeFromBlacklist, this.autocomplete);
    this.listenTo(Structural._user, 'addressBookUpdated', this._updateAddressBook);

    this.$el.html(this.template());
    this.appendChildTo(this.removableList, this.$('.new-cnv-participants'));
    this.appendChildTo(this.autocomplete, this.$('.new-cnv-participants'));

    return this;
  },
  events: {
    'click .disable-new-cnv': 'cancel',
    'click .send-new-cnv': 'send',
    'click .new-cnv-participants': 'focusParticipantsInput',
    'focus .new-cnv-participants input': 'enterParticipantEditingMode',
    'focus .new-cnv-body': 'leaveParticipantEditingModeOnTab',
    'focus .new-cnv-title-toolbar input': 'enterTitleEditingMode',
    'blur .new-cnv-title-toolbar input': 'leaveTitleEditingMode'
  },

  cancel: function(e) {
    e.preventDefault();
    this.leave();
  },
  send: function(e) {
    e.preventDefault();

    var title = this.$('.new-cnv-title-input').val();
    if (title.length === 0) {
      title = 'New Conversation';
    }
    var participants = this.removableList.participants();
    var firstMessage = this.$('.new-cnv-body').val();

    Structural.createNewConversation(title, participants, firstMessage);
    this.leave();
  },

  focusParticipantsInput:function(e) {
    this.$('.new-cnv-participants input').focus();
  },
  enterParticipantEditingMode: function(e) {
    this.$('.new-cnv-participants').addClass('editing');
    this.$('.autocomplete input').attr('placeholder', 'Add people...');
  },
  leaveParticipantEditingMode: function(e) {
    this.autocomplete.cancel();
    this.$('.new-cnv-participants').removeClass('editing');
    if (this.$('.removable-participant').length === 0) {
      this.$('.autocomplete input').attr('placeholder', 'Add people...');
    } else {
      this.$('.autocomplete input').attr('placeholder', '');
    }
  },
  enterTitleEditingMode: function(e) {
    this.leaveParticipantEditingMode();
    this.$('.new-cnv-title-toolbar').addClass('editing');
  },
  leaveTitleEditingMode: function(e) {
    this.$('.new-cnv-title-toolbar').removeClass('editing');
  },

  leaveParticipantEditingModeOnClickOff: function(e) {
    if (this.$('.new-cnv-participants').hasClass('editing')) {
      var target = $(e.target);
      if (target.closest('.new-cnv-participants').length === 0 &&
          target.closest('body').length > 0) {
        this.leaveParticipantEditingMode();
      }
    }
  },
  /* This will stop working how we want if we rearrange or add elements
     to the tab order in this view.  Unfortunately, the other way I had
     of checking for tabbing out (looking at the e.relatedTarget property
     of the blur event) isn't cross-browser. */
  leaveParticipantEditingModeOnTab: function(e) {
    this.leaveParticipantEditingMode();
  },
  _updateAddressBook: function(){
    this.autocomplete.replaceDictionary(Structural._user.addressBook());
  }
});
