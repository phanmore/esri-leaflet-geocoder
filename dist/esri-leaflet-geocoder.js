/*! esri-leaflet-geocoder - v0.0.1-beta.2 - 2014-02-25
*   Copyright (c) 2014 Environmental Systems Research Institute, Inc.
*   Apache 2.0 License */
!function(a){function b(a,b){b=b||window;for(var c,d=b,e=a.split(".");c=e.shift();)d[c]||(d[c]={}),d=d[c];return d}function c(a){var b="?";for(var c in a)if(a.hasOwnProperty(c)){var d=c,e=a[c];b+=encodeURIComponent(d),b+="=",b+=encodeURIComponent(e),b+="&"}return b.substring(0,b.length-1)}function d(b){var c=new a.LatLng(b.ymin,b.xmin),d=new a.LatLng(b.ymax,b.xmax);return new a.LatLngBounds(c,d)}b("L.esri.Services.Geocoding"),b("L.esri.Controls.Geosearch"),a.esri.Services.Geocoding=a.Class.extend({includes:a.Mixin.Events,options:{url:"https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/",outFields:"Subregion, Region, PlaceName, Match_addr, Country, Addr_type, City, Place_addr"},initialize:function(b){a.Util.setOptions(this,b)},request:function(b,d,e){var f="c"+(1e9*Math.random()).toString(36).replace(".","_");d.f="json",d.callback="L.esri.Services.Geocoding._callback."+f;var g=document.createElement("script");g.type="text/javascript",g.src=b+c(d),g.id=f,this.fire("loading"),a.esri.Services.Geocoding._callback[f]=a.Util.bind(function(b){this.fire("load"),e(b),document.body.removeChild(g),delete a.esri.Services.Geocoding._callback[f]},this),document.body.appendChild(g)},geocode:function(b,c,d){var e={outFields:this.options.outFields},f=a.extend(e,c);f.text=b,this.request(this.options.url+"find",f,d)},suggest:function(a,b,c){var d=b||{};d.text=a,this.request(this.options.url+"suggest",d,c)}}),a.esri.Services.geocoding=function(b){return new a.esri.Services.Geocoding(b)},a.esri.Services.Geocoding._callback={},a.esri.Controls.Geosearch=a.Control.extend({includes:a.Mixin.Events,options:{position:"topleft",zoomToResult:!0,useMapBounds:11,collapseAfterResult:!0,expanded:!1,maxResults:25},initialize:function(b){a.Util.setOptions(this,b),this._service=new a.esri.Services.Geocoding},_processMatch:function(b,c){var e=c.feature.attributes,f=d(c.extent);return{text:b,bounds:f,latlng:new a.LatLng(c.feature.geometry.y,c.feature.geometry.x),name:e.PlaceName,match:e.Addr_type,country:e.Country,region:e.Region,subregion:e.Subregion,city:e.City,address:e.Place_addr?e.Place_addr:e.Match_addr}},_geocode:function(b,c){var d={};if(c)d.magicKey=c;else{var e=this._map.getBounds(),f=e.getCenter(),g=e.getNorthWest();d.bbox=e.toBBoxString(),d.maxLocations=this.options.maxResults,d.location=f.lng+","+f.lat,d.distance=Math.min(Math.max(f.distanceTo(g),2e3),5e4)}a.DomUtil.addClass(this._input,"geocoder-control-loading"),this.fire("loading"),this._service.geocode(b,d,a.Util.bind(function(c){if(c.error)this.fire("error",{code:c.error.code,message:c.error.messsage});else if(c.locations.length){var d,e=[],f=new a.LatLngBounds;for(d=c.locations.length-1;d>=0;d--)e.push(this._processMatch(b,c.locations[d]));for(d=e.length-1;d>=0;d--)f.extend(e[d].bounds);this.fire("results",{results:e,bounds:f,latlng:f.getCenter()}),this.options.zoomToResult&&this._map.fitBounds(f)}else this.fire("results",{results:[],bounds:null,latlng:null,text:b});a.DomUtil.removeClass(this._input,"geocoder-control-loading"),this.fire("load"),this.clear(),this._input.blur()},this))},_suggest:function(b){a.DomUtil.addClass(this._input,"geocoder-control-loading");var c={};if(this.options.useMapBounds===!0||this._map.getZoom()>=this.options.useMapBounds){var d=this._map.getBounds(),e=d.getCenter(),f=d.getNorthWest();c.location=e.lng+","+e.lat,c.distance=Math.min(Math.max(e.distanceTo(f),2e3),5e4)}this._service.suggest(b,c,a.Util.bind(function(b){if(this._input.value){if(this._suggestions.innerHTML="",this._suggestions.style.display="none",b.suggestions){this._suggestions.style.display="block";for(var c=0;c<b.suggestions.length;c++){var d=a.DomUtil.create("li","geocoder-control-suggestion",this._suggestions);d.innerHTML=b.suggestions[c].text,d["data-magic-key"]=b.suggestions[c].magicKey}}a.DomUtil.removeClass(this._input,"geocoder-control-loading")}},this))},clear:function(){this._suggestions.innerHTML="",this._suggestions.style.display="none",this._input.value="",this.options.collapseAfterResult&&a.DomUtil.removeClass(this._container,"geocoder-control-expanded")},onAdd:function(b){return this._map=b,b.attributionControl?b.attributionControl.addAttribution("Geocoding by Esri"):a.control.attribution().addAttribution("Geocoding by Esri").addTo(b),this._container=a.DomUtil.create("div","geocoder-control"+(this.options.expanded?" geocoder-control-expanded":"")),this._input=a.DomUtil.create("input","geocoder-control-input leaflet-bar",this._container),this._suggestions=a.DomUtil.create("ul","geocoder-control-suggestions leaflet-bar",this._container),a.DomEvent.addListener(this._input,"focus",function(){a.DomUtil.addClass(this._container,"geocoder-control-expanded")},this),a.DomEvent.addListener(this._container,"click",function(){a.DomUtil.addClass(this._container,"geocoder-control-expanded"),this._input.focus()},this),a.DomEvent.addListener(this._suggestions,"mousedown",function(a){var b=a.target||a.srcElement;this._geocode(b.innerHTML,b["data-magic-key"]),this.clear()},this),a.DomEvent.addListener(this._input,"blur",function(){this.clear()},this),a.DomEvent.addListener(this._input,"keydown",function(b){var c=this._suggestions.querySelectorAll(".geocoder-control-selected")[0];switch(b.keyCode){case 13:c?(this._geocode(c.innerHTML,c["data-magic-key"]),this.clear()):this.options.allowMultipleResults?this._geocode(this._input.value):a.DomUtil.addClass(this._suggestions.childNodes[0],"geocoder-control-selected"),this.clear(),a.DomEvent.preventDefault(b);break;case 38:c&&a.DomUtil.removeClass(c,"geocoder-control-selected"),c&&c.previousSibling?a.DomUtil.addClass(c.previousSibling,"geocoder-control-selected"):a.DomUtil.addClass(this._suggestions.childNodes[this._suggestions.childNodes.length-1],"geocoder-control-selected"),a.DomEvent.preventDefault(b);break;case 40:c&&a.DomUtil.removeClass(c,"geocoder-control-selected"),c&&c.nextSibling?a.DomUtil.addClass(c.nextSibling,"geocoder-control-selected"):a.DomUtil.addClass(this._suggestions.childNodes[0],"geocoder-control-selected"),a.DomEvent.preventDefault(b)}},this),a.DomEvent.addListener(this._input,"keyup",function(a){var b=a.which||a.keyCode,c=(a.target||a.srcElement).value;return c.length<2?void 0:27===b?(this._suggestions.innerHTML="",void(this._suggestions.style.display="none")):void(13!==b&&38!==b&&40!==b&&this._suggest(c))},this),a.DomEvent.disableClickPropagation(this._container),this._container},onRemove:function(a){a.attributionControl.removeAttribution("Geocoding by Esri")}}),a.esri.Controls.geosearch=function(b){return new a.esri.Controls.Geosearch(b)}}(L);