slugify = (s) ->
  encodeURIComponent(s.toLowerCase()
                      .replace(/[ _]/g, '-')
                      .replace(/[^A-Za-z0-9-]/g, ''))

UrlFactory = {
  folder: (folder) ->
    "/folder/#{slugify(folder.name)}/#{folder.id}"
  conversation: (conversation) ->
    "/conversation/#{slugify(conversation.title)}/#{conversation.id}"

  Api: {
    _apiUrl: (suffix) -> "/api/v0#{suffix}"
    folderConversations: (folder) ->
      UrlFactory.Api._apiUrl("/folders/#{folder.id}/conversations")
    conversationMessages: (conversation) ->
      UrlFactory.Api._apiUrl("/conversations/#{conversation.id}/actions")
    conversationParticipants: (conversation, user) ->
      UrlFactory.Api._apiUrl("/conversations/#{conversation.id}/participants/#{user.id}")
  }
}

Structural.UrlFactory = UrlFactory