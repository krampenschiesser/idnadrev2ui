import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { JSDOM } from 'jsdom';

const jsdom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'https://localhost/',
  referrer: 'https://localhost/',
  contentType: 'text/html',
  includeNodeLocations: true,
  storageQuota: 10000000
});
const {window} = jsdom;

function copyProps(src: any, target: any) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .reduce((result, prop) => ({
      ...result,
      [prop]: Object.getOwnPropertyDescriptor(src, prop),
    }), {});
  Object.defineProperties(target, props);
}

window.matchMedia = window.matchMedia || (() => {
  return {
    matches: false, addListener: () => {
    }, removeListener: () => {
    },
  };
});

// @ts-ignore
global.window = window;
// @ts-ignore
global.document = window.document;
// @ts-ignore
global.navigator = {
  userAgent: 'node.js',
};
copyProps(window, global);

configure({adapter: new Adapter()});

const mock = window;
export default mock;