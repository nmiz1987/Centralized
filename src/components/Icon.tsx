import { Link as LinkIcon } from 'lucide-react';
import Image from 'next/image';

export function Icon({ icon, alt }: { icon?: string; alt: string }) {
  if (!icon) {
    return <LinkIcon size={16} className="mr-1" />;
  }

  if (!icon.startsWith('http')) {
    return <LinkIcon size={16} className="mr-1" />;
  }

  return <Image src={icon} width={20} height={20} alt={alt} />;
}
