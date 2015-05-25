class CreateFlights < ActiveRecord::Migration
  def change
    create_table :flights do |t|
      t.integer :to_id
      t.integer :from_id
      t.datetime :start_time
      t.integer :duration

      t.timestamps null: false
    end
  end
end
