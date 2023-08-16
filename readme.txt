เมื่อมีการเข้า website ค่า session จะถูกเก็บที่ฝั่ง server โดยจะส่งสร้างค่า connect.sid แล้วส่งผ่าน cookie ซึ่งจะเรียกว่า session cookie (สามารถกำหนดเวลาหมดอายุได้) เก็บไว้ทางฝั่ง client
โดยหากมีการเข้าจากหลายผู้ใช้งาน, หลาย browser, มีการลบ session cookie แล้วเข้าสู่ระบบใหม่ / ค่า session ก็จะเก็บใหม่ไปเรื่อยๆ ทำให้มีค่า session ที่ฝั่ง server เยอะมากจึงต้องมีการลบ

-ตัวอย่างการลบค่า session ฝั่ง server

    const express = require('express');
    const session = require('express-session');

    const app = express();

    app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 30 * 60 * 1000 } // 30 minutes
    }));

    // ...

    // ตรวจสอบและลบ session ที่หมดอายุออกจากฐานข้อมูล
    setInterval(() => {
    // ใส่โค้ดที่ตรวจสอบและลบ session ที่หมดอายุ
    }, 3600000); // 1 ชั่วโมง

การที่คุกกี้เซสชั่น (Session Cookie) ถูกลบหลังจากปิดเบราว์เซอร์ หรือยังคงอยู่เมื่อเปิดใหม่ขึ้นอาจขึ้นอยู่กับการตั้งค่าของเบราว์เซอร์และการทำงานของแต่ละเบราว์เซอร์ การที่คุกกี้เซสชั่นหายไปหลังจากปิดเบราว์เซอร์เป็นพฤติกรรมที่คาดหวังและเกิดขึ้นในส่วนมากกับเบราว์เซอร์ที่ถูกตั้งค่าให้เป็น "session-only cookie" หรือ "temporary cookie" ซึ่งหมายถึงว่าคุกกี้เหล่านี้จะถูกลบออกหลังจากผู้ใช้ปิดเบราว์เซอร์ แต่บางเบราว์เซอร์อาจเป็นไปตามตั้งค่านี้ หรืออาจใช้โหมดการทำงานที่ทำให้คุกกี้เซสชั่นยังคงอยู่หลังจากปิดเบราว์เซอร์เช่นกัน
การตั้งค่านี้อาจแตกต่างกันไปในแต่ละเบราว์เซอร์ และอาจมีการเปลี่ยนแปลงโดยผู้ใช้เองหรือผู้ดูแลระบบ ดังนั้นผลของการปิดและเปิดเบราว์เซอร์บนแต่ละเบราว์เซอร์อาจแตกต่างกันไป
ถ้าคุณพบว่าบน Opera คุกกี้เซสชั่นยังคงอยู่หลังจากปิดเบราว์เซอร์ นั่นอาจเป็นเพราะ Opera มีการตั้งค่าเบราว์เซอร์ให้คุกกี้เซสชั่นยังคงอยู่หลังจากปิดเบราว์เซอร์ และเก็บค่า session ID ในคุกกี้เซสชั่นเพื่อใช้ในเซสชั่นต่อไป

session หลักๆจะเก็บที่
    1.MemoryStore (express.js ใช้เป็นค่าเริ่มต้น) (ปิด browser หรือ ปิด คอม ค่า session จะไม่หาย หากมีการ run server อยู่)
    2.database (ปิด browser หรือ ปิด คอม ค่า session จะไม่หายเพราะถูกเก็บใน database) [โดยจะเก็บค่า userid, data ต่างๆ] 

-----------------------------------------------------

1. install

    npm init
    npm i express nodemon experss-session connect-mongo

2. package.json

    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "start": "nodemon server.js"
    },

3. create server.js -> require express, express-session, body-parser(middlewareสำหรับรับค่า form) -> ตั้งค่า session -> กำหนด middleware -> สร้าง route -> สร้าง server

4. การ set ค่า session (req.session.username = username;)
    การ อ่านค่า session (username = req.session.username)
