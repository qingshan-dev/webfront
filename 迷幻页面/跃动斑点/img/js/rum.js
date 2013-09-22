
var colours = [
    'FE4365', 'FC9D9A', 'F9CDAD',
    'C8C8A9', '83AF9B', 'FC913A',
    'F9D423', '435356', '566965',
    'FF7373', 'A9DA88', 'E3AAD6',
    '73A8AF', 'F6BCAD', 'BE4C54',
    '7CD7CF', 'FFA446', 'B5D8EB',
    'E05561', 'F4CE79', '77B29C'
];

var pulses = [
    'sin(t)',
    'cos(t)',
    'cos(t)*sin(t)',
    'sin(t)*sin(t*1.5)',
    'sin(tan(cos(t)*1.2))',
    'sin(tan(t)*0.05)',
    'cos(sin(t*3))*sin(t*0.2)',
    'sin(pow(8,sin(t)))',
    'sin(exp(cos(t*0.8))*2)',
    'sin(t-PI*tan(t)*0.01)',
    'pow(sin(t*PI),12)',
    'cos(sin(t)*tan(t*PI)*PI/8)',
    'sin(tan(t)*pow(sin(t),10))',
    'cos(sin(t*3)+t*3)',
    'pow(abs(sin(t*2))*0.6,sin(t*2))*0.6'
];

var more = document.getElementById( 'more' );

Sketch.create({
    
    setup: function() {

        colours = colours.sort( function() {
            return random() < 0.5 ? -1 : 1;
        });
    },

    draw: function() {

        this.globalAlpha = 0.5;

        var t = this.millis * 0.0015;

        var rows = 3;
        var cols = 5;
        var minR = 10;
        var maxR = 50;
        var xs = max( maxR * 3, this.width / cols );
        var ys = max( maxR * 3, this.height / rows );
        var x, y, s, f, w, i = 0;

        for ( y = ys * 0.5; y < this.height; y += ys ) {

            for ( x = xs * 0.5; x < this.width; x += xs ) {

                if( !( f = eval( s = pulses[i] ) ) ) break;

                f = minR + abs(f) * ( maxR - minR );

                this.beginPath();
                this.arc( x, y, f, 0, TWO_PI );
                this.fillStyle = this.strokeStyle = colours[ i % colours.length ];
                this.fill();

                this.font = '10px monospace';

                w = this.measureText( s ).width;

                this.textBaseline = 'top';
                this.fillStyle = '#000';
                this.fillText( s, x - w * 0.5, y + maxR + 10 );

                i++;
            }

            if ( !f ) break;
        }
    },
  
  resize: function() {
      more.style.top = this.height > 450 ? '-100px' : '0px';
  }
});