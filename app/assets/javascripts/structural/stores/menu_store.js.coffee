Menu = new Hippodrome.Store
  displayName: 'Menu Store'
  initialize: ->
    @_open = false
    @_content = undefined
    @_node = undefined

  dispatches: [{
    action: Structural.Actions.OpenMenu
    callback: 'openMenu'
  }, {
    action: Structural.Actions.CloseMenu
    callback: 'closeMenu'
  }]

  openMenu: (payload) ->
    @_open = true
    @_content = payload.content
    @_node = payload.node
    @trigger()
  closeMenu: (payload) ->
    @_open = false
    @_content = undefined
    @_node = undefined
    @trigger()

  public:
    open: () -> @_open
    content: () -> @_content
    direction: () ->
      if not @_node
        return undefined

      rect = @_node.getBoundingClientRect()
      centerX = rect.left + (rect.width / 2)
      centerY = rect.top + (rect.height / 2)
      viewportWidth = window.innerWidth
      viewportHeight = window.innerHeight

      moreSpaceLeft = centerX > (viewportWidth / 2)
      moreSpaceUp = centerY > (viewportHeight / 2)

      if moreSpaceLeft and moreSpaceUp
        'left-up'
      else if moreSpaceLeft
        'left-down'
      else if moreSpaceUp
        'right-up'
      else
        'right-down'
    position: () ->
      viewportWidth = window.innerWidth
      viewportHeight = window.innerHeight
      rect = @_node.getBoundingClientRect()
      dir = @direction()

      if dir == 'left-up'
        {right: (viewportWidth - rect.right), bottom: (viewportHeight - rect.top)}
      else if dir == 'left-down'
        {right: (viewportWidth - rect.right), top: rect.bottom}
      else if dir == 'right-up'
        {left: rect.left, bottom: (viewportHeight - rect.top)}
      else
        {left: rect.left, top: rect.bottom}

Structural.Stores.Menu = Menu
