import { useEffect, useState } from 'react';
import style from './Content.module.css';
import dineMenu from './DineMenu.module.css';
import addMenu from './AddMenu.module.css';
import thumb from './assets/react.svg';
import fetchData from '../../../utils/fetcher';
import { useNavigate } from 'react-router-dom';

function AddMenu({onAdd, img = thumb, label = null, des = null, rate = null, isShefSpecial = false,  vegD = false, catg = 'starter', subCateg = 'Veg Soup'}){
    const [cat, setCat] = useState(catg);
    const [name, setName] = useState(label);
    const [desc, setDesc] = useState(des);
    const [price, setPrice] = useState(rate);
    const [shef, setShef] = useState(isShefSpecial);
    const [sCat, setSCat] = useState(subCateg);
    const [inputImg, setImg] = useState(null);
    const [veg, setVeg] = useState(vegD);
    const [bgImg, setBackgroundImage] = useState(thumb);
    const subCats = {
        "starter": ["Veg Soup", "Veg Starters", "Chinese Veg Starters", "Eastern Oven Tandoor", "Sizzling Sizzlers", "Chinese Veg Main", "Papad/ Salads/ Raita", "Nonveg Soup", "Non Veg Chinese Starters", "Salads"],
        "main": ["Veg Mains", "Dals", "Chinese Rice/ Noodles / Chopsuey", "Veg Biryani", "Non Veg Mains", "Chicken NonVeg Main", "NonVeg Rice/ Noodles", "Biryani", "Indian Breads", "Sandwiches - Plain / Grilled", "Pizza and Pasta"],
        "desert": ["Deserts"],
        "drink" : ["Coolers", "Beverages", "Milk Shakers / Faluda"]
    }
    const handleSubmition = async(e)=>{
        e.preventDefault();
        let textData = {
            name: name,
            desc: desc,
            price: price,
            cat: cat,
            subCat: sCat,
            shefSpecial: shef,
            isVeg: veg,
        }
        console.log("textData = ", textData);
        alert("Adding Menu! PLease Wait");
        let formData = [{key:"jsonData", value: JSON.stringify(textData)}, {key:"thumb", value: inputImg}];
        let ack = await fetchData('addMenu', 'POST', null, formData);
        if(ack.status){
            alert("request Processed");
            onAdd();
        }else{
            console.log("Error Reason=", ack.reason)
            alert("Err= " + ack.reason);
        }
    }
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          setImg(file);
          console.log("imgSet");
          const imageUrl = URL.createObjectURL(file);
          setBackgroundImage(imageUrl);
        }
      };
    return(
        <form className={addMenu.form} onSubmit={(e)=>handleSubmition(e)}>
            <div className={addMenu.box1}>
                <label className={addMenu.thumbLabel} htmlFor="thumbnail"><div style={{backgroundImage:`url(${bgImg})`, backgroundPosition:"center", backgroundSize:"contain"}}></div></label>
                <input className={addMenu.thumbInput} id='thumbnail' type="file" src="" alt="" required onChange={(e)=>handleImageChange(e)}/>
                <input className={addMenu.input1} value = {name} required type="text"  placeholder='Dish Name' onChange={(e)=>setName(e.target.value)}/>
            </div>
            <div className={addMenu.box2}>
                <textarea className={addMenu.input1} required rows={3} name="" id="" placeholder='Dish Description' onChange={(e)=>setDesc(e.target.value)}></textarea>
                <input className={addMenu.input2} value={price} type="number" name="" id="" placeholder='price' onChange={(e)=>setPrice(e.target.value)}/>
                <select name="" id="" onChange={(e)=>{setCat(e.target.value); setSCat(subCats[e.target.value][0])}}>
                    <option value="starter">Starters</option>
                    <option value="main">Main Course</option>
                    <option value="desert">Deserts</option>
                    <option value="driAnk">Drinks</option>
                </select>
                <select name="" id="" onChange={(e)=>setSCat(e.target.value)}>
                    {
                        subCats[cat].map((subCat)=>
                            <option value={subCat}>{subCat}</option>
                        )
                    }
                </select>
                <span className={addMenu.shefSpecial} v>
                    <input type="checkbox" name="" id="shefSpecial" checked= {shef} onChange={(e)=>setShef(e.target.checked)}/>
                    <label htmlFor="shefSpecial">Is Shef Special ? </label>
                </span>
                <span className={addMenu.shefSpecial} v>
                    <input type="checkbox" name="" id="isVeg" checked= {veg} onChange={(e)=>setVeg(e.target.checked)}/>
                    <label htmlFor="isVeg">Is Veg ? </label>
                </span>
                <button type="submit" className={addMenu.addBtn}>{label? "Edit": "Add"} Item</button>
            </div>
        </form>
    );
}

function DineMenu(){
    const navigate = useNavigate();
    const [overlay, setOverlay] = useState(false);
    const [menu, setMenu] = useState([{img:"#", name:"Pavbhaji", desc:"Tasty And Delicious", price:100, cat:"Main Course", subCat:"Indian", shefSpecial: true}
    ]);
    const fetchMenu = async () => {
        let data = await fetchData('getMenu', 'GET');
        if (data.status) {
            setMenu(data.content);
        } else {
            alert("Server Error");
            navigate('/login')
        }
    };
    useEffect(() => {
        fetchMenu();
    }, []);
    
    return (
        <div>
            <button style={{position:"fixed", bottom:"40px", right:"80px", padding:"5px 20px", borderRadius:"50px", border:"0px", background:"#071f6e", color:"white", fontWeight:"bold", fontSize:"18px"}} onClick={()=>setOverlay(true)}>Add Dish</button>
            {
                overlay ? 
                <div className={dineMenu.overlay}>
                    <div className={dineMenu.exitArea} onClick={()=>setOverlay(false)}></div>
                    <AddMenu onAdd = {fetchMenu}/>
                </div> : ''
            }
            <h2 className={dineMenu.header}>Manage Menu</h2>
            <table className={dineMenu.menuTable}>
                <tbody>
                    <tr>
                        <th>Sr</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Sub Category</th>
                        <th>Is Shef's Special</th>
                        <th colSpan={2}>Actions</th>
                    </tr>
                    {
                        menu.map((dish, index)=>
                            <tr className={dineMenu.listRow}>
                                <td>{index + 1}</td>
                                <td><img src={dish.img} alt="" /></td>
                                <td>{dish.name}</td>
                                <td>{dish.desc}</td>
                                <td>{dish.price}</td>
                                <td>{dish.cat}</td>
                                <td>{dish.subCat}</td>
                                <td><input type="checkbox" name="" id="" checked = {dish.shefSpecial}/></td>
                                <td>&#128465;</td>
                                <td>&#9998;</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}

export default function Content(){
    const [contentManager, setContentManager] = useState(<DineMenu />);
    const handleChange = (selectedValue)=>{
        switch(selectedValue){
            case 'dineMenu' : 
                setContentManager(<DineMenu />);
            break;
            default:
                alert("Bad Request");
        }
    }
    return (
        <div>
            <h1>Content Management</h1>
            <select name="" id="" onChange={(e)=>{handleChange(e.target.value)}}>
                <option value="dineMenu">Dine Menu Management</option>
            </select>
            <hr />
            <div>
                {contentManager}
            </div>
        </div>
    );
}