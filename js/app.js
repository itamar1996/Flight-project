"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const baseurl = "https://66e98a6387e417609449dfc5.mockapi.io/api/";
const selectfligths = document.querySelector(".fligths");
const pesengerList = document.querySelector(".pesenger-li");
const addPessengerBtn = document.querySelector(".send");
const hedderdiv = document.querySelector(".hedder-div");
const agent = "agent8340332";
const get_data_for_user = (data, userid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield fetch(`${baseurl}${data}${data == "pasangers" ? `?agent=${agent}` : ""}`);
        return res.json();
    }
    catch (error) {
        console.log(error);
    }
});
const loadFlifths = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fligths = yield get_data_for_user("flights", "");
        for (const fligth of fligths) {
            const option = document.createElement("option");
            option.value = fligth.id;
            option.textContent = fligth.date + " " + fligth.from + "-" + fligth.to;
            selectfligths.appendChild(option);
        }
    }
    catch (error) {
        console.log(error);
    }
});
const loadPessengers = () => __awaiter(void 0, void 0, void 0, function* () {
    pesengerList.innerHTML = "";
    try {
        const Pessengers = yield get_data_for_user("pasangers", "");
        for (const pessenger of Pessengers) {
            pesengerList.appendChild(retliforpess(pessenger));
        }
    }
    catch (error) {
        console.log(error);
    }
});
const retliforpess = (pessenger) => {
    const pesangerItem = document.createElement("li");
    pesangerItem.id = pessenger.id;
    const btnsdiv = document.createElement("div");
    btnsdiv.className = "btns-div";
    btnsdiv.appendChild(retBtnsForPessenger("del-btn", pessenger.id));
    btnsdiv.appendChild(retBtnsForPessenger("edite-btn", pessenger.id));
    pesangerItem.textContent += `${pessenger.gender}`;
    const namep = document.createElement("p");
    namep.textContent = pessenger.name;
    pesangerItem.appendChild(namep);
    pesangerItem.appendChild(btnsdiv);
    return pesangerItem;
};
const retBtnsForPessenger = (type, pessId) => {
    const Btn = document.createElement("button");
    Btn.className = `${type} btns`;
    Btn.textContent = type == "del-btn" ? "X" : "edite";
    type == "del-btn" ? Btn.addEventListener("click", () => delPessenger(pessId)) :
        Btn.addEventListener("click", () => EditePessBtn(pessId));
    return Btn;
};
const addPessenger = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(RetPessFromForm(hedderdiv));
    try {
        const res = yield fetch(`${baseurl}pasangers`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(yield RetPessFromForm(hedderdiv))
        });
        if (res.ok) {
            const newItem = yield res.json();
            console.log(newItem);
            loadPessengers();
        }
        else {
            console.error(res.statusText);
        }
    }
    catch (error) {
        console.error(`Error adding :`, error);
    }
});
const delPessenger = (pessId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield fetch(`${baseurl}pasangers/${pessId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        });
        if (res.ok) {
            const newItem = yield res.json();
            console.log(newItem);
            loadPessengers();
        }
        else {
            console.error(res.statusText);
        }
    }
    catch (error) {
        console.error(`Error adding :`, error);
    }
});
const EditePessBtn = (pessId) => __awaiter(void 0, void 0, void 0, function* () {
    const editeinput = hedderdiv.cloneNode(true);
    const pessengeritem = document.getElementById(pessId);
    const namep = pessengeritem === null || pessengeritem === void 0 ? void 0 : pessengeritem.querySelector("p");
    const inputname = editeinput.querySelector(".name");
    const buttonSave = editeinput.querySelector(".send");
    if (inputname && buttonSave) {
        // inputname.className = "edit-name"
        inputname.value = namep.textContent || "";
    }
    if (buttonSave && pessengeritem) {
        buttonSave.textContent = "Save Changes";
        buttonSave.addEventListener("click", () => EditePess(editeinput, pessengeritem.id));
    }
    if (pessengeritem) {
        console.log(pessengeritem);
        pessengeritem.innerHTML = "";
        pessengeritem.appendChild(editeinput);
    }
    else {
        console.error(`Element with id ${pessId} not found`);
    }
});
const RetPessFromForm = (form) => {
    const name = form.querySelector(".name").value;
    const gender = form.querySelector('input[name="gender"]:checked').value;
    const flightValue = form.querySelector(".fligths").value;
    return {
        id: "",
        name: name,
        gender: gender,
        flight_id: flightValue,
        agent: "agent8340332",
        createdAt: new Date().toISOString()
    };
};
const EditePess = (form, pessId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(form);
    try {
        const res = yield fetch(`${baseurl}pasangers/${pessId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(RetPessFromForm(form))
        });
        if (res.ok) {
            const newItem = yield res.json();
            console.log(newItem);
            loadPessengers();
        }
        else {
            console.error(res.statusText);
        }
    }
    catch (error) {
        console.error(`Error adding :`, error);
    }
});
addPessengerBtn.addEventListener("click", () => addPessenger());
loadFlifths();
loadPessengers();
