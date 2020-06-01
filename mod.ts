import {
  connect,
  AmqpConnectOptions,
  AmqpConnection,
  AmqpChannel,
} from "https://deno.land/x/amqp/mod.ts";

export interface AMQPConnectionOptions extends AmqpConnectOptions {
  queue: string;
}

export class AMQPConnector {
  private connection!: AmqpConnection;
  private channel!: AmqpChannel;
  private options: AMQPConnectionOptions;
  private connected: boolean = false;

  constructor(options: AMQPConnectionOptions) {
    this.options = options;
  }

  private checkConnected(): void {
    if (this.connected === false) {
      throw new Error("You need to connect first. Use connect() function");
    }
  }

  async connect(): Promise<AMQPConnector> {
    if (this.connected === false) {
      this.connection = await connect(this.options);
      this.channel = await this.connection.openChannel();
      this.channel.declareQueue({ queue: this.options.queue, durable: true });
      this.connected = true;
    }
    return this;
  }

  async send(msg: string): Promise<void> {
    this.checkConnected();
    await this.channel.publish(
      { routingKey: this.options.queue },
      { deliveryMode: 2 },
      new TextEncoder().encode(msg),
    );
  }

  async receive(callback: (msg: string) => void): Promise<void> {
    this.checkConnected();
    await this.channel.consume(
      { queue: this.options.queue, noAck: false },
      async (args: any, props: any, data: any) => {
        callback(new TextDecoder().decode(data));
        await this.channel.ack({ deliveryTag: args.deliveryTag });
      },
    );
  }
  async close(): Promise<void> {
    await this.channel.close();
    await this.connection.close();
  }
}
