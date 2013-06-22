class Api::V0::ConversationsController < ApplicationController
  before_filter :require_login

  # Note that this is always on a url like /topics/1/conversations.
  def index
    topic = Topic.find_by_id(params[:topic_id])
    head :status => :not_found and return unless topic
    render :json => current_user.conversations.where(:topic_id => topic.id).to_json(:user => current_user)
  end

  # Note that this is always on a url like /topics/1/conversations.
  def create
    topic = Topic.find_by_id(params[:topic_id])
    head :status => :not_found and return unless topic
    conversation = topic.conversations.create()
    if (params[:title])
      conversation.title = params[:title]
    end
    conversation.users << current_user
    if (params[:participants])
      params[:participants].each do |p|
        user = User.find(p[:id])
        conversation.users << user
      end
    end
    if (params[:actions])
      params[:actions].each do |a|
        action = conversation.actions.new(:type => a[:type],
                                          :data => Action::data_for_params(a),
                                          :user_id => current_user.id)

        # I'm ignoring deletion actions here, because why would you.  If it turns
        # up, do what Nick did in Api::V0::ActionsController::create

        conversation.handle(action)
        action.save
        conversation.update_most_recent_event
        current_user.update_most_recent_viewed conversation
      end
    end
    conversation.save
    render :json => conversation.to_json(:user => current_user), :status => 201
  end

  def show
    conversation = Conversation.find_by_id(params[:id])
    head :status => :not_found and return unless conversation
    render :json => conversation.to_json(:user => current_user)
  end

end
