window.addEventListener('load', function() {

    var self = this;

    this._togglesci = function(e) {
      App.panels.forceDirected.svg.sci = this.checked;
    };

    this._togglehide = function(e) {
      let key = this.id.split('-').indexOf('positive') > -1 ? 'green' : 'red';

      if (this.checked) {
        // make links invisible
        d3.selectAll('.link-1')
          .transition()
          .style('stroke-opacity', function() {
            return this.style.stroke.indexOf(key) > -1 ? 0 :
                this.style['stroke-opacity']
          });

        // remove mouseover functionality
        d3.selectAll('.link-2')
          .attr('pointer-events', function() {
            return this.style.stroke.indexOf(key) > -1 ? 'none' :
                this.getAttribute('pointer-events')
          });
      }
      else {
        // make links visible
        d3.selectAll('.link-1')
          .transition()
          .style('stroke-opacity', function() {
            return this.style.stroke.indexOf(key) > -1 ? 1 :
                this.style['stroke-opacity']
          });

        // return mouseover functionality
        d3.selectAll('.link-2')
          .attr('pointer-events', function() {
            return this.style.stroke.indexOf(key) > -1 ? 'all' :
                this.getAttribute('pointer-events')
          });

      }

    };
    this._toggleinfl = function(e) {
      let key = this.id.split('-').indexOf('link') > -1 ? 'link' : 'node';
      let threshold = Math.abs(parseFloat(App.panels.forceDirected.threshold));
      if(key === 'link') {
        if (this.checked) {
          // make links invisible
          d3.selectAll('.link-1')
            .transition()
            .style('stroke-opacity', function() {
              return Math.abs(parseFloat(this.getAttribute("value"))) < threshold ? 0 :
                  this.style['stroke-opacity']
            });

          // remove mouseover functionality
          d3.selectAll('.link-2')
            .attr('pointer-events', function() {
              return Math.abs(parseFloat(this.getAttribute("value"))) < threshold ? 'none' :
                  this.getAttribute('pointer-events')
            });
        }
        else {
          // make links visible
          d3.selectAll('.link-1')
            .transition()
            .style('stroke-opacity', function() {
              return Math.abs(parseFloat(this.getAttribute("value"))) < threshold ? 1 :
                  this.style['stroke-opacity']
            });

          // return mouseover functionality
          d3.selectAll('.link-2')
            .attr('pointer-events', function() {
              return Math.abs(parseFloat(this.getAttribute("value"))) < threshold ? 'all' :
                  this.getAttribute('pointer-events')
            });
        }
      }
      // make nodes invisible
      else {
        if (this.checked) {
          d3.selectAll('.rule')
              .transition()
              .style('stroke-opacity', function() {
                return parseInt(this.getAttribute("cluster")) === 0 ? 0 :
                    this.style['stroke-opacity']
              })
              .style('opacity', function() {
                return parseInt(this.getAttribute("cluster")) === 0 ? 0 :
                    this.style['opacity']
              })
              // remove mouseover functionality
              .attr('pointer-events', function() {
                return parseInt(this.getAttribute("cluster")) === 0 ? 'none' :
                    this.getAttribute('pointer-events')
              });
          }
        // make nodes visible
        else {
          d3.selectAll('.rule')
              .transition()
              .style('stroke-opacity', function() {
                return parseInt(this.getAttribute("cluster")) === 0 ? 0.5 :
                    this.style['stroke-opacity']
              })
              .style('opacity', function() {
                return parseInt(this.getAttribute("cluster")) === 0 ? 1 :
                    this.style['opacity']
              })
              // remove mouseover functionality
              .attr('pointer-events', function() {
                return parseInt(this.getAttribute("cluster")) === 0 ? 'all' :
                    this.getAttribute('pointer-events')
              });
        }
      }
    }


    this._unpin = function(e) {
        for (var node in App.panels.forceDirected.filteredData) {
            App.panels.forceDirected.filteredData[node].fx = null;
            App.panels.forceDirected.filteredData[node].fy = null;
        }
        d3.selectAll('.rule')
          .style("fill", d => App.panels.forceDirected.clusterColor(d.cluster))
          .style("stroke", "white");

    };

    this._filename = function(e) {
        var input = document.getElementById('filename-input');
        console.log(input.value);
        if (!input.value.match(/.*#.json/)) {
          input.value = '';
          input.setAttribute('placeholder', 'Filenames of data series should be in the format "[prefix]_#.json"');
        }
    };

    // add listeners
    [].slice.call(document.querySelectorAll('.control input[type="checkbox"]'))
        .forEach((checkbox) => {
            checkbox.addEventListener('change', 
                self['_toggle'+checkbox.id.split('-')[0]]);
        });

    [].slice.call(document.querySelectorAll('.control button'))
        .forEach((button) => {
            button.addEventListener('click', self['_'+button.id]);
        });

});
