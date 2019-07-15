
import fetchMeta from '../utils/fetchMeta';


const metaUpdateByOwner = async (state,fileToAdd) =>
{

    
    let selectedContract;
    let boolSwitch = true;
    let metaFile;
    let metaFileHash;
    let metaArray = [];

    console.log("PRIVILEGES = "+state.privileges);
    console.log("SELECTED PRIVILAGE = "+state.selectedPrivilege);

    if (state.selectedPrivilege =="SENDER") 
      { 
        //get meta of selected contract 
        selectedContract = state.contractSender
        metaFileHash = await selectedContract.methods.getMetafile().call();
        console.log("CONTRACT SENDER HASH "+state.metaFileHash);
    
        let i = 0;
        await state.node.get(metaFileHash, async (err, files) => {
            if (err) {
              console.error("ERR get"+err)
            }
              files.forEach((file) => {
                console.log("filepath (METAFILE HASH)= "+file.path)
                metaFile=file
                //metafile parse and get info
                console.log(file);
                let tempMetaContent = JSON.parse(file.content);
    
                tempMetaContent.forEach((obj) => {
                if (obj.hash != metaFileHash)
                    {
                        console.log(obj);
                        metaArray.push(obj);
                        console.log(metaArray);
                    }
                i++;
              });
            }); 
            console.log(state);
        
            //Get Current meta to a array
            let data = [];
            data = JSON.parse(metaFile.content);
            console.log("data = "+data);
            
            //now we must check for duplicate upload
            data.forEach((obj)=>{
              if(obj.hash == state.hashResponse)
              {
                alert("THIS FILE ALREADY EXIST ON YOUR USER");
                console.log("THIS FILE ALREADY EXIST ON YOUR USER");
                
                boolSwitch = false;
              }
              if(obj.name == state.uploadedFileName)
              {
                alert("THIS FILE NAME ALREADY EXIST  ON YOUR USER , CHANGE NAME");
                console.log("THIS FILE NAME ALREADY EXIST  ON YOUR USER , CHANGE NAME AND TRY AGAIN");
                boolSwitch = false;
              }
            });
    
            if(boolSwitch)
            {
                //append new item to meta
                data.push(fileToAdd);
                console.log("AFTER PUSJH "+data);
                
                const userNewMeta = JSON.stringify(data);
                const fileBuffer = new Buffer.from(userNewMeta);
    
                //add it to ipfs
                await state.node.add(fileBuffer, async(err, addedMeta) => {
                    if (err) {
                      return console.error('Error - ipfs add', err, addedMeta);
                    }
                    metaFileHash = addedMeta[0].hash;
                    console.log("NEW META HASH  === "+metaFileHash);
                    await selectedContract.methods.setMetaFile(metaFileHash).send({ from: state.accounts[0] ,gasPrice: '20000000000', gas: 6721975});
                    console.log("NEW META ADDED TO SENDER ");
                  });
            }
            else{console.log("Failed to upload.");}   
        
        
        });



        
      }

    else if (state.selectedPrivilege == "RECEIVER") 
      { 
        //get meta of selected contract 
        selectedContract = state.contractReceiver
        metaFileHash = await selectedContract.methods.getMetafile().call();
        console.log("CONTRACT SENDER HASH "+state.metaFileHash);
    
        let i = 0;
        await state.node.get(metaFileHash, async (err, files) => {
            if (err) {
              console.error("ERR get"+err)
            }
              files.forEach((file) => {
                console.log("filepath (METAFILE HASH)= "+file.path)
                metaFile=file
                //metafile parse and get info
                console.log(file);
                let tempMetaContent = JSON.parse(file.content);
    
                tempMetaContent.forEach((obj) => {
                if (obj.hash != metaFileHash)
                    {
                        console.log(obj);
                        metaArray.push(obj);
                        console.log(metaArray);
                    }
                i++;
              });
            }); 
            console.log(state);
        
            //Get Current meta to a array
            let data = [];
            data = JSON.parse(metaFile.content);
            console.log("data = "+data);
            
            //now we must check for duplicate upload
            data.forEach((obj)=>{
              if(obj.hash == state.hashResponse)
              {
                alert("THIS FILE ALREADY EXIST ON YOUR USER");
                console.log("THIS FILE ALREADY EXIST ON YOUR USER");
                
                boolSwitch = false;
              }
              if(obj.name == state.uploadedFileName)
              {
                alert("THIS FILE NAME ALREADY EXIST  ON YOUR USER , CHANGE NAME");
                console.log("THIS FILE NAME ALREADY EXIST  ON YOUR USER , CHANGE NAME AND TRY AGAIN");
                boolSwitch = false;
              }
            });
    
            if(boolSwitch)
            {
                //append new item to meta
                data.push(fileToAdd);
                console.log("AFTER PUSJH "+data);
                
                const userNewMeta = JSON.stringify(data);
                const fileBuffer = new Buffer.from(userNewMeta);
    
                //add it to ipfs
                await state.node.add(fileBuffer, async(err, addedMeta) => {
                    if (err) {
                      return console.error('Error - ipfs add', err, addedMeta);
                    }
                    metaFileHash = addedMeta[0].hash;
                    console.log("NEW META HASH  === "+metaFileHash);
                    await selectedContract.methods.setMetaFile(metaFileHash).send({ from: state.accounts[0] ,gasPrice: '20000000000', gas: 6721975});
                    console.log("NEW META ADDED TO RECEIVER ");
                  });
            }
            else{console.log("Failed to upload.");}   
        
        
        });
    }
    else 
      {console.log("VERY BAD BUG");}
      
}

export default metaUpdateByOwner;
