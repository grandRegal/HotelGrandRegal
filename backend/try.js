// check-schema.js

const { MongoClient } = require("mongodb");

// ✅ Replace with your MongoDB Atlas URI
const uri = "mongodb+srv://grandregalservices:qjzn97xUZx2RVfw2@cluster0.ln8wjyr.mongodb.net/?appName=Cluster0";

// ✅ Replace with your database name
const dbName = "grandRegalDb";

// ✅ Replace with your collection nam
  
  async function createCollectionWithSchema() {
    const client = new MongoClient(uri);
  
    try {
      await client.connect();
      insertRoomData(client.db("grandRegalDb"))
    } catch (err) {
      console.error("❌ Error:", err);
    }   
  }


  async function createDineMenuCollection(db) {
    try {
      const collectionName = "dineMenu";
  
      // Create collection with validation rules
      await db.createCollection(collectionName, {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["img", "name", "desc", "price", "cat", "subCat", "shefSpecial", "isVeg"],
            properties: {
              img: {
                bsonType: "string",
                description: "must be a string and is required"
              },
              name: {
                bsonType: "string",
                description: "must be a string and is required"
              },
              desc: {
                bsonType: "string",
                description: "must be a string and is required"
              },
              price: {
                bsonType: "int",
                description: "must be an integer and is required"
              },
              cat: {
                bsonType: "string",
                description: "must be a string and is required"
              },
              subCat: {
                bsonType: "string",
                description: "must be a string and is required"
              },
              shefSpecial: {
                bsonType: "bool",
                description: "must be a boolean and is required"
              },
              isVeg: {
                bsonType: "bool",
                description: "must be a boolean and is required"
              }
            }
          }
        }
      });
  
      console.log("✅ DineMenu collection created with schema validation!");
    } catch (error) {
      console.error("❌ Error creating collection:", error.message);
    }
  }

  async function createRoomsCollection(db) {
    try {
      const collectionName = "rooms";
  
      const schema = {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["name", "price", "briefInfo", "detailedInfo", "gallery", "ammenities", "rules", "extraFeatures", "broker"],
            properties: {
              name: { bsonType: "string" },
              price: { bsonType: "int"},
              briefInfo: { bsonType: "string" },
              detailedInfo: { bsonType: "string" },
              gallery: {
                bsonType: "array",
                items: { bsonType: "string" }
              },
              ammenities: {
                bsonType: "array",
                items: {
                  bsonType: "object",
                  required: ["name", "logo"],
                  properties: {
                    name: { bsonType: "string" },
                    logo: { bsonType: "string" }
                  }
                }
              },
              rules: {
                bsonType: "array",
                items: {
                  bsonType: "object",
                  required: ["name", "logo"],
                  properties: {
                    name: { bsonType: "string" },
                    logo: { bsonType: "string" }
                  }
                }
              },
              extraFeatures: {
                bsonType: "array",
                items: {
                  bsonType: "object",
                  required: ["logo", "name", "rate"],
                  properties: {
                    logo: { bsonType: "string" },
                    name: { bsonType: "string" },
                    rate: { bsonType: "int" }
                  }
                }
              },
              broker: { bsonType: "string" }
            }
          }
        }
      };
  
      // Create the collection
      await db.createCollection(collectionName, schema);
      
      console.log("✅ 'rooms' collection created successfully with validation rules.");
    } catch (err) {
      if (err.codeName === "NamespaceExists") {
        console.log("⚠️ Collection 'rooms' already exists.");
      } else {
        console.error("❌ Error creating 'rooms' collection:", err.message);
      }
    }
  }
  
  

  createCollectionWithSchema();


  async function insertRoomData(db) {
    try {
      const roomData = {
        name: "Deluxe Twin Bed Room",
        price: 2800,
        briefInfo: "A perfect blend of style and comfort with two cozy twin beds, modern amenities, and a serene ambiance for a relaxing stay",
        detailedInfo: `Deluxe Twin Bed Room offers a stylish stay with two comfortable twin beds and elegant interiors.
        Enjoy modern amenities like high-speed Wi-Fi, a smart TV, air conditioning, and a work desk.
        The room features a private bathroom with a rain shower and premium toiletries.
        Ideal for friends, colleagues, or solo travelers seeking space and comfort.
        A perfect blend of convenience and relaxation for a memorable stay`,
        gallery: [
          "https://res.cloudinary.com/de9mmhibr/image/upload/v1744556778/IMG-20250328-WA0006_lpy8vu.jpg",
          "https://res.cloudinary.com/de9mmhibr/image/upload/v1744556777/IMG-20250328-WA0004_hjrnkr.jpg",
          "https://res.cloudinary.com/de9mmhibr/image/upload/v1744556777/IMG-20250328-WA0005_elnu9n.jpg",
          "https://res.cloudinary.com/de9mmhibr/image/upload/v1744556777/IMG-20250328-WA0003_rf9lzz.jpg"
        ],
        ammenities: [
          { logo: "https://res.cloudinary.com/de9mmhibr/image/upload/v1744607231/area_dmz2kf.png", name: "144 sq.ft" },
          { logo: "https://res.cloudinary.com/de9mmhibr/image/upload/v1744607258/image-removebg-preview_ahxg9n.png", name: "City View" },
          { logo: "https://res.cloudinary.com/de9mmhibr/image/upload/v1744607259/bed-removebg-preview_u7nx3d.png", name: "Twin Beds" },
          { logo: "https://res.cloudinary.com/de9mmhibr/image/upload/v1744604488/wifi_1_mldc92.png", name: "Free Wifi" },
          { logo: "https://res.cloudinary.com/de9mmhibr/image/upload/v1744607259/city-removebg-preview_dmpp9t.png", name: "City Center" },
          { logo: "https://res.cloudinary.com/de9mmhibr/image/upload/v1744607259/city-removebg-preview_dmpp9t.png", name: "Road Touch" },
          { logo: "https://res.cloudinary.com/de9mmhibr/image/upload/v1744604489/study_room_bixqib.png", name: "Study Room" },
          { logo: "https://res.cloudinary.com/de9mmhibr/image/upload/v1744604489/room_services_tml6cf.png", name: "Room Service" },
          { logo: "https://res.cloudinary.com/de9mmhibr/image/upload/v1744604486/air-conditioner_2_ou6ycj.png", name: "Air Conditioning" },
          { logo: "https://res.cloudinary.com/de9mmhibr/image/upload/v1744604488/house_keeping_ynjdkq.png", name: "House Keeping" },
          { logo: "https://res.cloudinary.com/de9mmhibr/image/upload/v1744604486/air_purifer_yevxr2.png", name: "Air Purifier" },
          { logo: "https://res.cloudinary.com/de9mmhibr/image/upload/v1744604488/laundry_services_qhzvts.png", name: "Laundry Service" },
          { logo: "https://res.cloudinary.com/de9mmhibr/image/upload/v1744604489/mineral_water_sgpwu3.png", name: "Mineral Water" },
          { logo: "https://res.cloudinary.com/de9mmhibr/image/upload/v1744604486/bathroom__wqhht8.png", name: "Bathroom" },
          { logo: "https://res.cloudinary.com/de9mmhibr/image/upload/v1744608852/image-removebg-preview_3_pwbxso.png", name: "Telephone" },
          { logo: "https://res.cloudinary.com/de9mmhibr/image/upload/v1744608718/image-removebg-preview_2_h26zqy.png", name: "Closet" },
          { logo: "https://res.cloudinary.com/de9mmhibr/image/upload/v1744604488/coffee_machine_pve7cg.png", name: "Coffee Machine" },
          { logo: "https://res.cloudinary.com/de9mmhibr/image/upload/v1744604489/Work_Desk_fg2ia1.png", name: "Work Desk" },
          { logo: "https://res.cloudinary.com/de9mmhibr/image/upload/v1744604489/Seating_area_loxvh9.png", name: "Seating Area" },
          { logo: "https://res.cloudinary.com/de9mmhibr/image/upload/v1744604487/Charging_points_bi34r4.png", name: "Charging Point" },
          { logo: "https://res.cloudinary.com/de9mmhibr/image/upload/v1744608459/computer-icons-emergency-blankets-clip-art-portable-network-graphics-png-favpng-f9YxLbaTtQ0RwK4UmRHrkV7vK-removebg-preview_cgarxz.png", name: "Blankets" },
          { logo: "https://res.cloudinary.com/de9mmhibr/image/upload/v1744608306/safe-30_vepuzu.png", name: "Safe" },
          { logo: "https://res.cloudinary.com/de9mmhibr/image/upload/v1744604487/Cupboards_with_lock_xwmrs1.png", name: "Lockers" },
          { logo: "https://res.cloudinary.com/de9mmhibr/image/upload/v1744608718/image_uuvk6y-removebg-preview_dl3rmy.png", name: "TV" },
          { logo: "https://res.cloudinary.com/de9mmhibr/image/upload/v1744604490/Toiletries_htz64n.png", name: "Toiletries" },
          { logo: "https://res.cloudinary.com/de9mmhibr/image/upload/v1744604489/Shaving_Mirror_wx5ygt.png", name: "Shaving Mirror" },
          { logo: "https://res.cloudinary.com/de9mmhibr/image/upload/v1744604487/Western_toilet_gp5z5i.png", name: "Western Toilets" },
          { logo: "https://res.cloudinary.com/de9mmhibr/image/upload/v1744604487/Towels_dpudbe.png", name: "Towels" },
          { logo: "https://res.cloudinary.com/de9mmhibr/image/upload/v1744604489/Slippers_lhy20x.png", name: "Slippers" },
          { logo: "https://res.cloudinary.com/de9mmhibr/image/upload/v1744604490/Toiletries_htz64n.png", name: "Dental Kit" },
          { logo: "https://res.cloudinary.com/de9mmhibr/image/upload/v1744604488/Hot_and_Cold_Water_gem2ch.png", name: "Hot & Cold Water" },
          { logo: "https://res.cloudinary.com/de9mmhibr/image/upload/v1744604488/Kettle_p2atwl.png", name: "Kettle" },
          { logo: "https://res.cloudinary.com/de9mmhibr/image/upload/v1744604486/Celling_Fan_sulqjy.png", name: "Ceiling Fans" }
      ],
        rules: [
          { logo: "https://res.cloudinary.com/de9mmhibr/image/upload/v1744609101/pngtree-vector-business-man-icon-png-image_925673-removebg-preview_cdzbka.png", name: "Primary Guest Should Be 18 Years of Age" },
          { logo: "https://res.cloudinary.com/de9mmhibr/image/upload/v1744608969/684833_ftmosf.png", name: "Aadhar is Requires as ID proof" },
          { logo: "https://res.cloudinary.com/de9mmhibr/image/upload/v1744609130/image-removebg-preview_5_s5s7q6.png", name: "Pets Not Allowed" },
          { logo: "https://res.cloudinary.com/de9mmhibr/image/upload/v1744609129/image-removebg-preview_4_b9onvs.png", name: "Outside Food Not allowed" }
        ],
        extraFeatures: [
          { logo: "https://res.cloudinary.com/de9mmhibr/image/upload/v1744607259/bed-removebg-preview_u7nx3d.png", name: "Extra bed", rate: 0 }
        ],
        broker: "https://www.makemytrip.com/hotels/grand_regal-details-uran_islampur.html"
      };
  
      const result = await db.collection("rooms").insertOne(roomData);
      console.log("✅ Room data inserted successfully with _id:", result.insertedId);
    } catch (error) {
      console.error("❌ Failed to insert room data:");
      if (error.name === "MongoNetworkError") {
        console.error("🔌 Network error. Make sure MongoDB is running.");
      } else if (error.code === 11000) {
        console.error("⚠️ Duplicate key error. This room might already exist.");
      } else {
        console.error("🧨 Error message:", error.message);
        console.error("🧩 Stack trace:", error.stack);
      }
    }
  }

  async function createRoomBookingsCollection(db) {
    try {
      const collectionName = "room_bookings";
  
      const schema = {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: [
              "roomName", "name", "checkIn", "checkOut", 
              "checkInT", "checkOutT", "mobile",  "finalCost"
            ],
            properties: {
              roomName: { bsonType: "string" },
              name: { bsonType: "string" },
              guestName: {
                bsonType: ["array", "null"],
                items: {
                  bsonType: "object",
                  required: ["name", "isChild"],
                  properties: {
                    name: { bsonType: "string" },
                    isChild: { bsonType: "bool" }
                  }
                }
              },
              checkIn: { bsonType: "date" },
              checkOut: { bsonType: "date" },
              checkInT: { bsonType: "string" },
              checkOutT: { bsonType: "string" },
              mobile: { bsonType: "string" },
              email: { bsonType: ["string", "null"], description: "optional field" },
              services: {
                bsonType: ["array", "null"],
                items: { bsonType: "string" }
              },
              msg: { bsonType: ["string", "null"] },
              finalCost: { bsonType: "int" }
            }
          }
        }
      };
  
      await db.createCollection(collectionName, schema);
      console.log("✅ 'room_bookings' collection created successfully with validation.");
    } catch (err) {
      if (err.codeName === "NamespaceExists") {
        console.log("⚠️ Collection 'room_bookings' already exists.");
      } else {
        console.error("❌ Error creating 'room_bookings' collection:", err.message);
      }
    }
  }
  
  
  