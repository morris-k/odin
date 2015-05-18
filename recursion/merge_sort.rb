def merge_sort(arr)
	puts "#{arr}"
	p = 0
	r = arr.length
	if arr.length <= 1
		return arr
	else
		q = r / 2
		puts "sort left"
		left = merge_sort(arr[p..q-1])
		puts "sort left #{left}"
		puts "sort right"
		right = merge_sort(arr[q..-1])
		puts "sort right #{right}"
		res = merge(left, right)
		return res
	end
end

def merge(left, right)
	puts "merging #{left} #{right}"
	res = []
	until left.empty? || right.empty?
		if left[0] <= right[0]
			res << left.shift
		else 
			res << right.shift
		end
	end
	res + left + right
end

p "#{merge_sort([2, 5, 32, 1, 523, 44, 3])}"