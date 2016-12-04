window.addEventListener('load', function() {
    App.property = {};
    var self = this;

    this._togglesci = function(e) {
      App.property.sci = this.checked;
    };

    this._togglehide = function(e) {
      let key = this.id.split('-').indexOf('positive') > -1 ? 'green' : 'red';

      if (this.checked) {
        App.property[key] = true;
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
        App.property[key] = false;
        let threshold = Math.abs(App.panels.forceDirected.threshold);
        // make links visible
        d3.selectAll('.link-1')
          .transition()
          .style('stroke-opacity', function(d) {
            if(App.property.link == true) {
              return Math.abs(d.value) >= threshold && this.style.stroke.indexOf(key) > -1 ? 1 :
                this.style['stroke-opacity']
            }
            else {
              return this.style.stroke.indexOf(key) > -1 ? 1 :
                this.style['stroke-opacity']  
            }
          });

        // return mouseover functionality
        d3.selectAll('.link-2')
          .attr('pointer-events', function(d) {
            if(App.property.link == true) {
              return Math.abs(d.value) > threshold && this.style.stroke.indexOf(key) > -1? 'all' :
                this.getAttribute('pointer-events')
            }
            else {
              return this.style.stroke.indexOf(key) > -1 ? 'all' :
                this.getAttribute('pointer-events')
            }
          });
      }
    };

    this._toggleinfl = function(e) {
      let key = this.id.split('-').indexOf('link') > -1 ? 'link' : 'node';
      let threshold = Math.abs(App.panels.forceDirected.threshold);
      if(key === 'link') {
        if (this.checked) {
          App.property[key] = true;
          // make links invisible
          d3.selectAll('.link-1')
            .transition()
            .style('stroke-opacity', function(d) {
              return Math.abs(d.value) < threshold ? 0 :
                  this.style['stroke-opacity']
            });

          // remove mouseover functionality
          d3.selectAll('.link-2')
            .attr('pointer-events', function(d) {
              return Math.abs(d.value) < threshold ? 'none' :
                  this.getAttribute('pointer-events')
            });
        }
        else {
          // make links visible
          App.property[key] = false;
          d3.selectAll('.link-1')
            .transition()
            .style('stroke-opacity', function(d) {
              if(App.property.red == true &&
                 App.property.green == true) {
                return this.style['stroke-opacity']
              }
              else if(App.property.red == true) {
                return Math.abs(d.value) < threshold && this.style.stroke.indexOf('green') > -1? 1 :
                  this.style['stroke-opacity']
              }
              else if(App.property.green == true) {
                return Math.abs(d.value) < threshold && this.style.stroke.indexOf('red') > -1? 1 :
                  this.style['stroke-opacity']
              }
              else {
                return Math.abs(d.value) < threshold ? 1 :
                  this.style['stroke-opacity']  
              }                     
            });

          // return mouseover functionality
          d3.selectAll('.link-2')
            .attr('pointer-events', function(d) {
              return Math.abs(d.value) < threshold ? 'all' :
                  this.getAttribute('pointer-events')
            });
        }
      }
      // make nodes invisible
      else {
        if (this.checked) {
          App.property.node = true;
          d3.selectAll('.rule')
              .transition()
              .style('stroke-opacity', function(d) {
                return !d.cluster ? 0 : 
                    this.style['stroke-opacity']
              })
              .style('opacity', function(d) {
                return !d.cluster ? 0 : 
                    this.style['opacity']
              })
              // remove mouseover functionality
              .attr('pointer-events', function(d) {
                return !d.cluster ? 'none' : 
                    this.getAttribute('pointer-events')
              });
          }
        // make nodes visible
        else {
          App.property.node = false;
          d3.selectAll('.rule-node')
              .transition()
              .style('stroke-opacity', function() {
                return 0.5;
              })
              .style('opacity', function() {
                return 1;
              })
              // return  mouseover functionality
              .attr('pointer-events', function() {
                return 'all'
              });
          if (App.property.label == true) {
            d3.selectAll('.rule-text')
              .transition()
              .style('opacity',0.75)
          }
        }
      }
    };

    this._toggleshow = function(e) {
        if(this.checked) {
          App.property.label = true;
          d3.selectAll('.rule-text')
            .transition()
            .style('opacity', function(d) {
              if (App.property.node == true && d.cluster === 0) {
                return 0;
              }
              return 0.75;
            })
        }
        else {
         App.property.label = false; 
         d3.selectAll('.rule-text')
            .transition()
            .style('opacity', 0)
        }
    };


    this._unpin = function(e) {
        for (var node in App.panels.forceDirected.filteredData) {
            App.panels.forceDirected.filteredData[node].fx = null;
            App.panels.forceDirected.filteredData[node].fy = null;
        }
        d3.selectAll('.rule-node')
          .style("fill", d => App.panels.forceDirected.clusterColor(d.cluster))
          .style("stroke", "white");

        App.panels.forceDirected.simulation.alpha(0.1).restart();
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
