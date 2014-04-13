/********************************************************************************
* Vittel Up                                                                     *
* Project for Vittel to track dehydration and water consumption using an        *
* arduino Yun and a 1.5 watter bottle.                                          *
*                                                                               *
* Copyright (C) 2014 George Koulouris (george.koulouris1@gmail.com)             * 
*                                                                               *
* License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html> *
* This is free software: you are free to change and redistribute it.            *
* There is NO WARRANTY, to the extent permitted by law.                         *
*                                                                               *
*********************************************************************************/

var homeView = Backbone.View.extend({
  el:".page",
  template:  _.template($('#home').html()),

  render: function() {
  	this.$el.append(this.template);

  	dehydration = new graph({id:'Dehydration', model: this.model});
  	drink = new graph({id:'Drink', model: this.model});
  	temperature = new graph({id:'Temperature', model: this.model});
  	dehydration.render();
  	drink.render();
  	temperature.render();

  	// Check the value of the txt file regularly
  	refreshIntervalId = setInterval(function() {this.model.updateValues()}, 300);
  }

});

var graph = Backbone.View.extend({
	el:".graphs",
	template: null, 
	canvas:null,
	graph: null,
	arcRadius: null,
	arcStroke: 10,
	arcColor: {hue: 0.444, saturation: 0.7, brightness: 0.69},
	picto:null,
	color: null,
	value: null,
	maxValue: null,

	initialize:function() {
		this.arcRadius = $(".page").width() / 9;
		this.listenTo(this.model, 'change', this.updateGraph);

		// Select the correct picture
		switch(this.id) {
			case 'Dehydration':
				this.picto = 'fa fa-user';
				this.color = '#009841';
				this.value = 100*this.model.get(this.id) + '%';
				this.maxValue = 1;
				break;
			case 'Drink':
				this.picto = 'fa fa-tint';
				this.color = '#044F98';
				this.value = this.model.get(this.id) + 'ml';
				this.maxValue = 1500;
				break;
			case 'Temperature':
				this.picto = 'fa fa-sun-o';
				this.color = '#E7FF00';
				this.value = this.model.get(this.id) + '<sup> o</sup>C';
				this.maxValue = 50;
				break;
		}
		
		this.template = _.template($('#graph').html(), {ID: this.id, VALUE: this.value, PICTO: this.picto, COLOR: this.color});
  	},

	render: function() {
		this.$el.append(this.template);
		this.canvas = Raphael(this.id, 2*(this.arcRadius + this.arcStroke),  2*(this.arcRadius + this.arcStroke));

		// Add 1 opaque circle
    	this.canvas.path(this.drawCircle(this.arcRadius, this.arcStroke, 0, 1)).attr({"stroke-width":this.arcStroke, "stroke": "#FFFFFF", "stroke-opacity": 0.5});

    	// Add the graph
    	this.graph = this.canvas.path(this.drawCircle(this.arcRadius, this.arcStroke, 0, this.model.get(this.id)/this.maxValue)).attr({"stroke-width":this.arcStroke, "stroke": this.color});
	},

	drawCircle:function(radius, stroke, offset, value) {

	    var alpha = 360 * value,
	          a = (90 - alpha) * Math.PI / 180,
	          x = radius + stroke + radius * Math.cos(a),
	          y = radius + stroke - radius * Math.sin(a),
	          path;

	    if (value == 1) {
	      path = [["M", radius + stroke + offset, stroke + offset], ["A", radius, radius, 0, 1, 1, radius + stroke + offset - 0.01, stroke + offset]];
	    } else {
	      path = [["M", radius + stroke + offset, stroke + offset], ["A", radius, radius, 0, +(alpha > 180), 1, x + offset, y + offset]];
	    }

	    return path;  
  },

  updateGraph:function() {
  	this.graph.animate({path:this.drawCircle(this.arcRadius, this.arcStroke, 0, this.model.get(this.id)/this.maxValue)});
  	switch(this.id) {
			case 'Dehydration':
				this.value = 100*this.model.get(this.id) + '%';
				break;
			case 'Drink':
				this.value = this.model.get(this.id) + 'ml';
				break;
			case 'Temperature':
				this.value = this.model.get(this.id) + '<sup> o</sup>C';
				break;
		}

	$('#graphText' + this.id).html(this.value);

  }


});
