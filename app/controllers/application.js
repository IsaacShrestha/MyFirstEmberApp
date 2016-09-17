//Step 16 completed but tags are not getting displayed either with my API or the API provided

import Ember from 'ember';

/*var Photo = Ember.Object.extend({
	title: '',
	username: '',
	url: '',
	//flickr extra data
	owner: '',
	//flickr url data
	id: '',
	farm: 0,
	secret: '',
	server: '',
	url: function(){
		return "https://farm"+this.get('farm')+"staticflickr.com/"+this.get('server')+"/"+this.get('id')+"_"+this.get('secret')+"_b.jpg";
	}.property('farm','server','id','secret'),
});*/

var PhotoCollection = Ember.ArrayProxy.extend(Ember.SortableMixin, {
	sortProperties: ['dates.taken'],
	sortAscending: true,
	content: [],
});

export default Ember.Controller.extend({
	photos: PhotoCollection.create(),
	searchField: '',
	tagSearchField: '',
	tagList: ['hi','ember','cheese'],
	filteredPhotos: function(){
		var filter = this.get('searchField');
		var rx = new RegExp(filter, 'gi');
		var photos = this.get('photos');

		return photos.filter(function(photo){
			return photo.get('title').match(rx) || photo.get('owner.username').match(rx);
		});
	}.property('photos.@each', 'searchField'),

	init: function(){
		this._super.apply(this, arguments);
		var apiKey = 'aff9a42d0f8aefc47aa09da1597b59a0';
		var host = 'https://api.flickr.com/services/rest/';
		var method = "flickr.tags.getHotList";
		var requestURL = host + "?method="+method + "&api_key="+apiKey+"&format=json&nojsoncallback=1";//+"&api_sig="+apiSig;
		var t = this;
		Ember.$.getJSON(requestURL, function(data){
			//callback for successfully completed requests
			console.log(data);
			data.hottags.tag.map(function(tag){
				t.get('tagList').pushObject(tag._content);
			});
		});
	},

	actions: {
		search: function(){
			this.get('photos').content.clear();
			this.store.unloadAll('photo');
			this.send('getPhotos',this.get('tagSearchField'));
		},


		getPhotos: function(tag){
			var apiKey = 'aff9a42d0f8aefc47aa09da1597b59a0';
			var host = 'https://api.flickr.com/services/rest/';
			var method = "flickr.photos.search";
			//var apiSig = 'd44f5ca2979b0d53c80515319126ce5d';
			var requestURL = host + "?method="+method + "&api_key="+apiKey+"&tags="+tag+"&per_page=50&format=json&nojsoncallback=1";
			var photos = this.get('photos');
			var t = this;
			Ember.$.getJSON(requestURL, function(data){
				//callback for successfully completed requests
				//make secondary requests to get all of the photo information
				data.photos.photo.map(function(photoitem){
					var infoRequestURL = host + "?method="+"flickr.photos.getInfo" + "&api_key="+apiKey+ "&photo_id="+photoitem.id+"&format=json&nojsoncallback=1";
					Ember.$.getJSON(infoRequestURL, function(item){
						var photo = item.photo;
						var tags = photo.tags.tag.map(function(tagitem){
							return tagitem._content;
						});
						var newPhotoItem = t.store.createRecord('photo',{
						title: photo.title._content,
						dates: photo.dates,
						owner: photo.owner,
						description: photo.description._content,
						link: photo.urls.url[0]._content,
						views: photo.views,
						tags: tags,
						//flickr url data
						id: photo.id,
						farm: photo.farm,
						secret: photo.secret,
						server: photo.server,
						});
					photos.pushObject(newPhotoItem);
					});
				});
			});
		},

		clicktag: function(tag){
			this.set('tagSearchField', tag);
			this.get('photos').content.clear();
			this.store.unloadAll('photo');
			this.send('getPhotos',tag);
		},
	}
});
