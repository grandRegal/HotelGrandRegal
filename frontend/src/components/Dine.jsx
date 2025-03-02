import { useEffect, useState } from "react";
import style from "./Dine.module.css"

function MenuCard(props){
    const MenuItemCard = (props)=>{
        return(
          <div className={style.menuCardItem}>
            <img src={props.img} className = {style.dishImg}/>
            <h4 className = {style.dishName}>{props.name}</h4>
            <p className = {style.dishDesc}>{props.description}</p>
            <span className = {style.dishPrice}>&#8377; {props.price} /-</span>
          </div>
        );
    }

    const SubCategoryCard = (props)=>{
        return (
          <div className={style.menuCardCat}>
            <h2 className={style.menuCardCatName}>{props.name}</h2>
            <div className={style.menuList}>{props.filteredItemList.map((item)=>(
                <MenuItemCard img = {item.img}  name = {item.name} description = {item.description} price = {item.price} isVeg = {item.isVeg}/>
            ))}</div>
          </div>
        );
    }

    let MenuCardStruct = [];
    props.cardData.itemList.forEach((itemArray, index) => {
        if(props.subCat == "All" || props.cardData.subCatList[index] == props.subCat){
            MenuCardStruct.push(<SubCategoryCard name={props.cardData.subCatList[index]} filteredItemList = {itemArray.filter((item)=>(
              !props.isVeg || item.isVeg
            ))}/>);
        }
    });

      return <div id={style.menuCard}>{MenuCardStruct}</div>;

}

function Options(props){
    const ele = props.subCatList.map((value)=>
        <option value={value}>{value}</option>
    );
    return (<>{ele}</>)
}

export default function Dine(){
    const menu = [
      {
        subCatList: ["Cold", "subCat2", "subCat3"],
        itemList: [
          [
            {
                              "name": "Masala Papad",
                              "isVeg": false,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": false,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          }
          ],
          [
            {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          }
          ],
          [
            {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          }
          ]
        ]
      },
      {
        subCatList: ["Punjabi", "subCat2", "subCat3"],
        itemList: [
          [
            {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          }
          ],
          [
            {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          }
          ],
          [
            {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          }
          ]
        ]
      },
      {
        subCatList: ["Punjabi", "subCat2", "subCat3"],
        itemList: [
          [
            {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          }
          ],
          [
            {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          }
          ],
          [
            {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          }
          ]
        ]
      },
      {
        subCatList: ["Punjabi", "subCat2", "subCat3"],
        itemList: [
          [
            {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          }
          ],
          [
            {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          }
          ],
          [
            {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          },
                          {
                              "name": "Masala Papad",
                              "isVeg": true,
                              "price": 100,
                              "quantity": 1,
                              "img": "./files/temp.jpeg",
                              "description": "Crispy roasted papad topped with masala."
                          }
          ]
        ]
      }
    ]
    const [cat, setCat] = useState('1');
    const [subCat, setSubCat] = useState('All');
    const [isVeg, setIsVeg] = useState(false);
    const selectCat = (e, category)=>{
        e.preventDefault();
        setCat(category);
    }
    useEffect(()=>{
        setSubCat('All');
    }, [cat]);

    return (
        <div id={style.menuBox}>
            <h3>MENU</h3>
            <ul>
                <li className = {cat == '1' ? style.selected : ""}><a href="#" onClick={(event)=>{selectCat(event, '1')}}>Starters</a></li>
                <li className = {cat == '2' ? style.selected : ""}><a href="#" onClick={(event)=>{selectCat(event, '2')}}>Main Course</a></li>
                <li className = {cat == '3' ? style.selected : ""}><a href="#" onClick={(event)=>{selectCat(event, '3')}}>Desert</a></li>
                <li className = {cat == '4' ? style.selected : ""}><a href="#" onClick={(event)=>{selectCat(event, '4')}}>Drinks</a></li>
                <li id={style.lastItem}>
                    <select id={style.subCatList} value={subCat} onChange={(e)=>{setSubCat(e.target.value)}}>
                        <option value="All">All</option>
                        <Options subCatList = {menu[parseInt(cat)-1].subCatList}/>
                    </select>
                </li>
                <li><input id={style.vegBtn} type="checkbox" onChange={e=>{setIsVeg(e.target.checked)}} /><label htmlFor={style.vegBtn}>Veg Only</label></li>
            </ul>
            <hr id={style.menuLine}/>
            <MenuCard cardData = {menu[parseInt(cat) -1]} isVeg = {isVeg} subCat = {subCat}/>
        </div>
    );
}