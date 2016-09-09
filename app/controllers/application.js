import Ember from 'ember';

var Photo = Ember.Object.extend({
	title: '',
	username: '',
	url: '',
});

var PhotoCollection = Ember.ArrayProxy.extend(Ember.SortableMixin, {
	sortProperties: ['title'],
	sortAscending: true,
	content: [],
});

var testPhotos = PhotoCollection.create();
var testimg1 = Photo.create({
	title: "Google",
	username: "Google",
	url: "https://www.google.com/images/srpr/logo11w.png"
});

var testimg2 = PhotoCollection.create({
	title: "UNO Logo",
	username: "UNO",
	url: "http://www.unomaha.edu/_files/images/logo-subsite-o-2.png"
});

var testimg3 = PhotoCollection.create({
	title: "Facebook logo",
	username: "Facebook",
	url: "https://www.facebook.com/images/fb_icon_325x325.png"
});

var testimg4 = PhotoCollection.create({
	title: "Hubble Carina Nebula",
	username: "NASA",
	url: "http://imgsrc.hubblesite.org/hu/db/images/hs-2010-13-a-1920x1200_wallpaper.jpg"
});

testPhotos.pushObject(testimg1);
testPhotos.pushObject(testimg2);
testPhotos.pushObject(testimg3);
testPhotos.pushObject(testimg4);

export default Ember.Controller.extend({
	photos: testPhotos
});
