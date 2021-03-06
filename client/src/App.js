import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import SimpleStorageContract2 from "./contracts/SimpleStorage2.json";
import SimpleStorageContract3 from "./contracts/SimpleStorage3.json";
import getWeb3 from "./utils/getWeb3";
import Ipfs from 'ipfs'
import "./App.css";
import listMaker from "./listComponent"
import { RingLoader } from 'react-spinners';
import fileDownload from 'js-file-download';
import metaUpdate from "./metaUpdate";
import metaUpdateByOwner from "./modules/metaUpdateByOwner"
import listClass from "./listComponent";
import fileReaderStream from "filereader-stream";
import {checkIPFSHash } from './utils/utils';
import Button from '@material-ui/core/Button';
import encrypt from "./crypto/encrypt";
import decrypt from "./crypto/decrypt";
import Icon from '@material-ui/core/Icon';
import { ListItem, Divider , ListItemText} from "@material-ui/core";
import fetchMeta from "./utils/fetchMeta";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import fetchMetaFile from "./utils/fetchMeta";
import { css } from '@emotion/core';
import Typography from '@material-ui/core/Typography';


const addresses = [ "0xEE36d99d9Af96F1EF2FC86a257d47f72a77dE51f",   //SENDER
                    "0xB7476c61E9805Cf3a67256448BB5F700a4b1DAD7",   //RECEIVER
                    "0xD0cfd5e97650cD3b197E00fc91C267808A3447A5"];  //INSTITUTE

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;

// import simple storage
class App extends Component {
  constructor(props){
    super(props)

    this.state = { 
      storageValue: 0, 
      web3: null, 
      accounts: null, 
      contract: null , 
      contractSender: null , 
      contractReceiver: null , 
      node : null,
      buffer: null,
      hashResponse: null  ,
      SimpleStorageInstance: null,
      metaFileHash: null,
      metaFile: null,
      metaArray : [],
      storedFolderNames: [],
      storedFileNames: [],
      selectedTag: "Health",
      latestTransactionHash: null,
      latestTransactionArray: [],
      dialog:false,
      nodeStatus:"online",
      privileges:null,
      selectedPrivilege:null,
      loading: false,
      encryptKey:""
    };
  
    this.fileCapture = this.fileCapture.bind(this);
    this.resolver = this.resolver.bind(this);
    this.fileSubmit = this.fileSubmit.bind(this);
    this.selectBarChanger = this.selectBarChanger.bind(this);
    this.selectPrivilegeChanger = this.selectPrivilegeChanger.bind(this);
    this.closethis = this.closethis.bind(this);
    this.alertAccept = this.alertAccept.bind(this);
    this.privilageSelect = this.privilageSelect.bind(this); 
  }
  
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      const ipfsNode =  new Ipfs();
      
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      const wallet = web3.eth.accounts.wallet;

      console.log("CURRENT ACCOUNT   "+accounts);
      console.log("WALLET "+wallet.privateKey);
      
      
      let privileges;
      if (accounts == addresses[0]) {privileges = "SENDER"}
      else if (accounts == addresses[1]) {privileges = "RECEIVER"}
      else if (accounts == addresses[2]) { privileges = "INSTITUTE"}
       
