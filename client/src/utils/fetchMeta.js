import {checkIPFSHash } from './utils';

const fetchMetaFile = async (state) =>
{
    let newState;
    await state.node.get(state.metaFileHash, async (err, files) => {
        if (err) {
          console.error("ERR get"+err)
        }
          files.forEach((file) => {
            console.log("filepath (METAFILE HASH)= "+file.path)
            state.metaFile=file
            //metafile parse and get info
            console.log(file);
            let data = JSON.parse(file.content);

            data.forEach((obj) => {
            console.log(obj);
            state.metaArray.push(obj);
            console.log(state.metaArray);
          });
        }); 
        //QUERY FOR LATEST TRANSACTION
        console.log("CHECKING DUPLICATE ON FETCH");
        const storedFiles = await checkIPFSHash(state,"check");
        state.storedFileNames=storedFiles;
        console.log("STORED FILES"+state.storedFileNames);
        state.dialog = true;
        newState = state;
      });
    return newState;

}

export default fetchMetaFile;