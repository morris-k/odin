def fibs(n)
	if n == 1
		return [1]
	elsif n == [2]
		return [1, 1]
	else
		f = [1, 1]
		while f.length < n
			i = f[-1]
			j = f[-2] 
			f << i + j
		end
		f
	end
end

p fibs(10)

def fibs_rec(n)
	if n == 2
		return [1, 1]
	else
		x = fibs_rec(n-1)
		return x << (x[-1] + x[-2])
	end
end

p fibs_rec(10)