import CryptoWorker from './CryptoWorkerImpl';

export interface EncryptDataMsg {
  id: number;
  plaintext: Uint8Array;
  nonce: Uint8Array;
}

export interface EncryptDataResponse {
  id: number;
  ciphertext: Uint8Array;
  tag: Uint8Array;
  nonce: Uint8Array;
}

export interface HashPwMsg {
  id: number;
  plaintext: string;
  salt: string;
}

export interface HashPwResponse {
  id: number;
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

var responses: Map<number, [(param: any) => void, (param: any) => void]> = new Map();
var msgCounter = 0;
const worker1: any = new WebWorker(CryptoWorker);
worker1.onmessage = (ev: any) => {
  console.log('from worker', ev);
  let promise = responses.get(ev.data.id);
  if (promise) {
    console.log("found promise")
    let resolve = promise[0];
    resolve(ev.data);
    console.log("resolved promise")
  }
};

export function hash(plaintext: string, salt: string): Promise<Uint8Array> {
  let id = msgCounter;
  msgCounter++;
  let msg: HashPwMsg = {
    id: id,
    plaintext: plaintext,
    salt: salt
  };
  let promise = new Promise<Uint8Array>((resolve, reject) => {
    console.log("here")
    responses.set(id, [resolve, reject]);
  });
  worker1.postMessage(msg);
  return promise;
}