
local W = 300
local H = 300
local RATE_OF_CHANGE = 10
local SIZE_MAX=12
local SIZE_DEFAULT = 3 -- smallest a ball can be

local Ball = {}
function Ball.create(x,y)
    local self = {x=x,y=y,dx=0,dy=0,
        size=SIZE_DEFAULT,
        growing=false,
        change=RATE_OF_CHANGE}
    function self:update(dt)
        -- update the ball
        self.x = self.x + self.dx * dt
        self.y = self.y + self.dy * dt

        if self.x<0 then
            self.x = 0
            self.dx = self.dx * -1
        end
        if self.x > W then
            self.x = W
            self.dx = self.dx * -1
        end
        if self.y<0 then
            self.y = 0
            self.dy = self.dy * -1
        end
        if self.y > H then
            self.y = H
            self.dy = self.dy * -1
        end


        -- if you are growing change size
        if self.growing then
            self.size = self.size + (self.change*dt)
            if self.size>SIZE_MAX then
                self.change = -RATE_OF_CHANGE
            end
            -- smallest we can be
            if self.size<SIZE_DEFAULT then
                self.growing = false
                self.size = SIZE_DEFAULT
            end
        end
    end
    function self:draw()
        love.graphics.circle("fill",self.x,self.y,self.size)
    end
    return self
end

local COUNT = 10
local balls = {}

function love.mousereleased(x,y,button)
    local b = Ball.create(x,y)
    b.dx = math.random(50)
    b.dy = math.random(50)
    b.growing = true
    balls[COUNT+1] = b
    COUNT = COUNT + 1
end

function love.update(dt)
    for i=1,COUNT do
        local b = balls[i]
        if b ~= nil then
            b:update(dt)
        end
    end
end

function love.draw()
    for i=1,COUNT do
        balls[i]:draw()
    end
end

function love.load()
    for i=1,COUNT do
        balls[i] = Ball.create(math.random(100),math.random(100))
        balls[i].dx = math.random(-50,50)
        balls[i].dy = math.random(-50,50)
    end
end

