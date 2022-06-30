let db; // database

//1.opening database
//2.create object store --- sql -> tables 
                            // mongo -> collection
//3. make transactions
let openReq = indexedDB.open('db'); // one more params which tells the version
openReq.addEventListener('success',(e)=>{
    console.log('db opened');
    db = openReq.result;
})

openReq.addEventListener('error',(e)=>{
    console.log('db error occured');

})
// object store can only be created/ modify in upgrade needed event
openReq.addEventListener('upgradeneeded',(e)=>{
    // db first time creates here
    db = openReq.result;
    console.log('db upgraded ');
    db.createObjectStore("video",{keyPath: "id"})  // keypath in unique term
    db.createObjectStore("image",{keyPath: "id"})


})
