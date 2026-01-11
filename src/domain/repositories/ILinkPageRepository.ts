import { LinkPage } from '../entities/LinkPage';
import { Username } from '../value-objects/Username';

export interface ILinkPageRepository {
  findById(id: string): Promise<LinkPage | null>;
  findByUserId(userId: string): Promise<LinkPage | null>;
  findByUsername(username: Username): Promise<LinkPage | null>;
  save(linkPage: LinkPage): Promise<LinkPage>;
  update(linkPage: LinkPage): Promise<LinkPage>;
  delete(id: string): Promise<void>;
}
