ConversateApp.Views.MessagesIndex = Backbone.View.extend({
  render: function () {
    var self = this;
    self.collection.each(function (message) {
      self.$el.append(JST['backbone/templates/messages/index']({ message: message,
                                                                  helpers: self.helpers }))
    });

    return self;
  },
  initialize: function () {
        _.bindAll(this, 'render', 'add');

        this.collection.bind('add', this.add);
  },
  add: function (message) {

    var scrollable = $('#thread');
    var autoscroll = this.autoscroll(scrollable);

    this.$el.append(JST['backbone/templates/messages/index']({ message: message,
                                                                helpers: this.helpers }))

    // For unknown reasons, this.$el's scrollTop is broken.
    if (autoscroll) {
      scrollable.scrollTop(scrollable[0].scrollHeight);
    }
  },
  autoscroll: function (scrollable) {

    // There's a consistent difference between scrollHeight
    // and scrollTop + height that we need to account for.
    var scrollOffset = scrollable[0].scrollHeight - (scrollable.scrollTop() + scrollable.height());

    return ((scrollable.scrollTop() + scrollable.height() + scrollOffset)
                        == scrollable[0].scrollHeight);
  },
  helpers: {
    name: function (name) {
      return name.full_name || name.email;
    },
    names: function (names) {
      return _.map(names, function(name) {
        return name.full_name || name.email;
      }).join(', ');
    }
  }
});
