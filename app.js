var app = angular.module('myApp', ['ngRoute']);

app.config(function ($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "main.html"
    })
    .when('/detail', {
      templateUrl: 'detail.html',
      controller: 'DetailController'
    })
    .when('/main', {
      templateUrl: 'main.html',
      controller: 'MainController'
    })
    .otherwise({
      redirectTo: '/'
    });
});

app.service('weatherService', function () {
  this.getWeatherIconUrl = function (id) {
    var iconUrl = '';
    if (id >= 200 && id <= 235) {
      iconUrl = 'images/thunderstorm.png';
    } else if (id >= 300 && id <= 321) {
      iconUrl = 'images/heavy-rain.png';
    } else if (id >= 500 && id <= 531) {
      iconUrl = 'images/rainyWithSun.png';
    } else if (id >= 600 && id <= 622) {
      iconUrl = 'images/snowy.png';
    } else if (id >= 701 && id <= 781) {
      iconUrl = 'images/haze.png';
    } else if (id === 800) {
      iconUrl = 'images/sun.png';
    } else if (id === 801) {
      iconUrl = 'images/cloudy.png';
    } else if (id >= 802 && id <= 805) {
      iconUrl = 'images/cloud.png';
    }
    return iconUrl;
  };
});


app.controller('WeatherController', function ($scope, $http, weatherService, $rootScope) {
  var apiKey = api; //OpenWeatherMap'ten kendi APIKey'inizi alıp '411a1.....' string içine yazıp buradaki api değişkeni yerine koyup çalıştırabilirsiniz. 
  $scope.cities = cities;
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  var days = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
  var dayName = days[today.getDay()]; // haftanın günü

  $scope.nextDay = today.getDay() + 1;
  $scope.nowDay = days[$scope.nextDay];

  today = dd + '.' + mm + '.' + yyyy + ', ' + dayName;
  $scope.today = today;
  $scope.getWeatherIconUrl = weatherService.getWeatherIconUrl;

  $scope.setCity = function (city) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + apiKey + '&units=metric&lang=tr';
    $http.get(apiUrl).then(function (response) {
      $scope.weather = response.data;
      $scope.weather.city.name = $scope.weather.city.name.split(' ')[0];
      $rootScope.currentCity = city;
    });
    
  }

  var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + $rootScope.currentCity + '&appid=' + apiKey + '&units=metric&lang=tr';
    $http.get(apiUrl).then(function (response) {
      $scope.weather = response.data;
      $scope.weather.city.name = $scope.weather.city.name.split(' ')[0];
    });
    
  const select = document.querySelector('select');

  $scope.cities.forEach(city => {
    const option = document.createElement('option');
    option.textContent = city;
    select.appendChild(option);
  });
});

app.controller('DetailController', function ($scope, $http, weatherService, $rootScope) {
  $scope.getWeatherIconUrl = weatherService.getWeatherIconUrl;
  var apiKey = api; //OpenWeatherMap'ten kendi APIKey'inizi alıp '411a1.....' string içine yazıp buradaki api değişkeni yerine koyup çalıştırabilirsiniz.
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  var days = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
  var dayName = days[today.getDay()]; // haftanın günü

  $scope.nextDay = today.getDay() + 1;
  $scope.nowDay = days[$scope.nextDay];

  var now = new Date();
  var hour = now.getHours();
  var minute = now.getMinutes();
  var nextHour = Math.floor(hour / 3) * 3 + 3; // Sonraki 3 saatlik zaman dilimi

  today = dd + '.' + mm + '.' + yyyy + ', ' + dayName;
  $scope.today = today;
  $scope.hour = hour + '.' + minute.toString().padStart(2, '0');
  

  $scope.returnNowDay = function (index) {
    console.log(index);
    return days[($scope.nextDay + index) % 7]
  }


  var detailUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + $rootScope.currentCity + '&appid=' + apiKey + '&units=metric&lang=tr';
  $http.get(detailUrl).then(function (response) {
    $scope.weatherDetail = response.data;
  });

  var forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + $rootScope.currentCity + '&appid=' + apiKey + '&units=metric&lang=tr';
  $http.get(forecastUrl).then(function (response) {
    var forecastData = response.data.list;
    var dailyForecasts = forecastData.filter(function (forecast) {
      return forecast.dt_txt.includes(nextHour.toString().padStart(2, '0') + ":00:00");
    }).slice(1, 6);
    $scope.myWeatherData = dailyForecasts;

  });

});

app.controller('MainController', function ($scope, $rootScope, $http) {
  var apiKey = api;
  $scope.cities = cities
  $scope.setCity = function (city) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + $rootScope.currentCity + '&appid=' + apiKey + '&units=metric&lang=tr';
    $http.get(apiUrl).then(function (response) {
      $scope.weather = response.data;
      $scope.weather.city.name = $scope.weather.city.name.split(' ')[0];
    });
  }
  $scope.setCity($rootScope.currentCity);
  const select = document.querySelector('select');

  $scope.cities.forEach(city => {
    const option = document.createElement('option');
    option.textContent = city;
    select.appendChild(option);
  });
});




