{div} = React.DOM

MessagesList = React.createClass
  displayName: 'Messages List'

  getDefaultProps: -> messages: []

  render: ->
    messages = _.map(@props.messages, (message) =>
      Structural.Components.Message(
        message: message,
        currentUser: @props.currentUser
        conversation: @props.conversation
        key: message.id
      )
    )

    div className: 'messages-list',
      messages


Structural.Components.MessagesList = MessagesList
