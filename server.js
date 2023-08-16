const express = require('express')
const app = express()
const session = require('express-session');
const bodyParser = require('body-parser');
const port = 3001

// middle สำหรับรับค่า form
app.use(bodyParser.urlencoded({ extended: true }));

// กำหนดค่า session
app.use(session({
    secret: 'your-secret-key', // คีย์สำหรับเข้ารหัส session
    resave: false, // เป็นการกำหนดว่าเมื่อมีการเข้าถึงข้อมูล session แม้ไม่มีการเปลี่ยนแปลง คุณต้องการให้ Express.js จัดเก็บข้อมูล session ใหม่หรือไม่ เมื่อถูกตั้งค่าเป็น false จะทำให้ไม่มีการเก็บข้อมูล session ซ้ำซ้อน
    saveUninitialized: true, // มื่อตั้งค่าเป็น true จะทำให้เกิดการเก็บข้อมูล session ที่ไม่ถูกเริ่มต้น (ไม่มีการกำหนดค่า) ได้ ซึ่งอาจเป็นประโยชน์ในบางกรณี
    cookie: {
      // ไม่ต้องกำหนดค่า expiration
      // คุกกี้จะถูกลบเมื่อปิดเบราว์เซอร์
      httpOnly: true,
  },
  }));

app.use((req, res, next) => {
    // console.log(req.session)
    next()
})

app.use((req, res, next) => {
    if (req.sessionStore) {
      console.log('Sessions in MemoryStore:', req.sessionStore.sessions);
    }
    next();
  });

app.get('/', (req, res) => {
    // res.send(string)
    res.status(200).send('this is homepage')
})

app.get('/setsession', (req, res) => {
    // ตั้งค่า session
    req.session.mysession = 'woramet'
    res.send('Session has been set.')
})

app.get('/getsession', (req, res) => {
    // อ่านค่า session
    const mySession = req.session.mysession
    if(mySession){
        res.send('welcom' + mySession)
    }
    else{
        res.send('welcome guest')
    }
})

// ลบค่า session ทั้งหมด
app.get('/clearsession', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Error destroying session.');
        } else {
            res.send('Session has been cleared.');
        }
    });
});

// เคลียร์ค่าเฉพาะ session variable ที่คุณต้องการ
app.get('/clearspecificsession', (req, res) => {
    delete req.session.mysession; // เคลียร์ค่า session variable ที่ต้องการ
    res.send('Specific session variable has been cleared.');
});

app.get('/login', (req, res) => {
    res.send(`
      <form method="post" action="/login">
        <input type="text" name="username" placeholder="Username" required>
        <input type="password" name="password" placeholder="Password" required>
        <button type="submit">Login</button>
      </form>
    `);
});

app.post('/login', (req, res) => {
    // อ่านค่า req.body
    const { username, password } = req.body;

    // ตรวจสอบการเข้าสู่ระบบจริง ๆ ในที่นี้เราใช้ตัวอย่างเช็คข้อมูลที่ส่งมาเท่ากับ 'user' และ 'password'
    if (username === 'user' && password === 'password') {
        // ตัั้งค่า session
        req.session.loggedIn = true;
        req.session.username = username;
        res.redirect('/profile');
    } else {
        res.send('Invalid username or password');
    }
});

app.get('/profile', (req, res) => {
    if (req.session.loggedIn) {
      const username = req.session.username;
      res.send(`
        Welcome to your profile, ${username}!<br>
        <a href="/logout">Logout</a>
      `);
    } else {
      res.redirect('/login');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        res.send('Error logging out');
      } else {
        res.redirect('/login');
      }
    });
});

app.get('/countview', (req, res) => {
  // เช็คว่ามี session countview หรือยัง
  if (!req.session.countview) {
    req.session.countview = 1;
    res.send(`เข้าชมครั้งแรก: ${req.session.countview}`);

  } else {
    req.session.countview++;
    res.send(`จำนวนครั้งที่เข้าชม: ${req.session.countview}`);

  }

});

app.listen(port, ()=> {
    console.log('server is running at port '+ port);
})