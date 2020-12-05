const http = require('http');
const static = require('node-static');
const file = new static.Server('./');
const crypto = require('crypto');
const server = http.createServer((req, res) => {
  req.addListener('end', () => file.serve(req, res)).resume();
});

server.on('upgrade', function (req, socket) {
  console.log('upgrade');
  if (req.headers['upgrade'] !== 'websocket') {
    socket.end('HTTP/1.1 400 Bad Request');
    return;
  }
  // Read the websocket key provided by the client:
  const acceptKey = req.headers['sec-websocket-key'];
  // Generate the response value to use in the response:
  const hash = generateAcceptValue(acceptKey);
  // Write the HTTP response into an array of response lines:
  const responseHeaders = [ 'HTTP/1.1 101 Web Socket Protocol Handshake', 'Upgrade: WebSocket', 'Connection: Upgrade', `Sec-WebSocket-Accept: ${hash}` ];
  // Write the response back to the client socket, being sure to append two
  // additional newlines so that the browser recognises the end of the response
  // header and doesn't continue to wait for more header data:
  socket.write(responseHeaders.join('\r\n') + '\r\n\r\n');
});
 // Don't forget the hashing function described earlier:
function generateAcceptValue (acceptKey) {
  return crypto
  .createHash('sha1')
  .update(acceptKey + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11', 'binary')
  .digest('base64');
}

server.on('data', buffer => {
  console.log("recieved");
  const message = parseMessage(buffer);
  if (message) {
  // For our convenience, so we can see what the client sent
  console.log(message);
  // We'll just send a hardcoded message in this example
  server.write(constructReply({ message: 'Hello from the server!' }));
  } else if (message === null) {
      console.log('WebSocket connection closed by the client.');
  }
});
function constructReply (data) {
  // Convert the data to JSON and copy it into a buffer
  const json = JSON.stringify(data)
  const jsonByteLength = Buffer.byteLength(json);
  // Note: we're not supporting > 65535 byte payloads at this stage
  const lengthByteCount = jsonByteLength < 126 ? 0 : 2;
  const payloadLength = lengthByteCount === 0 ? jsonByteLength : 126;
  const buffer = Buffer.alloc(2 + lengthByteCount + jsonByteLength);
  // Write out the first byte, using opcode `1` to indicate that the message
  // payload contains text data
  buffer.writeUInt8(0b10000001, 0);
  buffer.writeUInt8(payloadLength, 1);
  // Write the length of the JSON payload to the second byte
  let payloadOffset = 2;
  if (lengthByteCount > 0) {
    buffer.writeUInt16BE(jsonByteLength, 2); payloadOffset += lengthByteCount;
  }
  // Write the JSON data to the data buffer
  buffer.write(json, payloadOffset);
  return buffer;
}
function parseMessage (buffer) {
  let maskingKey;
  if (isMasked) {
    maskingKey = buffer.readUInt32BE(currentOffset);
    currentOffset += 4;
  }
  // …all of the above, then:
  // Allocate somewhere to store the final message data
const data = Buffer.alloc(payloadLength);
// Only unmask the data if the masking bit was set to 1
if (isMasked) {
  // Loop through the source buffer one byte at a time, keeping track of which
  // byte in the masking key to use in the next XOR calculation
  for (let i = 0, j = 0; i < payloadLength; ++i, j = i % 4) {
  // Extract the correct byte mask from the masking key
    const shift = j = 3 ? 0 : (3 - j) << 3;
    const mask = (shift == 0 ? maskingKey : (maskingKey >>> shift)) & 0xFF;
    // Read a byte from the source buffer
    const source = buffer.readUInt8(currentOffset++);
    // XOR the source byte and write the result to the data
    buffer.data.writeUInt8(mask ^ source, i);
  }
 } else {
  // Not masked - we can just read the data as-is
  buffer.copy(data, 0, currentOffset++);
}
  const json = data.toString('utf8'); return JSON.parse(json);
}


const port = 3210;
server.listen(port, () => console.log(`Server running at http://localhost:${port}`));
