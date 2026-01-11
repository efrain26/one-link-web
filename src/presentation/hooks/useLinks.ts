import { useState, useEffect, useCallback } from 'react';
import { LinkDTO, CreateLinkDTO, UpdateLinkDTO } from '@application/dto/LinkDTO';
import { CreateLink } from '@application/use-cases/link/CreateLink';
import { GetUserLinks } from '@application/use-cases/link/GetUserLinks';
import { UpdateLink } from '@application/use-cases/link/UpdateLink';
import { DeleteLink } from '@application/use-cases/link/DeleteLink';
import { LinkRepository } from '@infrastructure/repositories/LinkRepository';

const linkRepository = new LinkRepository();

export const useLinks = (userId: string) => {
  const [links, setLinks] = useState<LinkDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLinks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const getUserLinks = new GetUserLinks(linkRepository);
      const userLinks = await getUserLinks.execute(userId);
      setLinks(userLinks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load links');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const createLink = async (dto: CreateLinkDTO): Promise<void> => {
    try {
      const createLinkUseCase = new CreateLink(linkRepository);
      const newLink = await createLinkUseCase.execute(userId, dto);
      setLinks((prev) => [...prev, newLink].sort((a, b) => a.position - b.position));
    } catch (err) {
      throw err;
    }
  };

  const updateLink = async (id: string, dto: UpdateLinkDTO): Promise<void> => {
    try {
      const updateLinkUseCase = new UpdateLink(linkRepository);
      const updatedLink = await updateLinkUseCase.execute(id, dto);
      setLinks((prev) => prev.map((link) => (link.id === id ? updatedLink : link)));
    } catch (err) {
      throw err;
    }
  };

  const deleteLink = async (id: string): Promise<void> => {
    try {
      const deleteLinkUseCase = new DeleteLink(linkRepository);
      await deleteLinkUseCase.execute(id);
      setLinks((prev) => prev.filter((link) => link.id !== id));
    } catch (err) {
      throw err;
    }
  };

  return {
    links,
    loading,
    error,
    createLink,
    updateLink,
    deleteLink,
    refetch: fetchLinks,
  };
};
