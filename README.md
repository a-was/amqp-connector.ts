# deno-amqp-connector

## Description

Easy in use class for making AMQP connections in [deno](https://deno.land)

Dependences: [amqp](https://deno.land/x/amqp)

## Usage

### Creating new connector
```typescript
import { AMQPConnector } from "https://raw.githubusercontent.com/a-was/deno-amqp-connector/master/mod.ts";

var connector = await new AMQPConnector({ queue: "test" }).connect();  // making object and connection
// or
var connector = new AMQPConnector({ queue: "test" });  // making object
await connector.connect();  // making connection
```
### Sending messages
```typescript
await connector.send("Hello world!");  // txt
await connector.send(JSON.stringify({ message: "Hello world!" }));  // json

await connector.close()  // closing connection
```

### Receiving messages
```typescript
await connector.receive((msg) => console.log(msg));  // txt
await connector.receive((msg) => console.log(JSON.parse(msg)));  // json
```
