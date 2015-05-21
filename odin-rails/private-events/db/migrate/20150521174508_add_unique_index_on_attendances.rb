class AddUniqueIndexOnAttendances < ActiveRecord::Migration
  def change
  	add_index :attendances, [:attendee_id, :attended_event_id], unique: true
  end
end
