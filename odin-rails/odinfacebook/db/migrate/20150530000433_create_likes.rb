class CreateLikes < ActiveRecord::Migration
  def change
    create_table :likes do |t|
      t.references :subject, polymorphic: true
      t.integer :user_id

      t.timestamps null: false
    end
    add_index :likes, :subject_id
    add_index :likes, [:subject_id, :subject_type, :user_id], unique: true
  end
end
