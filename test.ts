import { AMQPConnector } from "./mod.ts";

var connector = await new AMQPConnector({ queue: "test" }).connect();

await connector.send("Hello world!");
await connector.receive((msg) => console.log(msg));
