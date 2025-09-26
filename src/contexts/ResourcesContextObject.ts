import { createContext } from 'react';
import { ResourcesContextType } from '@/types/ResourcesContextType';

export const ResourcesContext = createContext<ResourcesContextType | undefined>(undefined);