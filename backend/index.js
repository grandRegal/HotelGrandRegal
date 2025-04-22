const express = require('express');
const multer = require('multer');
const cors = require('cors');
require('dotenv').config();
const getContent = require('./utils/contentGenerator');
const handleImg = require('./utils/handleImg');
const Creds = require('./utils/creds');


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

            /*Admin Requests */
            app.post('/api/adminLogin', (req, res) => {
                if (req.body.username && req.body.pwd) {
                    let status = credsData.verifyLogin(req.body.username, req.body.pwd);
                    if (status) {
                        res.cookie(
                            'loginCookie',
                            status,
                            {
                                httpOnly : true,
                                maxAge : req.body.isToRemember ? 604800000 : undefined,
                                secure: true,
                                sameSite: 'none'
                            }
                        )
                        res.json({ status: true });
                    } else {
                        res.json({ status: false });
                    }
                    res.end();
                }else{
                    res.json({})
                }
            });
            app.get('/api/dashboard', (req, res) => {
                if (!credsData.verifyRequest(req.headers.cookie)) {
                    res.json({
                        status: false
                    })
                } else
                    res.json(
                        {
                            status: true,
                            content: [
                                [{ header: "Pending", value: 0 }, { header: "Accepted", value: value++ }, { header: "Active", value: value++ }],
                                [{ header: "Pending", value: value++ }, { header: "Accepted", value: 0 }, { header: "Active", value: 0 }],
                                [{ header: "Pending", value: 0 }, { header: "Accepted", value: value++ }, { header: "Active", value: value++ }],
                                [{ header: "Pending", value: 0 }, { header: "Accepted", value: value++ }, { header: "Active", value: 0 }]
                            ]
                        }
                    )
            });
            app.post('/api/addMenu', upload.single('thumb'), async (req, res) => {
                console.log("ADD menu request received");
                if (credsData.verifyRequest(req.headers.cookie)) {
                    if (req.file) {
                        const ack = await cloudinary.insertImg(req.file.buffer);
                        let jsonData = JSON.parse(req.body.jsonData);
                        console.log("jsonData = ", jsonData);
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
                // console.log("Booking Request = ", req.body);
                res.json(await content.userReqeusts.bookRoom(req.body.roomName, req.body.checkIn, req.body.checkOut, req.body.fName + " " + req.body.lName, req.body.mobile, req.body.email, req.body.guest, req.body.services, req.body.msg, req.body.cost));
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
                // console.log("Booking Request = ", req.body);
                res.json(await content.userReqeusts.bookRoom(req.body.roomName, req.body.checkIn, req.body.checkOut, req.body.fName + " " + req.body.lName, req.body.mobile, req.body.email, req.body.guest, req.body.services, req.body.msg, req.body.cost));
            });
            /*Feedback Page */
            app.post('/api/review', async (req, res) => {
                let status = await content.userReqeusts.submitReview(req.body.name, req.body.contact, req.body.rating, req.body.review);
                console.log("reviewStat =", JSON.stringify(status) || status);
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
