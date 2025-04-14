const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

module.exports = async function (){
  try {
    console.log("creating connection")
    await client.connect();
    console.log("connection done")
    const database = client.db("grandRegalDb");
    return {
      userReqeusts: {
          submitReview: async(name, contact, rating, review) => await submitReview(name, contact, rating, review, database),
          fetchShownReviews: async() => fetchShownReviews(database),
          getMenu: async()=>await getUMenu(database),
          getRoomList: async()=>await getRoomList(database),
          bookRoom: async(roomName, checkIn, checkOut, name, mobile, email, guest, services, message, cost)=>await bookRoom(roomName, checkIn, checkOut, name, mobile, email, guest, services, message, cost,  database)
      },
      adminRequests: {
        dashboard: {
          getDashboard: async() => getDashboard(database),
        },
        content: {
          addMenu: async(thumbnail, name, desc, price, cat, subCat, shefSpecial, isVeg) => await addMenu(thumbnail, name, desc, price, cat, subCat, shefSpecial, isVeg, database),
          getMenu: async()=>await getAMenu(database),
        },
        feedback: {
          getFeebacks: async () => await getFeedbacks(database),
          deleteFeedback: async(feedbackId) => await deleteFeedback(feedbackId, database),
          setFeedback: async(feedbackId, command) => await setFeedback(feedbackId, command, database),
          replyFeedback: async(feedbackId, reply) => await replyFeedback(feedbackId, reply),
        }
      }
    }
  } catch (e) {
    console.log("error found")
    throw e;
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
    console.log(status);
    return true;
  } catch (err) {
    return {
      status: false
    }
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
      status: false
    }
    throw err;
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
  try{
    return await database.collection("user_ratings").find({}).toArray();
  }catch(err){
    throw err;
  }
}

async function setFeedback(feedbackId, command, database){
  console.log("here", feedbackId, command);
  try{
    const status = await database.collection("user_ratings").updateOne(
      { _id: new ObjectId(feedbackId)},
      { $set: { category: command } }
    )
    console.log(status);
    return status.modifiedCount == 1;
  }catch(err){
    console.log("err",err);
    throw err;
  }
}

async function deleteFeedback(feedbackId, database){
  try{
    const status = await database.collection("user_ratings").deleteOne(
      { _id: new ObjectId(feedbackId)}
    )
    console.log(status);
    return status.deletedCount == 1;
  }catch(err){
    console.log("err",err);
    throw err;
  }
}

async function addMenu(thumbnail, name, desc, price, cat, subCat, shefSpecial, isVeg, database) {
  console.log("heere to add menu")
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
    const status = await database.collection("dineMenu").insertOne(menu);
    console.log("stat = ", status);
    return true;
  } catch (err) {
    console.log("err", err);
    return false
  }
}

async function getAMenu(database){
  try{
    let ack = await database.collection('dineMenu').find({}).toArray();
    return {
      status: true,
      content: ack
    }
  }catch(err){
    return {
      status: false,
      content: ack
    }
  }
}

async function getUMenu(database){
  try{
    let finalContent = [
      {
        subCatList: null, 
        itemList:[]
      },
      {
        subCatList: null, 
        itemList:[]
      },
      {
        subCatList: null, 
        itemList:[]
      },
      {
        subCatList: null, 
        itemList:[]
      }
    ];
    let categories = ["starter", "main", "desert", "drink"];
    for(index=0; index<4; index++){
      allMenu= await database.collection("dineMenu").find({ cat: categories[index]}).toArray();
      finalContent[index].subCatList = [...new Set(allMenu.map(item => item.subCat))];
      for(i=0; i<finalContent[index].subCatList.length; i++){
        finalContent[index].itemList.push(allMenu.filter((item)=>item.subCat == finalContent[index].subCatList[i]));
      }
    }
    console.log("fetched Menu", finalContent);
    return{
      status: true,
      content: finalContent
    }
  }catch(err){
    console.log(err);
    return{
      status: false,
      reason: err
    }
  }
}

async function getRoomList(database){
  try{
    let data = await database.collection("rooms").find({}).toArray();
    console.log("RoomData= ", data);
    return {
      status: true,
      content: data
    }
  }catch(err){
    return{
      status: false,
      reason:"here is reason = " + err
    }
  }
}

async function bookRoom(roomName, checkIn, checkOut, name, mobile, email, guest, services, message, cost, database){
  // console.log(roomName, checkIn, checkOut, name, mobile, email, guest, services, message, cost)
  let dataToInsert = {
    roomName: roomName,
    checkIn : new Date(checkIn.slice(0, 10)),
    checkOut : new Date(checkOut.slice(0, 10)),
    checkInT: checkIn.slice(10),
    checkOutT : checkOut.slice(10),
    name: name,
    mobile: mobile,
    finalCost: cost,
  };
  if(email) dataToInsert.email = email;
  if(message) dataToInsert.msg = message;
  if(guest){
    dataToInsert.guestName = guest.map((g)=>
    ({name: g.fname + " " + g.lname, isChild: g.isChild})
    )
  }
  if(services){
    dataToInsert.services = services.map(service=>
      service.label
    )
  }
  try{
    let data = await database.collection("room_bookings").insertOne(dataToInsert);
    return {
      status: true,
      content: null
    }
  }catch(err){
    return{
      status: false,
      reason:"here is reason = " + err
    }
  }
}