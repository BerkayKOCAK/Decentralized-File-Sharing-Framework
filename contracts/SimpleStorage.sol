

pragma solidity ^0.5.0;

contract SimpleStorage {
  string storedData;
  string metaHash;
  bytes key;
 
  function set(string memory x) public {
    storedData = x;
    
  }

  function setMetaFile(string memory temp) public {
    metaHash = temp;
    
  }

  function setKey(bytes memory temp) public{
    key = temp;
  }

  function get() public view returns (string memory) {
    return storedData;
  }

  function getMetafile() public view returns (string memory) {
    return metaHash;
  }
  function getKey() public view returns (bytes memory) {
    return key;
  }
}
