const asyncRequest = require('async-request'); // npm lấy API thời tiết 
const express = require('express');  // npm tạo máy chủ
// lấy thông tin thời tiết
const getWeather  = async (location) => {
  const access_key = "e3ee6cba4d9a137c2d956652099be2f8";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${access_key}`;
  try {
    issucces = true ;
  const res =  await asyncRequest(url); // lấy dữ liệu trên web
  const data =  JSON.parse(res.body); // chuyển dữ liệu về kiểu js
  const temp_K = data.main.temp ;     
  const temp_C = temp_K - 273.15;
  // thông tin cần hiển thị
  const weather = {
     region: data.name,
     country :  data.sys.country,
     temp : temp_C,
     wind_speed : data.wind.speed,
     clouds : data.clouds.all,
  };
  console.log(weather);
  return weather;
  } catch (error) {
    console.log(error);
    return {
        issucces : false ,
        error,
    }
  }
};
// tạo sever 
const app = express();
// http://localhost:7000
const path = require('path');
const pathPublic = path.join(__dirname, "/public" );
// req : người dùng yêu cầu
// res : sever trả lại
app.get("/",  async (req , res )  => {
// lấy giá trị người dùng nhập vào địa chỉ
const params = req.query;
const location = params.address ;
console.log(location);
const weather = await getWeather(location);
if (location) {
  res.render('weather', {
    // truyền dữ liệu , biến qua trang hiển thị 
    status : true ,
    region  : weather.region, 
    country : weather.country,
    temp : weather.temp ,
    wind_speed : weather.wind_speed ,
    clouds : weather.clouds
  
  });
} else {
  res.render('weather', {
    status : false,
  })
}
// hiển thị dữ liệu ra màn hình 

// sử dụng các thư mục trong trang web : vd : img 
app.use(express.static(pathPublic));
}
);
//set up view engine 
app.set("view engine", "hbs");
const port = 7000;
app.listen( port, () => {
    console.log(` app run on port 7000 `);
}
);
