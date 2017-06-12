
//数据
var universities = [
          {name: '中国地质大学（武汉）', location: [114.398904,30.520774],id: '武汉'},
          {name: '华中科技大学', location: [114.414725,30.515978],id: '北京'},
          {name: '武汉大学', location: [114.365248,30.53786],id: '南京'},
          {name: '武汉理工大学', location: [114.353978,30.518672],id: '广州'},
          {name: '中南财经政法大学', location: [114.381502,30.473399],id: '西安'},
          {name: '华中农业大学', location:[114.35673,30.475421],id: '长沙'},
          {name: '中南民族大学', location:[114.39316,30.48668],id: '成都'},
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
    this.id= ko.observable(university.id);
    
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

    self.universityList().forEach(function(university){

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
        
    //
    university.marker = marker;

    $.ajax({
      url:"http://v.juhe.cn/weather/index?format=2&cityname="+university.id()+"&dtype=&format=&key=630a5114bc1d2bf4729275b4f07d532a",

      dataType: "jsonp",



      success: function(responce){
        var result = responce.result.today;

        
        var info=[];
        info.push("<p>地点："+university.id()+"</p>");
        info.push("<p>温度："+result.temperature+"</p>");
        info.push("<p>天气："+result.weather+"</p>");
        marker.content=info.join('<br>');
        

        AMap.event.addListener(university.marker,'click',function(){
          infowindow.setContent(marker.content);
          infowindow.open(map,this.getPosition());

          university.marker.setAnimation('AMAP_ANIMATION_BOUNCE');
          setTimeout(function () {
                university.marker.setAnimation(null);
          }, 1200);

          map.setCenter(university.marker.getPosition());
        });
      },

      error: function (e) {
             return alert('加载失败');   
          },
    });


  });
    
    

  self.showInfo = function(university){
    AMap.event.trigger(university.marker,'click');
     
  };

  self.userInput = ko.observable('');

  //搜索函数
  self.filterMarkers = function () {
      
      var searchInput = self.userInput().toLowerCase();
        
      self.universityList().forEach(function (university) {
          university.visible(true);
          university.marker.setMap(map);
            
          if (university.name().toLowerCase().indexOf(searchInput) === -1) {
              university.visible(false);
              university.marker.setMap(null);
          }
      });
       
  };
};














