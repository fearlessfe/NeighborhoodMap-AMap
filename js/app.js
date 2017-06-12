var universities = [
          {name: '中国地质大学（武汉）', location: [114.398904,30.520774],id: '武汉'},
          {name: '华中科技大学', location: [114.414725,30.515978],id: '北京'},
          {name: '武汉大学', location: [114.365248,30.53786],id: '南京'},
          {name: '武汉理工大学', location: [114.353978,30.518672],id: '广州'},
          {name: '中南财经政法大学', location: [114.381502,30.473399],id: '西安'},
          {name: '华中农业大学', location:[114.35673,30.475421],id: '长沙'},
          {name: '中南民族大学', location:[114.39316,30.48668],id: '成都'},
        ];
  


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

var University = function(university){
    this.name = ko.observable(university.name);
    this.location = ko.observable(university.location);
    this.marker = ko.observable();
    this.visible = ko.observable(true);
    this.id= ko.observable(university.id);
    
}

var MapViewModel = function(data){
    var self=this;

    self.universityList=ko.observableArray([]);

    data.forEach(function(university){
        self.universityList.push(new University(university));


    });

    var infowindow = new AMap.InfoWindow({
            offset:new AMap.Pixel(0,-28)
        });

    var marker;

    self.universityList().forEach(function(university){


    var icon = new AMap.Icon({
      image:'images/'+university.name()+'.png',

    });

    marker = new AMap.Marker({
          icon : icon,
          position:university.location(),
          map: map,
          animation:'AMAP_ANIMATION_DROP',
    });
        

    university.marker = marker;

    $.ajax({
      url:"http://v.juhe.cn/weather/index?format=2&cityname="+university.id()+"&dtype=&format=&key=630a5114bc1d2bf4729275b4f07d532a",

      dataType: "jsonp",



      success: function(responce){
        var result = responce.result.today;

        marker.content=(function(university){
          var info=[];
          info.push("<p>地点："+university.id()+"</p>");
          info.push("<p>温度："+result.temperature+"</p>");
          info.push("<p>天气："+result.weather+"</p>");

          return info.join('<br>');
        })(university);

        AMap.event.addListener(university.marker,'click',function(){
          let content=marker.content;
          infowindow.setContent(content);
          infowindow.open(map,this.getPosition());

          university.marker.setAnimation('AMAP_ANIMATION_BOUNCE');
          setTimeout(function () {
                university.marker.setAnimation(null);
          }, 1200);

          

          map.setCenter(university.marker.getPosition());
        });


      },

      error: function (e) {
                
          },
    });
         

        

        

        



  });
    
    

  self.showInfo = function(university){
    AMap.event.trigger(university.marker,'click');
     
  };

 

  self.userInput = ko.observable('');

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













