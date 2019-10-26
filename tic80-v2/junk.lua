
local players = {}
local COUNT = 0 -- refers to players
local INIT_COUNT = 50
local dt = 1.0/30.0
local W = 240
local H = 136

-- used only for system mouse handling
local mouse_was_down = false

local Player = {
	create = function(x,y)
		local self = {x=x,y=y,
		radius=3,
		dx=0,dy=0,
        color=2,
        dying = false,
        mut = 0.1
    }

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
            
            if self.dying then
                self.radius = self.radius + self.mut
                if self.radius>10 then
                    self.mut = -0.1
                end
                if self.radius<1 then
                    self.radius = 0
                    self.x = -10
                    self.y = -10
                    self.dying = false
                end
            end

		end

		function self:draw()
			circ(self.x,self.y,self.radius,self.color)
			if self.dying then
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
	for i=1,INIT_COUNT do
		local player1 = Player.create(0,0)
		player1:random()
		players[i] = player1
	end
	COUNT = INIT_COUNT
end

init()

function mouse_down(mx,my)
    trace("mouse down")
end

function mouse_up(mx,my)
    trace("mouse up")
    local player1 = Player.create(mx,my)
    players[COUNT+1] = player1
    player1.dying = true
    COUNT = COUNT + 1
end

function update()
    mx,my,md = mouse()
    if not mouse_was_down and md then
        -- this is the mouse_down event
        mouse_down(mx,my)
        mouse_was_down = true
    end
    if mouse_was_down and not md then
        -- this is mouse up event
        mouse_up(mx,my)
        mouse_was_down = false
    end

    -- movement
	for i=1,COUNT do
		local p = players[i]
		p:update()
	end

    -- collison detect here
    for i=1,COUNT do
		local p = players[i]
		for j=1,COUNT do
			local other = players[j]
			if i ~= j then
                if p:hit(other) then
                    p.dying = true
                    other.dying = true
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

