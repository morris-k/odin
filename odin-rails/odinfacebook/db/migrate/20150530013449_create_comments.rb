class CreateComments < ActiveRecord::Migration
  def change
    create_table :comments do |t|
      t.references :subject, polymorphic: true
      t.integer :user_id
      t.text :body

      t.timestamps null: false
    end
    add_index :comments, :subject_id
  end
end
