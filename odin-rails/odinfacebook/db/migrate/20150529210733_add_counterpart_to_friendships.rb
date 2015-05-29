class AddCounterpartToFriendships < ActiveRecord::Migration
  def change
    add_column :friendships, :counterpart_id, :integer
  end
end
