import { isAvailable, to_uint8 } from 'rasm-crypt';
import * as waitUntil from 'async-wait-until';
import { decryptToUtf8, encrypt, hash } from './CryptoHelper';


describe("CryptoHelper", function() {

  it("scrypt", async () => {
    await waitUntil(()=> isAvailable(),5000,50);
    let out = await hash("hello world","salt");
    expect(out.length).toBe(32);
  });

  it('encrypt/decrypt', async ()=>{
    await waitUntil(()=> isAvailable(),5000,50);
    let pw= await hash("hello world","salt");
    let plaintext = to_uint8("hello world");
    let [ciphertext, nonce] = await encrypt(plaintext,pw);
    let decrypted = await decryptToUtf8(ciphertext,nonce,pw);
    expect(decrypted).toEqual("hello world");
  })
});
