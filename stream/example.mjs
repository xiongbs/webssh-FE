const Stream = require('stream');
const readableStream = new Stream.Readable();
readableStream._read = () => {};

readableStream.push('hello');
readableStream.push('word');


