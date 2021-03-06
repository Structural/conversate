Structural.Views.AutocompleteInput = Support.CompositeView.extend({
  className: 'autocomplete-input',
  template: JST.template('autocomplete/input'),
  initialize: function(options) {
  },
  render: function() {
    this.$el.html(this.template());
    this._input = this.$('.input');
    return this;
  },

  clear: function() {
    if (this._input) {
      this._input.val('');
    }
  },

  events: {
    'keyup': 'input',
    'keydown': 'preventSubmit'
  },

  input: function(e) {
    if (e.which === Support.Keys.up) {
      this.trigger('up');
    } else if (e.which === Support.Keys.down) {
      this.trigger('down');
    } else if (e.which === Support.Keys.enter ||
               e.which === Support.Keys.tab) {
      this.trigger('select');
    } else {
      this.trigger('textChanged', this._input.val());
    }
  },

  text: function() {
    return this._input.val();
  },

  preventSubmit: function(e) {
    if (e.which === Support.Keys.enter) {
      e.preventDefault();
    }
  }
});
