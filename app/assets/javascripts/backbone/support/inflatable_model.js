Support.InflatableModel = function(attributes, options) {
  Backbone.Model.apply(this, [attributes, options]);
}

_.extend(Support.InflatableModel.prototype, Backbone.Model.prototype, {

});

Support.InflatableModel.extend = Backbone.Model.extend;
