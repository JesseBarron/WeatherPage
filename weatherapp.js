$(document).ready(function(){

    /*this is the API i used to get the geo location, its not accurate at all,
    however, its good enough for this little project at this point anyway*/

  $.getJSON("http://ipinfo.io", function (response){
    console.log(response);

    //Coordinates for the users location
    //Splits the coordinates with lat and long
    var lat = response.loc.split(",")[0];
    var lon = response.loc.split(",")[1];


    //Determines wether the api will return an imperial or metric unit of tempreture
    var country = response.country;
    var unit = ""; // var for imperial or metric.
    var tempUnit = "";
    if (country == "US") {
      unit = "imperial";
      tempUnit = "F";
    }else{
      unit = "metric";
      tempUnit = "C";
    }


    // OpenWeatherMap API -----------------------
    $.getJSON("http://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&appid=faacecde70091b39d59cdc2009397940&units="+unit, function(data){

      function jsonLoop(day,temp,weather,icon,humidity,wind){

              var i = 1; // iterates the list[i] index through the JSON
              var y = 0; // iterates through the day (dayArray) in order to filter our any repeats
              //var x = 1; // thought i needed a third variable but turns out i didn't

        while (i < 40 ){ // this will loop 40 times roughly the amount of parent objects there are in this JSON

              day[0] = new Date(data.list[0].dt*1000).getDay();
              temp[0] = data.list[0].main.temp;
              humidity[0] = data.list[0].main.humidity;      //this whole block assigns the first values of the JSON because
              weather[0] = data.list[0].weather[0].main;     //the first element in my arrays will always be the current weather report
              icon[0] = data.list[0].weather[0].icon;       // Also it gave me something to compare the following vales for "dt" in the if statement.
              wind[0] = data.list[0].wind.speed;

              var dayNum = new Date(data.list[i].dt*1000).getDay(); // this variable held the iterating values for "dt"
                                                                    // and i used it to compare with the previous value day[y]
              i++; // iterates i before the logic statement in order to actually have values to compare!!

        if (dayNum > day[y] || dayNum < day[y]){ // this statement filters any repeated dt that might have occured.

              day.push(dayNum); // this is where the beauty comes in since i had the index number for the different dates in the JSON
              temp.push(data.list[i].main.temp); // I though why not use that to push all the other values i needed at the same time?
              humidity.push(data.list[i].main.humidity);  // since this JSON was structured to have all relevant data for the day under the same object
              weather.push(data.list[i].weather[0].main);   // it was possible for me to use the indexed number i for all my data to match up!
              icon.push(data.list[i].weather[0].icon);
              wind.push(data.list[i].wind.speed);

              y++;
              }
            }
          };




      function daySwitch(day){
            var i = 0;
            while(i < day.length){

            switch (day[i]) {
              case 0:
                day[i] = "Sunday";
                break;
              case 1:
                day[i] = "Monday";
                break;
              case 2:
                day[i] = "Tuesday";
                break;
              case 3:
                day[i] = "Wednesday";
                break;
              case 4:
                day[i] = "Thursday";
                break;
              case 5:
                day[i] = "Friday";
                break;
              case 6:
                day[i] = "Saturday";
                break;

              default: day[i] = "Failure"
              }
              i++;
            }
          }

      function weatherSwitch(weather,imageURL){
        var i = 0;
        var clouds = "http://fonris.ru/_ph/26/931183161.jpg";
        var clear = "https://news.am/img/news/11/97/85/default.jpg";
        var rain = "https://thegroundofmyheart.files.wordpress.com/2012/04/rain.jpg";
        var snow = "http://2.bp.blogspot.com/-_YUVfwjxF7E/TxenxgCCREI/AAAAAAAADUY/ert6PGpbQc0/s1600/1_Snow_Tunnel.jpg";

        while (i < weather.length){

          switch (weather[i]) {
            case "Clouds":
            imageURL.push(clouds);
            break;
            case "Clear":
            imageURL.push(clear);
            break;
            case "Rain":
              imageURL.push(rain);
              break;
            case "Snow":
              imageURL.push(snow);
              break;

            default: imageURL.push("http://previews.123rf.com/images/pockygallery/pockygallery1507/pockygallery150700004/42667226-Try-again-red-stamp-text-on-white-Stock-Photo.jpg");

          }
        i++;
        }

      }

  var dayArray = [];
  var tempArray = [];
  var weatherArray = [];
  var humidityArray =[];
  var iconArray = [];
  var windArray =[];
  var imgArray = [];

  jsonLoop(dayArray,tempArray,weatherArray,iconArray,humidityArray,windArray);

  daySwitch(dayArray);

  weatherSwitch(weatherArray,imgArray);

  console.log(imgArray);


  var g = 0;

  // This while loop assigns the data already parsed from the OWM API and puts it on the html.
  // This uses the .html identifier?... However this gets rid of preimplimented html like "%, or mph/kmh, or c/f" need to use add or something like that..
  while (g < dayArray.length){
    $("#weather_"+g+" #ti").html(dayArray[g]);
    $("#weather_"+g+" #tem").html(tempArray[g]+"°"+tempUnit);
    $("#weather_"+g+" #wth").html("Weather: "+weatherArray[g]);
    $("#weather_"+g+" #hum").html("Humidity: "+humidityArray[g]+"%");
    $("#weather_"+g+" img").attr( "src", "http://openweathermap.org/img/w/"+iconArray[g]+".png");
    $("#weather_"+g+" #wnd").html("Wind Speed: "+windArray[g]+"mph");
    g++;
  }
//  Click Event For Unit button F/C button
  $(".unit_button").on("click", function(event){
    if (unit == "imperial"){
      unit = "metric";
      var z = 0;
      while(z < tempArray.length){
        tempArray[z] = (tempArray[z]-32)*.5556;
        var temp1 = tempArray[z].toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
        $("#weather_"+z+" #tem").html(temp1+"°C");
        z++;
      }
      z = 0;
    }else if(unit == "metric"){
      unit = "imperial";
      var m = 0;
      while(m < tempArray.length){
        tempArray[m] = tempArray[m] * 1.8 + 32;
        var temp2 = tempArray[m].toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
        $("#weather_"+m+" #tem").html(temp2+"°F");
        m++;
    }
    m = 0;
  }
      });
  //End F/C click Event-------------------------------------------------------

//This changes the background-image for the actall pace depending on what the current weahter is.
//$("body").css({"background-image":"url("+imgArray[0]+")"});

//This sets the background-image to the different dates....
  $("#weather_0.day_strip").on("mouseover",function(event){
  $("#weather_0.day_strip").css({"background-image":"url("+imgArray[0]+")"});
  $(this).on("mouseleave",function(event){
      $(this).css({"background-image":"url('')"});
  });
    });

  $("#weather_1.day_strip").on("mouseover",function(event){
  $("#weather_1.day_strip").css({"background-image":"url("+imgArray[1]+")"});
  $(this).on("mouseleave",function(event){
          $(this).css({"background-image":"url('')"});
      });
    });

  $("#weather_2.day_strip").on("mouseover",function(event){
  $("#weather_2.day_strip").css({"background-image":"url("+imgArray[2]+")"});
  $(this).on("mouseleave",function(event){
          $(this).css({"background-image":"url('')"});
      });
    });

  $("#weather_3.day_strip").on("mouseover",function(event){
  $("#weather_3.day_strip").css({"background-image":"url("+imgArray[3]+")"});
  $(this).on("mouseleave",function(event){
          $(this).css({"background-image":"url('')"});
      });
    });

  $("#weather_4.day_strip").on("mouseover",function(event){
  $("#weather_4.day_strip").css({"background-image":"url("+imgArray[4]+")"});
  $(this).on("mouseleave",function(event){
          $(this).css({"background-image":"url('')"});
      });
    });

  $("#weather_5.day_strip").on("mouseover",function(event){
  $("#weather_5.day_strip").css({"background-image":"url("+imgArray[5]+")"});
  $(this).on("mouseleave",function(event){
          $(this).css({"background-image":"url('')"});
      });
    });

    });
  });
});
