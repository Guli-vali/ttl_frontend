import { BaseApi } from './base';
import type { MessageRecord } from '../pocketbase';

export interface CreateMessageData {
  text: string;
  card: string;
}

export class MessagesApi extends BaseApi {
  // Получить все сообщения для карточки
  async getByCard(cardId: string): Promise<MessageRecord[]> {
    try {
      this.checkAuth();

      const records = await this.pb.collection('messages').getList(1, 100, {
        filter: `card = "${cardId}"`,
        sort: 'created',
        expand: 'author',
        ...this.getDefaultOptions()
      });
      return records.items as unknown as MessageRecord[];
    } catch (error) {
      this.handleError(error, 'getByCard messages');
    }
  }

  // Получить сообщение по ID
  async getById(id: string): Promise<MessageRecord> {
    try {
      this.checkAuth();

      return await this.pb.collection('messages').getOne(id, {
        expand: 'author',
        ...this.getDefaultOptions()
      }) as unknown as MessageRecord;
    } catch (error) {
      this.handleError(error, 'getById message');
    }
  }

  // Создать сообщение
  async create(data: CreateMessageData): Promise<MessageRecord> {
    try {
      this.checkAuth();

      return await this.pb.collection('messages').create(data, {
        ...this.getDefaultOptions()
      }) as unknown as MessageRecord;
    } catch (error) {
      this.handleError(error, 'create message');
    }
  }

  // Обновить сообщение
  async update(id: string, data: Partial<MessageRecord>): Promise<MessageRecord> {
    try {
      this.checkAuth();

      return await this.pb.collection('messages').update(id, data, {
        ...this.getDefaultOptions()
      }) as unknown as MessageRecord;
    } catch (error) {
      this.handleError(error, 'update message');
    }
  }

  // Удалить сообщение
  async delete(id: string): Promise<boolean> {
    try {
      this.checkAuth();

      await this.pb.collection('messages').delete(id, {
        ...this.getDefaultOptions()
      });
      return true;
    } catch (error) {
      console.error('Error deleting message:', error);
      return false;
    }
  }

  // Получить сообщения пользователя
  async getByUser(userId: string): Promise<MessageRecord[]> {
    try {
      this.checkAuth();

      const records = await this.pb.collection('messages').getList(1, 100, {
        filter: `author = "${userId}"`,
        sort: '-created',
        expand: 'author',
        ...this.getDefaultOptions()
      });
      return records.items as unknown as MessageRecord[];
    } catch (error) {
      this.handleError(error, 'getByUser messages');
    }
  }
}

// Экспорт экземпляра
export const messagesApi = new MessagesApi();
