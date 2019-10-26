

local players = {}
local COUNT = 0 -- refers to players
local INIT_COUNT = 100
local dt = 1.0/30.0
local W = 240
local H = 136

local Player = require("player")

function init()
	for i=1,INIT_COUNT do
		local player1 = Player.create(0,0)
		player1:random()
		players[i] = player1
	end
	COUNT = INIT_COUNT
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

