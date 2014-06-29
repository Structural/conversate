class Api::V0::ContactListsController < ApplicationController
  before_filter :require_login_api

  # Note that this is always on a url like /folders/1/conversations.
  def index
    render :status => :error
  end

  # Note that this is always on a url like /folders/1/conversations.
  def create
    render :status => :error
  end

  def update
    @contact_list = ContactList.find(params[:id])
    if(params[:contact_list][:name])
      @contact_list.name = params[:contact_list][:name]
    end
    if @contact_list.save
      render :json => @contact_list
    else
      binding.pry
      render :json => @contact_list.errors, :status => :error
    end
  end

  def show
    render :status => :error
  end

end
