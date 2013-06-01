Structural.Views.AutocompleteOptions = Support.CompositeView.extend({
  tagName: 'ul',
  className: 'token-options',
  template: JST['backbone/templates/participants/options'],
  initialize: function(options) {
    options = options || {};
    this.matches = [];
    this.targetIndex = 0;
  },
  render: function() {
    this.$el.empty();
    this.$el.html(this.template({users: this.matches}));
    if (this.matches.length === 0) {
      this.$el.addClass('hidden');
    }
    else {
      this.$el.removeClass('hidden');
    }
    this._changeTargetIndex(this.targetIndex);
  },
  events: {
    'hover .token-option': 'focusAutocompleteTarget',
    'click .token-option': 'selectOption'
  },

  focusAutocompleteTarget: function(e) {
    var index = this._getIndexFromEvent(e);
    this._changeTargetIndex(index);
  },
  moveAutocompleteTarget: function(direction) {
    var index = Math.min(this.matches.length - 1,
                  Math.max(0, this.targetIndex + (direction === 'up' ? -1 : 1)));
    this._changeTargetIndex(index);
  },
  changeAutocompleteOptions: function(pattern) {
    if (pattern === '') {
      this.matches = [];
    } else {
      var regex = new RegExp(pattern, 'gi');
      this.matches = this.collection.filter(function(u) {
        return regex.test(u.get('name'));
      });
    }
    this.targetIndex = 0;
    this.render();
  },
  currentOption: function() {
    return this.matches[this.targetIndex];
  },
  clear: function() {
    this.matches = [];
    this.targetIndex = 0;
    this.render();
  },
  selectOption: function(e) {
    this.trigger('selectAutocompleteTarget');
  },

  _getIndexFromEvent: function(e) {
    // This is dumb, but I don't see a better way in the JQuery API.
    var index = 0;
    var prev = $(e.target).prev();
    while(prev.length !== 0) {
      index += 1;
      prev = prev.prev();
    }
    return index;
  },
  _changeTargetIndex: function(newIndex) {
    $(this.$('.token-option')[this.targetIndex]).removeClass('target');
    this.targetIndex = newIndex;
    $(this.$('.token-option')[this.targetIndex]).addClass('target');
  }
});