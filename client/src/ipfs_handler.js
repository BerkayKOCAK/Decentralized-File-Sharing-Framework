

window.onload = function () {
    console.log("load event detected!");
    const inputElement = document.getElementById("file");
    inputElement.addEventListener("change", fileAdder, false);
  
    const buttonElement = document.getElementById("resolveButton");
    buttonElement.addEventListener("click", resolver, false);
  }
  
  
  // Store data outside your user directory
  const node = new Ipfs({ repo: './rep' })
  
  let hashResponse;
  
  
  
  const ready = () => {
    node.once('ready', () => {
      console.log('Online status: ', node.isOnline() ? 'online' : 'offline')
      document.getElementById("status").innerHTML = 'Node status: ' + (node.isOnline() ? 'online' : 'offline')
      
  
    })
  }
  
  const fileAdder = () => {
   const fileList =  document.getElementById("file").files[0]//this.files;
     /*let arrayBuffer = [];
    reader.readAsArrayBuffer(fileList[0]);
    arrayBuffer = reader*/
    /* now you can work with the file list 
    console.log("fileList = " + fileList);
    let fileBuffer = Buffer.from(fileList[0]);*/
  
   
              var file = fileList;
              var reader = new FileReader();
  
          
        
        reader.onload = function(e) {
          
          let fileBuffer = Buffer.from(reader.result);
          console.log("fileBuffer =" + fileBuffer);
        
          node.add(fileBuffer, (err, filesAdded) => {
            if (err) {
              return console.error('Error - ipfs add', err, filesAdded)
            }
        
            filesAdded.forEach((file) => {
              document.getElementById("result").innerHTML = (file.hash);
              hashResponse = file.hash;
              return hashResponse;
            });
        
          });
        }
      reader.readAsArrayBuffer(file);	
    //resolver();
  
  
  }
  const resolver = () => {
    node.cat(hashResponse, function (err, data) {
      if (err) {
        return console.error('Error - ipfs files cat', err, res)
      }
      document.getElementById("response").innerHTML = 'Response : ' + data.toString();
      console.log("inc data = " + data.toString())
    })
  }
  console.log("Boot Starts.");
  ready();
  
  module.exports = {
    fileAdder
  }