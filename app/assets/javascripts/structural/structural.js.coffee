#= require_self
#= require ./http/http
#= require ./api/api
#= require ./data/data
#= require ./actions/actions
#= require ./stores/stores
#= require ./side_effects/side_effects
#= require ./components/components
#
#= require_tree .

# We need exactly one top-level object so that tests and whatever
# can get access to our stuff.  Any other assignment to window. is
# probably an error.
window.Structural = {}

Structural.startApp = ->
  React.renderComponent(Structural.Components.App(), document.body)
  Structural.Actions.StartApp()