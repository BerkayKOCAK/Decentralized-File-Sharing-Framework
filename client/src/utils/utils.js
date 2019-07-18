
import isIPFS from "is-ipfs"

const checkIPFSHash = async (state,mode) =>
{
  let transactionARR = state.latestTransactionArray;
  let hashes  = [];
  let names   = [];
  let tags    = [];
  let privileges    = [];
  let keys = [];
  if(transactionARR.length<2)
  {return null;}
  
  for(let hashIndex = 1;hashIndex<transactionARR.length;hashIndex = hashIndex+4)
    {
      if(isIPFS.multihash(transactionARR[hashIndex]) == false)
      {
        console.log("wrong hash");
        
        alert("WTF IS GOIN ON!");
        return null;
      }
      else
      {
        names.push(transactionARR[hashIndex-1]);
        hashes.push(transactionARR[hashIndex]);
        tags.push(transactionARR[hashIndex+1]);
        privileges.push(transactionARR[hashIndex+2]);
        keys.push(transactionARR[hashIndex+3]);
      }
    };

  const approvedHashes = checkDuplicate(state,hashes)
  console.log("approvedHashes "+approvedHashes);
  
  if(approvedHashes == null){
    console.log("\nNone of the hashes approved !\n");
      return null;
    }
  else if (mode == "check"){
      console.log("   ------------Incoming Transaction------------");
      let approvedNames = checkDuplicateName(state,names);
      return approvedNames;
    }
  else if (mode == "getHashes"){
      return approvedHashes;
    }
}


const checkDuplicate = (state,hashes) =>
{
  let approvedHashes = [];
  let boolSwitch = false;
  if(state.metaArray != undefined)
  {
    for(let i=0;i<hashes.length;i++){
        boolSwitch = false
        state.metaArray.forEach((element)=>{
          if(element.hash == hashes[i])
          {
            let tagIndex = state.latestTransactionArray.indexOf(hashes[i]);
            tagIndex++;
            if(element.tag == state.latestTransactionArray[tagIndex])
            {
              console.log("ITS DUPLICATE !"+element.name);
              boolSwitch = true;
            }
          }
        });

        if (boolSwitch== false)
        {approvedHashes.push(hashes[i]);}
    }
  return approvedHashes;
  }
  else{
    console.log("CANT REACH META ARRAY !");
    return approvedHashes;
  }
}

const checkDuplicateName = (state,names) => {

  let approvedNames = [];
  let boolSwitch = false;
  if(state.metaArray != undefined)
  {
    for(let i=0;i<names.length;i++){
        boolSwitch = false
        state.metaArray.forEach((element)=>{
          if(element.name == names[i])
          {
            console.log("ITS DUPLICATE ! "+element.name);
            boolSwitch = true;
          }
        });

        if (boolSwitch== false)
        {approvedNames.push(names[i]);}
    }
    
  return approvedNames;
  }
  else{
    console.log("CANT REACH META ARRAY !");
    return approvedNames;
  }
}

export { checkIPFSHash , checkDuplicate   };


