import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Polyfill for Next.js edge runtime globals
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Polyfill Request, Response, Headers for Next.js route handlers
if (typeof Request === 'undefined') {
  global.Request = class Request {};
}

if (typeof Response === 'undefined') {
  global.Response = class Response {};
}

if (typeof Headers === 'undefined') {
  global.Headers = class Headers {};
}
