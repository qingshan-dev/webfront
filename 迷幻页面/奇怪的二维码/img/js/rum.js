var SIMULATION_RUNNING = true; //True if the simulation is running
var SIMULATION_SIZE = 80; //Number of cells horizontally & vertically
var CELL_SIZE = 8; //Size of each cell in pixels
var CELL_SHADOW_SIZE = 3; //Size of the shadow around each cell
var data = create_grid(true);
draw_grid();

$(".gameoflife").css("width", CELL_SIZE + "px");
$(".gameoflife").css("height", CELL_SIZE + "px");

/////////////////////

setInterval(function(){
  if (SIMULATION_RUNNING) {
    step();
    draw_grid();
  }
},100);

$("#step").click(function(){
  step();
  draw_grid();
});

$("#reset").click(function(){
  data = create_grid(true);
  draw_grid();
});

$("#playpause").click(function(){
  SIMULATION_RUNNING = !SIMULATION_RUNNING;
  if (SIMULATION_RUNNING) {
     $("#playpause").text("Pause"); 
     $("#step").hide();
  } else {
     $("#playpause").text("Resume"); 
    $("#step").show();
  }
  draw_grid();
});

///////////////

function create_grid(generateRandom) {
  var data = [];
  for (var i = 0; i < SIMULATION_SIZE; i++) {
     var tmp = [];
      for (var j = 0; j < SIMULATION_SIZE; j++) {
        if (generateRandom == true) {
          tmp.push((Math.random() < 0.5));
        } else {
          tmp.push(false);
        }
      }
    data.push(tmp);
  }
  return data;
}

/*
Any live cell with fewer than two live neighbours dies, as if caused by under-population.

Any live cell with two or three live neighbours lives on to the next generation.

Any live cell with more than three live neighbours dies, as if by overcrowding.

Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
*/
function step() {
  ndata = create_grid(false);

  for (var y = 0; y < data.length; y++) {
    for (var x = 0; x < data[y].length; x++) {
      var n = getnum(x,y); 
      if ((n == 2 && data[y][x] == true) || n == 3) {
        ndata[y][x] = true;
      } else {
        ndata[y][x] = false;
      }
    }
  }  
  data = ndata;
}

function getnum(x,y) {
  var i = 0;
  i = i + checkxy(x-1,y-1);
  i = i + checkxy(x,y-1);
  i = i + checkxy(x+1,y-1);
  
  i = i + checkxy(x-1,y);
  i = i + checkxy(x+1,y);
  
  i = i + checkxy(x-1,y+1);
  i = i + checkxy(x,y+1);
  i = i + checkxy(x+1,y+1);
  
  return i;
}

function checkxy(x,y) {
  if (x >= 0 && y >= 0 && data.length > y && data[y].length > x) {
    if (data[y][x] == true) {
      return 1;
    }
  } 
  return 0;
}


//Drawing magic:
function draw_grid() {
  var boxshadows = [];
  
  for (var y = 0; y < data.length; y++) {
    for (var x = 0; x < data[y].length; x++) {
      if (data[y][x] == true) {
         boxshadows.push((x*CELL_SIZE) + "px " + (y*CELL_SIZE) + "px " + CELL_SHADOW_SIZE + "px #222");
      }
    }
  }
  
  $(".gameoflife").css("box-shadow", boxshadows.join(","));
}