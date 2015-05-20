class ChangeDigestToTokenForUsers < ActiveRecord::Migration
  def change
  	rename_column :users, :remember_digest, :remember_token
  end
end
