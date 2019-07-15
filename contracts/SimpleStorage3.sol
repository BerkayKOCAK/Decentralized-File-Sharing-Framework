pragma solidity ^0.5.0;

contract SimpleStorage3 {
  string storedData;
  string metaHash;
  
  function set(string memory x) public {
    storedData = x;
    
  }

  function setMetaFile(string memory temp) public {
    metaHash = temp;
    
  }

  function get() public view returns (string memory) {
    return storedData;
  }

  function getMetafile() public view returns (string memory) {
    return metaHash;
  }
}
