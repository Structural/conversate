require 'spec_helper'

describe Upload do
  it "directly describes a file" do
    upload_file = fixture_file_upload('/files/scream.jpeg', 'image/jpeg')
    file = Upload.new(:upload => upload_file)
    file.save
    expect(file.upload_file_name).to eq('scream.jpeg')
    expect(file.upload_content_type).to eq('image/jpeg')
    expect(file.upload_file_size).to eq(9227)
    expect(file.upload.url).to match(/s3\.amazonaws\.com.*scream\.jpeg/)
  end
end
