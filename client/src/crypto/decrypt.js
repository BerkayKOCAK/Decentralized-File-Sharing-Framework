
import crypto from 'crypto';

function decipher(password,buffer){

    const algorithm = 'aes-256-cbc';
    var decipher = crypto.createDecipher(algorithm,password)
    var dec = Buffer.concat([decipher.update(buffer) , decipher.final()]);
    return dec;
  }

  export default decipher;