const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const client = new MongoClient("mongodb+srv://grandregalservices:qjzn97xUZx2RVfw2@cluster0.ln8wjyr.mongodb.net/?appName=Cluster0", {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

module.exports = async function () {
  try {
    console.log("creating connection")
    await client.connect();
    console.log("connection done")
    const database = client.db("grandRegalDb");
    return {
      userReqeusts: {
        submitReview: async (name, contact, rating, review) => await submitReview(name, contact, rating, review, database),
        fetchShownReviews: async () => fetchShownReviews(database),
        getMenu: async () => await getUMenu(database),
        getRoomList: async () => await getRoomList(database),
        getBanquetList: async () => await getBanquetList(database),
        getTarrif: async () => await getTarrif(database),
        getBanquetMenu: async () => await getBanquetMenu(database),
        bookRoom: async (roomName, checkIn, checkOut, name, mobile, email, guest, services, message, cost) => await bookRoom(roomName, checkIn, checkOut, name, mobile, email, guest, services, message, cost, database)
      },
      adminRequests: {
        dashboard: {
          getDashboard: async () => getDashboard(database),
        },
        content: {
          addMenu: async (thumbnail, name, desc, price, cat, subCat, shefSpecial, isVeg) => await addMenu(thumbnail, name, desc, price, cat, subCat, shefSpecial, isVeg, database),
          getMenu: async () => await getAMenu(database),
        },
        feedback: {
          getFeebacks: async () => await getFeedbacks(database),
          deleteFeedback: async (feedbackId) => await deleteFeedback(feedbackId, database),
          setFeedback: async (feedbackId, command) => await setFeedback(feedbackId, command, database),
          replyFeedback: async (feedbackId, reply) => await replyFeedback(feedbackId, reply),
        }
      }
    }
  } catch (e) {
    console.log("error found", e)
  }
}


async function fetchShownReviews(database) {
  try {
    const result = await database.collection("user_ratings")
      .find({ category: "shown" })
      .project({ name: 1, rating: 1, review: 1, _id: 0 })
      .toArray();
    return {
      status: true,
      content: result
    };
  } catch (err) {
    return {
      status: false,
      reason: "Error While Fetching Shown Reviews\n Detailed Error = " + err.message
    }
  }
}

async function getUMenu(database) {
  try {
    let finalContent = [
      {
        subCatList: null,
        itemList: []
      },
      {
        subCatList: null,
        itemList: []
      },
      {
        subCatList: null,
        itemList: []
      },
      {
        subCatList: null,
        itemList: []
      }
    ];
    let categories = ["starter", "main", "desert", "drink"];
    for (index = 0; index < 4; index++) {
      allMenu = await database.collection("dineMenu").find({ cat: categories[index] }).toArray();
      finalContent[index].subCatList = [...new Set(allMenu.map(item => item.subCat))];
      for (i = 0; i < finalContent[index].subCatList.length; i++) {
        finalContent[index].itemList.push(allMenu.filter((item) => item.subCat == finalContent[index].subCatList[i]));
      }
    }
    return {
      status: true,
      content: finalContent
    }
  } catch (err) {
    return {
      status: false,
      reason: "Error While Fetching User Dine Menu\n Detailed Error = " + err.message
    }
  }
}

async function getRoomList(database) {
  try {
    let data = await database.collection("rooms").find({}).toArray();
    return {
      status: true,
      content: data
    }
  } catch (err) {
    return {
      status: false,
      reason: "Error While Fetching User Room List\n Detailed Error = " + err.message
    }
  }
}

async function bookRoom(roomName, checkIn, checkOut, name, mobile, email, guest, services, message, cost, database) {
  let dataToInsert = {
    roomName: roomName,
    checkIn: new Date(checkIn.slice(0, 10)),
    checkOut: new Date(checkOut.slice(0, 10)),
    checkInT: checkIn.slice(10),
    checkOutT: checkOut.slice(10),
    name: name,
    mobile: mobile,
    finalCost: cost,
  };
  if (email) dataToInsert.email = email;
  if (message) dataToInsert.msg = message;
  if (guest) {
    dataToInsert.guestName = guest.map((g) =>
      ({ name: g.fname + " " + g.lname, isChild: g.isChild })
    )
  }
  if (services) {
    dataToInsert.services = services.map(service =>
      service.label
    )
  }
  try {
    await database.collection("room_bookings").insertOne(dataToInsert);
    return {
      status: true,
      content: null
    }
  } catch (err) {
    return {
      status: false,
      reason: "Error While Booking Room\n Detailed Error = " + err.message
    }
  }
}

async function getBanquetList(database) {
  try {
    let data = await database.collection("banquets").find({}).toArray();
    return {
      status: true,
      content: data
    }
  } catch (err) {
    return {
      status: false,
      reason: "Error While Fetching User BanquetList\n Detailed Error = " + err.message
    }
  }
}

async function getTarrif(database) {
  try {
    let data = await database.collection("tarrifs").find({}).toArray();
    return {
      status: true,
      content: data
    }
  } catch (err) {
    return {
      status: false,
      reason: "Error While Fetching User Tarrif\n Detailed Error = " + err.message
    }
  }
}

async function getBanquetMenu(database) {
  try {
    let data = await database.collection("banquetMenu").find({}).toArray();
    return {
      status: true,
      content: data
    }
  } catch (err) {
    return {
      status: false,
      reason: "Error While Fetching User banquet Menu\n Detailed Error = " + err.message
    }
  }
}

async function submitReview(name, contact, rating, review, database) {
  const ratingNum = parseInt(rating);
  const reviewDoc = {
    name: name,
    contact: contact,
    rating: ratingNum,
    review: review,
    category: "unread",
    date: new Date()
  };

  try {
    const status = await database.collection("user_ratings").insertOne(reviewDoc);
    return {
      status: true,
      content: null
    }
  } catch (err) {
    return {
      status: false,
      reason: "Error While Submitting Review\n Detailed Error = " + err.message
    }
  }
}

function getDashboard() {
  let value = 0;
  return [
    [{ header: "Pending", value: 0 }, { header: "Accepted", value: value++ }, { header: "Active", value: value++ }],
    [{ header: "Pending", value: value++ }, { header: "Accepted", value: 0 }, { header: "Active", value: 0 }],
    [{ header: "Pending", value: 0 }, { header: "Accepted", value: value++ }, { header: "Active", value: value++ }],
    [{ header: "Pending", value: 0 }, { header: "Accepted", value: value++ }, { header: "Active", value: 0 }]
  ]
}

async function getFeedbacks(database) {
  try {
    let data = await database.collection("user_ratings").find({}).toArray();
    return {
      status: true,
      content: data
    }
  } catch (err) {
    return {
      status: false,
      reason: "Error While Getting Admin Feedbacks\n Detailed Error = " + err.message
    }
  }
}

async function setFeedback(feedbackId, command, database) {
  console.log("here", feedbackId, command);
  try {
    const status = await database.collection("user_ratings").updateOne(
      { _id: new ObjectId(feedbackId) },
      { $set: { category: command } }
    )
    return status.modifiedCount == 1 ? {
      status: true,
      content: null,
    } : {
      status: false,
      reason: "Error While Setting Feedback\n Detailed Error = " + "The Feedback Not Found, May be deleted or not present"
    }
  } catch (err) {
    return {
      status: false,
      reason: "Error While Setting Feedback\n Detailed Error = " + err.message
    }
  }
}

async function deleteFeedback(feedbackId, database) {
  try {
    const status = await database.collection("user_ratings").deleteOne(
      { _id: new ObjectId(feedbackId) }
    )
    return status.deletedCount == 1 ? {
      status: true,
      content: null,
    } : {
      status: false,
      reason: "Error While deleting Feedback\n Detailed Error = " + "The Feedback Not Found, May be deleted or not present"
    }
  } catch (err) {
    return {
      status: false,
      reason: "Error While deleting Feedback\n Detailed Error = " + err.message
    }
  }
}

async function addMenu(thumbnail, name, desc, price, cat, subCat, shefSpecial, isVeg, database) {
  const menu = {
    img: thumbnail,
    name: name,
    desc: desc,
    price: parseInt(price),
    cat: cat,
    subCat: subCat,
    shefSpecial: shefSpecial,
    isVeg: isVeg
  };

  try {
    await database.collection("dineMenu").insertOne(menu);
    return{
      status: true,
      content: null
    }
  } catch (err) {
    return {
      status: false,
      reason: "Error While Adding Menu\n Detailed Error = " + err.message
    }
  }
}

async function getAMenu(database) {
  try {
    let ack = await database.collection('dineMenu').find({}).toArray();
    return {
      status: true,
      content: ack
    }
  } catch (err) {
    return {
      status: false,
      reason: "Error While Getting Admin Menu\n Detailed Error = " + err.message
    }
  }
}
