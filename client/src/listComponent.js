
import React, { Component } from "react";
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';

import Icon from '@material-ui/core/Icon';
import { ListItem, Divider , ListItemText} from "@material-ui/core";

const buttonStyle = {
    margin:"5px"
  };

const collapseState = {
  open: true
}

const listMaker = ( state) => {

    let healthNames = [];
    let financeNames = [];
    let criminalRecordshNames = [];
    if(state.metaArray != null)
    {
      
      state.metaArray.forEach((element)=>
      {
        if(element.tag == "Health")
        {
          healthNames.push(element.name);
        }
        if(element.tag == "Finance")
        {
          financeNames.push(element.name);
        }
        if(element.tag == "Criminal-Records")
        {
          criminalRecordshNames.push(element.name);
        }
      });
      
//HEALTH
      const listItems_H = healthNames.map((name,index) =>
      <List component="nav" className = "List" >
       <ListItem button={false} key={index} className="List-item" >
            <ListItemText primary={name} inset={true} secondary= "Date Here" className="List-item-text"></ListItemText>
        </ListItem> 
      <Divider/>
      </List>
      );
//FINANCE
      const listItems_F = financeNames.map((name,index) =>
      <List component="nav" className = "List" >
       <ListItem button={false} key={index} className="List-item" >
            <ListItemText primary={name} inset={true} secondary= "Date Here" className="List-item-text"/>  
        </ListItem> 
      <Divider/>
      </List>
       
      );

//CRIMINAL REPORTS
      const listItems_C = criminalRecordshNames.map((name,index) =>
      <List component="nav" className = "List" >
       <ListItem button={false} key={index} className="List-item" >
            <ListItemText primary={name} inset={true} secondary= "Date Here" className="List-item-text"/>  
        </ListItem> 
      <Divider/>
      </List>
      );
      return (
      <div id="topDivList">
      <div > 
      <header><h3>HEALTH
      <Button variant="contained" size="small" style = {buttonStyle} color="primary" className="List-item-button" onClick={() => sendFile(state,0,healthNames)} > Send<Icon className="Icon" >send</Icon></Button>
      </h3></header>
      {listItems_H}
      </div>
      <div > 
      <header><h3>FINANCE
      <Button variant="contained" size="small" style = {buttonStyle} color="primary" className="List-item-button" onClick={() => sendFile(state,0,financeNames)} > Send<Icon className="Icon" >send</Icon></Button>
      </h3></header>
      {listItems_F}</div>
      <div >
      <header><h3>CRIMINAL RECORDS
      <Button variant="contained" size="small" style = {buttonStyle} color="primary" className="List-item-button" onClick={() => sendFile(state,0,criminalRecordshNames)} > Send<Icon className="Icon" >send</Icon></Button>
      </h3></header>
         {listItems_C}</div>
      </div>
      );
    }
}

function hex_to_ascii(str1)
 {
	var hex  = str1.toString();
	var str = '';
	for (var n = 0; n < hex.length; n += 2) {
		str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
	}
	return str;
 }

function toHexString(byteArray) {
  return Array.from(byteArray, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}

//RECONSTRUCT TO SEND ALL CHILD FILES
const sendFile = async (state,index,names)=>
{
  console.log("names === "+names);
  

let files=[];
state.metaArray.forEach((element)=>{

  for(let i=0;i<names.length;i++)
  {
    if(element.name == names[i])
    {
      files.push(element.name);
      files.push(element.hash);
      files.push(element.tag);
      files.push(element.privileges);

    }
  };
});
              
  //let tester = hex_to_ascii(state.web3.utils.toHex(state.metaArray)).split(","); 
  console.log("selectedHash == "+files);
  //await state.contract.methods.set(selectedHash).send({ from: state.accounts[0] ,to:"0xc0C55406744183a7834A19cf7bFB197b767Be29F",gasPrice: '20000000000', gas: 6721975});
  await state.web3.eth.sendTransaction({ from: state.accounts[0] ,to:"0xc0C55406744183a7834A19cf7bFB197b767Be29F",data:state.web3.utils.toHex(files),gasPrice: '20000000000', gas: 6721975})
  //window.location.reload();
    
    
}


export default listMaker;