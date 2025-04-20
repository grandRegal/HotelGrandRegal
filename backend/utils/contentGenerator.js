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
          getBanquetList : async()=>await getBanquetList(database),
          getTarrif: async()=>await getTarrif(database),
          getBanquetMenu : async()=>await getBanquetMenu(database),
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
    console.log("error found", e)
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
    console.log("addStat =", JSON.stringify(status) || status);    return true;
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
    return status.deletedCount == 1;
  }catch(err){
    console.log("err",err);
    throw err;
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
  console.log("heere to add menu", menu)

  try {
    const status = await database.collection("dineMenu").insertOne(menu);
    console.log("stat = ", status);
    return true;
  } catch (err) {
    console.log("err", err.errorResponse.errInfo.details.schemaRulesNotSatisfied[0].propertiesNotSatisfied);

    console.error("🧨 Error message:", err.message);
    console.error("🧩 Stack trace:", err.stack);
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
      content: err
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
    console.log("eroor at getUMenu = ",err);
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

async function getBanquetList(database) {
  // return {
  //   status: true,
  //   content: {
  //     blog1 : {
  //         overview: "this is fake overview which  erview which i am entering to see how its looking on teh actual wen i am ent i am entering to see how its looking on teh actual img",
  //         features: [
  //             {
  //                 logo: "",
  //                 label: "300 peoples"
  //             },
  //             {
  //                 logo: "",
  //                 label: "250 peoples"
  //             },
  //             {
  //                 logo: "",
  //                 label: "150 peoples"
  //             },
  //         ], 
  //         gallery: ["", "", "", "","", "", "", "","", "", "", ""],
  //         price: 10000
  //     },
  //     blog2: {
  //         overview: "this is fake overview which i am entering to see how its looking on teh actual wensite this is fake overview which i am entering to see how its looking on teh actual wensite",
  //         features: [
  //             {
  //                 logo: "",
  //                 label: "100 peoples"
  //             },
  //             {
  //                 logo: "",
  //                 label: "100 peoples"
  //             },
  //             {
  //                 logo: "",
  //                 label: "100 peoples"
  //             },
  //         ], 
  //         gallery: ["", "", "", "","", "", "", "","", "", "", ""],
  //         price: 500
  //     }
  // }
  // }  

  try{
    let data = await database.collection("banquets").find({}).toArray();
    return {
      status: true,
      content: data
    }
  }catch(err){
    return{
      status: false,
      reason:"here is reason = " + err.message
    }
  }
}

async function getTarrif(database){
  // return {
  //   status: true,
  //   content: {
  //     veg : [
  //         {
  //             name: "Silver",
  //             list: [
  //                 {
  //                     logo: "",
  //                     label: "1 veg"
  //                 },
  //                 {
  //                     logo: "",
  //                     label: "1 veg"
  //                 },
  //                 {
  //                     logo: "",
  //                     label: "1 veg"
  //                 },
  //                 {
  //                     logo: "",
  //                     label: "1 veg"
  //                 },
  //                 {
  //                     logo: "",
  //                     label: "1 veg"
  //                 },
  //                 {
  //                     logo: "",
  //                     label: "1 veg"
  //                 },
  //                 {
  //                     logo: "",
  //                     label: "1 veg"
  //                 },
  //             ]
  //         },
  //         {
  //             name: "Gold",
  //             list: [
  //                 {
  //                     logo: "",
  //                     label: "1 veg"
  //                 },
  //                 {
  //                     logo: "",
  //                     label: "1 veg"
  //                 },
  //                 {
  //                     logo: "",
  //                     label: "1 veg"
  //                 },
  //                 {
  //                     logo: "",
  //                     label: "1 veg"
  //                 },
  //                 {
  //                     logo: "",
  //                     label: "1 veg"
  //                 },
  //                 {
  //                     logo: "",
  //                     label: "1 veg"
  //                 },
  //                 {
  //                     logo: "",
  //                     label: "1 veg"
  //                 },
  //             ]
  //         },
  //         {
  //             name: "Platenium",
  //             list: [
  //                 {
  //                     logo: "",
  //                     label: "1 veg"
  //                 },
  //                 {
  //                     logo: "",
  //                     label: "1 veg"
  //                 },
  //                 {
  //                     logo: "",
  //                     label: "1 veg"
  //                 },
  //                 {
  //                     logo: "",
  //                     label: "1 veg"
  //                 },
  //                 {
  //                     logo: "",
  //                     label: "1 veg"
  //                 },
  //                 {
  //                     logo: "",
  //                     label: "1 veg"
  //                 },
  //                 {
  //                     logo: "",
  //                     label: "1 veg"
  //                 },
  //             ]
  //         }
  //     ],
  //     nonveg : [
  //         {
  //             name: "Silver",
  //             list: [
  //                 {
  //                     logo: "",
  //                     label: "1 veg"
  //                 },
  //                 {
  //                     logo: "",
  //                     label: "10 veg"
  //                 },
  //                 {
  //                     logo: "",
  //                     label: "100 veg"
  //                 },
  //                 {
  //                     logo: "",
  //                     label: "100 veg"
  //                 },
  //                 {
  //                     logo: "",
  //                     label: "1000 veg"
  //                 },
  //                 {
  //                     logo: "",
  //                     label: "1000 veg"
  //                 },
  //                 {
  //                     logo: "",
  //                     label: "1 veg"
  //                 },
  //             ]
  //         },
  //         {
  //             name: "Gold",
  //             list: [
  //                 {
  //                     logo: "",
  //                     label: "1 veg"
  //                 },
  //                 {
  //                     logo: "",
  //                     label: "1 veg"
  //                 },
  //                 {
  //                     logo: "",
  //                     label: "1 veg"
  //                 },
  //                 {
  //                     logo: "",
  //                     label: "1 veg"
  //                 },
  //                 {
  //                     logo: "",
  //                     label: "1 veg"
  //                 },
  //                 {
  //                     logo: "",
  //                     label: "1 veg"
  //                 },
  //                 {
  //                     logo: "",
  //                     label: "1 veg"
  //                 },
  //             ]
  //         },
  //         {
  //             name: "Platenium",
  //             list: [
  //                 {
  //                     logo: "",
  //                     label: "1 veg"
  //                 },
  //                 {
  //                     logo: "",
  //                     label: "1 veg"
  //                 },
  //                 {
  //                     logo: "",
  //                     label: "1 veg"
  //                 },
  //                 {
  //                     logo: "",
  //                     label: "1 veg"
  //                 },
  //                 {
  //                     logo: "",
  //                     label: "1 veg"
  //                 },
  //                 {
  //                     logo: "",
  //                     label: "1 veg"
  //                 },
  //                 {
  //                     logo: "",
  //                     label: "1 veg"
  //                 },
  //             ]
  //         }
  //     ]
  // }
  // }

  try{
    let data = await database.collection("tarrifs").find({}).toArray();
    return {
      status: true,
      content: data
    }
  }catch(err){
    return{
      status: false,
      reason:"here is reason = " + err.message
    }
  }
}

async function getBanquetMenu(database) {
  // return {
  //   status: true,
  //   content: [
  //     {
  //         cat : "hi",
  //         thubnail : "",
  //         items: ["Paneer Shorma", "kaju kari", "buttur masala", "shahi panner", "Paneer Shorma", "kaju kari", "buttur masala", "shahi panner", "Paneer Shorma", "kaju kari", "buttur masala", "shahi panner", "Paneer Shorma", "kaju kari", "buttur masala", "shahi panner", "Paneer Shorma", "kaju kari", "buttur masala", "shahi panner", "Paneer Shorma", "kaju kari", "buttur masala", "shahi panner", "Paneer Shorma", "kaju kari", "buttur masala", "shahi panner"]
  //     },
  //     {
  //         cat : "hello",
  //         thubnail : "",
  //         items: ["A", "b", "c", "d"]
  //     },
  //     {
  //         cat : "how",
  //         thubnail : "",
  //         items: ["A", "b", "c", "d"]
  //     }
  // ]
  // }  

  try{
    let data = await database.collection("banquetMenu").find({}).toArray();
    console.log("Menu Data = ", data);
    return {
      status: true,
      content: data
    }
  }catch(err){
    return{
      status: false,
      reason:"here is reason = " + err.message
    }
  }
}