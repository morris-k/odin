require_relative 'node.rb'

class Tree

	attr_accessor :root

	def initialize(arr, root = arr[0])
		if !arr.index(root)
			root = arr.shift
		else 
			arr.delete_at(arr.find_index(root))
		end
		@root = Node.new(root)
		build_tree(arr)
	end

	def build_tree(arr)
		arr.each { |n| add_node(@root, Node.new(n))}
	end

	def add_node(current_node, next_node)
		if next_node.value < current_node.value
			if current_node.left_child.nil?
				next_node.parent = current_node
				current_node.left_child = next_node
			else
				add_node(current_node.left_child, next_node)
			end
		else
			if current_node.right_child.nil?
				next_node.parent = current_node
				current_node.right_child = next_node
			else
				add_node(current_node.right_child, next_node)
			end
		end
	end

	def show_all(current = @root)
		show(current)
		show_all(current.left_child) unless current.left_child.nil?
		show_all(current.right_child) unless current.right_child.nil?
	end

	def show(node)
		puts "Value: #{node.value}"
		if node.parent
			puts "   parent: #{node.parent.value}"
		end
		if node.left_child
			puts "   left: #{node.left_child.value}"
		end
		if node.right_child
			puts "   right: #{node.right_child.value} "
		end
	end

	def breadth_first_search(target)
		queue = [@root]
		until queue.length == 0
			current = queue.shift
			return current.to_s if current.value == target
			queue << current.left_child unless current.left_child.nil?
			queue << current.right_child unless current.right_child.nil?
		end
		nil
	end

	def depth_first_search(target)
		stack = [@root]
		until stack.length == 0
			current = stack.shift
			return current.to_s if current.value == target
			stack.unshift current.left_child unless current.left_child.nil?
			stack.unshift current.right_child unless current.right_child.nil?
		end
	end

	def dfs_rec(current, target)
		return nil if current.nil?
		return current.to_s if current.value == target
		dfs_rec(current.left_child, target) unless current.left_child.nil?
		dfs_rec(current.right_child, target) unless current.right_child.nil?
	end

end

def rand_arr(length, max)
	arr = []
	length.times do 
		rand = rand(max)
		while arr.include? rand
			rand = rand(max)
		end
		arr << rand
	end
	arr
end

def timer
	t1 = Time.now
	yield
	t2 = Time.now
	puts (t2 - t1)*10000
end

def time_searches(tree, vals)
	vals.each do |val|
		puts val
		timer { tree.breadth_first_search(val) }
		timer { tree.depth_first_search(val) }
		timer { tree.dfs_rec(tree.root, val) }
		puts
	end
end
# arr = [19, 98, 196, 118, 55, 88, 158, 81, 170, 151, 106, 62, 117, 70, 159, 183, 123, 43, 182, 11, 116, 105, 2, 137, 47, 122, 48, 3, 96, 145, 22, 102, 72, 165, 73, 180, 133, 61, 144, 7, 14, 37, 18, 89, 150, 69, 127, 112, 16, 82]
# tree = Tree.new(arr)
# puts arr.length

# time_searches(tree, [arr[0], arr[24], arr[48], arr[60]])

