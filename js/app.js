
//数据
var universities = [
          {name: '中国地质大学（武汉）', location: [114.398904,30.520774]},
          {name: '华中科技大学', location: [114.414725,30.515978]},
          {name: '武汉大学', location: [114.365248,30.53786]},
          {name: '武汉理工大学', location: [114.347353,30.521553]},
          {name: '中南财经政法大学', location: [114.381502,30.473399]},
          {name: '华中农业大学', location:[114.35673,30.475421]},
          {name: '中南民族大学', location:[114.39316,30.48668]},
        ];
  

//初始化地图
var map;
function init(){
  map = new AMap.Map('map',{
    resizeEnable: true,
    center: [114.398736,30.520789],
    zoom : 13,
    mapStyle:'amap://styles/4dfd6e52d470ba9eb4ca32744883a8b9',
  });

  ko.applyBindings(new MapViewModel(universities));


}

//为每个学校的属性创建观察变量
var University = function(university){
    //基本数据
    this.name = ko.observable(university.name);
    this.location = ko.observable(university.location);
    //点击li，触发其绑定的事件
    this.marker = ko.observable();
    //绑定li是否可见
    this.visible = ko.observable(true);
    //ajax查询
    // this.id= ko.observable(university.id);
    
}

//VM

var MapViewModel = function(data){
    var self=this;
    //创建数据的观察数组
    self.universityList=ko.observableArray([]);

    data.forEach(function(university){
        self.universityList.push(new University(university));
    });

    //创建信息窗口，并有一定的偏移
    var infowindow = new AMap.InfoWindow({
            offset:new AMap.Pixel(0,-28)
        });

    var marker;

    self.universityList().forEach(function(university,index){

    //用已有图片替换marker默认的icon
    var icon = new AMap.Icon({
      image:'images/'+university.name()+'.png',

    });
    //创建标记
    marker = new AMap.Marker({
          icon : icon,
          position:university.location(),
          map: map,
          animation:'AMAP_ANIMATION_DROP',
    });

    university.marker = marker;


    AMap.event.addListener(university.marker,'click',function(){
      
      var src="http://api.map.baidu.com/panorama/v2?ak=I8yKhCGTcuIEU9fBlwppGcXUA9klckhF&width=256&height=128&coordtype=wgs84ll&location="+university.location()+"&fov=180";
      var info=[];
      info.push("<h2>"+university.name()+"</h2>");
      info.push("<div><img src="+src+" alt='无法获取图片'>");

      infowindow.setContent(info.join("<br>"));
      infowindow.open(map,this.getPosition());

      university.marker.setAnimation('AMAP_ANIMATION_BOUNCE');
      setTimeout(function () {
            university.marker.setAnimation(null);
      }, 1200);

      map.setCenter(university.marker.getPosition());
    });
     



  });
    
  //显示所点击的list对应的infowindow
  self.showInfo = function(university){
    AMap.event.trigger(university.marker,'click');
     
  };

  self.isShow= ko.observable(50);
  self.toggleList=function(){
    return self.isShow(-self.isShow());
  }

  self.userInput = ko.observable('');

  //搜索函数
  self.filterMarkers = function () {
      
      var searchInput = self.userInput();
        
      self.universityList().forEach(function (university) {
          university.visible(true);
          university.marker.setMap(map);
            
          if (university.name().toLowerCase().indexOf(searchInput) === -1) {
              university.visible(false);
              university.marker.setMap(null);
          }
      });
       
  };
  // self.filteredMarkers=ko.computed(function(){
  //   if(!self.userInput()){
  //     return self.universityList();
  //     console.log(self.userInput(66));
  //   }else{
  //     return self.universityList().forEach(function(university){
  //       university.visible(true);
  //       university.marker.setMap(map);
  //       console.log(self.userInput());

  //       if (university.name().indexOf(self.searchInput) === -1) {
  //           university.visible(false);
  //           university.marker.setMap(null);
  //       }
  //     });
  //   }
  // },this);
};














