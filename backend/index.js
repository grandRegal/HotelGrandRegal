const express = require('express');
const multer = require('multer');
const cors = require('cors');
require('dotenv').config();
const getContent = require('./utils/contentGenerator');
const handleImg = require('./utils/handleImg');
const Creds = require('./utils/creds');
const sendMail = require('./utils/sendMail');


/*Server Logic */
const app = express();
const PORT = 3000;
app.use(express.json());


/*Image Upload Logic */
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/*CORS Logic */
const allowedOrigins = process.env.ACCESS_URL.split(',');

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true // 👈 VERY IMPORTANT
};

app.use(cors(corsOptions));


/*User Login Logic */
const credsData = new Creds();

async function init() {
    try {
        console.log("Initializing Server...");
        console.log("Establishing Connection With Database...");
        const content = await getContent();
        const cloudinary = await handleImg();
        console.log("Database Connection Established");
        try {
            app.listen(PORT, () => {
                console.log(`Server running on ${process.env.ACCESS_URL}:${PORT}`);
            });

            app.get('/ping', (req, res) => {
                res.send("Ping Successful " + new Date());
            });

            /*Admin Requests */
            app.post('/api/adminLogin', (req, res) => {
                if (req.body.username && req.body.pwd) {
                    let status = credsData.verifyLogin(req.body.username, req.body.pwd);
                    if (status) {
                        res.cookie(
                            'loginCookie',
                            status,
                            {
                                httpOnly: true,
                                maxAge: req.body.isToRemember ? 604800000 : undefined,
                                secure: true,
                                sameSite: 'none'
                            }
                        )
                        res.json({ status: true });
                    } else {
                        res.json({ status: false });
                    }
                    res.end();
                } else {
                    res.json({})
                }
            });
            app.get('/api/dashboard', async(req, res) => {
                res.json(await content.adminRequests.dashboard.getDashboard());
            });
            app.post('/api/addMenu', upload.single('thumb'), async (req, res) => {
                console.log("ADD menu request received");
                if (credsData.verifyRequest(req.headers.cookie)) {
                    if (req.file) {
                        const ack = await cloudinary.insertImg(req.file.buffer);
                        let jsonData = JSON.parse(req.body.jsonData);
                        if (ack.status) {
                            let status = await content.adminRequests.content.addMenu(ack.url, jsonData.name, jsonData.desc, jsonData.price, jsonData.cat, jsonData.subCat, jsonData.shefSpecial, jsonData.isVeg);
                            if (status) {
                                res.json({ status: true })
                            } else {
                                res.json({ status: false, reason: "failed with mongo" })
                            }
                        } else {
                            res.json({ status: false, reason: "failed with coludinary" })
                        }
                    }
                    else {
                        console.log("Failed With Image");
                        res.json({ status: false, reason: "failed with img" })
                    }
                } else {
                    console.log("Inside Request Processing\n1) Sesion Expired");
                    res.json({
                        status: false,
                        reason: "session expired"
                    })
                }
            });
            app.get('/api/getMenu', async (req, res) => {
                let ack = await content.adminRequests.content.getMenu();
                if (ack.status) {
                    res.json(
                        {
                            status: true,
                            content: ack.content
                        }
                    )
                } else {
                    res.json(
                        {
                            status: false,
                            reason: ack.reason
                        }
                    )
                }

            });
            app.post('/api/editMenu', upload.single('thumb'), async (req, res) => {
                try {
                    const ack = await cloudinary.insertImg(req.file.buffer);
                    let newData = JSON.parse(req.body.jsonData);
                    res.json(await content.adminRequests.content.editMenu(newData.id, ack.url, newData.name, newData.desc, newData.price, newData.cat, newData.subCat, newData.shefSpecial, newData.isVeg));
                } catch (err) {
                    res.json({ status: false, reason: "failer to upload to storage reason = " + JSON.stringify(err) });
                }
            });
            app.post('/api/deleteMenu', async (req, res) => {
                res.json(await content.adminRequests.content.deleteMenu(req.body.id));
            });
            app.get('/api/roomDetails', async (req, res) => {
                res.json(await content.adminRequests.content.getRoomData());
            });
            app.post('/api/setRoom', upload.array('gallery'), async (req, res) => {
                let jsonData = JSON.parse(req.body.jsonData);
                let convertedGallery = null;
                try {
                    convertedGallery = await Promise.all(
                        req.files.map(async (img) => {
                            const ack = await cloudinary.insertImg(img.buffer);
                            return ack.url;
                        })
                    );
                } catch (err) {
                    console.log("err" + err.message);
                }
                res.json(await content.adminRequests.content.setRoom(jsonData.id, jsonData.name, jsonData.info, jsonData.desc, jsonData.price, convertedGallery));
            });
            app.post('/api/addRoom', upload.array('gallery'), async (req, res) => {
                let jsonData = JSON.parse(req.body.jsonData);
                let convertedGallery = null;
                try {
                    convertedGallery = await Promise.all(
                        req.files.map(async (img) => {
                            const ack = await cloudinary.insertImg(img.buffer);
                            return ack.url;
                        })
                    );
                } catch (err) {
                    console.log("err" + err.message);
                }
                res.json(await content.adminRequests.content.addRoom(jsonData.id, jsonData.name, jsonData.info, jsonData.desc, jsonData.price, convertedGallery));
            });
            app.post('/api/deleteRoom', async (req, res) => {
                res.json(await content.adminRequests.content.deleteRoom(req.body.id));
            });
            app.get('/api/banquetDetails', async (req, res) => {
                res.json(await content.adminRequests.content.getBanquetData());
            });
            app.post('/api/setBanquet', upload.array('gallery'), async (req, res) => {
                let jsonData = JSON.parse(req.body.jsonData);
                let convertedGallery = null;
                try {
                    convertedGallery = await Promise.all(
                        req.files.map(async (img) => {
                            const ack = await cloudinary.insertImg(img.buffer);
                            return ack.url;
                        })
                    );
                } catch (err) {
                    console.log("err" + err.message);
                }
                res.json(await content.adminRequests.content.setBanquet(jsonData.id, jsonData.desc, jsonData.price, convertedGallery, jsonData.capacity));
            });
            app.post('/api/addBanquet', upload.array('gallery'), async (req, res) => {
                let jsonData = JSON.parse(req.body.jsonData);
                let convertedGallery = null;
                try {
                    convertedGallery = await Promise.all(
                        req.files.map(async (img) => {
                            const ack = await cloudinary.insertImg(img.buffer);
                            return ack.url;
                        })
                    );
                } catch (err) {
                    console.log("err" + err.message);
                }
                res.json(await content.adminRequests.content.addBanquet(jsonData.desc, jsonData.price, convertedGallery, jsonData.capacity));
            });
            app.post('/api/deleteBanquet', async (req, res) => {
                res.json(await content.adminRequests.content.deleteBanquet(req.body.id));
            });
            app.get('/api/bookingData', async(req, res)=>{
                res.json(await content.adminRequests.booking.bookingData());
            });
            app.post('/api/acceptBooking', async(req, res)=>{
                if(req.body.type == '0'){
                    sendMail(req.body.email, 'Your Room Booking Confirmation', 'Your Room Booking At Hotel Grand Reagl Is Confirmed');
                    res.json(await content.adminRequests.booking.acceptRoomBooking(req.body.id));
                }else{
                    sendMail(req.body.email, 'Your Banquet Booking Confirmation', 'Your Banquet Booking At Hotel Grand Reagl Is Confirmed');
                    res.json(await content.adminRequests.booking.acceptBanquetBooking(req.body.id));
                }
            });
            app.post('/api/declineBooking', async(req, res)=>{
                if(req.body.type == '0'){
                    sendMail(req.body.email, 'Your Room Booking Declined', 'Your Room Booking At Hotel Grand Reagl Is Declined');
                    res.json(await content.adminRequests.booking.declineRoomBooking(req.body.id));
                }else{
                    sendMail(req.body.email, 'Your Banquet Booking Declined', 'Your Banquet Booking At Hotel Grand Reagl Is Declined');
                    res.json(await content.adminRequests.booking.declineBanquetBooking(req.body.id));
                }
            });
            app.get('/api/feedbackData', async (req, res) => {
                console.log("|===================================|\nClient Request Received \n|===================================|\n");
                console.log("Endpoint = " + '/feedbackData' + '\nProcessing Request');
                if (credsData.verifyRequest(req.headers.cookie)) {
                    console.log("Inside Request Processing\n1) Sesion Valid");
                    try {
                        console.log("Inside Request Processing\n2) Fetching Feedbacks");
                        const userRatings = await content.adminRequests.feedback.getFeebacks();
                        console.log("Inside Request Processing\n3) Feedbacks Fetched");
                        res.json({
                            status: true,
                            content: userRatings
                        });
                    } catch (err) {
                        console.log("Inside Request Processing\n3) Error Fetching Feedbacks");
                        res.json({
                            status: false,
                            reason: "Internal Error"
                        })
                    }
                } else {
                    console.log("Inside Request Processing\n1) Sesion Expired");
                    res.json({
                        status: false,
                        reason: "session expired"
                    })
                }
            });
            app.post('/api/setFeedback', async (req, res) => {
                console.log("|===================================|\nClient Request Received \n|===================================|\n");
                console.log("Endpoint = " + '/setFeedback' + '\nProcessing Request');
                if (credsData.verifyRequest(req.headers.cookie)) {
                    console.log("Inside Request Processing\n1) Sesion Valid");
                    try {
                        console.log("Inside Request Processing\n2) Setting Feedbacks");
                        const status = await content.adminRequests.feedback.setFeedback(req.body.id, req.body.command);
                        console.log("Inside Request Processing\n3) Feedbacks Set");
                        res.json({
                            status: status
                        });
                    } catch (err) {
                        console.log("Inside Request Processing\n3) Error Setting Feedbacks" + err);
                        res.json({
                            status: false,
                            reason: err
                        })
                    }
                } else {
                    console.log("Inside Request Processing\n1) Sesion Expired");
                    res.json({
                        status: false,
                        reason: "session expired"
                    })
                }
            });
            app.post('/api/deleteFeedback', async (req, res) => {
                if (credsData.verifyRequest(req.headers.cookie)) {
                    console.log("Inside Request Processing\n1) Sesion Valid");
                    try {
                        console.log("Inside Request Processing\n2) Deleting Feedbacks");
                        const status = await content.adminRequests.feedback.deleteFeedback(req.body.id);
                        console.log("Inside Request Processing\n3) Feedbacks Deleted");
                        res.json({
                            status: status
                        });
                    } catch (err) {
                        console.log("Inside Request Processing\n3) Error Deliting Feedbacks" + err);
                        res.json({
                            status: false,
                            reason: err
                        })
                    }
                } else {
                    console.log("Inside Request Processing\n1) Sesion Expired");
                    res.json({
                        status: false,
                        reason: "session expired"
                    })
                }
            });
            app.post('/api/deleteEnquiry', async(req, res)=>{
                res.json(await content.adminRequests.enquiry.deleteEnquiry(req.body.id));
            });
            app.get('/api/enquiryData', async(req, res)=>{
                let data = await content.adminRequests.enquiry.enquiryDetails();
                if(data.status) data.content.forEach(doc => {
                    content.adminRequests.enquiry.setEnquiry(doc._id, 'read');
                });
                res.json(data);
            });
            app.post('/api/replyEnquiry', (req, res)=>{
                content.adminRequests.enquiry.setEnquiry(req.body.id, 'replied');
                sendMail(req.body.mailid, 'Reply From Hotel Grand Regal', req.body.reply);
                res.json({status:true, content:null});
            })

            /*User Requests */
            /*Home Page */
            app.get('/api/getReviews', async (req, res) => {
                let data = await content.userReqeusts.fetchShownReviews();
                if (data.status) {
                    res.json(
                        data
                    );
                } else {
                    res.json(
                        {
                            status: false,
                            reason: ""
                        }
                    )
                }
            });
            /*Dine Page */
            app.get('/api/getUMenu', async (req, res) => {
                let ack = await content.userReqeusts.getMenu();
                if (ack.status) {
                    res.json(
                        {
                            status: true,
                            content: ack.content
                        }
                    )
                } else {
                    res.json(
                        {
                            status: false,
                            reason: ack.reason
                        }
                    )
                }

            });
            /*Roms Page */
            app.get('/api/getRoomList', async (req, res) => {
                let data = await content.userReqeusts.getRoomList();
                res.json(data);
            });
            app.post("/api/bookRoom", async (req, res) => {
                let ack = await content.userReqeusts.bookRoom(req.body.roomName, req.body.checkIn, req.body.checkOut, req.body.fName + " " + req.body.lName, req.body.mobile, req.body.email, req.body.guest, req.body.services, req.body.msg, req.body.cost)
                if (ack.status) {
                    const booking = req.body;
                    const message = `
                    🏨 𝐑𝐎𝐎𝐌 𝐃𝐄𝐓𝐀𝐈𝐋𝐒
                    __________________________________________________________

                    • 𝐑𝐨𝐨𝐦 𝐓𝐲𝐩𝐞     : ${booking.roomName}
                    • 𝐂𝐡𝐞𝐜𝐤-𝐈𝐧      : ${booking.checkIn}
                    • 𝐂𝐡𝐞𝐜𝐤-𝐎𝐮𝐭     : ${booking.checkOut}
                    • 𝐓𝐨𝐭𝐚𝐥 𝐂𝐨𝐬𝐭     : ₹${booking.cost}

                    👤  𝐏𝐑𝐈𝐌𝐀𝐑𝐘 𝐆𝐔𝐄𝐒𝐓
                    __________________________________________________________

                    • 𝐍𝐚𝐦𝐞         : ${booking.fName} ${booking.lName}
                    • 𝐌𝐨𝐛𝐢𝐥𝐞       : ${booking.mobile}
                    • 𝐄𝐦𝐚𝐢𝐥        : ${booking.email || 'Not Provided'}

                    👥  𝐀𝐃𝐃𝐈𝐓𝐈𝐎𝐍𝐀𝐋 𝐆𝐔𝐄𝐒𝐓(𝐒)
                    __________________________________________________________
                    ${booking.guest.map(g => `• ${g.fname} ${g.lname} (${g.isChild ? 'Child 👶' : 'Adult 🧑'})`).join('\n')}

                    🛎️  𝐒𝐄𝐑𝐕𝐈𝐂𝐄𝐒 𝐑𝐄𝐐𝐔𝐄𝐒𝐓𝐄𝐃
                    __________________________________________________________

                    ${booking.services.map(s => `• ${s.label} (₹${s.rate})`).join('\n')}

                    🗒️  𝐒𝐏𝐄𝐂𝐈𝐀𝐋 𝐌𝐄𝐒𝐒𝐀𝐆𝐄
                    __________________________________________________________
                    ${booking.msg || 'None'}
                    `;
                    sendMail(process.env.MANAGER_EMAIL, '📩 New Room Booking Received', message);

                }
                res.json(ack);
            });
            /*Banquet Page */
            app.get("/api/getBanquetList", async (req, res) => {
                let ack = await content.userReqeusts.getBanquetList();
                res.json(ack);
            });
            app.get("/api/getTarrif", async (req, res) => {
                let ack = await content.userReqeusts.getTarrif();
                res.json(ack);
            });
            app.get("/api/getBanquetMenu", async (req, res) => {
                let ack = await content.userReqeusts.getBanquetMenu();
                res.json(ack);
            });
            app.post("/api/bookBanquet", async (req, res) => {
                let ack = await content.userReqeusts.bookBanquet(req.body.name, req.body.fname, req.body.lname, req.body.mobile, req.body.email, req.body.date, req.body.time, req.body.duration, req.body.tarrif, req.body.plan, req.body.guestCount, req.body.additional, req.body.userShownCost, req.body.userShownCost);
                if (ack.status) {
                    const booking = req.body;

                    const adminMessage = `
                    🏢 𝐁𝐎𝐎𝐊𝐈𝐍𝐆 𝐃𝐄𝐓𝐀𝐈𝐋𝐒
                    __________________________________________________________

                    • 𝐇𝐚𝐥𝐥 𝐓𝐲𝐩𝐞     : ${booking.name}
                    • 𝐃𝐚𝐭𝐞         : ${booking.date}        • 𝐓𝐢𝐦𝐞         : ${booking.time}
                    • 𝐃𝐮𝐫𝐚𝐭𝐢𝐨𝐧     : ${booking.duration} hours
                    • 𝐓𝐚𝐫𝐢𝐟𝐟       : ${booking.tarrif}      • 𝐏𝐥𝐚𝐧         : ${booking.plan}
                    • 𝐆𝐮𝐞𝐬𝐭 𝐂𝐨𝐮𝐧𝐭  : ${booking.guestCount}
                    • 𝐓𝐎𝐓𝐀𝐋 𝐂𝐎𝐒𝐓 : ₹ ${booking.userShownCost}

                    👤  𝐂𝐎𝐍𝐓𝐀𝐂𝐓 𝐃𝐄𝐓𝐀𝐈𝐋𝐒
                    __________________________________________________________

                    • 𝐍𝐚𝐦𝐞         : ${booking.fname} ${booking.lname}
                    • 𝐌𝐨𝐛𝐢𝐥𝐞       : ${booking.mobile}
                    • 𝐄𝐦𝐚𝐢𝐥        : ${booking.email}

                    🛠️  𝐀𝐃𝐃𝐈𝐓𝐈𝐎𝐍𝐀𝐋 𝐒𝐄𝐑𝐕𝐈𝐂𝐄𝐒
                    __________________________________________________________

                    ${booking.additional.map(s => `• ${s.label} (₹${s.rate})`).join('\n')}

                    Please make sure all preparations are in place for this booking.

                    If you have any questions or need assistance, feel free to reach out to the customer at: ${booking.email}.
                    `;

                    sendMail(process.env.MANAGER_EMAIL, '📩 New Banquet Booking Received', adminMessage);

                }
                res.json(ack);
            });
            /*Contact Page */
            app.post('/api/enquire', async(req,res)=>{
                let ack = await content.userReqeusts.enquire(req.body.fname, req.body.lname, req.body.mobile, req.body.email, req.body.reason, req.body.message);
                if(ack.status){
                    const enquiry = req.body;
                const enquiryMessage = `
                📩 𝐍𝐄𝐖 𝐄𝐍𝐐𝐔𝐈𝐑𝐘 𝐑𝐄𝐂𝐄𝐈𝐕𝐄𝐃
                __________________________________________________________

                👤 𝐂𝐔𝐒𝐓𝐎𝐌𝐄𝐑 𝐃𝐄𝐓𝐀𝐈𝐋𝐒
                • 𝐍𝐚𝐦𝐞     : ${enquiry.fname} ${enquiry.lname}
                • 𝐌𝐨𝐛𝐢𝐥𝐞   : ${enquiry.mobile}
                • 𝐄𝐦𝐚𝐢𝐥    : ${enquiry.email}

                ❓ 𝐄𝐍𝐐𝐔𝐈𝐑𝐘 𝐃𝐄𝐓𝐀𝐈𝐋𝐒
                • 𝐑𝐞𝐚𝐬𝐨𝐧   : ${enquiry.reason}
                • 𝐌𝐞𝐬𝐬𝐚𝐠𝐞 : 
                ${enquiry.message}

                📌 Please respond to this enquiry at your earliest convenience.
                `;
                sendMail(process.env.MANAGER_EMAIL, '📨 New Customer Enquiry Received', enquiryMessage);
                }
                res.json(ack);
            });
            /*Feedback Page */
            app.post('/api/review', async (req, res) => {
                let status = await content.userReqeusts.submitReview(req.body.name, req.body.contact, req.body.rating, req.body.review);
                if (status) {
                    res.json({
                        status: true
                    })
                } else {
                    res.json({
                        status: false,
                        reason: "Internal Error",
                    })
                }
            });
        } catch (err) {
            console.log("Failed To Start Server...\n" + err);
        }
    } catch (err) {
        console.log("Failed To establishing Connection With Database...\n" + err);
    }
}

init();
