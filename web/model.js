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

var Model = Backbone.Model.extend({
	url: 'ajax.php',
	Dehydration: null,
	Drink:null,
	Temperature:null,

	initialize: function() {
		this.set('Dehydration', 0);
		this.set('Drink', 0);
		this.set('Temperature', 18.6);
	},	

	updateValues: function() {
		that = this;
		this.fetch({
      		success: function(model, data){
        		that.set('Drink', Math.round(data[0].Drink));
        		that.set('Dehydration', Math.round(data[0].Dehydration*100)/100);
				}
    	});
	},
})