// Drool.

function Logo(is_looping)
{
  var is_looping = is_looping;

  this.canvas = null;
  this.size = null

  this.install = function(target_canvas,size)
  {
    this.canvas = target_canvas;
    this.size = size;

    this.create_tiles();
    animate();

    var timer = setInterval(this.draw, 30);
  }

  function Pos(x,y)
  {
    this.x = x;
    this.y = y;
  }

  var tiles = [];

  this.create_tiles = function()
  {
    for (x = 0; x < 10; x++) { 
      for (y = 0; y < 10; y++) { 
        var pos = new Pos(x,y);
        tiles.push(new Tile(pos,this.size/5));  
      }
    }
  }

  function scare_tiles(steps)
  {
    for (s = 0; s < steps; s++) { 
      for (t = 0; t < tiles.length; t++) { 
        tiles[t].flee();
      }
    }
  }

  function return_tiles_to(step)
  {
    for (i = 0; i < tiles.length; i++) { 
      tiles[i].move_to(tiles[i].history[step]);
      tiles[i].update();
    }
  }

  function animate_return_to(step,id)
  {
    if(id == -1){ return; }
    tiles[id].animate_until(tiles[id].history[step]);
    setTimeout(function(){ animate_return_to(step,id-1); }, 10);
  }

  this.context = function()
  {
    return this.canvas.getContext('2d');
  }

  this.clear = function()
  {
    this.context().clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  this.draw = function()
  {
    logo.clear();
    var offset = 200;
    for (i = 0; i < tiles.length; i++) { 
      var tile = tiles[i];
      logo.context().beginPath();
      logo.context().arc(tile.el_pos.x + offset,tile.el_pos.y + offset, (tile.size/2)-2, 0, 2 * Math.PI, false);
      logo.context().fillStyle = "white";
      logo.context().fill();
      logo.context().closePath();
    }
  }

  function animate_to(step,id)
  {
    if(id == 100){ return; }
    animate_tile(tiles[id],20);
    tiles[id].move_to(tiles[id].history[step]);
    setTimeout(function(){ animate_to(step,id+1); }, 10);
  }

  function animate_tile(tile,count)
  {
    if(count == 0){ return; }
    if(tile.el_pos.x < (tile.pos.x * tile.size)){ tile.translate_with(1,0); }
    if(tile.el_pos.x > (tile.pos.x * tile.size)){ tile.translate_with(-1,0); }
    if(tile.el_pos.y < (tile.pos.y * tile.size)){ tile.translate_with(0,1); }
    if(tile.el_pos.y > (tile.pos.y * tile.size)){ tile.translate_with(0,-1); }
    setTimeout(function(){ animate_tile(tile,count-1); }, 1);
  }

  function animate()
  {
    scare_tiles(6);
    return_tiles_to(5);

    setTimeout(function(){ animate_return_to(4,99); }, 1000);
    setTimeout(function(){ animate_return_to(3,99); }, 1600);
    setTimeout(function(){ animate_return_to(2,99); }, 2200);
    setTimeout(function(){ animate_return_to(1,99); }, 2800);

    return;
    if(is_looping == true){
      setTimeout(function(){ scare_tiles(6); }, 6000);
      setTimeout(function(){ return_tiles_to(1); }, 6000);
      
      setTimeout(function(){ animate_to(2,0); }, 6500);
      setTimeout(function(){ animate_to(3,0); }, 7500);
      setTimeout(function(){ animate_to(4,0); }, 8000);
      setTimeout(function(){ animate_to(5,0); }, 8500);

      setTimeout(function(){ animate(); }, 11500);
    }
  }

  // Generate

  function Tile(pos,size)
  {
    this.pos = pos;
    this.size = size;
    this.el_pos = {x:this.pos.x * this.size,y:this.pos.y * this.size};
    this.history = [];
    this.history.push(new Pos(this.pos.x,this.pos.y));   

    function tile_at(target_pos,neighboors)
    {
      for (t2 = 0; t2 < neighboors.length; t2++) { 
        if(neighboors[t2].pos.x == target_pos.x && neighboors[t2].pos.y == target_pos.y){
          return neighboors[t2];
        }
      }
      return null;
    }

    this.move_to = function(target_pos)
    {
      this.pos.x = target_pos.x;
      this.pos.y = target_pos.y;
    }

    var target_pos = null;

    this.animate_until = function(target_pos)
    {
      this.target_pos = target_pos;

      var target_el_pos = {x:target_pos.x * this.size,y:target_pos.y * this.size};

      var to_move = {x:target_el_pos.x - this.el_pos.x,y:target_el_pos.y - this.el_pos.y};

      if(to_move.x > 0){ this.el_pos.x += 1; }
      else if(to_move.x < 0){ this.el_pos.x -= 1; }
      if(to_move.y > 0){ this.el_pos.y += 1; }
      else if(to_move.y < 0){ this.el_pos.y -= 1; }

      if(target_el_pos.x != this.el_pos.x || target_el_pos.y != this.el_pos.y){
        var target = this;
        setTimeout(function(){ target.animate_until(target_pos); }, 5);
      }
    }

    this.translate_with = function(x,y)
    {
      this.el_pos.x += x;
      this.el_pos.y += y;
    }

    this.update = function()
    {
      this.el_pos = {x:pos.x * this.size,y:pos.y * this.size};
    }

    this.neighboor_left = function()
    {
      return tile_at(new Pos(pos.x-1,pos.y),tiles);
    }
    this.neighboor_right = function()
    {
      return tile_at(new Pos(pos.x+1,pos.y),tiles);
    }
    this.neighboor_top = function()
    {
      return tile_at(new Pos(pos.x,pos.y+1),tiles);
    }
    this.neighboor_down = function()
    {
      return tile_at(new Pos(pos.x,pos.y-1),tiles);
    }

    this.flee = function()
    {
      var random = Math.random();

      this.history.push(new Pos(this.pos.x,this.pos.y));  

      if(random < 0.25 && !this.neighboor_top()){
        this.pos.y += 1; 
      }
      else if(random < 0.5 && !this.neighboor_down()){
        this.pos.y -= 1; 
      }
      else if(random < 0.75 && !this.neighboor_right()){
        this.pos.x += 1; 
      }
      else if(!this.neighboor_left()){
        this.pos.x -= 1; 
      }      
    }
  }
}
