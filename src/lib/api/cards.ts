import { BaseApi } from './base';
import type { CardRecord } from '../pocketbase';

export interface CreateCardData {
  title: string;
  text: string;
  language: string;
  author?: string; // Добавляем опциональное поле author
}

export class CardsApi extends BaseApi {
  // Получить все карточки с автором
  async getAll(): Promise<CardRecord[]> {
    try {
      this.checkAuth();

      const records = await this.pb.collection('cards').getList(1, 50, {
        expand: 'author',
        sort: '-created',
        ...this.getDefaultOptions()
      });
      return records.items as unknown as CardRecord[];
    } catch (error) {
      this.handleError(error, 'getAll cards');
    }
  }

  // Получить карточку по ID с автором
  async getById(id: string): Promise<CardRecord> {
    try {
      this.checkAuth();

      return await this.pb.collection('cards').getOne(id, {
        expand: 'author',
        ...this.getDefaultOptions()
      }) as unknown as CardRecord;
    } catch (error) {
      this.handleError(error, 'getById card');
    }
  }

  // Создать карточку
  async create(data: CreateCardData): Promise<CardRecord> {
    try {
      this.checkAuth();

      // Если author не передан, используем текущего пользователя
      const cardData = {
        ...data,
        author: data.author || this.pb.authStore.model?.id,
      };

      return await this.pb.collection('cards').create(cardData, {
        ...this.getDefaultOptions()
      }) as unknown as CardRecord;
    } catch (error) {
      this.handleError(error, 'create card');
    }
  }

  // Обновить карточку
  async update(id: string, data: Partial<CardRecord>): Promise<CardRecord> {
    try {
      this.checkAuth();

      return await this.pb.collection('cards').update(id, data, {
        ...this.getDefaultOptions()
      }) as unknown as CardRecord;
    } catch (error) {
      this.handleError(error, 'update card');
    }
  }

  // Удалить карточку
  async delete(id: string): Promise<boolean> {
    try {
      this.checkAuth();

      await this.pb.collection('cards').delete(id, {
        ...this.getDefaultOptions()
      });
      return true;
    } catch (error) {
      console.error('Error deleting card:', error);
      return false;
    }
  }

  // Получить карточки пользователя
  async getByUser(userId: string): Promise<CardRecord[]> {
    try {
      this.checkAuth();

      const records = await this.pb.collection('cards').getList(1, 50, {
        filter: `author = "${userId}"`,
        sort: '-created',
        expand: 'author',
        ...this.getDefaultOptions()
      });
      return records.items as unknown as CardRecord[];
    } catch (error) {
      this.handleError(error, 'getByUser cards');
    }
  }
}

// Экспорт экземпляра
export const cardsApi = new CardsApi();