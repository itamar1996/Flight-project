const baseurl = "https://66e98a6387e417609449dfc5.mockapi.io/api/"
const selectfligths : HTMLSelectElement = document.querySelector(".fligths")!
 const pesengerList : HTMLUListElement = document.querySelector(".pesenger-li")!
 const addPessengerBtn : HTMLButtonElement = document.querySelector(".send")!
 const hedderdiv : HTMLDivElement = document.querySelector(".hedder-div")! 
const agent = "agent8340332";
const get_data_for_user =async (data:string,userid:string):Promise<Pessenger[]| Flight[]|undefined>=>{
    try {
        const res :Response = await fetch(`${baseurl}${data}${data == "pasangers"? `?agent=${agent}`:""}`)
        return res.json();
    } catch (error) {
        console.log(error);
    }
}
const loadFlifths = async() :Promise<void>=> {
    try {
        const fligths = await get_data_for_user("flights", "") as Flight[];
        for (const fligth of fligths) {
            const option : HTMLOptionElement = document.createElement("option");
            option.value = fligth.id;
            option.textContent = fligth.date +" "+fligth.from+"-"+fligth.to;
            selectfligths.appendChild(option);
        }
    } catch (error) {
        console.log(error);
        
    }
}
const loadPessengers = async() :Promise<void>=> {
    pesengerList.innerHTML = "";
    try {
        const Pessengers = await get_data_for_user("pasangers", "") as Pessenger[];
        for (const pessenger of Pessengers) {
            pesengerList.appendChild(retliforpess(pessenger));
        }
    } catch (error) {
        console.log(error);
        
    }
}
const retliforpess = (pessenger: Pessenger): HTMLLIElement => {
    const pesangerItem: HTMLLIElement = document.createElement("li");
    pesangerItem.id = pessenger.id;
    
    const btnsdiv: HTMLDivElement = document.createElement("div"); 
    btnsdiv.className = "btns-div";

    btnsdiv.appendChild(retBtnsForPessenger("del-btn", pessenger.id));
    btnsdiv.appendChild(retBtnsForPessenger("edite-btn", pessenger.id));
    pesangerItem.textContent += `${pessenger.gender}`;
    const namep: HTMLParagraphElement = document.createElement("p");
    namep.textContent = pessenger.name;
    pesangerItem.appendChild(namep);
 
    pesangerItem.appendChild(btnsdiv);

    return pesangerItem;
}

const retBtnsForPessenger = (type : string,pessId :string) : HTMLButtonElement=>{
    const Btn :HTMLButtonElement = document.createElement("button");
    Btn.className = `${type} btns`;
    Btn.textContent = type == "del-btn"?"X":"edite"; 
    type == "del-btn"? Btn.addEventListener("click",()=>delPessenger(pessId)):
    Btn.addEventListener("click",()=>EditePessBtn(pessId))
    return Btn;
}
const addPessenger = async()=>
{
    console.log(RetPessFromForm(hedderdiv));
    
    try {
        const res = await fetch(`${baseurl}pasangers`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(await RetPessFromForm(hedderdiv))
        });

        if (res.ok) {
            const newItem = await res.json();
            console.log( newItem);
            loadPessengers();
        } else {
            console.error( res.statusText);
        }
    } catch (error) {
        console.error(`Error adding :`, error);
    }
    
}

const delPessenger = async (pessId :string):Promise<void>=>{
    try {
        const res = await fetch(`${baseurl}pasangers/${pessId}`,{
            method :"DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        })
        if (res.ok) {
            const newItem = await res.json();
            console.log( newItem);
            loadPessengers();
        } else {
            console.error( res.statusText);
        }
    } catch (error) {
        console.error(`Error adding :`, error);

    }
}
const EditePessBtn = async (pessId: string): Promise<void> => {
    const editeinput = hedderdiv.cloneNode(true) as HTMLDivElement;
    
    const pessengeritem = document.getElementById(pessId);
    const namep: HTMLParagraphElement = pessengeritem?.querySelector("p")!
    
    const inputname = editeinput.querySelector(".name") as HTMLInputElement | null;
    
    const buttonSave = editeinput.querySelector(".send") as HTMLButtonElement | null;

    if (inputname&&buttonSave) {
        // inputname.className = "edit-name"
        inputname.value = namep.textContent||"";
    }

    if (buttonSave&&pessengeritem) {
        buttonSave.textContent = "Save Changes";
        buttonSave.addEventListener("click", () =>EditePess(editeinput,pessengeritem.id));
    }
    if (pessengeritem) {
        console.log(pessengeritem);
        pessengeritem.innerHTML = "";
        pessengeritem.appendChild(editeinput);
    } else {
        console.error(`Element with id ${pessId} not found`);
    }
}
const RetPessFromForm = (form :HTMLDivElement): Pessenger => {
    const name: string = (form.querySelector(".name") as HTMLInputElement).value;
    const gender: string = (form.querySelector('input[name="gender"]:checked') as HTMLInputElement).value;
    const flightValue: string = (form.querySelector(".fligths") as HTMLSelectElement).value;
    
    return {
        id: "", 
        name: name,
        gender: gender,
        flight_id: flightValue,
        agent: "agent8340332", 
        createdAt: new Date().toISOString()  
    };
}

const EditePess = async(form :HTMLDivElement, pessId:string):Promise<void>=>{
    console.log(form);
    
    try {
        const res = await fetch(`${baseurl}pasangers/${pessId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(RetPessFromForm(form))
        });

        if (res.ok) {
            const newItem = await res.json();
            console.log( newItem);
            loadPessengers();
        } else {
            console.error( res.statusText);
        }
    } catch (error) {
        console.error(`Error adding :`, error);
    }
    
}

addPessengerBtn.addEventListener("click",()=>addPessenger())
loadFlifths()
loadPessengers()

interface Flight{
    
    date: string,
    from: string,
    to: string,
    id:string
    
}
interface Pessenger{
    id: string
    createdAt: string,
    name: string,
    gender: string,
    flight_id: string,
    agent: "agent8340332"      
}