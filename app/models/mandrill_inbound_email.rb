class MandrillInboundEmail
  CNV_REGEX = /(.*)@(.*)\.watercoolr\.io/

  attr_reader :sender, :action, :conversation, :subdomain, :domain, :recipient, :folder

  def initialize(data)
    @data = data
    @sender = User.find_by_email(@data['from_email']) unless @user
    reply_text = EmailReplyParser.parse_reply(@data['text'])
    @action = Action.new(
      type: 'email_message',
      data: { text: reply_text,
              full_text: @data['text'] }.to_json,
      user_id: @sender.id
    )
    CNV_REGEX =~ @data['email']
    @recipient = $1
    @subdomain = $2

    case @recipient
      when /cnv-(\d+)/
        @conversation = Conversation.find($1)
      when /fol-(\d+)/
        @folder = Folder.find($1)
        @subject = @data['subject']
    end
  end

  def to_conversation?
    !@conversation.nil?
  end

  def dispatch
    if !@conversation.nil?
      self.dispatch_to_conversation
    elsif !folder.nil?
      self.dispatch_to_folder
    end
  end
  def dispatch_to_conversation
    self.action.save
    self.conversation.actions << self.action
    conversation.update_most_recent_event
    @sender.update_most_recent_viewed conversation
    self.conversation.handle action
  end

  def dispatch_to_folder
    @conversation =  @folder.conversations.create()
    conversation.set_title @subject, @sender
    conversation.add_participants [@sender], @sender
    conversation.reload
    self.dispatch_to_conversation
  end
end
