import metadataJson from '@/../data/metadata.json';
import type { Metadata } from '../types';

const metadata: Metadata = metadataJson as Metadata;

export function getMetadata(): Metadata {
  return metadata;
}
