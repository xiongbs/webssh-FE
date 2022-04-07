const { createGzip } = require('zlib');
const { pipeline } = require('stream');

const { createReadStream, createWriteStream } = require('fs');

const { promisify } = require('util');
const pipePromise = promisify(pipeline);

async function do_gzip(input, output) {
    const gzip = createGzip();
    const source = createReadStream(input);
    const destination = createWriteStream(output);
    await pipePromise(source, gzip, destination);
}

do_gzip('input.txt', 'input.txt.gz')
    .catch(err => {
        console.error('An error occurred:', err);
        process.exitCode = 1;
    })



class Trie {
    constructor() {
        this.trie = [];
        for (let i = 0; i < 10; i++) {
            this.trie.push(new Array(26).fill(0));
        }
        this.index = 0;
        this.count = new Array(100).fill(0);
    }

    insert(str) {
        let p = 0;
        // 往数组里塞
        for (let s of str) {
            let u = s.charCodeAt() - 'a'.charCodeAt();
            if (this.trie[p][u] === 0) this.trie[p][u] = ++this.index;
            p = this.trie[p][u];
        }
        this.count[p]++; //记录是否为尾巴
    }
}


function roughSizeOfObject(object) {

    var objectList = [];
    var stack = [object];
    var bytes = 0;

    while (stack.length) {
        var value = stack.pop();

        if (typeof value === 'boolean') {
            bytes += 4;
        }
        else if (typeof value === 'string') {
            bytes += value.length * 2;
        }
        else if (typeof value === 'number') {
            bytes += 8;
        }
        else if
            (
            typeof value === 'object'
            && objectList.indexOf(value) === -1
        ) {
            objectList.push(value);

            for (var i in value) {
                stack.push(value[i]);
            }
        }
    }
    return bytes;
}

let a = `
o e i i
a t h f
a a j l
n e r v
`
