
local W = 300
local H = 300

local Ball = {}
function Ball.create(x,y)
    local self = {x=x,y=y,dx=0,dy=0,size=3,growing=false,change=1}
    function self:update(dt)
        self.x = self.x + self.dx * dt
        self.y = self.y + self.dy * dt
        if self.growing then
            self.size = self.size + self.change
            if self.size>10 then
                self.change = -1
            end
            if self.size<3 then
                self.growing = false
                self.size = 3
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
            if b.x<0 then
                b.x = 0
                b.dx = b.dx * -1
            end
            if b.x > W then
                b.x = W
                b.dx = b.dx * -1
            end
            if b.y<0 then
                b.y = 0
                b.dy = b.dy * -1
            end
            if b.y > H then
                b.y = H
                b.dy = b.dy * -1
            end
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
        balls[i].dx = math.random(50)
        balls[i].dy = math.random(50)
    end
end

