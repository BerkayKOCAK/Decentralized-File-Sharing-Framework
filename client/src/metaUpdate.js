
const metaUpdate = async (state,newMeta) =>
{
    
    let fileBuffer;
    let userMeta;
    if(newMeta == null)
    {console.log("No MetaFile found ! Adding new meta file");
      const metaJSON = [
        {
          "name": "meta.json",
          "hash": "QmeFJofJMLbH8s2RVLZ6QHVB4PfHwbeDRmh28tvvXt5MbU",
          "tag" : "meta",
          "privileges" : state.privileges
        }
      ];
      
        userMeta = JSON.stringify(metaJSON);//json arr to json obj
        fileBuffer = new Buffer.from(userMeta);//json obj to buffer
    }
    else
    {fileBuffer = newMeta;}

    await state.node.add(fileBuffer, async(err, addedMeta) => {
      if (err) {
        return console.error('Error - ipfs add', err, addedMeta);
      }
      
      state.metaFileHash = addedMeta[0].hash;
      console.log("metahash === "+state.metaFileHash);
      await state.contract.methods.setMetaFile(state.metaFileHash).send({ from: state.accounts[0] ,gasPrice: '20000000000', gas: 6721975});
      window.location.reload();
    });

    await state.node.get(state.metaFileHash, async (err, files) => {
        if (err) {
          console.error("ERR get"+err)
        }
          files.forEach((file) => {
            console.log("filepath (METAFILE HASH)= "+file.path)
            state.metaFile = file
          console.log("MetaUpdate - MetaArray == "+state.metaArray);     
        }); 
      });   
return state;
}

export default metaUpdate;
