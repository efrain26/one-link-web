import { Link } from '../entities/Link';

export interface ILinkRepository {
  findById(id: string): Promise<Link | null>;
  findByUserId(userId: string): Promise<Link[]>;
  save(link: Link): Promise<Link>;
  update(link: Link): Promise<Link>;
  delete(id: string): Promise<void>;
  reorderLinks(userId: string, linkIds: string[]): Promise<void>;
}
