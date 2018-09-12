import PromiseWorker from 'promise-worker';
import CryptoWorker from './CryptoWorkerImpl';

export interface EncryptDataMsg {
  plaintext: Uint8Array;
  nonce: Uint8Array;
}

export interface EncryptDataResponse {
  ciphertext: Uint8Array;
  tag: Uint8Array;
  nonce: Uint8Array;
}

export interface HashPwMsg {
  plaintext: string;
  salt: string;
}

export interface HashPwResponse {
  hashed: Uint8Array;
  salt: string;
}

class WebWorker {
  constructor(worker: any) {
    let code = worker.toString();
    code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'));

    const blob = new Blob([code], {type: 'application/javascript'});
    return new Worker(URL.createObjectURL(blob));
  }
}

var
const worker1: any = new WebWorker(CryptoWorker);
worker1.onmessage = (ev: any) => {
  console.log('from worker', ev);
};

const worker = new PromiseWorker(worker1);

export function hash(plaintext: string, salt: string): Promise<Uint8Array> {
  let msg: HashPwMsg = {
    plaintext: plaintext,
    salt: salt
  };
  return worker.postMessage(msg).then(resp => {
    console.log('Received from worker');
    console.log(resp);
    return resp;
  }).then((resp: HashPwResponse) => {
    console.log(resp);
    return resp.hashed;
  });
}