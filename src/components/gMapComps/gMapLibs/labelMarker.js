/* eslint-disable */
google.maps.LabelMarker = function (options) {
  this.labelOpts = options
  google.maps.Marker.apply(this, arguments);
}
google.maps.LabelMarker.prototype = new google.maps.Marker(new google.maps.LatLng(0, 0));
google.maps.LabelMarker.prototype.setMap = function (map) {
  google.maps.Marker.prototype.setMap.call(this, map);
  if(map){
    if(!this.overlay){
      // console.log(this,'LabelMarker setMap this');
      this.overlay = new google.maps.myLabel(this.labelOpts,this.sn)
      this.overlay.setMap(map)
      // console.log(this.overlay,'oberlay');
    }
    // console.log(map,'LabelMarker setMap map');
  }else{
    if(this.overlay){
      this.overlay.setMap(null)
    }
  }
}

google.maps.myLabel = function(options,sn){
  this.sn = sn
  // console.log(options.position.lng,'options.position.lat');
  this.position = {
    lng : ()=>{
      return options.position.lng
    },
    lat : ()=>{
      return options.position.lat
    },
  },
  this.latlng = options.position;
  this.labelText = options.labelText || '';
  this.labelClass = options.labelClass || 'labelMarkerClass';
  this.labelOffset = options.labelOffset || new google.maps.Size(8, -33);
  options.icon = options.icon || getTextIcon();

  var label = document.createElement('div');
  label.className = this.labelClass;
  label.innerHTML = 'eeeeeeeeeee' || this.labelText;
  label.style.position = 'absolute';
  label.style.width = '48px';
  this.label = label;
}
google.maps.myLabel.prototype = new google.maps.OverlayView();
google.maps.myLabel.prototype.onAdd = function () {
  // console.log(this.getPanes(),'overlay.getPanes().floatPane'); 
  
  this.getPanes().floatPane.appendChild(this.label);
}
google.maps.myLabel.prototype.draw = function () {
  // console.log(this,'this in draw');
  // console.log(this.sn,'this in this.sn');
  // console.log(this.position.lat(),'this in this.position');

  var divPosition = this.getProjection().fromLatLngToDivPixel(this.position);
  var display = Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000 ? 'block' : 'none';
  // if (display === 'block') {
    this.label.style.left = divPosition.x + 'px';
    this.label.style.top = divPosition.y + 'px';
  // }
  // if (this.label.style.display !== display) {
  //   this.label.style.display = display;
  // }
}
google.maps.myLabel.prototype.onRemove = function () {
  // console.log(this,'object');
  if (this.label.parentElement) {
    this.label.parentElement.removeChild(this.label);
  }
}