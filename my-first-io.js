const fs = require('fs');
const path = process.argv[1];
function readSyncByfs(tips = '>') {
	let response;
	process.stdout.write(tips);
	process.stdin.pause();
	const buf = Buffer.allocUnsafe(10000);
	response = fs.readSync(process.stdin.fd, buf, 0, 10000, 0);
	process.stdin.end();

	return buf.toString('utf-8', 0, response);
}

console.log(readSyncByfs('请输入任意字符:'));
