

local players = {}
local COUNT = 0
local dt = 1.0/30.0
local W = 240
local H = 136

local Player = {
	create = function(x,y)
		local self = {x=x,y=y,
		radius=3,
		dx=0,dy=0,
		color=2,
		animate = false}

		function self:update()
			self.x = self.x + self.dx*dt
			self.y = self.y + self.dy*dt

			if self.x<0 then
				self.x = 0
				self.dx = self.dx * -1
			end
			if self.x>W then
				self.x = W
				self.dx = self.dx * -1
			end
			if self.y<0 then
				self.y = 0
				self.dy = self.dy * -1
			end
			if self.y>H then
				self.y = H
				self.dy = self.dy * -1
			end
			
		end

		function self:draw()
			circ(self.x,self.y,self.radius,self.color)
			if self.animate then
				circ(self.x,self.y,2,15)
			end
		end

		function self:repr()
			return tostring(self.x) .. " " .. tostring(self.y)
		end

		function self:distTo(other)
			local dx = self.x - other.x
			local dy = self.y - other.y
			return math.sqrt(dx*dx + dy*dy)
		end

		function self:hit(other)
			if self:distTo(other) <= self.radius+other.radius then
				return true
			else
				return false
			end
		end

		function self:random()
			self.x = math.random(1,W)
			self.y = math.random(1,H)
			self:random_speed()
		end

		function self:random_speed()
			self.dx = math.random(-30,30)
			self.dy = math.random(-30,30)
		end

		return self
	end
}

function init()
	for i=1,10 do
		local player1 = Player.create(0,0)
		player1:random()
		players[i] = player1
	end
	COUNT = 10
end

init()

function update()
	for i=1,COUNT do
		local p = players[i]
		p:update()
		p.animate = false
	end
	for i=1,COUNT do
		local p = players[i]
		for j=1,COUNT do
			local other = players[j]
			if i ~= j then
				if p:hit(other) then
					p.animate = true
				end
			end
		end
	end
end

function draw()
	for i=1,COUNT do
		local p = players[i]
		p:draw()
	end
end

function TIC()
	cls(0)
	update()
	draw()
end

