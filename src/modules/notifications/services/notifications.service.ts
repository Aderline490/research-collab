import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { connect, Channel, Connection } from 'amqplib';

@Injectable()
export class NotificationsService implements OnModuleInit, OnModuleDestroy {
  private connection: Connection;
  private channel: Channel;
  private readonly exchangeName = 'notifications_exchange';

  async onModuleInit() {
    this.connection = await connect('amqp://localhost');
    this.channel = await this.connection.createChannel();

    await this.channel.assertExchange(this.exchangeName, 'fanout', { durable: true });
  }

  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }

  async notifyUsers(message: string) {
    this.channel.publish(this.exchangeName, '', Buffer.from(message));
    console.log(`Notification sent: ${message}`);
  }
}