      //transaction history
      await web3.eth.getBlock(
        "latest",
        (error, block) => {
            if (error) {
                console.error(error);
            } else {
                console.log(block.transactions[0]); 
                this.setState({ latestTransactionHash: block.transactions[0] });
            }
        });
      let asciiResponse ="";
      let responseArray=[];
      if (this.state.latestTransactionHash != undefined)
      {
        await web3.eth.getTransaction(this.state.latestTransactionHash).then( (response)=>
        {
          asciiResponse = web3.utils.hexToAscii(response.input);
          asciiResponse = asciiResponse.replace(/["]/g,"");
          asciiResponse = asciiResponse.replace(/[\[\]\}\{]+/g,"");
          responseArray = asciiResponse.split(",");
          console.log("RESPONSE ARRAY "+responseArray);
          this.setState({ latestTransactionArray: responseArray });
        });
      }
      
                        
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork1 = SimpleStorageContract.networks[networkId];
      const deployedNetwork2 = SimpleStorageContract2.networks[networkId];
      const deployedNetwork3 = SimpleStorageContract3.networks[networkId];

      /*console.log("deployed network"+deployedNetwork2 && deployedNetwork2.address);
      console.log("deployed network ADDRESS "+deployedNetwork2.address);*/
      //deployedNetwork2.address GIVES SMART CONTRACT ADDRESS

      let instance , instanceSender ,instanceReceiver;
      if(accounts == addresses[0])
      {
        instance = new web3.eth.Contract(
          SimpleStorageContract.abi,
          deployedNetwork1 && deployedNetwork1.address,accounts
        ); 
      }
      else if (accounts == addresses[1]){
        instance = new web3.eth.Contract(
          SimpleStorageContract.abi,
          deployedNetwork2 && deployedNetwork2.address,accounts
        ); 
      }
      else if(accounts == addresses[2])
      {
        instance = new web3.eth.Contract(
          SimpleStorageContract.abi,
          deployedNetwork3 && deployedNetwork3.address,accounts
        ); 
        instanceSender = new web3.eth.Contract(
          SimpleStorageContract.abi,
          deployedNetwork1 && deployedNetwork1.address,accounts
        ); 
        instanceReceiver = new web3.eth.Contract(
          SimpleStorageContract.abi,
          deployedNetwork2 && deployedNetwork2.address,accounts
        ); 
      }
  
      //GET IPFS HASH OF PREVIOUS
      const metaFileHash = await instance.methods.getMetafile().call();
      const encryptKey = await instance.methods.getKey().call();
      this.setState({ web3, accounts, contract:instance, contractReceiver: instanceReceiver , 
        contractSender:instanceSender, node:ipfsNode, metaFileHash , privileges , encryptKey , selectedPrivilege:privileges});
      await this.ready();
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };
  
  ready = async () => {
    console.log("privileges "+this.state.privileges);
    
    //NODE INIT (DEPRECATE)
    await this.state.node.once('ready', () => {
      console.log('Online status: ', this.state.node.isOnline() ? 'online' : 'offline');
      this.setState({nodeStatus: this.state.node.isOnline() ? 'online' : 'offline'});
      /*this.state.node.id(function (err, identity) {
        if (err) {
          console.error("ERR "+err)
        }
        console.log(identity)
        });*/
      });

    
      
      //FOLDER LIST
      /*const { accounts, contract } = this.state; 
    await this.state.node.files.ls('/', function (err, files) {
        if (err) {
          console.error("ERR get"+err);
        }
        console.log("Listing folders");
        
        files.forEach((file) => {
          console.log(file.name);
        })
      });*/


    if(this.state.metaFileHash == "")
      { 
        //bugKiller
        await this.state.node.files.rm('/METAFILE',{ recursive: true }, (err) => {
          if (err) {
            console.error("ERR remove  "+err)
          }
        });
        //create meta directory for user
        await this.state.node.files.mkdir('/METAFILE', (err) => {
          if (err) {
            console.error("ERR mkdir "+err)
          }
        });

       this.setState(await metaUpdate(this.state,null));
      }
      else
      {
        //all available directories on this node
        await this.state.node.files.ls('/', (err, files)=> {
          if (err) {
            console.error("ERR get"+err);
          }
          files.forEach((file) => {
            let tempArr = [];
              this.state.storedFolderNames.push(file.name.toString("utf8"));
              tempArr = this.state.storedFolderNames;
              //console.log("tempArr "+tempArr);
              this.setState( { storedFolderNames :tempArr } );
          });
        });
        console.log(this.state);
        this.setState( await fetchMetaFile(this.state));
       
        //this.setState({ metaFile : tempState.metaFile , metaArray : tempState.metaArray })
        console.log(this.state);
      
       
     
       
        
    }

     
  }
  

  fileCapture = async () => {
    this.state.hashResponse = null;
    const fileList =  document.getElementById("file").files[0];
    
    console.log("File name = "+fileList.name);
    console.log("File size = "+fileList.size+"bytes");
    if(fileList.size > 5021039)
    {
      const start = Date.now();

      this.setState({uploadedFileName : fileList.name});
      let file = fileList;
      //const reader = new FileReader();

      if(file == undefined)
        {return console.log("EMPTY UPLOAD");}
      else {
        let chunkSize = 32768;
        this.setState({loading:true});
        //reader.readAsArrayBuffer(file);// IMPRACTICAL
        const readStream = fileReaderStream(file,chunkSize);

        this.state.node.addFromStream(readStream, (err, result) => {
          if (err) {
            throw err
          }
          console.log(result);
          result.forEach((file) => {
            document.getElementById("result").innerHTML = (file.hash);
            this.state.hashResponse = file.hash;
          });
          this.setState({loading:false});
          const end = Date.now();
          let millis = end - start; 
          console.log("seconds elapsed = " + Math.floor(millis/1000));
        })
      }
    }
    else
    {
      this.setState({uploadedFileName : fileList.name});
      let file = fileList;
      const reader = new FileReader();

      if(file == undefined)
        {return console.log("EMPTY UPLOAD");}
      else {reader.readAsArrayBuffer(file);}
    
      reader.onloadend = () => {
      
        if(reader.result == undefined)
        {return console.log("EMPTY UPLOAD");}
        let fileBuffer = Buffer.from(reader.result);
        console.log("fileBuffer =" + fileBuffer);

        this.setState( {buffer: fileBuffer});
        console.log();
        
        // ENCRYPT
        
        const encryptedBuffer = encrypt(this.state.encryptKey,fileBuffer);
        // outputs your buffer
        //console.log(decrypt(key,encryptedBuffer).toString('utf8'));


        //add file to ipfs
        this.state.node.add(encryptedBuffer, (err, filesAdded) => {
          if (err) {
            return console.error('Error - ipfs add', err, filesAdded);
          }
        
          filesAdded.forEach((file) => {
            document.getElementById("result").innerHTML = (file.hash);
            this.state.hashResponse = file.hash;
          });
        });
      }
    }
    console.log(this.state);
  }

  fileSubmit = async() => {
    console.log(this.state);
    const { accounts, contract } = this.state;
    if (this.state.hashResponse == null)
    {
      return console.log("UPLOAD FILE FIRST");
    }

    const tempFileOBJ = 
        {
          "name": this.state.uploadedFileName,
          "hash": this.state.hashResponse,
          "tag" : this.state.selectedTag,
          "privileges":this.state.privileges,
          "key":this.state.encryptKey
        };

    if(this.state.selectedPrivilege != this.state.privileges)
      {
        console.log("BLASPHEMY");
        await metaUpdateByOwner(this.state,tempFileOBJ)
        return console.log("WROTE SOME1 ELSE'S META");;
      }

    let data = [];
    console.log(this.state);
    
    data = JSON.parse(this.state.metaFile.content);
    let boolSwitch = true;
    
    data.forEach((obj)=>{
     if(obj.hash == this.state.hashResponse)
     {
       alert("THIS FILE ALREADY ADDED");
       boolSwitch = false;
     }
     if(obj.name == this.state.uploadedFileName)
     {
       alert("THIS FILE NAME ALREADY EXIST CHANGE NAME");
       boolSwitch = false;
     }
    });
    if(boolSwitch)
    {
      data.push(tempFileOBJ);
      const userNewMeta = JSON.stringify(data);
      const fileBuffer = new Buffer.from(userNewMeta);
      this.setState(await metaUpdate(this.state,fileBuffer));
      // Stores a given value to contract
      // Get the value from the contract to prove it worked.
      const response = await contract.methods.get().call();
      console.log("data from contract  = "+response);
      
     }
     else{
       console.log("Failed to upload."); 
     }
  }


  resolver = () => {
    if (this.state.hashResponse == null){
      return console.log("UPLOAD FILE FIRST");
    }

    this.state.node.cat(this.state.hashResponse, function (err, data) {
      if (err) {
        return console.error('Error - ipfs files cat', err, data);
      }
      document.getElementById("response").innerHTML = 'Response : ' + data.toString();
      console.log("inc data = " + data.toString());
    });

    const validCID = this.state.hashResponse;

    this.state.node.get(validCID, function (err, files) {
      files.forEach((file) => {
        console.log("filepath = "+file.path);
        console.log("filepathUTF = "+file.content.toString('utf8'));
      })
    })
  }

  selectBarChanger(event) {
    this.setState({selectedTag: event.target.value});
  }

  selectPrivilegeChanger(event) {
    this.setState({selectedPrivilege: event.target.value});
  }

  closethis = () => { 
    this.setState({dialog: false}); 
  }

  alertAccept = async () =>
  {
    this.closethis();
    let approvedHashes = await checkIPFSHash(this.state,"getHashes");
    if((approvedHashes == undefined ) || (approvedHashes == null))
    {
      console.log("BIG ERROR");
      return;
    }
    let transactionARR = this.state.latestTransactionArray;
    console.log("Transaction ARR = "+this.state.latestTransactionArray);
    console.log("approvedHashes ALERT= "+approvedHashes);
    const tempFileOBJ = 
          {
            "name": "xxx",
            "hash": "xxx",
            "tag" : "xxx",
            "privileges":"xxx",
            "key":"xxx"
          } ;
    for(let i=0;i<approvedHashes.length;i++)
    {
      let index = transactionARR.indexOf(approvedHashes[i])
      tempFileOBJ.name  =   transactionARR[index-1];
      tempFileOBJ.hash  =   transactionARR[index];
      tempFileOBJ.tag   =   transactionARR[index+1];
      tempFileOBJ.privileges   =   transactionARR[index+2];
      tempFileOBJ.key   =   transactionARR[index+3];
      console.log("tempFileOBJ  "+tempFileOBJ.name);
      this.state.metaArray.push(tempFileOBJ);
    }
    console.log("NEW META "+this.state.metaArray);
    
    const userNewMeta = JSON.stringify(this.state.metaArray);
    const fileBuffer = new Buffer.from(userNewMeta);
    this.setState(await metaUpdate(this.state,fileBuffer));
    this.closethis();
  }

  privilageSelect = () =>
  {
    if( this.state.privileges != "INSTITUTE" )
    {
      return ;
    }
    else
    {
      return (
        <label>
          Pick Your User To Create:
          <select value={this.state.selectedPrivilege} onChange={this.selectPrivilegeChanger}>
            <option value="INSTITUTE">INSTITUTE</option>
            <option value="SENDER">SENDER</option>
            <option value="RECEIVER">RECEIVER</option>
          </select>
        </label>
      )
    }
    
  }



  dialog =  () =>{

    try{
    
    let tempMetaArr = this.state.metaArray;
    let  hashes =  checkIPFSHash(this.state,"getHashes");
   
    if((hashes == undefined ) || (hashes == null) || (tempMetaArr == null) || (hashes.length == 0))
    {
      console.log("Prev Transaction Detected");
      return;
    }
    else
    {

      
    console.log("DIALOG TRIGGERED");
    let names =  this.state.storedFileNames;
    if(names == null)
    {return;}
    if (names.length > 0) 
      {
        let namesSTR = names.toString();
        namesSTR = namesSTR.replace(",","\n");
        console.log(namesSTR);
        console.log("HASHES - DIALOG "+hashes);
        return(
          <div>
          <Dialog 
            id = "myDialog"
            open = {this.state.dialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"RECEIVED"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
              SHALL I ENTER THESE TO LEDGER ?<br></br>  
              </DialogContentText>
              {namesSTR}
            </DialogContent>
            <DialogActions>
              <Button  color="primary" onClick={this.closethis}>
                Disagree
              </Button>
              <Button  color="primary" onClick={() => this.alertAccept(this.state)}>
                Agree
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        );
      }
      else if ((names == null) || (names == undefined) || (names.length== 0))
      { console.log("ENDID");
      
        return null;}
    }
   }catch(e) {
      console.error("Problem", e)
    }
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
     
      <div className="App">
       <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
       <h1>Personal Data Sharing Application</h1>
        <p>This is an application demo which has been developed over distributed file sharing framework</p>
        <p>It works for 3 types of data : 
          <br></br>Health Report
          <br></br>Financial Report
          <br></br>Criminal Report
        </p>
        <Divider variant="middle" />
        <div className="App-logo"></div>
        <h2 id="status">WELCOME {this.state.privileges}</h2>
        <Divider variant="middle" />
        <h3 id="status">Node status: {this.state.nodeStatus} </h3>
       
        <h3>Upload file to IPFS : </h3>
        <input type="file" id="file" onChange={this.fileCapture} />
        
       <div>
        <label>
          Pick Your File Tag:
          <select value={this.state.selectedTag} onChange={this.selectBarChanger}>
            <option value="Health">Health</option>
            <option value="Finance">Finance</option>
            <option value="Criminal-Records">Criminal Records</option>
          </select>
        </label>
        </div>

        <div> {this.privilageSelect()} </div>
        

        <button  onClick={this.fileSubmit} >Save it to ipfs</button>
        <div className='sweet-loading'>
        <RingLoader
          css={override}
          sizeUnit={"px"}
          size={80}
          color={'LightSeaGreen'}
          loading={this.state.loading}
        />
      </div> 
        <p>A file added with hash:</p>
        <p id="result"></p>
        
      
        <Divider variant="middle" />
        
        <div >
        <header>
           <Typography variant="h2" color="secondary">
            Files
          </Typography>
        </header>
         

        { listMaker(this.state) }
        </div>

        <div >
          {this.dialog()}
        </div>
       
      </div>
    );
  }
}
export default App;



