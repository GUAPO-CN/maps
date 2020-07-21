//1.定义构造函数并继承Overlay
function divMarker( point, text, mouseoverText){
  try {
    BMap;
  } catch (e) {
    throw Error('Baidu Map JS API is not ready yet!');
  }
  this._point = point;
  this._text = text;
  this._overText = mouseoverText;
}
divMarker.prototype = new BMap.Overlay();
divMarker.prototype.constructor = divMarker;
//2、提供 initialize ，初始化覆盖物
divMarker.prototype.initialize = function(map){
  this._map = map;

  //构建覆盖物元素
  var div = this._div = document.createElement("div");
  div.style.position = "absolute";
  div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
  div.style.backgroundColor = "#EE5D5B";
  div.style.border = "1px solid #BC3B3A";
  div.style.color = "white";
  div.style.height = "18px";
  div.style.padding = "2px";
  div.style.lineHeight = "18px";
  div.style.whiteSpace = "nowrap";
  div.style.MozUserSelect = "none";
  div.style.fontSize = "12px"
  var span = this._span = document.createElement("span");
  div.appendChild(span);
  span.appendChild(document.createTextNode(this._text));      
  var that = this;

  var arrow = this._arrow = document.createElement("div");
  arrow.style.background = "url(//map.baidu.com/fwmap/upload/r/map/fwmap/static/house/images/label.png) no-repeat";
  arrow.style.position = "absolute";
  arrow.style.width = "11px";
  arrow.style.height = "10px";
  arrow.style.top = "22px";
  arrow.style.left = "10px";
  arrow.style.overflow = "hidden";
  div.appendChild(arrow);
 
  //添加事件
  div.onmouseover = function(){
    this.style.backgroundColor = "#6BADCA";
    this.style.borderColor = "#0000ff";
    this.getElementsByTagName("span")[0].innerHTML = that._overText;
    arrow.style.backgroundPosition = "0px -20px";
  }

  div.onmouseout = function(){
    this.style.backgroundColor = "#EE5D5B";
    this.style.borderColor = "#BC3B3A";
    this.getElementsByTagName("span")[0].innerHTML = that._text;
    arrow.style.backgroundPosition = "0px 0px";
  }

  //将覆盖物添加到相应的 覆盖物容器 中
  this._map.getPanes().labelPane.appendChild(div);
  
  return div;
}

//3、提供 draw ，绘制覆盖物 位置
divMarker.prototype.draw = function(){
  var map = this._map;
  var pixel = map.pointToOverlayPixel(this._point);
  this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + "px";
  this._div.style.top  = pixel.y - 30 + "px";
}
divMarker.prototype.setPosition = function(obj){
  this._position = obj
}
divMarker.prototype.getPosition = function(){
  return this._position 
}
divMarker.prototype.setLabel = function(val){
  this._label = val
}
divMarker.prototype.getLabel = function(){
  return this._label 
}
divMarker.prototype.getMap = function(){
  return this._map 
}

//增加marker的key方法 start
divMarker.prototype.setMarkerKey = function(val){
  this.sn = val
}
divMarker.prototype.getMarkerKey = function(){
  return this.sn
}
divMarker.prototype.setMarkerStatus = function(val){
  this.mStatus = val
}
divMarker.prototype.getMarkerStatus = function(){
  return this.mStatuss
}
//增加marker的key方法 end
BMap.divMarker = divMarker;
export default divMarker;